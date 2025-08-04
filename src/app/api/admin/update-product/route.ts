import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    // Obter dados do produto a ser atualizado
    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      return NextResponse.json({ error: 'Formato de dados inválido' }, { status: 400 });
    }
    
    if (!payload) {
      return NextResponse.json({ error: 'Dados não fornecidos' }, { status: 400 });
    }
    
    // Verificar senha de administrador
    if (!payload.adminPassword || payload.adminPassword !== 'admin123') {
      return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 });
    }
    
    const { id, name, description, guruProductId } = payload;

    if (!id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Nome do produto é obrigatório' }, { status: 400 });
    }

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Verificar se o guruProductId já está em uso por outro produto
    if (guruProductId) {
      const productWithSameGuruId = await prisma.product.findFirst({
        where: {
          guruProductId,
          id: { not: id } // Excluir o produto atual da verificação
        }
      });

      if (productWithSameGuruId) {
        return NextResponse.json(
          { error: 'Este ID da Guru já está sendo usado por outro produto' },
          { status: 400 }
        );
      }
    }

    // Atualizar o produto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        guruProductId,
        updatedAt: new Date()
      }
    });

    // Registrar a atividade de atualização
    console.log(`Produto ${id} atualizado. GuruProductId: ${guruProductId || 'não definido'}`);

    return NextResponse.json({
      message: 'Produto atualizado com sucesso',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}
