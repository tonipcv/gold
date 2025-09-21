import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { currentPassword } = await request.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user?.password) {
      return new NextResponse('User not found', { status: 404 })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return new NextResponse('Invalid current password', { status: 400 })
    }

    // Gerar uma nova senha forte automaticamente (12 caracteres)
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*'
    const buf = crypto.randomBytes(16)
    const generatedPassword = Array.from(buf).map((b) => charset[b % charset.length]).slice(0, 12).join('')
    const hashedPassword = await bcrypt.hash(generatedPassword, 10)

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashedPassword }
    })

    await sendEmail({
      to: session.user.email,
      subject: 'Sua nova senha foi gerada',
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h1>Sua senha foi alterada</h1>
          <p>Geramos automaticamente uma nova senha para sua conta.</p>
          <p><strong>Nova senha:</strong> ${generatedPassword}</p>
          <p>Recomendamos alterá-la após o primeiro login.</p>
          <p>Se você não fez esta solicitação, entre em contato conosco imediatamente.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error changing password:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 