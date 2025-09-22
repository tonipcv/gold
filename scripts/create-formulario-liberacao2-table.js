const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');

async function runMigration() {
  console.log('Starting migration...');
  
  // Generate a timestamp for the migration
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const migrationName = `add_formulario_liberacao2_${timestamp}`;
  
  try {
    // 1. Create a new migration file using Prisma
    console.log('Creating migration file...');
    execSync(`npx prisma migrate dev --name ${migrationName} --create-only`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });

    // 2. Apply the migration
    console.log('\nApplying migration...');
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
