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

async function executeSqlCommands() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando migração para adicionar campo guruProductId...');
    
    // Verificar se a coluna já existe
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'guruProductId';
    `;
    
    const columnCheck = await client.query(checkColumnQuery);
    
    if (columnCheck.rows.length === 0) {
      console.log('Adicionando coluna guruProductId à tabela Product...');
      
      // Adicionar a coluna guruProductId
      await client.query(`
        ALTER TABLE "Product" 
        ADD COLUMN "guruProductId" TEXT UNIQUE;
      `);
      
      console.log('Coluna guruProductId adicionada com sucesso!');
    } else {
      console.log('A coluna guruProductId já existe na tabela Product.');
    }
    
    // Listar produtos existentes para referência
    const products = await client.query('SELECT id, name FROM "Product";');
    console.log('Produtos existentes:');
    products.rows.forEach(product => {
      console.log(`- ID: ${product.id}, Nome: ${product.name}`);
    });
    
    console.log('\nMigração concluída com sucesso!');
    console.log('\nAgora você pode atualizar o valor de guruProductId para seus produtos usando:');
    console.log('UPDATE "Product" SET "guruProductId" = \'ID_DO_GURU\' WHERE id = \'ID_DO_PRODUTO\';');
    
  } catch (error) {
    console.error('Erro ao executar migração:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

executeSqlCommands().catch(err => {
  console.error('Erro na execução do script:', err);
  process.exit(1);
});
