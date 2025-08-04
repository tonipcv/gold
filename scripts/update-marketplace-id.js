// Script para atualizar o guruProductId do produto para usar o marketplace_id
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateProductGuruId() {
  try {
    console.log('Iniciando atualização do guruProductId para o produto futurostech...');
    
    // Atualizar o produto futurostech para usar o marketplace_id como guruProductId
    const updatedProduct = await prisma.product.update({
      where: {
        id: 'prod_futurostech'
      },
      data: {
        guruProductId: '1747234232' // Usar o marketplace_id da plataforma Guru
      }
    });
    
    console.log('Produto atualizado com sucesso:', updatedProduct);
    
    // Verificar se a atualização foi bem-sucedida
    const product = await prisma.product.findUnique({
      where: {
        id: 'prod_copytrade'
      }
    });
    
    console.log('Dados atuais do produto:', product);
    
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductGuruId();
