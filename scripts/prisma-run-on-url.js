#!/usr/bin/env node

/*
 Safe Prisma runner against an explicit DATABASE_URL, without touching .env.

 Usage examples:
  node scripts/prisma-run-on-url.js --url "postgres://user:pass@host:port/db?sslmode=disable" --action migrate-deploy --yes
  node scripts/prisma-run-on-url.js --url "postgres://..." --action db-push --yes
  node scripts/prisma-run-on-url.js --url "postgres://..." --action validate

 Flags:
  --url <string>           Target database URL (required unless PRISMA_URL env is set)
  --action <string>        One of: migrate-deploy | db-push | generate | validate (default: migrate-deploy)
  --yes                    Actually execute; without it we only do a dry-run preview
  --allow-prod             Allow execution if the URL matches a known production URL pattern (safety lock)
  --timeout <ms>           Kill the child if it exceeds this duration (default 10 minutes)
*/

const { spawn } = require('child_process');

function parseArgs(argv) {
  const args = { action: 'migrate-deploy', yes: false, allowProd: false, timeout: 10 * 60 * 1000 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--yes') args.yes = true;
    else if (a === '--allow-prod') args.allowProd = true;
    else if (a === '--url') { args.url = argv[++i]; }
    else if (a === '--action') { args.action = argv[++i]; }
    else if (a === '--timeout') { args.timeout = Number(argv[++i]); }
    else if (a === '--help' || a === '-h') { args.help = true; }
  }
  return args;
}

function printHelp() {
  console.log(`\nUsage:\n  node scripts/prisma-run-on-url.js --url "<DATABASE_URL>" [--action migrate-deploy|db-push|generate|validate] [--yes] [--allow-prod]\n`);
}

function isLikelyProduction(url) {
  // Adjust these checks to your environment. Current known prod in the user message:
  // postgres://postgres:9f3f98e022fca261fab2@dpbdp1.easypanel.host:12321/boop?sslmode=disable
  try {
    const u = new URL(url);
    const host = u.hostname;
    const port = u.port;
    const db = u.pathname.replace(/^\//, '');
    // Heuristic: match known prod tuple
    if (host === 'dpbdp1.easypanel.host' && port === '12321' && db === 'boop') return true;
  } catch (_) {}
  return false;
}

function validateUrl(url) {
  if (!url) throw new Error('Missing --url');
  if (!/^postgres:\/\//i.test(url)) throw new Error('Only Postgres URLs are supported');
  // Basic sanity: must include host and db name
  try {
    const u = new URL(url);
    if (!u.hostname) throw new Error('URL missing hostname');
    if (!u.pathname || u.pathname === '/') throw new Error('URL missing database name');
  } catch (err) {
    throw new Error('Invalid URL: ' + err.message);
  }
}

async function run() {
  const args = parseArgs(process.argv);
  if (args.help) { printHelp(); process.exit(0); }

  const url = args.url || process.env.PRISMA_URL;
  try { validateUrl(url); } catch (e) { console.error('Error:', e.message); process.exit(1); }

  const allowedActions = new Set(['migrate-deploy', 'db-push', 'generate', 'validate']);
  if (!allowedActions.has(args.action)) {
    console.error(`Invalid --action: ${args.action}. Allowed: ${Array.from(allowedActions).join(', ')}`);
    process.exit(1);
  }

  const cmd = 'npx';
  const prismaArgs = ['prisma'];
  switch (args.action) {
    case 'migrate-deploy': prismaArgs.push('migrate', 'deploy'); break;
    case 'db-push': prismaArgs.push('db', 'push'); break;
    case 'generate': prismaArgs.push('generate'); break;
    case 'validate': prismaArgs.push('validate'); break;
  }

  const safetyProd = isLikelyProduction(url);

  console.log('Prisma action preview');
  console.log('  action        :', args.action);
  console.log('  target DB URL :', url);
  console.log('  safety prod?  :', safetyProd ? 'YES' : 'no');
  console.log('  will execute? :', args.yes ? 'YES' : 'dry-run');
  console.log('  command       :', [cmd, ...prismaArgs].join(' '));

  if (safetyProd && !args.allowProd) {
    console.error('\nRefusing to run on a URL that matches known production. Pass --allow-prod if you are absolutely sure.');
    process.exit(2);
  }

  if (!args.yes) {
    console.log('\nDry-run only. Add --yes to execute.');
    process.exit(0);
  }

  await new Promise((resolve, reject) => {
    const child = spawn(cmd, prismaArgs, {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: url },
    });

    const killer = setTimeout(() => {
      console.error(`\nTimeout exceeded (${args.timeout} ms). Killing process...`);
      child.kill('SIGKILL');
    }, args.timeout);

    child.on('close', (code) => {
      clearTimeout(killer);
      if (code === 0) resolve();
      else reject(new Error(`Prisma exited with code ${code}`));
    });

    child.on('error', (err) => {
      clearTimeout(killer);
      reject(err);
    });
  }).catch((err) => {
    console.error('Failed:', err.message);
    process.exit(1);
  });

  console.log('\nDone.');
}

run();
