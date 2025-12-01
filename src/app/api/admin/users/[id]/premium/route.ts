import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!verifyAdminToken(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
