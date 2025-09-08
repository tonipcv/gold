import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { prisma } from '@/lib/prisma';

/**
 * Verifica se o usuário tem acesso a um determinado produto
 * @param productName Nome do produto a ser verificado
 * @returns boolean indicando se o usuário tem acesso ao produto
 */
export async function hasProductAccess(productName: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return false;
  }

  // Busca o usuário pelo email com todas as compras
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      purchases: {
        include: {
          product: true
        }
      }
    }
  });

  if (!user || !user.purchases) {
    return false;
  }

  const now = new Date();
  
  // Filtra as compras após recuperá-las do banco
  const activePurchases = user.purchases.filter((purchase: any) => {
    // Verifica se o produto corresponde ao solicitado
    const isCorrectProduct = purchase.product.name === productName;
    
    // Verifica se o status é ativo
    const isActive = purchase.status === 'paid' || purchase.status === 'ACTIVE';
    
    // Verifica se está dentro do período de acesso
    const isWithinDateRange = 
      (!purchase.startDate || new Date(purchase.startDate) <= now) &&
      (!purchase.endDate || new Date(purchase.endDate) >= now);
    
    return isCorrectProduct && isActive && isWithinDateRange;
  });
  
  return activePurchases.length > 0;
}
