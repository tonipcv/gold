/**
 * Script para adicionar a coluna isAdmin no banco de produção
 * Execute com: node scripts/add-isAdmin-column.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addIsAdminColumn() {
  try {
    console.log('🔄 Verificando se a coluna isAdmin já existe...')
    
    // Tenta fazer uma query simples para verificar se a coluna existe
    try {
      await prisma.$queryRaw`SELECT "isAdmin" FROM "User" LIMIT 1`
      console.log('✅ Coluna isAdmin já existe no banco de dados!')
      return
    } catch (error) {
      // Se der erro, a coluna não existe, vamos criá-la
      console.log('📝 Coluna isAdmin não existe. Criando...')
    }

    // Adiciona a coluna isAdmin com valor padrão false
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false
    `

    console.log('✅ Coluna isAdmin criada com sucesso!')
    console.log('📊 Todos os usuários existentes têm isAdmin = false por padrão')
    console.log('')
    console.log('🔐 Para definir um usuário como admin, execute:')
    console.log('   npx ts-node scripts/set-admin.ts seu-email@example.com')
    console.log('')
    console.log('⚠️  IMPORTANTE: Reinicie o servidor e faça logout/login para atualizar o token!')

  } catch (error) {
    console.error('❌ Erro ao adicionar coluna isAdmin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addIsAdminColumn()
