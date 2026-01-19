import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { userId, newEmail } = await req.json()

    if (!userId || !newEmail) {
      return NextResponse.json({ error: 'userId e newEmail são obrigatórios' }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ 
        error: `Formato de email inválido: "${newEmail}"` 
      }, { status: 400 })
    }

    // Verificar se o email já existe em outro usuário
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    })

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ 
        error: 'Este email já está em uso por outro usuário' 
      }, { status: 400 })
    }

    // Atualizar o email
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail }
    })

    return NextResponse.json({ 
      message: 'Email atualizado com sucesso',
      user: updatedUser
    })
  } catch (err: any) {
    console.error('[update-user-email] Erro:', err)
    return NextResponse.json({ 
      error: err?.message || 'Erro ao atualizar email' 
    }, { status: 500 })
  }
}
