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

    const info = await transporter.sendMail({
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Katsu',
        address: process.env.EMAIL_FROM_ADDRESS || 'oi@k17.com.br'
      },
      to,
      subject,
      html
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}