import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    if (!(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { isPremium } = await request.json();
    if (typeof isPremium !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { id } = await context.params;

    const user = await prisma.user.update({
      where: { id },
      data: { isPremium },
      select: { id: true, isPremium: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.error('Error updating premium:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
