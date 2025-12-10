import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error('❌ Usuário não encontrado:', email)
      console.log('\n💡 Certifique-se de que o email está correto')
      process.exit(1)
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })

    console.log('✅ Admin definido com sucesso!')
    console.log('📧 Email:', updated.email)
    console.log('👤 Nome:', updated.name || '(sem nome)')
    console.log('🔑 isAdmin:', updated.isAdmin)
    console.log('\n⚠️  IMPORTANTE: Faça logout e login novamente para atualizar o token!')
  } catch (error) {
    console.error('❌ Erro ao definir admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Pegar email da linha de comando
const email = process.argv[2]

if (!email) {
  console.error('❌ Email não fornecido')
  console.log('\n📖 Uso:')
  console.log('  npx ts-node scripts/set-admin.ts seu-email@example.com')
  process.exit(1)
}

setAdmin(email)
