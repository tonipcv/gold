const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
  connectionString: "postgres://postgres:e965fd9c7bad820e93a3@dpbdp1.easypanel.host:3210/aa?sslmode=disable"
});

async function main() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando script para garantir acesso ao produto futurostech...');
    
    // 1. Verificar se o produto futurostech existe
    let productResult = await client.query(`
      SELECT id FROM "Product" WHERE name = 'futurostech'
    `);
    
    let productId;
    if (productResult.rows.length === 0) {
      console.log('Produto futurostech não encontrado. Criando...');
      const insertResult = await client.query(`
        INSERT INTO "Product" (id, name, description, "createdAt", "updatedAt", "accessDurationDays")
        VALUES (gen_random_uuid(), 'futurostech', 'Futuros Tech', NOW(), NOW(), 365)
        RETURNING id
      `);
      productId = insertResult.rows[0].id;
      console.log(`Produto futurostech criado com ID: ${productId}`);
    } else {
      productId = productResult.rows[0].id;
      console.log(`Produto futurostech encontrado com ID: ${productId}`);
    }
    
    // 2. Verificar o usuário específico xppsalvador@gmail.com
    const userResult = await client.query(`
      SELECT id FROM "User" WHERE email = 'xppsalvador@gmail.com'
    `);
    
    if (userResult.rows.length === 0) {
      console.log('Usuário xppsalvador@gmail.com não encontrado no banco de dados.');
      return;
    }
    
    const userId = userResult.rows[0].id;
    console.log(`Usuário xppsalvador@gmail.com encontrado com ID: ${userId}`);
    
    // 3. Verificar se já existe uma compra para este usuário/produto
    const purchaseResult = await client.query(`
      SELECT id FROM "Purchase" 
      WHERE "userId" = $1 AND "productId" = $2
    `, [userId, productId]);
    
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (purchaseResult.rows.length > 0) {
      // Atualizar a compra existente
      const purchaseId = purchaseResult.rows[0].id;
      console.log(`Compra existente encontrada com ID: ${purchaseId}. Atualizando...`);
      
      await client.query(`
        UPDATE "Purchase"
        SET status = 'ACTIVE',
            "startDate" = NOW(),
            "endDate" = $1
        WHERE id = $2
      `, [oneYearFromNow, purchaseId]);
      
      console.log(`Compra atualizada com sucesso para o usuário xppsalvador@gmail.com!`);
    } else {
      // Criar nova compra
      console.log(`Nenhuma compra encontrada. Criando nova compra...`);
      
      await client.query(`
        INSERT INTO "Purchase" (
          id, "userId", "productId", "purchaseDate", "expirationDate", 
          status, "startDate", "endDate", "createdAt", "updatedAt"
        )
        VALUES (
          gen_random_uuid(), $1, $2, NOW(), $3,
          'ACTIVE', NOW(), $3, NOW(), NOW()
        )
      `, [userId, productId, oneYearFromNow]);
      
      console.log(`Nova compra criada com sucesso para o usuário xppsalvador@gmail.com!`);
    }
    
    // 4. Verificar todos os usuários sem acesso ao futurostech e criar acesso
    console.log('Verificando todos os usuários sem acesso ao futurostech...');
    
    const usersWithoutAccess = await client.query(`
      SELECT u.id, u.email 
      FROM "User" u
      LEFT JOIN "Purchase" p ON u.id = p."userId" AND p."productId" = $1
      WHERE p.id IS NULL
    `, [productId]);
    
    console.log(`Encontrados ${usersWithoutAccess.rows.length} usuários sem acesso ao futurostech.`);
    
    if (usersWithoutAccess.rows.length > 0) {
      console.log('Criando acesso para todos os usuários sem acesso...');
      
      for (const user of usersWithoutAccess.rows) {
        await client.query(`
          INSERT INTO "Purchase" (
            id, "userId", "productId", "purchaseDate", "expirationDate", 
            status, "startDate", "endDate", "createdAt", "updatedAt"
          )
          VALUES (
            gen_random_uuid(), $1, $2, NOW(), $3,
            'ACTIVE', NOW(), $3, NOW(), NOW()
          )
        `, [user.id, productId, oneYearFromNow]);
        
        console.log(`Acesso criado para o usuário ${user.email}`);
      }
    }
    
    console.log('Script finalizado com sucesso!');
    
  } catch (error) {
    console.error('Erro na execução do script:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
