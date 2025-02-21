import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!verifyAdminToken(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar estatísticas
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({
      where: { isPremium: true }
    });
    const activeUsers = await prisma.session.count({
      where: { expires: { gte: new Date() } }
    });
    const lastDaySignups = await prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    // Buscar lista de usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isPremium: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const stats = {
      totalUsers,
      premiumUsers,
      activeUsers,
      lastDaySignups,
      users // Incluindo a lista de usuários
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({
      totalUsers: 0,
      premiumUsers: 0,
      activeUsers: 0,
      lastDaySignups: 0,
      users: []
    }, { status: 500 });
  }
} 