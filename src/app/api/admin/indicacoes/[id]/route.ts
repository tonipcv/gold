import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

// PATCH /api/admin/indicacoes/[id]
// Body: { coupon?: string | null, isActive?: boolean }
export async function PATCH(req: Request, context: any) {
  try {
    const id = context?.params?.id as string | undefined
    if (!id) return NextResponse.json({ error: 'ID ausente' }, { status: 400 })

    const body = await req.json().catch(() => ({} as any))
    const hasCoupon = Object.prototype.hasOwnProperty.call(body, 'coupon')
    const hasIsActive = Object.prototype.hasOwnProperty.call(body, 'isActive')

    if (!hasCoupon && !hasIsActive) {
      return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 })
    }

    // Prefer model accessor if available; otherwise use raw SQL
    const accessor = (prisma as any).referralBonusRequest

    if (accessor?.update) {
      const data: any = {}
      if (hasCoupon) data.coupon = body.coupon === null ? null : String(body.coupon)
      if (hasIsActive) data.isActive = Boolean(body.isActive)

      const updated = await accessor.update({ where: { id }, data })
      return NextResponse.json({ ok: true, item: updated })
    }

    // Raw SQL fallback
    if (hasCoupon && hasIsActive) {
      const rows = await prisma.$queryRaw<Array<any>>`
        UPDATE "ReferralBonusRequest"
        SET coupon = ${body.coupon === null ? null : String(body.coupon)},
            "isActive" = ${Boolean(body.isActive)}
        WHERE id = ${id}
        RETURNING id, name, "purchaseEmail", whatsapp, "friendsCount", coupon, "isActive", "createdAt"
      `
      const item = rows?.[0]
      if (!item) return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
      return NextResponse.json({ ok: true, item })
    }

    if (hasCoupon) {
      const rows = await prisma.$queryRaw<Array<any>>`
        UPDATE "ReferralBonusRequest"
        SET coupon = ${body.coupon === null ? null : String(body.coupon)}
        WHERE id = ${id}
        RETURNING id, name, "purchaseEmail", whatsapp, "friendsCount", coupon, "isActive", "createdAt"
      `
      const item = rows?.[0]
      if (!item) return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
      return NextResponse.json({ ok: true, item })
    }

    // hasIsActive only
    const rows = await prisma.$queryRaw<Array<any>>`
      UPDATE "ReferralBonusRequest"
      SET "isActive" = ${Boolean(body.isActive)}
      WHERE id = ${id}
      RETURNING id, name, "purchaseEmail", whatsapp, "friendsCount", coupon, "isActive", "createdAt"
    `
    const item = rows?.[0]
    if (!item) return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
    return NextResponse.json({ ok: true, item })
  } catch (err: any) {
    console.error('Admin indicacoes PATCH error', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
