/*
  Quick DB health/data check using Prisma Client.
  - Connects to the DB
  - Prints counts for key tables
  - Shows a few sample records (masked)
*/

/* eslint-disable no-console */

const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database connectivity...')
  try {
    await prisma.$connect()
    console.log('✔ Connected to database')
  } catch (err) {
    console.error('✖ Failed to connect to database')
    console.error(err)
    process.exit(1)
  }

  console.log('\nCollecting basic stats...')
  try {
    const [userCount, productCount, pageCount, purchaseCount, accountCount, sessionCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.page.count(),
      prisma.purchase.count(),
      prisma.account.count(),
      prisma.session.count(),
    ])

    console.log(JSON.stringify({
      ok: true,
      counts: {
        users: userCount,
        products: productCount,
        pages: pageCount,
        purchases: purchaseCount,
        accounts: accountCount,
        sessions: sessionCount,
      },
    }, null, 2))

    // Show some sample records (limit low to avoid noise)
    const [users, products, purchases] = await Promise.all([
      prisma.user.findMany({ select: { id: true, email: true, createdAt: true }, take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.product.findMany({ select: { id: true, name: true, createdAt: true }, take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.purchase.findMany({ select: { id: true, status: true, startDate: true, endDate: true, userId: true, productId: true }, take: 5, orderBy: { purchaseDate: 'desc' } }),
    ])

    console.log('\nSamples:')
    console.table(users.map(u => ({ id: u.id, email: u.email, createdAt: u.createdAt })))
    console.table(products.map(p => ({ id: p.id, name: p.name, createdAt: p.createdAt })))
    console.table(purchases.map(x => ({ id: x.id, status: x.status, startDate: x.startDate, endDate: x.endDate, userId: x.userId, productId: x.productId })))
  } catch (err) {
    console.error('✖ Error while querying data')
    console.error(err)
    process.exitCode = 2
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
