import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const name = (data?.name ?? '').toString().trim()
    const purchaseEmail = (data?.purchaseEmail ?? '').toString().trim().toLowerCase()
    const whatsapp = (data?.whatsapp ?? '').toString().trim()
    const friendsCountRaw = data?.friendsCount
    const friendsCount = Number.parseInt(String(friendsCountRaw), 10)

    if (!name || !purchaseEmail || !whatsapp || Number.isNaN(friendsCount)) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
    }
    if (friendsCount < 1 || friendsCount > 10) {
      return NextResponse.json({ error: 'friendsCount deve estar entre 1 e 10' }, { status: 400 })
    }

    const accessor = (prisma as any).referralBonusRequest
    if (accessor?.create) {
      const created = await accessor.create({
        data: { name, purchaseEmail, whatsapp, friendsCount },
      })
      return NextResponse.json({ ok: true, id: created.id })
    } else {
      const id = randomUUID()
      await prisma.$executeRaw`INSERT INTO "ReferralBonusRequest" (id, name, "purchaseEmail", whatsapp, "friendsCount") VALUES (${id}, ${name}, ${purchaseEmail}, ${whatsapp}, ${friendsCount})`
      return NextResponse.json({ ok: true, id })
    }
  } catch (err: any) {
    console.error('Referral bonus POST error', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
