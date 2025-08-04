import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipos para o corpo da requisição da plataforma de pagamento
interface CreditCard {
  brand: string;
  expiration_month: number;
  expiration_year: number;
  last_four: string;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  doc: string;
  phone_local_code: string;
  phone_number: string;
}

interface Product {
  id: string;
  marketplace_id: string;
  name: string;
}

interface CurrentInvoice {
  status: string;
  period_start: string;
  period_end: string;
}

interface Dates {
  cycle_start_date: string;
  cycle_end_date: string;
  next_cycle_at: string;
}

interface PaymentWebhookBody {
  id: string;
  internal_id: string;
  api_token: string;
  webhook_type: string;
  last_status: string;
  product: Product;
  subscriber: Subscriber;
  credit_card?: CreditCard;
  current_invoice?: CurrentInvoice;
  dates?: Dates;
}

export async function POST(req: Request) {
  console.log("Recebendo evento de webhook da plataforma de pagamento...");
  console.log("Headers:", JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));
  
  try {
    // Verificar se o corpo da requisição é válido
    const rawBody = await req.text();
    console.log("Raw body:", rawBody);
    
    let body: PaymentWebhookBody;
    try {
      body = JSON.parse(rawBody);
      console.log("Dados recebidos (parsed):", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { error: 'JSON inválido', details: 'O corpo da requisição não é um JSON válido' },
        { status: 400 }
      );
    }

    // Extrair informações relevantes
    const { last_status, subscriber, product, current_invoice, dates } = body;
    
    // Verificar se os campos necessários existem
    if (!subscriber || !subscriber.email) {
      console.error('Dados do assinante ausentes ou inválidos');
      return NextResponse.json(
        { error: 'Dados do assinante ausentes ou inválidos' },
        { status: 400 }
      );
    }
    
    const { email } = subscriber;
    console.log(`Processando webhook para o email: ${email}`);
    
    // Determinar o status do pagamento
    let paymentStatus = 'pending';
    
    // Verificar o status do pagamento
    if (last_status === 'active' || (current_invoice && current_invoice.status === 'paid')) {
      paymentStatus = 'paid';
      console.log('Status do pagamento: PAGO');
    } else if (last_status === 'canceled' || last_status === 'cancelled') {
      paymentStatus = 'cancelled';
      console.log('Status do pagamento: CANCELADO');
    } else if (last_status === 'expired') {
      paymentStatus = 'expired';
      console.log('Status do pagamento: EXPIRADO');
    } else {
      console.log(`Status do pagamento: PENDENTE (last_status: ${last_status}, invoice status: ${current_invoice?.status || 'N/A'})`);
    }
    
    // Determinar datas de início e fim
    let startDate = new Date();
    let endDate = new Date();
    
    if (dates) {
      // Usar datas do payload
      startDate = new Date(dates.cycle_start_date);
      endDate = new Date(dates.cycle_end_date);
    } else if (current_invoice) {
      // Alternativa: usar datas da fatura atual
      startDate = new Date(current_invoice.period_start);
      endDate = new Date(current_invoice.period_end);
    }

    // Verificar se o usuário existe ou criar um novo
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log(`Usuário com email ${email} não encontrado. Criando novo usuário...`);
      
      // Criar um novo usuário com os dados do subscriber
      user = await prisma.user.create({
        data: {
          email: email,
          name: subscriber.name,
          phone: `${subscriber.phone_local_code}${subscriber.phone_number}`,
          // Não definimos senha para que o usuário precise usar "esqueci minha senha"
          // para definir uma senha na primeira vez que acessar
        }
      });
      
      console.log(`Novo usuário criado com ID: ${user.id}`);
    }

    // Buscar o produto pelo ID externo (guruProductId)
    if (!product || (!product.marketplace_id && !product.id)) {
      console.error('ID do produto ausente ou inválido');
      return NextResponse.json(
        { error: 'ID do produto ausente ou inválido' },
        { status: 400 }
      );
    }
    
    // Preferir o marketplace_id como guruProductId, mas usar o id como fallback
    const guruProductId = product.marketplace_id || product.id;
    console.log(`Buscando produto com guruProductId: ${guruProductId}`);
    console.log(`Detalhes do produto: marketplace_id=${product.marketplace_id}, id=${product.id}`);

    
    // Listar todos os produtos disponíveis para debug
    const allProducts = await prisma.product.findMany();
    console.log('Produtos disponíveis:', allProducts.map(p => ({ id: p.id, name: p.name, guruProductId: p.guruProductId || 'não definido' })));
    
    // Buscar produto pelo guruProductId
    const localProduct = await prisma.product.findFirst({ 
      where: { 
        guruProductId: {
          equals: guruProductId
        }
      } 
    });

    if (!localProduct) {
      console.log(`Produto com guruProductId ${guruProductId} não encontrado`);
      
      // Registrar a tentativa de compra mesmo sem encontrar o produto
      console.log(`Registrando tentativa de compra para email ${email} e produto ID ${guruProductId}`);
      
      return NextResponse.json(
        { 
          error: 'Produto não encontrado', 
          message: 'A tentativa de compra foi registrada, mas o produto não foi encontrado no sistema.'
        },
        { status: 404 }
      );
    }
    
    console.log(`Produto encontrado: ${localProduct.name} (ID: ${localProduct.id})`);

    // Fallback: usar data atual + duração padrão do produto
    if (!dates && !current_invoice && localProduct) {
      // Adicionar a duração padrão do produto (em dias) à data atual
      endDate.setDate(endDate.getDate() + localProduct.accessDurationDays);
    }

    // Preparar dados para atualização ou criação do registro de compra
    const purchaseData = {
      status: paymentStatus,
      startDate: paymentStatus === 'paid' ? startDate : null,
      endDate: paymentStatus === 'paid' ? endDate : null,
      expirationDate: paymentStatus === 'paid' ? endDate : new Date(), // Se não estiver pago, expirar imediatamente
    };
    
    console.log(`Atualizando registro de compra com status: ${paymentStatus}`);
    console.log('Dados da compra:', JSON.stringify(purchaseData, null, 2));

    // Atualizar ou criar registro na tabela Purchase
    await prisma.purchase.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: localProduct.id,
        },
      },
      update: purchaseData,
      create: {
        ...purchaseData,
        user: { connect: { id: user.id } },
        product: { connect: { id: localProduct.id } },
      },
    });

    // Mensagem de sucesso com informações sobre o acesso
    const accessGranted = paymentStatus === 'paid';
    const message = accessGranted 
      ? 'Pagamento confirmado e acesso liberado' 
      : 'Webhook processado com sucesso, aguardando confirmação de pagamento';
    
    console.log(`Registro de compra atualizado com sucesso! Acesso liberado: ${accessGranted}`);
    
    return NextResponse.json(
      { 
        message, 
        status: paymentStatus,
        accessGranted,
        product: localProduct.name,
        user: user.email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    
    // Fornecer mais detalhes sobre o erro
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('Detalhes do erro:', errorMessage);
    console.error('Stack trace:', errorStack);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Adicionar um endpoint GET para verificar se a API está funcionando
export async function GET() {
  return NextResponse.json(
    { 
      status: 'online', 
      message: 'Webhook endpoint está ativo e pronto para receber notificações',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
