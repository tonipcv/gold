#!/usr/bin/env node
/*
  Set isPremium=true for users who have more than N days of access.

  Criteria:
  - User has at least one Purchase with:
    - startDate not null
    - startDate <= now - N days (default 7)
    - status in ('paid', 'ACTIVE')

  Usage:
    node scripts/set-premium-older-than-7-days.js [--days 7] [--dry-run]

  Examples:
    node scripts/set-premium-older-than-7-days.js
    node scripts/set-premium-older-than-7-days.js --days 10
    node scripts/set-premium-older-than-7-days.js --dry-run
*/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { days: 7, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--days' && args[i + 1]) {
      const v = Number(args[i + 1]);
      if (!Number.isNaN(v) && v > 0) opts.days = v;
      i++;
    } else if (arg.startsWith('--days=')) {
      const v = Number(arg.split('=')[1]);
      if (!Number.isNaN(v) && v > 0) opts.days = v;
    } else if (arg === '--dry-run' || arg === '--dryrun' || arg === '-n') {
      opts.dryRun = true;
    }
  }
  return opts;
}

function daysAgoDate(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  const { days, dryRun } = parseArgs();
  const cutoff = daysAgoDate(days);

  console.log(`Searching for users with access >= ${days} day(s).`);
  console.log(`Cutoff startDate: ${cutoff.toISOString()}`);
  console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}`);

  try {
    // Find users that match the rule via their purchases
    const usersToUpgrade = await prisma.user.findMany({
      where: {
        purchases: {
          some: {
            startDate: { lte: cutoff },
            status: { in: ['paid', 'ACTIVE'] },
          },
        },
        isPremium: false,
      },
      select: { id: true, email: true, name: true },
    });

    console.log(`Found ${usersToUpgrade.length} user(s) eligible for premium.`);

    if (usersToUpgrade.length > 0) {
      console.table(
        usersToUpgrade.map((u) => ({ id: u.id, email: u.email, name: u.name || '' }))
      );
    }

    if (dryRun) {
      console.log('Dry run enabled: no updates were performed.');
      return;
    }

    if (usersToUpgrade.length === 0) {
      console.log('Nothing to update. Exiting.');
      return;
    }

    const ids = usersToUpgrade.map((u) => u.id);

    const result = await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { isPremium: true },
    });

    console.log(`Updated ${result.count} user(s) to isPremium=true.`);
  } catch (err) {
    console.error('Error while setting premium:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
