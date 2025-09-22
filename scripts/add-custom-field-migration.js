const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function runMigration() {
  console.log('Starting migration to add customField to FormularioLiberacao...');
  
  const prisma = new PrismaClient();
  
  try {
    // Check if the column already exists
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'FormularioLiberacao' 
      AND column_name = 'customField'
    `;
    
    if (tableInfo && tableInfo.length > 0) {
      console.log('✅ customField column already exists');
      return;
    }
    
    // Add the new column
    console.log('Adding customField column...');
    await prisma.$executeRaw`
      ALTER TABLE "FormularioLiberacao" 
      ADD COLUMN "customField" TEXT;
    `;
    
    console.log('✅ Successfully added customField column');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
runMigration();
