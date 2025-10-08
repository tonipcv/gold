#!/usr/bin/env node
// Date helpers
function toEpochSeconds(input) {
  if (!input) return undefined;
  const n = Number(input);
  if (!Number.isNaN(n) && n > 0) return Math.floor(n);
  const d = new Date(input);
  if (!isNaN(d.getTime())) return Math.floor(d.getTime() / 1000);
  return undefined;
}

function startOfTodayUTC() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  return Math.floor(d.getTime() / 1000);
}

// (moved below, after argv/getArg definitions)

/**
 * Digital Manager Guru - Upload Coupons from CSV (Standalone)
 * -----------------------------------------------------------
 * Purpose: Create coupons in Guru from a CSV list of coupon codes.
 *
 * CSV format (simple):
 *   - Either a header line: coupon_code
 *     followed by one code per line, e.g.
 *       coupon_code
 *       11930159894
 *       11937520223
 *   - Or no header: one code per line
 *
 * Usage examples:
 *   node scripts/dmguru-upload-coupons-from-csv.js \
 *     --file public/coupons.csv \
 *     --token "<USER_TOKEN>" \
 *     --account-token "<ACCOUNT_TOKEN>" \
 *     --debug
 *
 * Options:
 *   --file <path>            Path to CSV (default: public/cupom.csv)
 *   --token <USER_TOKEN>     User Token (for Authorization: Bearer)
 *   --account-token <ACC>    Account Token (for X-Account-Token)
 *   --concurrency <n>        Parallel requests (default: 3)
 *   --incidence-type <t>     Default: percent
 *   --incidence-value <v>    Default: 9.09
 *   --incidence-field <f>    Default: products
 *   --validate-by <v>        Default: email
 *   --max-cycles <n>         Default: 1 (maximum_subscription_cycles)
 *   --product-id <id>        Optional product id (repeat flag to add multiple)
 *   --offer-id <id>          Optional offer id (repeat flag to add multiple)
 *   --date-ini <date>        Start date (ISO like 2025-10-07 or epoch seconds) - default: today (UTC)
 *   --date-end <date>        End date (ISO or epoch seconds) - default: +365 days from date_ini
 *   --usage-contact <n>      Default: 0
 *   --usage-total <n>        Default: 0
 *   --auth <mode>            Auth mode: bearer | account | both | auto (default: bearer)
 *   --sleep-ms <n>           Sleep between requests (ms). Default: 0
 *   --dry-run                Parse & print, do not create
 *   --debug                  Verbose logs
 */

const fs = require('fs');
const readline = require('readline');
const axios = require('axios');

// CLI args
const argv = process.argv.slice(2);
const getArg = (name) => {
  const idx = argv.findIndex((a) => a === name || a.startsWith(name + '='));
  if (idx === -1) return undefined;
  const val = argv[idx].includes('=') ? argv[idx].split('=').slice(1).join('=') : argv[idx + 1];
  return val;
};

const DEBUG = argv.includes('--debug');
const DRY_RUN = argv.includes('--dry-run');
const FILE_PATH = getArg('--file') || 'public/cupom.csv';

// Embedded API and tokens (as requested)
const API_BASE = 'https://digitalmanager.guru/api/v2';
const USER_TOKEN_DEFAULT = 'a00edf00-c234-4c19-8cae-1438ed6e5991|nARD9VFotQBKCnWdJlwPmmVjqC5pgOLEPHR2LV05a33b7cb5';
const ACCOUNT_TOKEN_DEFAULT = '2n6An1X0BC563TvIZ8VEBTANS1rev2u6kPsmTccz';

// CLI can override, otherwise use embedded
const USER_TOKEN = getArg('--token') || USER_TOKEN_DEFAULT;
const ACCOUNT_TOKEN = getArg('--account-token') || ACCOUNT_TOKEN_DEFAULT;
const CONCURRENCY = Math.max(1, Number(getArg('--concurrency') || 3));
const AUTH_MODE = (getArg('--auth') || 'bearer').toLowerCase();
const SLEEP_MS = Math.max(0, Number(getArg('--sleep-ms') || 0));

// Defaults aligned to the sample coupon
const INCIDENCE_TYPE = (getArg('--incidence-type') || 'percent').trim();
const INCIDENCE_VALUE = Number(getArg('--incidence-value') || 9.09);
const INCIDENCE_FIELD = (getArg('--incidence-field') || 'products').trim();
const VALIDATE_BY = (getArg('--validate-by') || 'email').trim();
const MAX_CYCLES = Number(getArg('--max-cycles') || 1);

// Date and usage flags (now that argv/getArg are defined)
const DATE_INI_FLAG = getArg('--date-ini');
const DATE_END_FLAG = getArg('--date-end');
let DATE_INI = toEpochSeconds(DATE_INI_FLAG) ?? startOfTodayUTC();
let DATE_END = toEpochSeconds(DATE_END_FLAG);
if (!DATE_END) {
  // default to +365 days from DATE_INI
  DATE_END = DATE_INI + 365 * 24 * 60 * 60;
}

const USAGE_CONTACT = Number(getArg('--usage-contact') || 0);
const USAGE_TOTAL = Number(getArg('--usage-total') || 0);

// Default IDs aligned to the sample coupon
const DEFAULT_PRODUCT_IDS = ['9fd0569c-c110-41b5-8290-013df2853407'];
const DEFAULT_OFFER_IDS = ['a00d2e15-8286-44f8-ab67-cc672e8aac3c', 'a00d3098-3f03-4577-b08e-91f55241f0d8'];

// Multi-value flags for product_ids and offer_ids (override defaults if provided)
const PRODUCT_IDS = argv
  .map((v, i) => (v === '--product-id' && argv[i + 1] ? argv[i + 1] : (v.startsWith('--product-id=') ? v.split('=')[1] : undefined)))
  .filter(Boolean);
const OFFER_IDS = argv
  .map((v, i) => (v === '--offer-id' && argv[i + 1] ? argv[i + 1] : (v.startsWith('--offer-id=') ? v.split('=')[1] : undefined)))
  .filter(Boolean);

if (!USER_TOKEN && !ACCOUNT_TOKEN) {
  console.error('❌ Provide at least one token: --token <USER_TOKEN> and/or --account-token <ACCOUNT_TOKEN>');
  process.exit(1);
}

const httpBearer = USER_TOKEN
  ? axios.create({
      baseURL: API_BASE,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  : null;

const httpAccount = ACCOUNT_TOKEN
  ? axios.create({
      baseURL: API_BASE,
      timeout: 20000,
      headers: {
        'X-Account-Token': ACCOUNT_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  : null;

const httpBoth = USER_TOKEN && ACCOUNT_TOKEN
  ? axios.create({
      baseURL: API_BASE,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${USER_TOKEN}`,
        'X-Account-Token': ACCOUNT_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  : null;

// Select a single HTTP client for the whole run to avoid duplicate concurrent requests
function pickHttpClient() {
  const pref = AUTH_MODE;
  const tryOrder =
    pref === 'auto' ? ['bearer', 'account', 'both'] : [pref];

  for (const m of tryOrder) {
    if (m === 'bearer' && httpBearer) return { client: httpBearer, mode: 'bearer' };
    if (m === 'account' && httpAccount) return { client: httpAccount, mode: 'account' };
    if (m === 'both' && httpBoth) return { client: httpBoth, mode: 'both' };
  }
  // Fallbacks
  if (httpBoth) return { client: httpBoth, mode: 'both' };
  if (httpBearer) return { client: httpBearer, mode: 'bearer' };
  if (httpAccount) return { client: httpAccount, mode: 'account' };
  throw new Error('No valid auth client available');
}

let HTTP_SELECTED = null;
let AUTH_SELECTED = null;

async function parseCsvCodes(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`CSV file not found: ${path}`);
  }
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const codes = [];
  let isFirst = true;
  for await (const raw of rl) {
    const line = (raw || '').trim();
    if (!line) continue;
    if (isFirst && /(^|,)\s*(coupon_code|cupom)\s*(,|$)/i.test(line)) {
      isFirst = false;
      continue; // skip header
    }
    isFirst = false;
    // assume one code per line or first column CSV
    const code = line.split(',')[0].replace(/^"|"$/g, '').trim();
    if (code) codes.push(code);
  }
  return codes;
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

async function createCoupon(code) {
  // Primary payload aligned with the sample coupon
  const basePayload = {
    coupon_code: code,
    is_active: 1,
    incidence_field: INCIDENCE_FIELD,
    incidence_type: INCIDENCE_TYPE,
    incidence_value: INCIDENCE_VALUE,
    validate_by: VALIDATE_BY,
    maximum_subscription_cycles: MAX_CYCLES,
    date_ini: DATE_INI,
    date_end: DATE_END,
    usage_contact: USAGE_CONTACT,
    usage_total: USAGE_TOTAL,
  };
  if (PRODUCT_IDS.length) {
    basePayload.product_ids = PRODUCT_IDS;
  } else {
    basePayload.product_ids = DEFAULT_PRODUCT_IDS;
  }
  if (OFFER_IDS.length) {
    basePayload.offer_ids = OFFER_IDS;
  } else {
    basePayload.offer_ids = DEFAULT_OFFER_IDS;
  }

  const path = '/coupons';

  // Ensure we have a selected client
  if (!HTTP_SELECTED) {
    const picked = pickHttpClient();
    HTTP_SELECTED = picked.client;
    AUTH_SELECTED = picked.mode;
    if (DEBUG) console.log(`🔐 Using auth mode: ${AUTH_SELECTED}`);
  }

  // Single attempt with retries on 429
  const maxRetries = 3;
  let attempt = 0;
  let lastErr = null;
  while (attempt <= maxRetries) {
    try {
      if (DEBUG) console.log(`➡️  POST ${AUTH_SELECTED.toUpperCase()} ${path}`, basePayload);
      const { data } = await HTTP_SELECTED.post(path, basePayload);
      return { ok: true, data, auth: AUTH_SELECTED, body: basePayload };
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      // If duplicate, treat as skipped (not an error)
      if (status === 422 && data && data.coupon_code && Array.isArray(data.coupon_code) && data.coupon_code.some(m => /exists/i.test(String(m)))) {
        if (DEBUG) console.log('ℹ️  Coupon already exists, skipping:', code);
        return { ok: true, data: { already_exists: true }, auth: AUTH_SELECTED, body: basePayload };
      }
      // If 401, try one-time fallback to another auth mode
      if (status === 401) {
        if (AUTH_SELECTED !== 'both' && httpBoth) {
          HTTP_SELECTED = httpBoth; AUTH_SELECTED = 'both';
          if (DEBUG) console.log('🔁 401 -> switching auth mode to BOTH and retrying once...');
          continue;
        }
        if (AUTH_SELECTED !== 'bearer' && httpBearer) {
          HTTP_SELECTED = httpBearer; AUTH_SELECTED = 'bearer';
          if (DEBUG) console.log('🔁 401 -> switching auth mode to BEARER and retrying once...');
          continue;
        }
        if (AUTH_SELECTED !== 'account' && httpAccount) {
          HTTP_SELECTED = httpAccount; AUTH_SELECTED = 'account';
          if (DEBUG) console.log('🔁 401 -> switching auth mode to ACCOUNT and retrying once...');
          continue;
        }
      }
      // 429 backoff
      if (status === 429) {
        const backoff = Math.min(2000 * (attempt + 1), 8000);
        if (DEBUG) console.log(`⏳ 429 received, backing off ${backoff}ms...`);
        await sleep(backoff);
        attempt++;
        continue;
      }
      lastErr = err;
      break;
    }
  }
  const error = new Error(`Create failed for ${code}`);
  error.last = { status: lastErr?.response?.status, data: lastErr?.response?.data };
  throw error;
}

async function run() {
  try {
    const codes = await parseCsvCodes(FILE_PATH);
    if (!codes.length) {
      console.log('⚠️ No coupon codes found in CSV. Ensure a header "coupon_code" or one code per line.');
      return;
    }

    console.log(`📄 CSV: ${FILE_PATH} | ${codes.length} codes`);
    if (DRY_RUN) {
      console.log('🧪 Dry run. First 10 codes:', codes.slice(0, 10));
      return;
    }

    // Simple concurrency control
    let idx = 0;
    let created = 0;
    let failed = 0;
    const results = [];

    async function worker(id) {
      while (idx < codes.length) {
        const i = idx++;
        const code = codes[i];
        try {
          if (SLEEP_MS) await sleep(SLEEP_MS);
          const res = await createCoupon(code);
          // Count as created even if already exists to move on silently
          created++;
          if (DEBUG) console.log(`✅ [${i + 1}/${codes.length}] Created`, code, `(auth=${res.auth})`);
          results.push({ code, status: res?.data?.already_exists ? 'exists' : 'created', auth: res.auth, id: res?.data?.id });
        } catch (err) {
          failed++;
          const last = err.last || {};
          console.error(`❌ [${i + 1}/${codes.length}] Failed ${code} status=${last.status || 'n/a'}`);
          if (DEBUG) console.error('↪️ details:', JSON.stringify(last.data || err.attempts || err.message || {}, null, 2));
          results.push({ code, status: 'failed', statusCode: last.status, error: last.data || err.message });
        }
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
    await Promise.all(workers);

    console.log('\n📊 Summary');
    console.log(`  Created: ${created}`);
    console.log(`  Failed:  ${failed}`);

    // Print a small table summary
    console.table(results.slice(0, 20));

    // Persist a full report
    const outDir = 'scripts/output';
    try { fs.mkdirSync(outDir, { recursive: true }); } catch (_) {}
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outFile = `${outDir}/dmguru-upload-result-${ts}.json`;
    fs.writeFileSync(outFile, JSON.stringify({
      file: FILE_PATH,
      created,
      failed,
      total: codes.length,
      results,
    }, null, 2));
    console.log(`\n📝 Report saved at: ${outFile}`);

  } catch (err) {
    console.error('❌ Unexpected error');
    if (err?.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err?.message || err);
    }
    process.exit(1);
  }
}

run();
