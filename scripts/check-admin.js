/**
 * Verificar status de admin de um usuário
 * Uso: node scripts/check-admin.js email@example.com
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmin(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        isAdmin: true,
        createdAt: true
      }
    })

    if (!user) {
      console.error('❌ Usuário não encontrado:', email)
      process.exit(1)
    }

    console.log('\n📊 Status do Usuário')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', user.email)
    console.log('👤 Nome:', user.name || '(sem nome)')
    console.log('🆔 ID:', user.id)
    console.log('💎 Premium:', user.isPremium ? '✅ Sim' : '❌ Não')
    console.log('🔐 Admin:', user.isAdmin ? '✅ Sim' : '❌ Não')
    console.log('📅 Criado em:', new Date(user.createdAt).toLocaleString('pt-BR'))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (user.isAdmin) {
      console.log('\n✅ Este usuário TEM acesso admin')
      console.log('⚠️  Lembre-se: Faça logout e login novamente para atualizar o token!')
    } else {
      console.log('\n❌ Este usuário NÃO tem acesso admin')
      console.log('💡 Para tornar admin, execute:')
      console.log(`   node scripts/set-admin.js ${email}`)
    }
    console.log('')

  } catch (err) {
    console.error('❌ Erro ao verificar usuário:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
if (!email) {
  console.error('❌ Email não fornecido')
  console.log('\n📖 Uso:')
  console.log('   node scripts/check-admin.js email@example.com')
  process.exit(1)
}

checkAdmin(email)
