/* eslint-disable no-console */
// Ensures the Product "Gold 10x" exists and has the correct guruProductId
// Usage:
//   node scripts/ensure-gold10x-product.js                # uses default 1757171521
//   node scripts/ensure-gold10x-product.js 28924245       # override via CLI arg
//   GURU_PRODUCT_ID=28924245 node scripts/ensure-gold10x-product.js  # override via env

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const argId = process.argv[2]
    const desiredGuruId = String(process.env.GURU_PRODUCT_ID || argId || '1757171521')

    console.log('Ensuring product exists...')
    let product = await prisma.product.findUnique({ where: { name: 'Gold 10x' } })

    if (!product) {
      console.log('Product "Gold 10x" not found. Creating...')
      product = await prisma.product.create({
        data: {
          name: 'Gold 10x',
          description: 'Plano Gold 10x',
          guruProductId: desiredGuruId,
          accessDurationDays: 365,
        },
      })
      console.log('Created:', product)
    } else {
      console.log('Product found:', { id: product.id, name: product.name, guruProductId: product.guruProductId })
      if (product.guruProductId !== desiredGuruId) {
        console.log(`Updating guruProductId from ${product.guruProductId || 'null'} to ${desiredGuruId}...`)
        product = await prisma.product.update({
          where: { id: product.id },
          data: { guruProductId: desiredGuruId },
        })
        console.log('Updated:', { id: product.id, guruProductId: product.guruProductId })
      } else {
        console.log('guruProductId already correct.')
      }
    }

    console.log('\nCurrent products:')
    const products = await prisma.product.findMany({
      select: { id: true, name: true, guruProductId: true, accessDurationDays: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    console.table(products)
  } catch (e) {
    console.error('Error ensuring product:', e)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
