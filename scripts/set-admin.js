/**
 * Definir um usuário como admin (versão JS)
 * Uso:
 *   node scripts/set-admin.js seu-email@example.com
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setAdmin(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      console.error('❌ Usuário não encontrado:', email)
      process.exit(1)
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
      select: { id: true, email: true, isAdmin: true }
    })

    console.log('✅ Admin definido com sucesso!')
    console.log('📧 Email:', updated.email)
    console.log('🔑 isAdmin:', updated.isAdmin)
    console.log('\n⚠️  IMPORTANTE: Faça logout e login novamente para atualizar o token!')
  } catch (err) {
    console.error('❌ Erro ao definir admin:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
if (!email) {
  console.error('❌ Email não fornecido')
  console.log('\nUso: node scripts/set-admin.js seu-email@example.com')
  process.exit(1)
}

setAdmin(email)
