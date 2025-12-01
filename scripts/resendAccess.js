#!/usr/bin/env node
/*
  scripts/resendAccess.js
  Usage:
    node scripts/resendAccess.js --email someone@example.com
    node scripts/resendAccess.js --all-paid [--delay 200]

  This script sends the same "primeiro acesso" email used by /api/admin/resend-access.
*/

const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const { PrismaClient } = require('@prisma/client')

// Minimal .env loader (no external dependency)
function loadDotEnvIfNeeded() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return
  }
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const valRaw = trimmed.slice(eq + 1)
      const val = valRaw.replace(/^"|"$/g, '')
      if (!process.env[key]) process.env[key] = val
    }
  }
}

loadDotEnvIfNeeded()

const prisma = new PrismaClient()

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    } : undefined,
  })
}

async function sendEmail({ to, subject, html }) {
  // Fail fast if env missing
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[resendAccess] SMTP env not fully configured; skipping send.')
    return { success: false, skipped: true, reason: 'SMTP_NOT_CONFIGURED' }
  }

  const transporter = createTransport()

  const maxRetries = 3
  let attempt = 0
  let lastErr
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
  const isTransient = (code) => [421, 450, 451, 452, 471].includes(code)

  while (attempt < maxRetries) {
    try {
      const info = await transporter.sendMail({
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Katsu',
          address: process.env.EMAIL_FROM_ADDRESS || 'oi@k17.com.br',
        },
        to,
        subject,
        html,
      })
      return { success: true, messageId: info.messageId, attempts: attempt + 1 }
    } catch (err) {
      lastErr = err
      const code = err && err.responseCode
      if (isTransient(code) && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
        console.warn(`[resendAccess] transient SMTP error ${code}. retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
        await sleep(delay)
        attempt++
        continue
      }
      break
    }
  }
  return { success: false, error: lastErr, errorCode: lastErr && lastErr.responseCode, attempts: attempt + 1 }
}

function buildHtml() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://gold.k17.com.br'
  const appLink = `${base}/automatizador-gold-10x`
  const passwordLink = `${base}/forgot-password`
  const fromName = process.env.EMAIL_FROM_NAME || 'Katsu'
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'oi@k17.com.br'
  return `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b0b0b">
        <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
        <h2 style="margin:0 0 10px 0">Bem-vindo(a) ao Automatizador Gold 10X</h2>
        <p>Seu <strong>primeiro acesso</strong> está pronto. Para entrar com segurança, siga os passos abaixo:</p>
        <ol style="padding-left:18px; margin:10px 0 16px">
          <li>Altere sua senha agora (recomendado para primeiro acesso).</li>
          <li>Depois, acesse o painel do Automatizador Gold 10X.</li>
        </ol>
        <p style="margin:12px 0">
          <a href="${passwordLink}" 
             style="display:inline-block;background:#111;color:#fff;border:1px solid #16a34a;text-decoration:none;padding:12px 16px;border-radius:8px;margin-right:8px">
            Alterar minha senha
          </a>
          <a href="${appLink}" 
             style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px">
            Acessar o Automatizador
          </a>
        </p>
        <p style="font-size:12px;color:#555;margin-top:12px">Se você não solicitou este acesso, ignore este e-mail.</p>
        <p style="font-size:12px;color:#555;margin-top:8px">Dúvidas? Fale no WhatsApp: <a href="${base}/whatsapp-cliqueaqui" target="_blank" rel="noopener noreferrer">(73) 9177‑8075</a></p>
      </div>
    `
}

function parseArgs(argv) {
  const args = { allPaid: false, email: null, delay: 200 }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--all-paid') args.allPaid = true
    else if (a === '--email') args.email = argv[++i]
    else if (a === '--delay') args.delay = Number(argv[++i]) || args.delay
  }
  return args
}

async function getAllPaidUsers() {
  return prisma.user.findMany({
    where: {
      purchases: { some: { status: 'paid' } },
    },
    select: { id: true, email: true, name: true },
    orderBy: { email: 'asc' },
  })
}

async function main() {
  const args = parseArgs(process.argv)
  const html = buildHtml()
  const subject = 'Acesso confirmado • Automatizador Gold 10X'

  try {
    if (args.email) {
      console.log(`[resendAccess] Sending to single email: ${args.email}`)
      const res = await sendEmail({ to: args.email, subject, html })
      console.log('[resendAccess] result:', res)
      return
    }

    if (args.allPaid) {
      const users = await getAllPaidUsers()
      if (!users.length) {
        console.log('[resendAccess] No paid users found.')
        return
      }
      console.log(`[resendAccess] Sending to all paid users: total=${users.length}`)

      // Heartbeat to indicate the process is alive
      const heartbeat = setInterval(() => {
        process.stdout.write('.')
      }, 30_000)

      let sent = 0, fail = 0, skipped = 0
      for (let i = 0; i < users.length; i++) {
        const u = users[i]
        console.log(`\n[resendAccess] (${i + 1}/${users.length}) Sending to ${u.email} ...`)
        try {
          const r = await sendEmail({ to: u.email, subject, html })
          if (r.skipped) {
            skipped++
            console.log(`[resendAccess] (${i + 1}/${users.length}) Skipped SMTP (not configured).`)
          } else if (!r.success) {
            fail++
            console.warn(`[resendAccess] (${i + 1}/${users.length}) Failed to send.`)
          } else {
            sent++
            console.log(`[resendAccess] (${i + 1}/${users.length}) Sent OK (messageId=${r.messageId}).`)
          }
        } catch (e) {
          fail++
          console.warn(`[resendAccess] (${i + 1}/${users.length}) Exception while sending:`, e && e.message)
        }
        if (args.delay > 0) {
          await new Promise(res => setTimeout(res, args.delay))
        }
      }

      clearInterval(heartbeat)
      console.log(`\n[resendAccess] Done. success=${sent} fail=${fail} skipped=${skipped}`)
      return
    }

    console.log('Usage:')
    console.log('  node scripts/resendAccess.js --email someone@example.com')
    console.log('  node scripts/resendAccess.js --all-paid [--delay 200]')
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error('[resendAccess] fatal error:', err)
  process.exitCode = 1
})
