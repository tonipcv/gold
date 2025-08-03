const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // SQL statements to execute separately
  const sqlStatements = [
    // Create Product table
    `CREATE TABLE IF NOT EXISTS "Product" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "accessDurationDays" INTEGER NOT NULL DEFAULT 365,
      
      CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
    )`,

    // Create Page table
    `CREATE TABLE IF NOT EXISTS "Page" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "content" TEXT,
      "slug" TEXT NOT NULL,
      "isExclusive" BOOLEAN NOT NULL DEFAULT true,
      "productId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "daysSincePurchase" INTEGER,
      
      CONSTRAINT "Page_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Page_slug_key" UNIQUE ("slug"),
      CONSTRAINT "Page_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,

    // Create Purchase table
    `CREATE TABLE IF NOT EXISTS "Purchase" (
      "id" TEXT NOT NULL,
      "userId" TEXT NOT NULL,
      "productId" TEXT NOT NULL,
      "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "expirationDate" TIMESTAMP(3) NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "startDate" TIMESTAMP(3),
      "endDate" TIMESTAMP(3),
      
      CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "Purchase_userId_productId_key" UNIQUE ("userId", "productId"),
      CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "Purchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )`
  ];
  
  try {
    // Execute each SQL statement separately
    for (const sql of sqlStatements) {
      console.log(`Executing: ${sql.substring(0, 50)}...`);
      await prisma.$executeRawUnsafe(sql);
      console.log('Statement executed successfully');
    }
    
    console.log('All migrations executed successfully');
  } catch (error) {
    console.error('Error executing migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
