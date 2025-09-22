import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phone } = body;

    // Validar campos obrigatórios
    if (!email || !password || !name) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Campos obrigatórios faltando',
          fields: {
            email: !email ? 'Email é obrigatório' : null,
            password: !password ? 'Senha é obrigatória' : null,
            name: !name ? 'Nome é obrigatório' : null,
          }
        },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Este e-mail já está registrado',
        },
        { status: 400 }
      );
    }

    // Gerar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    try {
      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || '',
          verificationToken,
          emailVerified: null
        },
      });

      // Enviar email de confirmação
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     process.env.NEXTAUTH_URL || 
                     'https://wallet.k17.com.br';
      const confirmationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

      try {
        const fromName = process.env.EMAIL_FROM_NAME || 'Katsu'
        const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'oi@k17.com.br'
        await sendEmail({
          to: email,
          subject: 'Confirme seu email',
          html: `
            <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
            <h1>Bem-vindo ao Katsu!</h1>
            <p>Olá ${name},</p>
            <p>Obrigado por se cadastrar. Por favor, confirme seu email clicando no botão abaixo:</p>
            <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">
              Confirmar Email
            </a>
            <p>Se você não criou esta conta, por favor ignore este email.</p>
          `
        });
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Continua com o registro mesmo se o email falhar
      }

      return NextResponse.json(
        { 
          success: true,
          message: 'Usuário criado com sucesso. Por favor, verifique seu email.',
          userId: user.id 
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { 
          success: false,
          message: 'Erro ao criar usuário no banco de dados',
          error: process.env.NODE_ENV === 'development' ? dbError : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Erro ao processar a requisição',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 