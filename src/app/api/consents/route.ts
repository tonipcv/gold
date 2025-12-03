import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { consentType, text, textVersion, screenshotUrl, configSnapshot } = await req.json()
    if (!consentType || !text) {
      return NextResponse.json({ error: 'Missing consentType or text' }, { status: 400 })
    }

    const textHash = crypto.createHash('sha256').update(String(text)).digest('hex')

    const ip = getIpFromRequest(req)
    const userAgent = req.headers.get('user-agent') || undefined

    const created = await prisma.consentLog.create({
      data: {
        userId: user.id,
        consentType,
        textVersion: textVersion || null,
        textHash,
        text,
        ip: ip || null,
        userAgent: userAgent || null,
        screenshotUrl: screenshotUrl || null,
        configSnapshot: configSnapshot ?? undefined,
      },
    })

    return NextResponse.json({ ok: true, id: created.id })
  } catch (err) {
    console.error('Consent POST error', err)
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
