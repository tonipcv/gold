const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { pages: true, purchases: true } },
      },
    })

    console.log('Produtos encontrados:', products.length)
    for (const p of products) {
      console.log(JSON.stringify({
        id: p.id,
        name: p.name,
        guruProductId: p.guruProductId || null,
        description: p.description || null,
        accessDurationDays: p.accessDurationDays,
        pagesCount: p._count.pages,
        purchasesCount: p._count.purchases,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }))
    }

    console.log('\nResumo de compras por produto:')
    const purchasesByProduct = await prisma.purchase.groupBy({
      by: ['productId', 'status'],
      _count: { _all: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))
    for (const row of purchasesByProduct) {
      const prod = productMap.get(row.productId)
      console.log(JSON.stringify({
        productId: row.productId,
        productName: prod ? prod.name : null,
        guruProductId: prod ? (prod.guruProductId || null) : null,
        status: row.status,
        count: row._count._all,
      }))
    }

    console.log('\nExemplos de compras (até 50):')
    const purchases = await prisma.purchase.findMany({
      take: 50,
      orderBy: { purchaseDate: 'desc' },
      include: {
        user: { select: { id: true, email: true, name: true } },
        product: { select: { id: true, name: true, guruProductId: true } },
      },
    })

    for (const c of purchases) {
      console.log(JSON.stringify({
        purchaseId: c.id,
        status: c.status,
        user: { id: c.user.id, email: c.user.email, name: c.user.name || null },
        product: { id: c.product.id, name: c.product.name, guruProductId: c.product.guruProductId || null },
        purchaseDate: c.purchaseDate,
        startDate: c.startDate || null,
        endDate: c.endDate || null,
        expirationDate: c.expirationDate,
      }))
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
