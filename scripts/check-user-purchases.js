const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserPurchases() {
  try {
    // Buscar o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: 'xppsalvador@gmail.com' },
      include: {
        purchases: {
          include: {
            product: true
          }
        }
      }
    });

    if (!user) {
      console.log('Usuário não encontrado');
      return;
    }

    console.log('Usuário encontrado:');
    console.log(`ID: ${user.id}`);
    console.log(`Nome: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log('\nCompras:');
    
    if (user.purchases.length === 0) {
      console.log('Nenhuma compra encontrada');
    } else {
      user.purchases.forEach((purchase, index) => {
        console.log(`\nCompra ${index + 1}:`);
        console.log(`ID: ${purchase.id}`);
        console.log(`Produto: ${purchase.product.name}`);
        console.log(`Status: ${purchase.status}`);
        console.log(`Data de início: ${purchase.startDate ? purchase.startDate.toISOString() : 'N/A'}`);
        console.log(`Data de fim: ${purchase.endDate ? purchase.endDate.toISOString() : 'N/A'}`);
        console.log(`Data de expiração: ${purchase.expirationDate ? purchase.expirationDate.toISOString() : 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('Erro ao verificar compras do usuário:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserPurchases();
