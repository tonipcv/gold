const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração da conexão com o banco de dados
// Extraindo a URL do banco de dados do arquivo schema.prisma
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
const urlMatch = schemaContent.match(/url\s*=\s*"([^"]+)"/);
const dbUrl = urlMatch ? urlMatch[1] : null;

if (!dbUrl) {
  console.error('Não foi possível encontrar a URL do banco de dados no arquivo schema.prisma');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
});

// Mapeamento de IDs de produtos
// Substitua estes valores pelos IDs corretos da sua plataforma de pagamento
const productMappings = [
  {
    name: 'futurostech',
    guruProductId: '9ad4f5bf-5fe5-4d02-bd9d-f819961b57cc' // Substitua pelo ID real do produto na plataforma
  },
  {
    name: 'copytrade',
    guruProductId: '9ee8f7a6-d4c6-4e48-9387-ec5a437e4851' // Substitua pelo ID real do produto na plataforma
  }
];

async function updateProductIds() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando atualização dos IDs de produtos...');
    
    for (const mapping of productMappings) {
      console.log(`Atualizando produto "${mapping.name}" com guruProductId: ${mapping.guruProductId}`);
      
      const updateResult = await client.query(`
        UPDATE "Product" 
        SET "guruProductId" = $1 
        WHERE name = $2
        RETURNING id, name, "guruProductId";
      `, [mapping.guruProductId, mapping.name]);
      
      if (updateResult.rows.length > 0) {
        console.log(`Produto atualizado com sucesso: ${JSON.stringify(updateResult.rows[0])}`);
      } else {
        console.log(`Produto "${mapping.name}" não encontrado.`);
      }
    }
    
    // Verificar todos os produtos após a atualização
    const products = await client.query('SELECT id, name, "guruProductId" FROM "Product";');
    console.log('\nEstado atual dos produtos:');
    products.rows.forEach(product => {
      console.log(`- ID: ${product.id}, Nome: ${product.name}, GuruProductId: ${product.guruProductId || 'não definido'}`);
    });
    
    console.log('\nAtualização concluída com sucesso!');
    
  } catch (error) {
    console.error('Erro ao atualizar IDs de produtos:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

updateProductIds().catch(err => {
  console.error('Erro na execução do script:', err);
  process.exit(1);
});
