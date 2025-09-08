#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ log: ['query'] });

async function execSqlFile(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`SQL file not found: ${abs}`);
  }
  const raw = fs.readFileSync(abs, 'utf8');

  // Split statements by semicolon while preserving statements that may span lines
  // Remove comments starting with -- and trim whitespace
  const lines = raw
    .split('\n')
    .map((l) => l.replace(/--.*$/, '')) // strip inline comments
    .join('\n');

  const statements = lines
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of statements) {
    console.log(`\nExecuting SQL:\n${sql};`);
    await prisma.$executeRawUnsafe(sql);
    console.log('✔ Done');
  }
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node scripts/exec-sql-file.js <path-to-sql>');
    process.exit(1);
  }
  try {
    await execSqlFile(file);
    console.log('\n✅ SQL file executed successfully.');
  } catch (err) {
    console.error('\n❌ Error executing SQL file:', err?.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
