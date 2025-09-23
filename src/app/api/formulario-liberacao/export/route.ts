import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '1000', 10);
    const liberado = searchParams.get('liberado') === 'true';
    const custom = (searchParams.get('custom') || '').trim();

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
      liberado: false, // Always filter for unreleased items
      ...(custom && {
        customField: { contains: custom, mode: 'insensitive' as const },
      }),
    };

    const [items, total] = await Promise.all([
      prisma.formularioLiberacao.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.formularioLiberacao.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (error) {
    console.error('Error exporting form data:', error);
    return NextResponse.json(
      { error: 'Erro ao exportar dados' },
      { status: 500 }
    );
  }
}
