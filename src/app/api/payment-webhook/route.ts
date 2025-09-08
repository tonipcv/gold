import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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
    
    let body: PaymentWebhookBody | any;
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

    // Extrair informações relevantes de forma resiliente para diferentes esquemas (subscription / transaction)
    const last_status: string | undefined = body?.last_status;
    // Alguns payloads usam "invoice" ao invés de "current_invoice"
    const current_invoice: any = body?.current_invoice || body?.invoice;
    const dates: any = body?.dates;
    const product: any = body?.product;

    // Email pode vir em subscriber.email (formato antigo) ou contact.email (Digital Guru transaction)
    const email: string | undefined = body?.subscriber?.email || body?.contact?.email;
    const subscriber: any = body?.subscriber || body?.contact;
    
    // Verificar se os campos necessários existem
    if (!email) {
      console.error('Dados do assinante ausentes ou inválidos');
      return NextResponse.json(
        { error: 'Dados do assinante ausentes ou inválidos' },
        { status: 400 }
      );
    }
    
    console.log(`Processando webhook para o email: ${email}`);
    
    // Determinar o status do pagamento considerando múltiplas fontes
    const rootStatus: string | undefined = body?.status; // Ex.: "waiting_payment" no payload de transaction
    const normalize = (s?: string) => (s || '').toLowerCase();
    let paymentStatus = 'pending';
    
    if (
      normalize(last_status) === 'active' ||
      normalize(last_status) === 'approved' ||
      normalize(last_status) === 'paid' ||
      normalize(current_invoice?.status) === 'paid' ||
      normalize(rootStatus) === 'paid' ||
      normalize(rootStatus) === 'approved' ||
      normalize(rootStatus) === 'confirmed' ||
      normalize(rootStatus) === 'active'
    ) {
      paymentStatus = 'paid';
      console.log('Status do pagamento: PAGO');
    } else if (
      normalize(last_status) === 'canceled' ||
      normalize(last_status) === 'cancelled' ||
      normalize(rootStatus) === 'canceled' ||
      normalize(rootStatus) === 'cancelled' ||
      normalize(rootStatus) === 'refunded' ||
      normalize(rootStatus) === 'chargeback'
    ) {
      paymentStatus = 'cancelled';
      console.log('Status do pagamento: CANCELADO');
    } else if (normalize(last_status) === 'expired' || normalize(rootStatus) === 'expired') {
      paymentStatus = 'expired';
      console.log('Status do pagamento: EXPIRADO');
    } else {
      paymentStatus = 'pending';
      console.log(`Status do pagamento: PENDENTE (last_status: ${last_status}, invoice status: ${current_invoice?.status || 'N/A'}, root status: ${rootStatus || 'N/A'})`);
    }
    
    // Determinar datas de início e fim
    let startDate = new Date();
    let endDate = new Date();
    
    if (dates?.cycle_start_date && dates?.cycle_end_date) {
      // Usar datas de ciclo (assinaturas)
      startDate = new Date(dates.cycle_start_date);
      endDate = new Date(dates.cycle_end_date);
    } else if (current_invoice?.period_start && current_invoice?.period_end) {
      // Usar datas da fatura
      startDate = new Date(current_invoice.period_start);
      endDate = new Date(current_invoice.period_end);
    } else if (dates?.created_at) {
      // Payload de transaction: usar created_at como início
      startDate = new Date(dates.created_at);
      if (dates?.expires_at) {
        endDate = new Date(dates.expires_at);
      }
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

    // Buscar o produto pelo ID externo (guruProductId). Em payload de transaction, pode vir em product.marketplace_id ou items[0].marketplace_id
    const guruProductId =
      product?.marketplace_id ||
      product?.id ||
      body?.items?.[0]?.marketplace_id ||
      body?.items?.[0]?.id;

    if (!guruProductId) {
      console.error('ID do produto ausente ou inválido');
      return NextResponse.json(
        { error: 'ID do produto ausente ou inválido' },
        { status: 400 }
      );
    }
    console.log(`Buscando produto com guruProductId: ${guruProductId}`);
    console.log(`Detalhes do produto (se disponíveis): marketplace_id=${product?.marketplace_id || 'N/A'}, id=${product?.id || 'N/A'}`);

    
    // Listar todos os produtos disponíveis para debug
    const allProducts = await prisma.product.findMany();
    console.log('Produtos disponíveis:', allProducts.map(p => ({ id: p.id, name: p.name, guruProductId: p.guruProductId || 'não definido' })));
    
    // Buscar produto pelo guruProductId
    let localProduct = await prisma.product.findFirst({ 
      where: { 
        guruProductId: {
          equals: guruProductId
        }
      } 
    });

    if (!localProduct) {
      console.log(`Produto com guruProductId ${guruProductId} não encontrado`);
      // Forçar mapeamento para o produto local 'Gold 10x' quando o nome recebido indicar isso
      const rawIncomingName = product?.name || body?.items?.[0]?.name || '';
      const incomingNameLc = String(rawIncomingName).toLowerCase();
      const isGold10x = incomingNameLc.includes('gold') && incomingNameLc.includes('10x');
      const targetName = isGold10x ? 'Gold 10x' : rawIncomingName || `Produto ${guruProductId}`;

      console.log(`Tentando resolver por nome forçado: ${targetName}`);
      const byName = await prisma.product.findFirst({ where: { name: targetName } });
      if (byName) {
        console.log(`Produto encontrado por nome (${targetName}). Atualizando guruProductId -> ${guruProductId}`);
        // Sincronizar guruProductId com o recebido
        localProduct = await prisma.product.update({
          where: { id: byName.id },
          data: { guruProductId: String(guruProductId) },
        });
      } else {
        console.log(`Produto '${targetName}' não existe. Criando automaticamente com guruProductId ${guruProductId}`);
        localProduct = await prisma.product.create({
          data: {
            name: targetName,
            description: 'Criado automaticamente via webhook',
            guruProductId: String(guruProductId),
            accessDurationDays: 365,
          },
        });
      }
    }
    
    console.log(`Produto encontrado: ${localProduct.name} (ID: ${localProduct.id})`);

    // Fallback ampliado: se não houver fim explícito (nem em dates, nem em current_invoice),
    // calcular endDate a partir de startDate + accessDurationDays do produto
    const hasExplicitEnd = Boolean(
      (dates?.cycle_end_date) ||
      (dates?.expires_at) ||
      (current_invoice?.period_end)
    );
    if (!hasExplicitEnd && localProduct) {
      const base = startDate instanceof Date && !isNaN(startDate.getTime()) ? new Date(startDate) : new Date();
      base.setDate(base.getDate() + (localProduct.accessDurationDays || 365));
      endDate = base;
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

    // Atualizar ou criar registro na tabela Purchase (resiliente a condições de corrida)
    const upsertOnce = async () => {
      return prisma.purchase.upsert({
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
    };

    try {
      await upsertOnce();
    } catch (e: any) {
      // Prisma P2002 => Unique constraint failed (provável corrida entre 2 requisições simultâneas)
      const code = e?.code || e?.meta?.code;
      if (code === 'P2002') {
        console.warn('P2002 em upsert(Purchase). Tentando atualizar registro existente...');
        // Fallback: forçar UPDATE no registro existente
        await prisma.purchase.update({
          where: {
            userId_productId: {
              userId: user.id,
              productId: localProduct.id,
            },
          },
          data: purchaseData,
        });
      } else {
        // Pequeno retry único em caso de outra falha transitória
        console.warn('Falha no upsert. Retentando uma vez...', e?.message || e);
        await upsertOnce();
      }
    }

    // Enviar emails transacionais conforme o status
    try {
      const appUrl = process.env.APP_URL || `https://${req.headers.get('host') || 'app.seudominio.com'}`;
      // Extrair dados de PIX (se existirem) para mensagens de pagamento pendente
      const pixSignature: string | undefined = body?.payment?.pix?.qrcode?.signature;
      const pixUrl: string | undefined = body?.payment?.pix?.qrcode?.url;
      const pixExpiration: string | undefined = body?.payment?.pix?.expiration_date;
      if (paymentStatus === 'paid') {
        const accessUrl = `${appUrl}/login`;
        const resetUrl = `${appUrl}/forgot-password`;
        const mailRes = await sendEmail({
          to: user.email,
          subject: `Acesso liberado: ${localProduct.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.5;">
              <h2>Seu acesso foi liberado 🎉</h2>
              <p>Olá${user.name ? `, ${user.name}` : ''}! Confirmamos o pagamento do seu produto <strong>${localProduct.name}</strong>.</p>
              <p><strong>Como acessar:</strong></p>
              <ol>
                <li>Acesse: <a href="${accessUrl}">${accessUrl}</a></li>
                <li>Entre com seu e-mail: <strong>${user.email}</strong></li>
                <li>Se ainda não definiu uma senha, use "Esqueci minha senha": <a href="${resetUrl}">${resetUrl}</a></li>
              </ol>
              <p><strong>Período de acesso:</strong> ${startDate.toISOString()} até ${endDate.toISOString()}</p>
              <p>Qualquer dúvida, responda este e-mail.</p>
            </div>
          `,
        });
        console.log('Email (paid) result:', JSON.stringify(mailRes));
      } else if (normalize(rootStatus) === 'analysis') {
        const checkoutUrl = body?.checkout_url || appUrl;
        const brand = body?.payment?.credit_card?.brand;
        const last4 = body?.payment?.credit_card?.last_digits;
        const mailRes = await sendEmail({
          to: user.email,
          subject: `Pagamento em análise: ${localProduct.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.5;">
              <h2>Seu pagamento está em análise</h2>
              <p>Olá${user.name ? `, ${user.name}` : ''}! Recebemos o seu pedido para <strong>${localProduct.name}</strong> e o pagamento está <strong>em análise</strong> pela operadora.</p>
              ${brand || last4 ? `<p>Forma de pagamento: ${brand ? brand.toUpperCase() : 'cartão'} ${last4 ? '•••• ' + last4 : ''}</p>` : ''}
              <p>Isso é normal e pode levar alguns minutos. Assim que for aprovado, seu acesso será liberado automaticamente e você receberá outro e‑mail.</p>
              <p>Se preferir acompanhar ou refazer o pagamento, acesse: <a href="${checkoutUrl}">${checkoutUrl}</a></p>
              <p>Qualquer dúvida, responda este e‑mail.</p>
            </div>
          `,
        });
        console.log('Email (analysis) result:', JSON.stringify(mailRes));
      } else if (paymentStatus === 'pending') {
        const checkoutUrl = body?.checkout_url || appUrl;
        const mailRes = await sendEmail({
          to: user.email,
          subject: `Pagamento pendente: ${localProduct.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.5;">
              <h2>Estamos aguardando a confirmação do seu pagamento</h2>
              <p>Olá${user.name ? `, ${user.name}` : ''}! Recebemos seu pedido para <strong>${localProduct.name}</strong>, mas o pagamento ainda está <strong>pendente</strong>.</p>
              <p>Para concluir:</p>
              <ol>
                <li>Finalize o pagamento pelo link (se disponível): <a href="${checkoutUrl}">${checkoutUrl}</a></li>
                <li>Após a confirmação, seu acesso será liberado automaticamente e você receberá outro e-mail.</li>
              </ol>
              ${pixUrl || pixSignature ? `
                <div style="margin-top:16px;padding:12px;border:1px solid #eee;border-radius:8px;">
                  <p><strong>Pagar via PIX</strong></p>
                  ${pixUrl ? `<p>QR Code: <a href="${pixUrl}" target="_blank" rel="noopener noreferrer">Abrir QR Code</a></p>` : ''}
                  ${pixSignature ? `<p style="word-break:break-all;"><strong>Copia e Cola:</strong><br/><code>${pixSignature}</code></p>` : ''}
                  ${pixExpiration ? `<p>Expira em: ${pixExpiration}</p>` : ''}
                </div>
              ` : ''}
              <p>Se já pagou, aguarde alguns minutos — o sistema atualizará automaticamente.</p>
              <p>Qualquer dúvida, responda este e-mail.</p>
            </div>
          `,
        });
        console.log('Email (pending) result:', JSON.stringify(mailRes));
      }
    } catch (mailErr) {
      const mailErrMsg = mailErr instanceof Error ? `${mailErr.name}: ${mailErr.message}` : String(mailErr ?? 'unknown mail error');
      console.error(`Falha ao enviar e-mail transacional: ${mailErrMsg}`);
    }

    // Mensagem de sucesso com informações sobre o acesso
    const accessGranted = paymentStatus === 'paid';
    const message = accessGranted 
      ? 'Pagamento confirmado e acesso liberado' 
      : 'Webhook processado com sucesso, aguardando confirmação de pagamento';
    
    console.log(`Registro de compra atualizado com sucesso! Acesso liberado: ${accessGranted}`);
    
    // Incluir dados de PIX no retorno quando pendente, para facilitar testes/integrações
    const baseResponse: any = {
      message,
      status: paymentStatus,
      accessGranted,
      product: localProduct.name,
      user: user.email,
    };
    if (paymentStatus === 'pending') {
      baseResponse.payment = {
        method: body?.payment?.method || 'unknown',
        checkoutUrl: body?.checkout_url || null,
        pix: body?.payment?.pix ? {
          qrcodeUrl: body?.payment?.pix?.qrcode?.url || null,
          qrcodeSignature: body?.payment?.pix?.qrcode?.signature || null,
          expirationDate: body?.payment?.pix?.expiration_date || null,
        } : null,
      };
      if (normalize(rootStatus) === 'analysis') {
        baseResponse.statusDetail = 'analysis';
        baseResponse.payment.card = {
          brand: body?.payment?.credit_card?.brand || null,
          last4: body?.payment?.credit_card?.last_digits || null,
        };
      }
    }

    return NextResponse.json(baseResponse, { status: 200 });
  } catch (error) {
    const errMsg = error instanceof Error ? `${error.name}: ${error.message}` : String(error ?? 'unknown error');
    console.error(`Erro ao processar webhook: ${errMsg}`);
    
    // Fornecer mais detalhes sobre o erro
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error(`Detalhes do erro: ${errorMessage}`);
    console.error(`Stack trace: ${errorStack}`);
    
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
