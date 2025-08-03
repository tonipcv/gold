import { prisma } from '../src/lib/prisma';

async function main() {
  const sql = `
    -- Your SQL query here
    ALTER TABLE "Page" ADD COLUMN "daysSincePurchase" INTEGER;
  `;
  
  try {
    const result = await prisma.$executeRaw`${sql}`;
    console.log('SQL executed successfully:', result);
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
