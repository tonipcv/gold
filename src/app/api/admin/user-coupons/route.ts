import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// GET /api/admin/user-coupons?userId=... | ?email=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    // List mode
    if (searchParams.get('list') === '1') {
      const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
      const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get('pageSize') || '50', 10)))
      const q = (searchParams.get('q') || '').trim()
      const activeOnly = (searchParams.get('active') || '') === '1'

      const like = q ? `%${q}%` : null
      // Total
      const countRows = like
        ? activeOnly
          ? await prisma.$queryRaw<{ count: number }[]>`
              SELECT COUNT(*)::int AS count
              FROM "User" u
              WHERE (u.email ILIKE ${like} OR u.name ILIKE ${like})
                AND EXISTS (
                  SELECT 1 FROM "UserCoupon" c
                  WHERE c."userId" = u.id AND c."isActive" = true
                )
            `
          : await prisma.$queryRaw<{ count: number }[]>`
              SELECT COUNT(*)::int AS count
              FROM "User" u
              WHERE u.email ILIKE ${like} OR u.name ILIKE ${like}
            `
        : activeOnly
          ? await prisma.$queryRaw<{ count: number }[]>`
              SELECT COUNT(*)::int AS count
              FROM "User" u
              WHERE EXISTS (
                SELECT 1 FROM "UserCoupon" c
                WHERE c."userId" = u.id AND c."isActive" = true
              )
            `
          : await prisma.$queryRaw<{ count: number }[]>`
              SELECT COUNT(*)::int AS count
              FROM "User" u
            `
      let total = 0
      if (Array.isArray(countRows) && countRows[0] && typeof countRows[0].count === 'number') {
        total = countRows[0].count
      }

      const offset = (page - 1) * pageSize
      const items = like
        ? activeOnly
          ? await prisma.$queryRaw<any[]>`
              SELECT u.id, u.name, u.email,
                uc.coupon, uc.link, uc."isActive", uc.id as "couponId"
              FROM "User" u
              LEFT JOIN LATERAL (
                SELECT id, coupon, link, "isActive"
                FROM "UserCoupon"
                WHERE "userId" = u.id
                ORDER BY "createdAt" DESC
                LIMIT 1
              ) uc ON true
              WHERE (u.email ILIKE ${like} OR u.name ILIKE ${like}) AND uc."isActive" = true
              ORDER BY u."createdAt" DESC
              LIMIT ${pageSize} OFFSET ${offset}
            `
          : await prisma.$queryRaw<any[]>`
              SELECT u.id, u.name, u.email,
                uc.coupon, uc.link, uc."isActive", uc.id as "couponId"
              FROM "User" u
              LEFT JOIN LATERAL (
                SELECT id, coupon, link, "isActive"
                FROM "UserCoupon"
                WHERE "userId" = u.id
                ORDER BY "createdAt" DESC
                LIMIT 1
              ) uc ON true
              WHERE u.email ILIKE ${like} OR u.name ILIKE ${like}
              ORDER BY u."createdAt" DESC
              LIMIT ${pageSize} OFFSET ${offset}
            `
        : activeOnly
          ? await prisma.$queryRaw<any[]>`
              SELECT u.id, u.name, u.email,
                uc.coupon, uc.link, uc."isActive", uc.id as "couponId"
              FROM "User" u
              LEFT JOIN LATERAL (
                SELECT id, coupon, link, "isActive"
                FROM "UserCoupon"
                WHERE "userId" = u.id
                ORDER BY "createdAt" DESC
                LIMIT 1
              ) uc ON true
              WHERE uc."isActive" = true
              ORDER BY u."createdAt" DESC
              LIMIT ${pageSize} OFFSET ${offset}
            `
          : await prisma.$queryRaw<any[]>`
              SELECT u.id, u.name, u.email,
                uc.coupon, uc.link, uc."isActive", uc.id as "couponId"
              FROM "User" u
              LEFT JOIN LATERAL (
                SELECT id, coupon, link, "isActive"
                FROM "UserCoupon"
                WHERE "userId" = u.id
                ORDER BY "createdAt" DESC
                LIMIT 1
              ) uc ON true
              ORDER BY u."createdAt" DESC
              LIMIT ${pageSize} OFFSET ${offset}
            `

      const rows = (items || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        coupon: u.coupon || '',
        link: u.link || '',
        isActive: !!u.isActive,
        couponId: u.couponId || null,
      }))
      // Counters of users with coupons active/inactive
      const activeCountRows = like
        ? await prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*)::int AS count
            FROM "User" u
            WHERE (u.email ILIKE ${like} OR u.name ILIKE ${like})
              AND EXISTS (
                SELECT 1 FROM "UserCoupon" c
                WHERE c."userId" = u.id AND c."isActive" = true
              )
          `
        : await prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*)::int AS count
            FROM "User" u
            WHERE EXISTS (
              SELECT 1 FROM "UserCoupon" c
              WHERE c."userId" = u.id AND c."isActive" = true
            )
          `
      const inactiveCountRows = like
        ? await prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*)::int AS count
            FROM "User" u
            WHERE (u.email ILIKE ${like} OR u.name ILIKE ${like})
              AND EXISTS (
                SELECT 1 FROM "UserCoupon" c
                WHERE c."userId" = u.id AND c."isActive" = false
              )
          `
        : await prisma.$queryRaw<{ count: number }[]>`
            SELECT COUNT(*)::int AS count
            FROM "User" u
            WHERE EXISTS (
              SELECT 1 FROM "UserCoupon" c
              WHERE c."userId" = u.id AND c."isActive" = false
            )
          `
      const activeCount = activeCountRows?.[0]?.count ?? 0
      const inactiveCount = inactiveCountRows?.[0]?.count ?? 0
      return NextResponse.json({ items: rows, total, page, pageSize, activeCount, inactiveCount })
    }
    let userId = (searchParams.get('userId') || '').trim()
    const email = (searchParams.get('email') || '').trim().toLowerCase()

    if (!userId && email) {
      const u = await prisma.user.findUnique({ where: { email } })
      if (!u) return NextResponse.json({ item: null, error: 'Usuário não encontrado' }, { status: 404 })
      userId = u.id
    }
    if (!userId) return NextResponse.json({ error: 'Informe userId ou email' }, { status: 400 })

    const accessor = (prisma as any).userCoupon
    if (accessor?.findFirst) {
      const item = await accessor.findFirst({ where: { userId } })
      return NextResponse.json({ item })
    }
    const rows = await prisma.$queryRaw<Array<any>>`
      SELECT id, "userId", coupon, link, "isActive", "createdAt"
      FROM "UserCoupon"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
      LIMIT 1
    `
    const item = rows?.[0] || null
    return NextResponse.json({ item })
  } catch (err: any) {
    console.error('user-coupons GET error', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// POST /api/admin/user-coupons
// Body: { userId? string, email? string, coupon: string, link: string, isActive?: boolean }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    let userId: string = (body.userId || '').trim()
    const email: string = (body.email || '').trim().toLowerCase()
    let coupon: string = String(body.coupon || '').trim()
    let link: string = String(body.link || '').trim()
    const isActive: boolean = Boolean(body.isActive)

    if (!userId && email) {
      const u = await prisma.user.findUnique({ where: { email } })
      if (!u) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
      userId = u.id
    }
    if (!userId && !email) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes: userId/email' }, { status: 400 })
    }

    // Se não veio cupom, gerar automaticamente a partir do e-mail do usuário (local-part + 10)
    if (!coupon) {
      try {
        const lookup = userId
          ? await prisma.user.findUnique({ where: { id: userId } })
          : await prisma.user.findUnique({ where: { email } })
        if (lookup?.email) {
          const local = lookup.email.split('@')[0] || 'USER'
          coupon = `${local.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}10`
        }
      } catch (e) {
        console.error('user-coupons POST: erro ao gerar cupom sugerido', e)
      }
      if (!coupon) {
        return NextResponse.json({ error: 'Cupom vazio. Informe um cupom válido.' }, { status: 400 })
      }
    }
    // Normalizar: coupon sempre em UPPERCASE sem espaços extras
    coupon = coupon.replace(/\s+/g, '').toUpperCase()

    // Garantir link
    if (!link) {
      link = `/automacao-bonus?coupon=${encodeURIComponent(coupon)}`
    }

    // Verificar unicidade do coupon (não pode existir em outro usuário)
    try {
      const existingByCoupon = await prisma.userCoupon.findUnique({ where: { coupon } })
      if (existingByCoupon && existingByCoupon.userId !== userId) {
        return NextResponse.json({ error: 'Cupom já utilizado por outro usuário', code: 'COUPON_IN_USE' }, { status: 409 })
      }
    } catch (e) {
      // Se falhar (por accessor ausente), checamos via SQL abaixo
    }

    const accessor = (prisma as any).userCoupon
    if (accessor?.findFirst && accessor?.update && accessor?.create) {
      const existing = await accessor.findFirst({ where: { userId } })
      let item
      if (existing) {
        item = await accessor.update({ where: { id: existing.id }, data: { coupon, link, isActive } })
      } else {
        item = await accessor.create({ data: { userId, coupon, link, isActive } })
      }
      return NextResponse.json({ ok: true, item })
    }

    // Raw SQL fallback
    // Checar unicidade por SQL
    const dupRows = await prisma.$queryRaw<Array<{ userId: string }>>`
      SELECT "userId" FROM "UserCoupon" WHERE coupon = ${coupon} LIMIT 1
    `
    if (dupRows?.[0]?.userId && dupRows[0].userId !== userId) {
      return NextResponse.json({ error: 'Cupom já utilizado por outro usuário', code: 'COUPON_IN_USE' }, { status: 409 })
    }
    const rows = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "UserCoupon" WHERE "userId" = ${userId} LIMIT 1
    `
    if (rows?.[0]?.id) {
      const updated = await prisma.$queryRaw<Array<any>>`
        UPDATE "UserCoupon"
        SET coupon = ${coupon}, link = ${link}, "isActive" = ${isActive}
        WHERE id = ${rows[0].id}
        RETURNING id, "userId", coupon, link, "isActive", "createdAt"
      `
      return NextResponse.json({ ok: true, item: updated?.[0] })
    } else {
      const id = (globalThis as any).crypto?.randomUUID?.() || require('crypto').randomUUID()
      const created = await prisma.$queryRaw<Array<any>>`
        INSERT INTO "UserCoupon" (id, "userId", coupon, link, "isActive")
        VALUES (${id}, ${userId}, ${coupon}, ${link}, ${isActive})
        RETURNING id, "userId", coupon, link, "isActive", "createdAt"
      `
      return NextResponse.json({ ok: true, item: created?.[0] })
    }
  } catch (err: any) {
    console.error('user-coupons POST error', {
      message: err?.message || String(err),
      stack: err?.stack,
    })
    return NextResponse.json({ error: 'Erro interno', detail: err?.message || String(err) }, { status: 500 })
  }
}
