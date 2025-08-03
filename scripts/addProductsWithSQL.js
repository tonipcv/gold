const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://postgres:e965fd9c7bad820e93a3@dpbdp1.easypanel.host:3210/aa?sslmode=disable"
});

async function main() {
  try {
    await client.connect();
    
    // Verificar se a constraint já existe
    const constraintExists = await client.query(`
      SELECT 1
      FROM information_schema.table_constraints 
      WHERE table_name = 'Product' AND constraint_name = 'product_name_unique';
    `);
    
    if (constraintExists.rows.length === 0) {
      // Adicionar constraint única se não existir
      await client.query(`
        ALTER TABLE "Product" ADD CONSTRAINT product_name_unique UNIQUE (name);
      `);
    }
    
    // Adicionar produtos
    await client.query(`
      INSERT INTO "Product" (id, name, description, "createdAt", "updatedAt", "accessDurationDays")
      VALUES 
        ('prod_futurostech', 'futurostech', 'Futuros Tech', NOW(), NOW(), 365),
        ('prod_copytrade', 'copytrade', 'Copy Trading com BH', NOW(), NOW(), 365)
      ON CONFLICT (name) DO NOTHING;
    `);
    
    // Associar todos os usuários ao produto 'futurostech'
    await client.query(`
      INSERT INTO "Purchase" (id, "userId", "productId", "purchaseDate", "expirationDate", status, "startDate", "endDate")
      SELECT 
        gen_random_uuid(), 
        u.id, 
        'prod_futurostech', 
        NOW(), 
        NOW() + INTERVAL '365 days', 
        'ACTIVE', 
        NOW(), 
        NOW() + INTERVAL '365 days'
      FROM "User" u
      ON CONFLICT ("userId", "productId") DO NOTHING;
    `);
    
    console.log('Produtos criados e usuários associados com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migração:', error);
  } finally {
    await client.end();
  }
}

main();
