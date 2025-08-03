const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://postgres:e965fd9c7bad820e93a3@dpbdp1.easypanel.host:3210/aa?sslmode=disable"
});

async function executeQuery(query, params = []) {
  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.log(`Erro ao executar query: ${query}`);
    console.log(`Erro: ${error.message}`);
    // Não interrompe a execução, apenas loga o erro
    return null;
  }
}

async function main() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados');
    
    // 1. Verificar e adicionar constraint única ao campo name na tabela Product
    console.log('Verificando constraint única para o campo name na tabela Product...');
    const constraintExists = await executeQuery(`
      SELECT 1
      FROM information_schema.table_constraints 
      WHERE table_name = 'Product' AND constraint_name = 'product_name_unique';
    `);
    
    if (!constraintExists || constraintExists.rows.length === 0) {
      console.log('Adicionando constraint única ao campo name na tabela Product...');
      await executeQuery(`
        ALTER TABLE "Product" ADD CONSTRAINT product_name_unique UNIQUE (name);
      `);
    } else {
      console.log('Constraint única já existe para o campo name na tabela Product');
    }
    
    // 2. Verificar e adicionar coluna status na tabela Purchase
    console.log('Verificando coluna status na tabela Purchase...');
    const statusColumnExists = await executeQuery(`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'Purchase' AND column_name = 'status';
    `);
    
    if (!statusColumnExists || statusColumnExists.rows.length === 0) {
      console.log('Adicionando coluna status à tabela Purchase...');
      await executeQuery(`
        ALTER TABLE "Purchase" ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING';
      `);
    } else {
      console.log('Coluna status já existe na tabela Purchase');
    }
    
    // 3. Verificar e adicionar colunas startDate e endDate na tabela Purchase
    console.log('Verificando colunas startDate e endDate na tabela Purchase...');
    const startDateColumnExists = await executeQuery(`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'Purchase' AND column_name = 'startDate';
    `);
    
    if (!startDateColumnExists || startDateColumnExists.rows.length === 0) {
      console.log('Adicionando coluna startDate à tabela Purchase...');
      await executeQuery(`
        ALTER TABLE "Purchase" ADD COLUMN "startDate" TIMESTAMP;
      `);
    } else {
      console.log('Coluna startDate já existe na tabela Purchase');
    }
    
    const endDateColumnExists = await executeQuery(`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'Purchase' AND column_name = 'endDate';
    `);
    
    if (!endDateColumnExists || endDateColumnExists.rows.length === 0) {
      console.log('Adicionando coluna endDate à tabela Purchase...');
      await executeQuery(`
        ALTER TABLE "Purchase" ADD COLUMN "endDate" TIMESTAMP;
      `);
    } else {
      console.log('Coluna endDate já existe na tabela Purchase');
    }
    
    // 4. Verificar e adicionar constraint composta userId_productId na tabela Purchase
    console.log('Verificando constraint composta userId_productId na tabela Purchase...');
    const compositeConstraintExists = await executeQuery(`
      SELECT 1
      FROM information_schema.table_constraints 
      WHERE table_name = 'Purchase' AND constraint_name = 'Purchase_userId_productId_key';
    `);
    
    if (!compositeConstraintExists || compositeConstraintExists.rows.length === 0) {
      console.log('Adicionando constraint composta userId_productId à tabela Purchase...');
      await executeQuery(`
        ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_productId_key" UNIQUE ("userId", "productId");
      `);
    } else {
      console.log('Constraint composta userId_productId já existe na tabela Purchase');
    }
    
    // 5. Adicionar produtos
    console.log('Adicionando produtos...');
    await executeQuery(`
      INSERT INTO "Product" (id, name, description, "createdAt", "updatedAt", "accessDurationDays")
      VALUES 
        ('prod_futurostech', 'futurostech', 'Futuros Tech', NOW(), NOW(), 365),
        ('prod_copytrade', 'copytrade', 'Copy Trading com BH', NOW(), NOW(), 365)
      ON CONFLICT (name) DO NOTHING;
    `);
    
    // 6. Verificar se os produtos foram criados
    console.log('Verificando se os produtos foram criados...');
    const products = await executeQuery(`
      SELECT id, name FROM "Product" WHERE name IN ('futurostech', 'copytrade');
    `);
    
    if (!products || products.rows.length === 0) {
      throw new Error('Produtos não foram criados corretamente');
    }
    
    const futurostech = products.rows.find(p => p.name === 'futurostech');
    if (!futurostech) {
      throw new Error('Produto futurostech não foi criado');
    }
    
    // 7. Associar todos os usuários ao produto 'futurostech'
    console.log('Associando usuários ao produto futurostech...');
    await executeQuery(`
      INSERT INTO "Purchase" (id, "userId", "productId", "purchaseDate", "expirationDate", status, "startDate", "endDate")
      SELECT 
        gen_random_uuid()::text, 
        u.id, 
        $1, 
        NOW(), 
        NOW() + INTERVAL '365 days', 
        'ACTIVE', 
        NOW(), 
        NOW() + INTERVAL '365 days'
      FROM "User" u
      LEFT JOIN "Purchase" p ON p."userId" = u.id AND p."productId" = $1
      WHERE p.id IS NULL;
    `, [futurostech.id]);
    
    console.log('Produtos criados e usuários associados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migração:', error);
  } finally {
    await client.end();
    console.log('Conexão com o banco de dados encerrada');
  }
}

main();
