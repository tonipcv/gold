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
    const { userId, productId, status, startDate, endDate } = await request.json();

    // Validar dados
    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'ID do usuário e ID do produto são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário já tem este produto
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingPurchase) {
      // Atualizar a compra existente
      const updatedPurchase = await prisma.purchase.update({
        where: { id: existingPurchase.id },
        data: {
          status: status || 'ACTIVE',
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(),
          expirationDate: endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      });

      return NextResponse.json({
        message: 'Acesso ao produto atualizado com sucesso',
        purchase: updatedPurchase
      });
    } else {
      // Criar nova compra
      const newPurchase = await prisma.purchase.create({
        data: {
          userId,
          productId,
          status: status || 'ACTIVE',
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          purchaseDate: new Date(),
          expirationDate: endDate ? new Date(endDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      });

      return NextResponse.json({
        message: 'Produto adicionado com sucesso',
        purchase: newPurchase
      });
    }
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar produto' },
      { status: 500 }
    );
  }
}
