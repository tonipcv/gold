import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Função auxiliar para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
  // Verificar autenticação
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { message: 'Não autorizado' },
      { status: 401 }
    );
  }

  try {
    // Parse do FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;

    if (!file || !password) {
      return NextResponse.json(
        { message: 'Arquivo CSV e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se é um arquivo CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json(
        { message: 'O arquivo deve ser do tipo CSV' },
        { status: 400 }
      );
    }

    // Ler o conteúdo do arquivo
    const fileContent = await file.text();
    const lines = fileContent.split('\n');

    // Preparar senha hasheada para todos os usuários
    const hashedPassword = await bcrypt.hash(password, 10);

    // Array para armazenar resultados
    const results = {
      importedCount: 0,
      skippedCount: 0,
      invalidEmails: [] as string[],
    };

    // Processar cada linha
    for (const line of lines) {
      const email = line.trim();
      
      // Pular linhas vazias
      if (!email) continue;

      // Validar email
      if (!isValidEmail(email)) {
        results.invalidEmails.push(email);
        continue;
      }

      try {
        // Verificar se o usuário já existe
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });

        if (existingUser) {
          results.skippedCount++;
          continue;
        }

        // Criar novo usuário
        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            isPremium: true // Define o usuário como premium por padrão
          }
        });

        results.importedCount++;
      } catch (error) {
        console.error(`Erro ao processar email ${email}:`, error);
        results.skippedCount++;
      }
    }

    return NextResponse.json({
      message: 'Processamento concluído',
      importedCount: results.importedCount,
      skippedCount: results.skippedCount,
      invalidEmails: results.invalidEmails.length > 0 ? results.invalidEmails : undefined
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao processar arquivo CSV:', error);
    return NextResponse.json(
      { message: 'Erro ao processar o arquivo CSV' },
      { status: 500 }
    );
  }
}
