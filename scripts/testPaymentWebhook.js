#!/usr/bin/env node
/*
  scripts/testPaymentWebhook.js

  Usage examples:
    node scripts/testPaymentWebhook.js --status paid --email user@example.com
    node scripts/testPaymentWebhook.js --status pending --email user@example.com --pix
    node scripts/testPaymentWebhook.js --status analysis --email user@example.com --host http://localhost:3000

  Options:
    --status           one of: paid, pending, analysis, cancelled, expired (default: pending)
    --email            target user email (default: test+<ts>@example.com)
    --host             base URL including protocol (default: http://localhost:3000)
    --path             webhook path (default: /api/payment-webhook)
    --productName      product name for mapping (default: Gold 10x)
    --productId        product id in provider (default: 9999)
    --marketplaceId    provider marketplace id (default: 9999)
    --pix              include PIX data in payload (only informational)

  This script crafts a payload compatible with src/app/api/payment-webhook/route.ts
  including both subscription-like and transaction-like fields so the handler
  can normalize status and product mapping.
*/

const https = require('https')
const http = require('http')

function parseArgs(argv) {
  const args = {
    status: 'pending',
    email: `test+${Date.now()}@example.com`,
    host: process.env.WEBHOOK_TEST_HOST || 'http://localhost:3000',
    path: process.env.WEBHOOK_TEST_PATH || '/api/payment-webhook',
    productName: 'Gold 10x',
    productId: '9999',
    marketplaceId: '9999',
    pix: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i]
    if (key === '--status') args.status = String(argv[++i] || '').toLowerCase()
    else if (key === '--email') args.email = argv[++i]
    else if (key === '--host') args.host = argv[++i]
    else if (key === '--path') args.path = argv[++i]
    else if (key === '--productName') args.productName = argv[++i]
    else if (key === '--productId') args.productId = argv[++i]
    else if (key === '--marketplaceId') args.marketplaceId = argv[++i]
    else if (key === '--pix') args.pix = true
  }
  return args
}

function buildPayload({ status, email, productName, productId, marketplaceId, pix }) {
  const now = new Date()
  const end = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30) // +30d

  const base = {
    // Top-level status variant (transaction-like)
    status, // e.g., 'paid', 'pending', 'analysis', 'cancelled', 'expired'
    // Subscription-like
    last_status: status,
    current_invoice: {
      status: status === 'paid' ? 'paid' : status,
      period_start: now.toISOString(),
      period_end: end.toISOString(),
    },
    dates: {
      cycle_start_date: now.toISOString(),
      cycle_end_date: end.toISOString(),
      created_at: now.toISOString(),
      expires_at: end.toISOString(),
    },
    product: {
      id: String(productId),
      marketplace_id: String(marketplaceId),
      name: productName,
    },
    // Fallback list format used by some providers
    items: [
      {
        id: String(productId),
        marketplace_id: String(marketplaceId),
        name: productName,
      },
    ],
    // Subscriber (or contact)
    subscriber: {
      id: 'sub-123',
      name: 'Test User',
      email,
      doc: '00000000000',
      phone_local_code: '11',
      phone_number: '999999999',
    },
    contact: {
      email,
      name: 'Test User',
    },
  }

  if (pix) {
    base.payment = {
      pix: {
        qrcode: {
          url: 'https://pix.example.com/qrcode-demo',
          signature: '00020101021226820014BR.GOV.BCB.PIX2553example-pix-url-demo5204000053039865802BR5913NOME RECEBEDOR6009SAO PAULO62140510ABCD1234EF6304ABCD',
        },
        expiration_date: end.toISOString(),
      },
    }
  } else {
    base.payment = {
      credit_card: {
        brand: 'visa',
        last_digits: '4242',
      },
    }
  }

  // Optional checkout URL, used in email templates
  base.checkout_url = 'https://checkout.example.com/continue'

  return base
}

function requestJson(url, path, payload) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://')
    const lib = isHttps ? https : http
    const { hostname, port, pathname } = new URL(url)
    const fullPath = (pathname === '/' ? '' : pathname) + path

    const data = JSON.stringify(payload)

    const req = lib.request(
      {
        hostname,
        port: port || (isHttps ? 443 : 80),
        path: fullPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8')
          const ct = res.headers['content-type'] || ''
          let parsed = body
          if (ct.includes('application/json')) {
            try { parsed = JSON.parse(body) } catch {}
          }
          resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed })
        })
      }
    )

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function main() {
  const args = parseArgs(process.argv)
  const payload = buildPayload(args)
  const target = args.host
  const path = args.path

  console.log('[testPaymentWebhook] Target:', target + path)
  console.log('[testPaymentWebhook] Status:', args.status)
  console.log('[testPaymentWebhook] Email:', args.email)
  console.log('[testPaymentWebhook] Product:', args.productName, `(id=${args.productId}, marketplaceId=${args.marketplaceId})`)
  if (args.pix) console.log('[testPaymentWebhook] Including PIX data')

  try {
    const res = await requestJson(target, path, payload)
    console.log('[testPaymentWebhook] Response status:', res.statusCode)
    console.log('[testPaymentWebhook] Response headers:', res.headers)
    console.log('[testPaymentWebhook] Response body:', typeof res.body === 'string' ? res.body : JSON.stringify(res.body, null, 2))
  } catch (err) {
    console.error('[testPaymentWebhook] Error:', err && err.message)
    process.exitCode = 1
  }
}

main()
