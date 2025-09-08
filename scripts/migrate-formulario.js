#!/usr/bin/env node
const { execSync } = require('node:child_process');

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

(async () => {
  try {
    // Generate Prisma Client to ensure latest types are available
    run('npx prisma generate');

    // Create and apply a new migration based on current schema
    // This will prompt for a name if not provided; we provide a fixed one
    run('npx prisma migrate dev --name add_formulario_liberacao');

    // Regenerate to make sure client picks up the new migration artifacts
    run('npx prisma generate');

    console.log('\n✅ Prisma migration for FormularioLiberacao applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Failed to run Prisma migration script:', err?.message || err);
    process.exit(1);
  }
})();
