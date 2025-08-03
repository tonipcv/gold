import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipos para o corpo da requisição
type PaymentStatus = 'paid' | 'pending' | 'cancelled' | 'refunded' | 'expired';

interface Subscriber {
  phone_number: string;
  phone_local_code: string;
  name: string;
  doc: string;
  email: string;
  id: string;
}

interface WebhookBody {
  last_status: PaymentStatus;
  created_at: string;
  expires_at: string;
  subscriber: Subscriber;
  product_id: string; // Novo campo para identificar o produto
}

export async function POST(req: Request) {
  try {
    console.log("Recebendo evento de webhook...");
    
    const body: WebhookBody = await req.json();
    console.log("Dados recebidos:", body);

    const { last_status, created_at, expires_at, subscriber, product_id } = body;
    const { email } = subscriber;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Usuário com email ${email} não encontrado`);
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({ 
      where: { id: product_id } 
    });
    if (!product) {
      console.log(`Produto com ID ${product_id} não encontrado`);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar ou criar registro na tabela Purchase
    const purchaseData = {
      status: last_status,
      startDate: new Date(created_at),
      endDate: new Date(expires_at),
      expirationDate: new Date(expires_at), // Adicionando campo obrigatório
    };

    await prisma.purchase.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product_id,
        },
      },
      update: purchaseData,
      create: {
        ...purchaseData,
        user: { connect: { id: user.id } },
        product: { connect: { id: product_id } },
      },
    });

    console.log("Registro de compra atualizado com sucesso!");
    return NextResponse.json(
      { message: 'Status e datas de acesso atualizados com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
