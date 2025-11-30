/**
 * Script para verificar quantos usuários são premium e quantos não são
 * 
 * Uso:
 *   node scripts/check-premium-users.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPremiumUsers() {
  try {
    console.log('🔍 Verificando usuários premium...\n');

    // Contar total de usuários
    const totalUsers = await prisma.user.count();

    // Contar usuários premium
    const premiumUsers = await prisma.user.count({
      where: {
        isPremium: true
      }
    });

    // Contar usuários não premium
    const nonPremiumUsers = totalUsers - premiumUsers;

    // Calcular porcentagens
    const premiumPercentage = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : 0;
    const nonPremiumPercentage = totalUsers > 0 ? ((nonPremiumUsers / totalUsers) * 100).toFixed(2) : 0;

    // Exibir resultados
    console.log('📊 RESUMO DE USUÁRIOS');
    console.log('═══════════════════════════════════════');
    console.log(`Total de usuários:        ${totalUsers}`);
    console.log(`Usuários Premium:         ${premiumUsers} (${premiumPercentage}%)`);
    console.log(`Usuários Não Premium:     ${nonPremiumUsers} (${nonPremiumPercentage}%)`);
    console.log('═══════════════════════════════════════\n');

    // Listar alguns usuários premium (opcional)
    if (premiumUsers > 0) {
      console.log('👥 USUÁRIOS PREMIUM (primeiros 10):');
      console.log('───────────────────────────────────────');
      
      const premiumUsersList = await prisma.user.findMany({
        where: {
          isPremium: true
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        },
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      });

      premiumUsersList.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'Sem nome'} (${user.email})`);
        console.log(`   ID: ${user.id} | Criado em: ${user.createdAt.toLocaleDateString('pt-BR')}`);
      });
      
      if (premiumUsers > 10) {
        console.log(`\n... e mais ${premiumUsers - 10} usuários premium`);
      }
      console.log('');
    }

    // Verificar usuários com compras ativas (Purchase)
    console.log('💳 USUÁRIOS COM COMPRAS ATIVAS:');
    console.log('───────────────────────────────────────');
    
    const usersWithActivePurchases = await prisma.user.findMany({
      where: {
        purchases: {
          some: {
            status: 'paid',
            endDate: {
              gte: new Date()
            }
          }
        }
      },
      include: {
        purchases: {
          where: {
            status: 'paid',
            endDate: {
              gte: new Date()
            }
          },
          include: {
            product: true
          }
        }
      }
    });

    console.log(`Total: ${usersWithActivePurchases.length} usuários com compras ativas\n`);

    if (usersWithActivePurchases.length > 0) {
      usersWithActivePurchases.slice(0, 5).forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'Sem nome'} (${user.email})`);
        console.log(`   Premium: ${user.isPremium ? 'Sim ✓' : 'Não ✗'}`);
        console.log(`   Produtos ativos: ${user.purchases.length}`);
        user.purchases.forEach(purchase => {
          console.log(`     - ${purchase.product.name} (até ${purchase.endDate?.toLocaleDateString('pt-BR')})`);
        });
        console.log('');
      });

      if (usersWithActivePurchases.length > 5) {
        console.log(`... e mais ${usersWithActivePurchases.length - 5} usuários\n`);
      }
    }

    // Alertas
    console.log('⚠️  ALERTAS:');
    console.log('───────────────────────────────────────');
    
    // Usuários com compras ativas mas não marcados como premium
    const usersWithPurchasesNotPremium = usersWithActivePurchases.filter(u => !u.isPremium);
    if (usersWithPurchasesNotPremium.length > 0) {
      console.log(`❌ ${usersWithPurchasesNotPremium.length} usuário(s) com compras ativas mas NÃO marcados como premium:`);
      usersWithPurchasesNotPremium.forEach(user => {
        console.log(`   - ${user.email}`);
      });
      console.log('');
    }

    // Usuários premium sem compras ativas
    const premiumWithoutActivePurchases = await prisma.user.count({
      where: {
        isPremium: true,
        purchases: {
          none: {
            status: 'paid',
            endDate: {
              gte: new Date()
            }
          }
        }
      }
    });

    if (premiumWithoutActivePurchases > 0) {
      console.log(`⚠️  ${premiumWithoutActivePurchases} usuário(s) marcados como premium mas SEM compras ativas`);
      console.log('');
    }

    if (usersWithPurchasesNotPremium.length === 0 && premiumWithoutActivePurchases === 0) {
      console.log('✅ Nenhum alerta. Tudo está sincronizado!\n');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar script
checkPremiumUsers();
