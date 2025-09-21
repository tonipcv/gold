import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Ler corpo com segurança
    let body: any = null
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }

    if (!body || !body.email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const { email } = body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Gerar nova senha forte automaticamente
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    const buf = crypto.randomBytes(16)
    const newPassword = Array.from(buf).map((b) => charset[b % charset.length]).slice(0, 12).join('')
    const hashed = await bcrypt.hash(newPassword, 10)

    // Atualizar a senha imediatamente e limpar tokens de reset
    await prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    })

    // Enviar e-mail com a nova senha
    await sendEmail({
      to: email,
      subject: 'Sua nova senha foi gerada',
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h1>Recuperação de Senha</h1>
          <p>Geramos automaticamente uma nova senha para sua conta.</p>
          <p><strong>Nova senha:</strong> ${newPassword}</p>
          <p>Recomendamos alterá-la após o primeiro login.</p>
          <p>Se você não solicitou a recuperação de senha, ignore este e‑mail.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Erro ao processar a solicitação',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 