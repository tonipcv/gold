/**
 * Limpar todas as sessões ativas para forçar re-login
 * Isso força todos os usuários a fazer login novamente com tokens atualizados
 * Uso: node scripts/clear-sessions.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function clearSessions() {
  try {
    console.log('🔄 Limpando todas as sessões ativas...')
    
    const result = await prisma.session.deleteMany({})
    
    console.log(`✅ ${result.count} sessões removidas com sucesso!`)
    console.log('')
    console.log('⚠️  Todos os usuários precisarão fazer login novamente')
    console.log('📝 Isso garante que os tokens JWT sejam regenerados com isAdmin correto')
    console.log('')
    console.log('🔐 Próximos passos:')
    console.log('   1. Acesse: https://gold.k17.com.br/api/auth/signout')
    console.log('   2. Faça login novamente')
    console.log('   3. Teste: https://gold.k17.com.br/admin/consents')
    console.log('')

  } catch (error) {
    console.error('❌ Erro ao limpar sessões:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

clearSessions()
