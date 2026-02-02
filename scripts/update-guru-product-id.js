const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateGuruProductId() {
  const oldProductId = '1769948402';
  const newProductId = '1757171521';

  try {
    console.log('🔄 Iniciando atualização do guruProductId...');
    console.log(`   De: ${oldProductId}`);
    console.log(`   Para: ${newProductId}\n`);

    // Buscar o produto com o ID antigo
    const product = await prisma.product.findUnique({
      where: {
        guruProductId: oldProductId
      },
      include: {
        purchases: true
      }
    });

    if (!product) {
      console.log('❌ Produto não encontrado com guruProductId:', oldProductId);
      return;
    }

    console.log(`📦 Produto encontrado: ${product.name} (ID: ${product.id})`);
    console.log(`   Total de compras associadas: ${product.purchases.length}\n`);

    // Atualizar o guruProductId
    const updatedProduct = await prisma.product.update({
      where: {
        id: product.id
      },
      data: {
        guruProductId: newProductId
      }
    });

    console.log('✅ Atualização concluída com sucesso!');
    console.log(`   Produto: ${updatedProduct.name}`);
    console.log(`   Novo guruProductId: ${updatedProduct.guruProductId}`);
    console.log(`   Atualizado em: ${updatedProduct.updatedAt}\n`);

    // Verificar a atualização
    const verification = await prisma.product.findUnique({
      where: {
        guruProductId: newProductId
      }
    });

    if (verification) {
      console.log('✅ Verificação: Produto encontrado com o novo ID');
    } else {
      console.log('⚠️  Aviso: Não foi possível verificar a atualização');
    }

  } catch (error) {
    console.error('❌ Erro ao atualizar guruProductId:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
updateGuruProductId()
  .then(() => {
    console.log('\n🎉 Script finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
