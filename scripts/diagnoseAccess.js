const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'xppsalvador@gmail.com';
  console.log(`Diagnosticando acesso para o usuário: ${email}`);

  // 1. Verificar se o usuário existe
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      purchases: {
        include: {
          product: true
        }
      }
    }
  });

  if (!user) {
    console.log(`Usuário ${email} não encontrado no banco de dados!`);
    return;
  }

  console.log(`\nInformações do usuário:`);
  console.log(`ID: ${user.id}`);
  console.log(`Email: ${user.email}`);
  console.log(`Nome: ${user.name}`);
  
  // 2. Verificar compras do usuário
  if (!user.purchases || user.purchases.length === 0) {
    console.log(`\nO usuário não possui nenhuma compra registrada!`);
    return;
  }

  console.log(`\nCompras do usuário (${user.purchases.length} total):`);
  
  user.purchases.forEach((purchase, index) => {
    console.log(`\nCompra #${index + 1}:`);
    console.log(`ID: ${purchase.id}`);
    console.log(`Produto: ${purchase.product ? purchase.product.name : 'N/A'} (ID: ${purchase.productId})`);
    
    // Verificar se os campos existem antes de tentar acessá-los
    console.log(`Status: ${purchase.status !== undefined ? purchase.status : 'CAMPO NÃO EXISTE'}`);
    console.log(`Data de início: ${purchase.startDate ? new Date(purchase.startDate).toISOString() : 'CAMPO NÃO EXISTE'}`);
    console.log(`Data de término: ${purchase.endDate ? new Date(purchase.endDate).toISOString() : 'CAMPO NÃO EXISTE'}`);
    
    // Verificar se a compra é do produto futurostech
    if (purchase.product && purchase.product.name === 'futurostech') {
      console.log(`\n>>> Esta é uma compra do produto futurostech <<<`);
      
      // Simular a lógica de verificação de acesso
      const now = new Date();
      
      // Verificar status
      const isActive = purchase.status === 'ACTIVE';
      console.log(`Status é ACTIVE? ${isActive ? 'SIM' : 'NÃO'}`);
      
      // Verificar datas
      const isWithinDateRange = 
        (!purchase.startDate || new Date(purchase.startDate) <= now) &&
        (!purchase.endDate || new Date(purchase.endDate) >= now);
      
      console.log(`Está dentro do período de acesso? ${isWithinDateRange ? 'SIM' : 'NÃO'}`);
      
      if (purchase.startDate) {
        console.log(`- Data de início ${new Date(purchase.startDate) <= now ? 'é válida' : 'ainda não chegou'}`);
      }
      
      if (purchase.endDate) {
        console.log(`- Data de término ${new Date(purchase.endDate) >= now ? 'é válida' : 'já expirou'}`);
      }
      
      console.log(`\nResultado final: O usuário ${isActive && isWithinDateRange ? 'TEM' : 'NÃO TEM'} acesso ao produto futurostech`);
    }
  });

  // 3. Verificar estrutura da tabela Purchase
  console.log('\n\nVerificando estrutura da tabela Purchase:');
  try {
    // Isso vai gerar um erro com a estrutura da tabela
    const purchaseStructure = await prisma.$queryRaw`
      SELECT column_name, data_type, character_maximum_length
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE table_name = 'Purchase'
    `;
    console.log(purchaseStructure);
  } catch (error) {
    console.log('Erro ao verificar estrutura da tabela:', error.message);
  }
}

main()
  .catch(e => {
    console.error('Erro na execução do script:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
