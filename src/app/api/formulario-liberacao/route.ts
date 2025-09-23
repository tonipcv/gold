import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, purchaseEmail, whatsapp, accountNumber, customField = 'turma 2' } = body || {}

    if (!name || !purchaseEmail || !whatsapp || !accountNumber) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const saved = await prisma.formularioLiberacao.create({
      data: {
        name,
        purchaseEmail,
        whatsapp,
        accountNumber,
        customField,
      },
    })

    return NextResponse.json({ ok: true, id: saved.id })
  } catch (err) {
    console.error('Erro ao salvar formulário de liberação:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1), 200)
    const search = (searchParams.get('search') || '').trim()
    const liberado = searchParams.get('liberado')
    const custom = (searchParams.get('custom') || '').trim()

    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { purchaseEmail: { contains: search, mode: 'insensitive' as const } },
          { whatsapp: { contains: search, mode: 'insensitive' as const } },
          { accountNumber: { contains: search, mode: 'insensitive' as const } },
          { customField: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(custom && {
        customField: { contains: custom, mode: 'insensitive' as const },
      }),
    }

    // Filter by status if provided
    if (liberado === 'true' || liberado === 'false') {
      where.liberado = liberado === 'true'
    }

    const [total, items] = await Promise.all([
      prisma.formularioLiberacao.count({ where }),
      prisma.formularioLiberacao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          purchaseEmail: true,
          whatsapp: true,
          accountNumber: true,
          customField: true,
          liberado: true,
          createdAt: true,
        },
      }),
    ])

    return NextResponse.json({ items, total, page, pageSize })
  } catch (err) {
    console.error('Erro ao listar formulários de liberação:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
