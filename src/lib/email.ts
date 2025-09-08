import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
})

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    // Skip if missing critical envs
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[email] SMTP env not fully configured; skipping send.');
      return { success: false, skipped: true, reason: 'SMTP_NOT_CONFIGURED' as const }
    }

    const maxRetries = 3
    let attempt = 0
    let lastErr: any

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
    const isTransient = (code?: number) => {
      // Common transient SMTP codes
      return code && [421, 450, 451, 452, 471].includes(code)
    }

    while (attempt < maxRetries) {
      try {
        const info = await transporter.sendMail({
          from: {
            name: process.env.EMAIL_FROM_NAME || 'Katsu',
            address: process.env.EMAIL_FROM_ADDRESS || 'oi@k17.com.br'
          },
          to,
          subject,
          html
        })
        return { success: true, messageId: info.messageId, attempts: attempt + 1 }
      } catch (error: any) {
        lastErr = error
        const code = error?.responseCode
        // retry only for transient errors
        if (isTransient(code) && attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
          console.warn(`[email] transient SMTP error ${code}. retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
          await sleep(delay)
          attempt++
          continue
        }
        break
      }
    }
    return { success: false, error: lastErr, attempts: attempt + 1, errorCode: lastErr?.responseCode }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}