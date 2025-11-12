#!/usr/bin/env node

/*
 Apply Prisma SQL migrations directly using Node + pg, against a given DATABASE_URL,
 without invoking Prisma Migrate. This is useful when you want full control and avoid
 touching production .env.

 IMPORTANT: This will attempt to maintain Prisma's _prisma_migrations table so that
 future `prisma migrate deploy` recognizes applied migrations.

 Usage:
  node scripts/run-sql-migrations-on-url.js \
    --url "postgres://user:pass@host:port/db?sslmode=disable" \
    [--migrations-dir prisma/migrations] \
    [--yes]

 It is DRY-RUN by default. Pass --yes to actually apply.
*/

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Client } = require('pg');

function parseArgs(argv) {
  const args = { migrationsDir: 'prisma/migrations', yes: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--yes') args.yes = true;
    else if (a === '--url') args.url = argv[++i];
    else if (a === '--migrations-dir') args.migrationsDir = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function printHelp() {
  console.log(`\nUsage:\n  node scripts/run-sql-migrations-on-url.js --url "<DATABASE_URL>" [--migrations-dir prisma/migrations] [--yes]\n`);
}

function validateUrl(url) {
  if (!url) throw new Error('Missing --url');
  if (!/^postgres:\/\//i.test(url)) throw new Error('Only Postgres URLs are supported');
}

function buildPgConfig(url) {
  // Map sslmode to pg's ssl option
  let ssl = false;
  try {
    const u = new URL(url);
    const sslmode = u.searchParams.get('sslmode');
    if (sslmode && sslmode.toLowerCase() !== 'disable') {
      // Use a permissive SSL by default when sslmode is not disable
      ssl = { rejectUnauthorized: false };
    }
  } catch (e) {}
  return { connectionString: url, ssl };
}

function listMigrations(migrationsDir) {
  if (!fs.existsSync(migrationsDir)) return [];
  const dirs = fs.readdirSync(migrationsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
  return dirs.map(dir => ({
    name: dir,
    sqlPath: path.join(migrationsDir, dir, 'migration.sql'),
  })).filter(x => fs.existsSync(x.sqlPath));
}

function sha256Hex(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
  );
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      id TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      finished_at TIMESTAMPTZ,
      migration_name TEXT NOT NULL,
      logs TEXT,
      rolled_back_at TIMESTAMPTZ,
      started_at TIMESTAMPTZ DEFAULT now(),
      applied_steps_count INTEGER DEFAULT 0
    );
  `);
}

async function isApplied(client, migrationName) {
  try {
    const { rows } = await client.query(
      'SELECT finished_at FROM "_prisma_migrations" WHERE migration_name = $1 LIMIT 1',
      [migrationName]
    );
    return rows.length > 0 && rows[0].finished_at != null;
  } catch (e) {
    // If table doesn't exist yet
    if (e.code === '42P01') return false;
    throw e;
  }
}

async function applyMigration(client, migration) {
  const sql = fs.readFileSync(migration.sqlPath, 'utf8');
  const checksum = sha256Hex(Buffer.from(sql, 'utf8'));
  const id = uuidv4();

  await ensureMigrationsTable(client);

  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query(
      'INSERT INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ($1, $2, now(), $3, $4, NULL, now(), $5)',
      [id, checksum, migration.name, null, 1]
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) { printHelp(); process.exit(0); }

  try { validateUrl(args.url || process.env.DATABASE_URL); } catch (e) { console.error('Error:', e.message); process.exit(1); }
  const pgConfig = buildPgConfig(args.url || process.env.DATABASE_URL);

  const migrations = listMigrations(args.migrationsDir);
  if (migrations.length === 0) {
    console.log('No migrations found in', args.migrationsDir);
    process.exit(0);
  }

  console.log('SQL migrations preview');
  console.log('  target DB URL  :', (args.url || process.env.DATABASE_URL));
  console.log('  migrations dir :', args.migrationsDir);
  console.log('  total          :', migrations.length);
  migrations.forEach(m => console.log('   -', m.name));
  console.log('  will execute?  :', args.yes ? 'YES' : 'dry-run');

  if (!args.yes) { console.log('\nDry-run only. Add --yes to execute.'); process.exit(0); }

  const client = new Client(pgConfig);
  await client.connect();

  try {
    for (const m of migrations) {
      const applied = await isApplied(client, m.name);
      if (applied) {
        console.log('Skipping already applied:', m.name);
        continue;
      }
      console.log('Applying:', m.name);
      await applyMigration(client, m);
      console.log('Applied:', m.name);
    }
  } finally {
    await client.end();
  }

  console.log('\nAll done.');
}

main().catch(err => { console.error('Failed:', err.message || err); process.exit(1); });
