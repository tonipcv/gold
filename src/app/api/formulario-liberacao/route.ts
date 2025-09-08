import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, purchaseEmail, whatsapp, accountNumber } = body || {}

    if (!name || !purchaseEmail || !whatsapp || !accountNumber) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const saved = await prisma.formularioLiberacao.create({
      data: {
        name,
        purchaseEmail,
        whatsapp,
        accountNumber,
      },
    })

    return NextResponse.json({ ok: true, id: saved.id })
  } catch (err) {
    console.error('Erro ao salvar formulário de liberação:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
