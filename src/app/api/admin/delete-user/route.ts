import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Exclui dependências que não possuem onDelete: Cascade
    // Accounts, Sessions e UserCoupons já possuem Cascade no schema
    await prisma.$transaction(async (tx) => {
      // Purchases não estão com Cascade -> remover manualmente
      await tx.purchase.deleteMany({ where: { userId } });

      // Finalmente remover o usuário
      await tx.user.delete({ where: { id: userId } });
    });

    return NextResponse.json({ message: 'Usuário apagado com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao apagar usuário' },
      { status: 500 }
    );
  }
}
