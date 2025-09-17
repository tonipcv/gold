import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendEmail } from '@/lib/email'
import { getBaseUrl } from '@/lib/url'

export async function POST(request: Request) {
  try {
    // Verifica se o corpo da requisição é válido
    if (!request.body) {
      return new NextResponse(
        JSON.stringify({ error: 'Corpo da requisição inválido' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const body = await request.json()
    
    if (!body.email) {
      return new NextResponse(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { email } = body

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry
      }
    })

    const baseUrl = getBaseUrl(request)
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`

    await sendEmail({
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para definir uma nova senha:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
          Redefinir Senha
        </a>
        <p style="margin-top:12px;color:#111">
          Se o botão não funcionar, copie e cole este link no seu navegador:
        </p>
        <p style="word-break: break-all; background:#f5f5f5; padding:8px 12px; border-radius:6px;">
          ${resetUrl}
        </p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
        <p>Este link é válido por 1 hora.</p>
      `
    })

    return new NextResponse(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Erro ao processar a solicitação',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } finally {
    await prisma.$disconnect()
  }
} 