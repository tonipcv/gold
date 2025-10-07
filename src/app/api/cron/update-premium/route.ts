import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function daysAgoDate(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

async function updatePremium(days: number, dryRun: boolean) {
  const cutoff = daysAgoDate(days)

  const usersToUpgrade = await prisma.user.findMany({
    where: {
      purchases: {
        some: {
          startDate: { lte: cutoff },
          status: { in: ['paid', 'ACTIVE'] },
        },
      },
      isPremium: false,
    },
    select: { id: true, email: true, name: true },
  })

  if (dryRun || usersToUpgrade.length === 0) {
    return { updated: 0, candidates: usersToUpgrade }
  }

  const ids = usersToUpgrade.map((u) => u.id)
  const result = await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { isPremium: true },
  })

  return { updated: result.count, candidates: usersToUpgrade }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const daysParam = url.searchParams.get('days')
  const dryRunParam = url.searchParams.get('dryRun')
  const days = Math.max(1, Number(daysParam ?? 7) || 7)
  const dryRun = ['1', 'true', 'yes'].includes(String(dryRunParam).toLowerCase())

  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : undefined
  const expected = process.env.CRON_SECRET

  if (!expected) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 }
    )
  }

  if (!token || token !== expected) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const res = await updatePremium(days, dryRun)
    return NextResponse.json(
      {
        ok: true,
        days,
        dryRun,
        updated: res.updated,
        candidates: res.candidates,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    )
  }
}
