const { PrismaClient } = require('@prisma/client');

async function runMigration() {
  console.log('Starting migration to add liberado field to FormularioLiberacao...');
  
  const prisma = new PrismaClient();
  
  try {
    // Check if the column already exists
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'FormularioLiberacao' 
      AND column_name = 'liberado'
    `;
    
    if (tableInfo && tableInfo.length > 0) {
      console.log('✅ liberado column already exists');
      return;
    }
    
    // Add the new column with default value false
    console.log('Adding liberado column...');
    await prisma.$executeRaw`
      ALTER TABLE "FormularioLiberacao" 
      ADD COLUMN "liberado" BOOLEAN NOT NULL DEFAULT false;
    `;
    
    console.log('✅ Successfully added liberado column');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
runMigration();
