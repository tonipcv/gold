const { PrismaClient } = require('@prisma/client')

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--product' || a === '-p') out.productName = args[++i]
    else if (a === '--current' || a === '-c') out.currentGuruId = args[++i]
    else if (a === '--new' || a === '-n') out.newGuruId = args[++i]
    else if (a === '--dry-run') out.dryRun = true
  }
  return out
}

async function main() {
  const prisma = new PrismaClient()
  try {
    const { productName, currentGuruId, newGuruId, dryRun } = parseArgs()

    if (!newGuruId) {
      console.error('Uso: node scripts/set-guru-product-id.js --new <novo_guru_id> [--product "Nome do Produto" | --current <guru_id_atual>] [--dry-run]')
      process.exit(1)
    }

    let product = null

    if (currentGuruId) {
      product = await prisma.product.findFirst({ where: { guruProductId: String(currentGuruId) } })
    } else if (productName) {
      product = await prisma.product.findFirst({ where: { name: String(productName) } })
    } else {
      console.error('É necessário informar --product "Nome" ou --current <guru_id_atual>')
      process.exit(1)
    }

    if (!product) {
      console.error('Produto não encontrado com os critérios fornecidos.')
      process.exit(1)
    }

    console.log('Produto alvo:', { id: product.id, name: product.name, guruProductId: product.guruProductId || null })
    console.log('Novo guruProductId:', String(newGuruId))

    if (dryRun) {
      console.log('[dry-run] Nenhuma alteração aplicada.')
      return
    }

    // Atualiza o campo único guruProductId
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { guruProductId: String(newGuruId) },
    })

    console.log('Atualizado com sucesso:', { id: updated.id, name: updated.name, guruProductId: updated.guruProductId })
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
