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

    // Obter dados do corpo da requisição
    const { userId, purchaseId } = await request.json();

    // Validar dados
    if (!userId || !purchaseId) {
      return NextResponse.json(
        { error: 'ID do usuário e ID da compra são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se a compra existe e pertence ao usuário
    const purchase = await prisma.purchase.findFirst({
      where: {
        id: purchaseId,
        userId: userId
      }
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Compra não encontrada ou não pertence ao usuário especificado' },
        { status: 404 }
      );
    }

    // Remover a compra
    await prisma.purchase.delete({
      where: { id: purchaseId }
    });

    return NextResponse.json({
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json(
      { error: 'Erro ao remover produto' },
      { status: 500 }
    );
  }
}
