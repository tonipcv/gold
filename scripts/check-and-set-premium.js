// Node.js script to check a user by email and set isPremium to true if currently false
// Usage: node scripts/check-and-set-premium.js --email user@example.com

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--email' && args[i + 1]) {
      opts.email = args[i + 1];
      i++;
    } else if (arg.startsWith('--email=')) {
      opts.email = arg.split('=')[1];
    }
  }
  return opts;
}

async function run() {
  const { email } = parseArgs();

  if (!email) {
    console.error('Missing required argument: --email <address>');
    process.exit(1);
  }

  console.log(`Checking premium status for: ${email}`);

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, isPremium: true, createdAt: true }
    });

    if (!user) {
      console.error(`User not found for email: ${email}`);
      return;
    }

    console.log('Current status:', {
      id: user.id,
      name: user.name || null,
      email: user.email,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
    });

    if (user.isPremium) {
      console.log('No change needed: user is already premium.');
      return;
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { isPremium: true },
      select: { id: true, email: true, isPremium: true }
    });

    console.log('Updated user:', updated);
  } catch (err) {
    console.error('Error checking/updating premium status:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();
