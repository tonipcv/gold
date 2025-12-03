import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const REQUIRED_VERSION = 'v3.0'

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      consentLogs: {
        where: { consentType: 'terms-of-use' },
        orderBy: { acceptedAt: 'desc' },
        take: 1,
      },
    },
  })

  const header = [
    'id','name','email','status','consent_version','accepted_at'
  ]

  const lines = users.map((u) => {
    const last = u.consentLogs[0]
    const status = !last
      ? 'MISSING'
      : last.textVersion === REQUIRED_VERSION
      ? 'ACCEPTED_V3'
      : `OUTDATED_${last.textVersion ?? 'unknown'}`

    const acceptedAt = last?.acceptedAt ? new Date(last.acceptedAt).toISOString() : ''

    const cells = [
      u.id,
      u.name ?? '',
      u.email,
      status,
      last?.textVersion ?? '',
      acceptedAt,
    ]

    // escape quotes and commas
    const escaped = cells.map((c) => {
      const s = String(c)
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"'
      }
      return s
    })

    return escaped.join(',')
  })

  const csv = [header.join(','), ...lines].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="consents.csv"',
      'Cache-Control': 'no-store',
    },
  })
}
