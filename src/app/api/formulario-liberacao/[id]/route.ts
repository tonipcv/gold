import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { liberado } = await req.json();
    
    if (typeof liberado !== 'boolean') {
      return NextResponse.json(
        { error: 'Status de liberação inválido' },
        { status: 400 }
      );
    }

    const updated = await prisma.formularioLiberacao.update({
      where: { id: params.id },
      data: { liberado },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating form status:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status' },
      { status: 500 }
    );
  }
}
