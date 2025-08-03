const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Criar produtos
  const products = [
    { name: 'futurostech', description: 'Futuros Tech' },
    { name: 'copytrade', description: 'Copy Trading com BH' },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  // Associar todos os usuários ao produto 'futurostech'
  const futurostech = await prisma.product.findUnique({
    where: { name: 'futurostech' },
  });

  if (!futurostech) {
    throw new Error('Produto futurostech não encontrado');
  }

  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.purchase.upsert({
      where: { 
        userId_productId: {
          userId: user.id,
          productId: futurostech.id,
        } 
      },
      update: {},
      create: {
        userId: user.id,
        productId: futurostech.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano de acesso
      },
    });
  }

  console.log('Produtos criados e usuários associados com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
