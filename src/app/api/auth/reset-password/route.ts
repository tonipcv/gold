import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    // Validate body presence
    if (!request.body) {
      return NextResponse.json(
        { error: 'Corpo da requisição inválido' },
        { status: 400 }
      )
    }

    let parsed: any
    try {
      parsed = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'JSON inválido' },
        { status: 400 }
      )
    }

    const { token, password } = parsed as { token?: string; password?: string }

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    })

    // Enviar email de confirmação
    const fromName = process.env.EMAIL_FROM_NAME || 'Katsu'
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'oi@k17.com.br'
    await sendEmail({
      to: user.email,
      subject: 'Senha alterada com sucesso',
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
          <h1>Senha Alterada</h1>
          <p>Sua senha foi alterada com sucesso.</p>
          <p>Se você não realizou esta alteração, entre em contato conosco imediatamente.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}
 