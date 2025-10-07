import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

// GET /api/admin/indicacoes?page=1&pageSize=20&search=foo
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)))
    const search = (searchParams.get('search') || '').trim()

    // Use raw SQL to avoid schema-type drift; include coupon/isActive
    let total: number
    let items: Array<{
      id: string
      name: string
      purchaseEmail: string
      whatsapp: string
      friendsCount: number
      coupon: string | null
      isActive: boolean | null
      createdAt: Date
    }>

    const like = `%${search}%`
    if (search) {
      const countRows = await prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM "ReferralBonusRequest"
        WHERE name ILIKE ${like} OR "purchaseEmail" ILIKE ${like} OR whatsapp ILIKE ${like} OR COALESCE(coupon, '') ILIKE ${like}
      `
      total = countRows?.[0]?.count ?? 0

      const offset = (page - 1) * pageSize
      items = await prisma.$queryRaw<Array<{
        id: string; name: string; purchaseEmail: string; whatsapp: string; friendsCount: number; coupon: string | null; isActive: boolean | null; createdAt: Date
      }>>`
        SELECT id, name, "purchaseEmail", whatsapp, "friendsCount", coupon, "isActive", "createdAt"
        FROM "ReferralBonusRequest"
        WHERE name ILIKE ${like} OR "purchaseEmail" ILIKE ${like} OR whatsapp ILIKE ${like} OR COALESCE(coupon, '') ILIKE ${like}
        ORDER BY "createdAt" DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `
    } else {
      const countRows = await prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM "ReferralBonusRequest"
      `
      total = countRows?.[0]?.count ?? 0

      const offset = (page - 1) * pageSize
      items = await prisma.$queryRaw<Array<{
        id: string; name: string; purchaseEmail: string; whatsapp: string; friendsCount: number; coupon: string | null; isActive: boolean | null; createdAt: Date
      }>>`
        SELECT id, name, "purchaseEmail", whatsapp, "friendsCount", coupon, "isActive", "createdAt"
        FROM "ReferralBonusRequest"
        ORDER BY "createdAt" DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `
    }

    return NextResponse.json({ items, total, page, pageSize })
  } catch (err: any) {
    console.error('Admin indicacoes GET error', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
