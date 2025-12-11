import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email },
      select: { id: true, email: true }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { action, configSnapshot } = await req.json()
    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 })
    }

    const ip = getIpFromRequest(req)
    const userAgent = req.headers.get('user-agent') || undefined

    const created = await prisma.actionLog.create({
      data: {
        userId: user.id,
        action,
        configSnapshot: configSnapshot ?? undefined,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    })

    return NextResponse.json({ ok: true, id: created.id })
  } catch (err) {
    console.error('ActionLog POST error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

function getIpFromRequest(req: Request): string | undefined {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0].trim()
  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp
  return undefined
}
