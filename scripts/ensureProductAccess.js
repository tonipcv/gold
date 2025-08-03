const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando script para garantir acesso ao produto futurostech...');

  // Buscar o produto futurostech
  let futurostech = await prisma.product.findFirst({
    where: { name: 'futurostech' },
  });

  if (!futurostech) {
    console.error('Produto futurostech não encontrado. Criando o produto...');
    await prisma.product.create({
      data: { 
        name: 'futurostech', 
        description: 'Futuros Tech' 
      },
    });
    console.log('Produto futurostech criado com sucesso!');
    // Buscar o produto recém-criado
    const newProduct = await prisma.product.findFirst({
      where: { name: 'futurostech' },
    });
    if (!newProduct) {
      throw new Error('Falha ao criar o produto futurostech');
    }
    futurostech = newProduct;
  }

  // Buscar todos os usuários
  console.log('Buscando todos os usuários...');
  const users = await prisma.user.findMany();
  console.log(`Encontrados ${users.length} usuários.`);

  // Verificar especificamente o usuário xppsalvador@gmail.com
  const specificUser = await prisma.user.findUnique({
    where: { email: 'xppsalvador@gmail.com' },
    include: { purchases: true }
  });
  
  console.log('Verificando usuário específico xppsalvador@gmail.com...');

  if (specificUser) {
    console.log(`Usuário xppsalvador@gmail.com encontrado (ID: ${specificUser.id})`);
    const hasFuturosTech = specificUser.purchases.some(p => p.productId === futurostech.id);
    if (!hasFuturosTech) {
      console.log('Usuário xppsalvador@gmail.com NÃO tem acesso ao futurostech. Adicionando...');
    } else {
      console.log('Usuário xppsalvador@gmail.com JÁ tem acesso ao futurostech. Atualizando para garantir status ACTIVE...');
    }
  } else {
    console.log('Usuário xppsalvador@gmail.com não encontrado no banco de dados.');
  }

  // Contador de acessos criados/atualizados
  let created = 0;
  let updated = 0;
  let errors = 0;

  // Para cada usuário, garantir acesso ao produto futurostech
  for (const user of users) {
    try {
      // Verificar se já existe uma compra para este usuário/produto
      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          userId: user.id,
          productId: futurostech.id,
        },
      });

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      if (existingPurchase) {
        // Atualizar a compra existente para garantir que está ativa
        await prisma.purchase.update({
          where: { id: existingPurchase.id },
          data: {
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: oneYearFromNow,
          },
        });
        updated++;
        if (user.email === 'xppsalvador@gmail.com') {
          console.log(`Acesso do usuário ${user.email} atualizado com sucesso!`);
        }
      } else {
        // Criar nova compra
        await prisma.purchase.create({
          data: {
            userId: user.id,
            productId: futurostech.id,
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: oneYearFromNow,
            purchaseDate: new Date(),
            expirationDate: oneYearFromNow,
          },
        });
        created++;
        if (user.email === 'xppsalvador@gmail.com') {
          console.log(`Acesso do usuário ${user.email} criado com sucesso!`);
        }
      }
    } catch (error) {
      console.error(`Erro ao processar usuário ${user.email}:`, error);
      errors++;
    }
  }

  console.log(`
  Resumo da operação:
  - Total de usuários: ${users.length}
  - Acessos criados: ${created}
  - Acessos atualizados: ${updated}
  - Erros: ${errors}
  `);
}

main()
  .catch(e => {
    console.error('Erro na execução do script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Script finalizado.');
  });
