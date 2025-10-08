#!/usr/bin/env node

/**
 * Bulk activate UserCoupon from CSV (email,cupom)
 * ------------------------------------------------
 * Reads public/nome-cupom.csv and, for each row, upserts UserCoupon so that:
 * - coupon = exact provided name (normalized to UPPERCASE, no spaces)
 * - isActive = true
 * - link = /automacao-bonus?coupon=<COUPON>
 *
 * Usage:
 *   node scripts/bulk-activate-user-coupons.js \
 *     --file public/nome-cupom.csv [--dry-run] [--sleep-ms 50] [--debug]
 */

const fs = require('fs');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const argv = process.argv.slice(2);
const getArg = (name) => {
  const idx = argv.findIndex((a) => a === name || a.startsWith(name + '='));
  if (idx === -1) return undefined;
  const val = argv[idx].includes('=') ? argv[idx].split('=').slice(1).join('=') : argv[idx + 1];
  return val;
};

const DEBUG = argv.includes('--debug');
const DRY_RUN = argv.includes('--dry-run');
const FILE_PATH = getArg('--file') || 'public/nome-cupom.csv';
const SLEEP_MS = Math.max(0, Number(getArg('--sleep-ms') || 0));

function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }

function normalizeCoupon(raw) {
  // Use coupon exactly as provided (trim only), per requirement
  return String(raw || '').trim();
}

async function parseCsv(path) {
  if (!fs.existsSync(path)) throw new Error(`CSV not found: ${path}`);
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  const rows = [];
  let isFirst = true;
  for await (const raw of rl) {
    const line = (raw || '').trim();
    if (!line) continue;
    const parts = line.split(',');
    if (isFirst) {
      const header = parts.map((p) => p.trim().toLowerCase());
      if (header[0] === 'email' && header[1] === 'cupom') {
        isFirst = false;
        continue;
      }
      // No header
      isFirst = false;
    }
    const email = (parts[0] || '').trim().toLowerCase();
    const cupom = (parts[1] || '').trim();
    if (email && cupom) rows.push({ email, cupom });
  }
  return rows;
}

async function upsertUserCoupon({ email, cupom }) {
  const coupon = normalizeCoupon(cupom);
  const link = `/automacao-bonus?coupon=${encodeURIComponent(coupon)}`;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, code: 'USER_NOT_FOUND', email, coupon };
  }

  // Verificar se o cupom já existe para outro usuário
  const existingByCoupon = await prisma.userCoupon.findUnique({ where: { coupon } }).catch(() => null);
  if (existingByCoupon && existingByCoupon.userId !== user.id) {
    return { ok: false, code: 'COUPON_IN_USE', email, coupon, ownerUserId: existingByCoupon.userId };
  }

  // Verificar se o usuário já tem um UserCoupon
  const existingForUser = await prisma.userCoupon.findFirst({ where: { userId: user.id } });
  
  if (existingForUser) {
    // Atualizar o registro existente com o novo cupom
    if (DRY_RUN) return { ok: true, code: 'UPDATE_DRY_RUN', email, coupon };
    
    try {
      const updated = await prisma.userCoupon.update({
        where: { id: existingForUser.id },
        data: { coupon, link, isActive: true },
      });
      return { ok: true, code: 'UPDATED', email, coupon, id: updated.id };
    } catch (err) {
      if (err.message.includes('Unique constraint failed')) {
        return { ok: false, code: 'COUPON_DUPLICATE', email, coupon };
      }
      throw err;
    }
  } else {
    // Criar novo registro para este usuário
    if (DRY_RUN) return { ok: true, code: 'CREATE_DRY_RUN', email, coupon };
    
    try {
      const created = await prisma.userCoupon.create({ 
        data: { userId: user.id, coupon, link, isActive: true } 
      });
      return { ok: true, code: 'CREATED', email, coupon, id: created.id };
    } catch (err) {
      if (err.message.includes('Unique constraint failed')) {
        return { ok: false, code: 'COUPON_DUPLICATE', email, coupon };
      }
      throw err;
    }
  }
}

(async () => {
  const startedAt = Date.now();
  try {
    const items = await parseCsv(FILE_PATH);
    if (!items.length) {
      console.log('⚠️ CSV vazio ou sem linhas válidas. Esperado header: email,cupom');
      process.exit(0);
    }

    console.log(`📄 CSV: ${FILE_PATH} | ${items.length} linhas`);
    if (DRY_RUN) console.log('🧪 Dry-run (sem escrita no banco)');

    let ok = 0, failed = 0, conflicts = 0, duplicates = 0;
    const results = [];

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      try {
        const res = await upsertUserCoupon(row);
        if (res.ok) {
          ok++;
          results.push({ i: i + 1, ...res });
          if (DEBUG) console.log(`✅ [${i + 1}/${items.length}] ${row.email} -> ${res.code}`);
        } else {
          failed++;
          if (res.code === 'COUPON_IN_USE') conflicts++;
          if (res.code === 'COUPON_DUPLICATE') duplicates++;
          results.push({ i: i + 1, ...res });
          console.error(`❌ [${i + 1}/${items.length}] ${row.email} -> ${res.code}`);
        }
      } catch (err) {
        failed++;
        console.error(`❌ [${i + 1}/${items.length}] ${row.email} -> ERROR ${err?.message || err}`);
        results.push({ i: i + 1, email: row.email, coupon: row.cupom, error: err?.message || String(err) });
      }
      if (SLEEP_MS) await sleep(SLEEP_MS);
    }

    const durationMs = Date.now() - startedAt;
    console.log('\n📊 Summary');
    console.log(`  OK:         ${ok}`);
    console.log(`  Failed:     ${failed}`);
    console.log(`  Conflicts:  ${conflicts}`);
    console.log(`  Duplicates: ${duplicates}`);
    console.log(`  Time:       ${(durationMs / 1000).toFixed(1)}s`);

    // Save report
    const outDir = 'scripts/output';
    try { fs.mkdirSync(outDir, { recursive: true }); } catch (_) {}
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outFile = `${outDir}/bulk-activate-user-coupons-${ts}.json`;
    fs.writeFileSync(outFile, JSON.stringify({ file: FILE_PATH, ok, failed, conflicts, duplicates, results }, null, 2));
    console.log(`\n📝 Report saved at: ${outFile}`);
  } catch (err) {
    console.error('❌ Fatal error:', err?.message || err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
