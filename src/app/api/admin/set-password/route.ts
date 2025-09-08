import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }
    // Opcional: validar role admin aqui

    const { userId, password, useDefault } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    let finalPassword: string | undefined = password
    if (useDefault) {
      const envPwd = process.env.DEFAULT_USER_PASSWORD
      if (!envPwd) {
        return NextResponse.json({ error: 'DEFAULT_USER_PASSWORD não configurada no servidor' }, { status: 400 })
      }
      finalPassword = envPwd
    }

    if (!finalPassword || typeof finalPassword !== 'string' || finalPassword.length < 6) {
      return NextResponse.json({ error: 'Senha inválida (mínimo 6 caracteres)' }, { status: 400 })
    }

    const hash = await bcrypt.hash(finalPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hash,
        // invalidar tokens antigos de reset/verify por segurança
        resetToken: null,
        resetTokenExpiry: null,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    return NextResponse.json({ success: true, message: 'Senha atualizada' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Erro interno' }, { status: 500 })
  }
}
