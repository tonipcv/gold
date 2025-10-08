#!/usr/bin/env node

/**
 * Digital Manager Guru - List Active Coupons
 *
 * How to use:
 * 1) Install deps (once):
 *    npm i axios dotenv
 * 2) Configure your .env with at least:
 *    DMGURU_API_BASE=https://api.digitalmanager.guru
 *    DMGURU_API_VERSION=v1
 *    DMGURU_API_KEY=your_api_key_here
 *    DMGURU_AUTH_HEADER=Authorization        # optional, defaults to Authorization
 *    DMGURU_AUTH_SCHEME=Bearer               # optional, defaults to Bearer
 *    DMGURU_ACCOUNT_ID=your_account_id       # optional, if your API requires it
 * 3) Run:
 *    node scripts/dmguru-list-active-coupons.js
 */

const axios = require('axios');

// Simple CLI args parsing
const argv = process.argv.slice(2);
const getArg = (name) => {
  const idx = argv.findIndex((a) => a === name || a.startsWith(name + '='));
  if (idx === -1) return undefined;
  const val = argv[idx].includes('=') ? argv[idx].split('=').slice(1).join('=') : argv[idx + 1];
  return val;
};

const DEBUG = argv.includes('--debug');
const API_TOKEN = getArg('--token');
const ACCOUNT_TOKEN = getArg('--account-token');
if (!API_TOKEN) {
  console.error('❌ Missing --token argument');
  process.exit(1);
}

// Correct base URL for Digital Manager Guru API
const API_BASE = 'https://digitalmanager.guru/api/v2';

const http = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function parseDateSafe(val) {
  if (!val) return undefined;
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
}

function nowUtc() {
  return new Date();
}

function isWithinWindow(coupon) {
  const starts = parseDateSafe(coupon.starts_at || coupon.start_at || coupon.valid_from || coupon.startDate);
  const ends = parseDateSafe(coupon.ends_at || coupon.end_at || coupon.valid_until || coupon.expirationDate || coupon.endDate);
  const now = nowUtc();
  if (starts && now < starts) return false;
  if (ends && now > ends) return false;
  return true; // no window or inside window
}

function toLower(v) {
  return (v || '').toString().trim().toLowerCase();
}

function isActiveCoupon(coupon) {
  // Common flags across APIs
  if (coupon.active === true) return true;
  if (coupon.enabled === true) return true;
  if (coupon.is_active === true) return true;

  const status = toLower(coupon.status || coupon.state);
  if (['active', 'enabled', 'ativo'].includes(status)) return true;

  // Some APIs use is_enabled or similar flags
  if (coupon.is_enabled === true) return true;

  // Fallback to date window if provided
  return isWithinWindow(coupon);
}

function normalizeCoupon(coupon) {
  // Best-effort normalization for printing
  const id = coupon.id || coupon.uuid || coupon._id || coupon.coupon_id;
  const code = coupon.code || coupon.coupon_code || coupon.name || coupon.title;
  const status = coupon.status || coupon.state || (coupon.active ? 'active' : undefined);
  const discountValue = coupon.discount_value || coupon.discount || coupon.amount || coupon.value;
  const discountType = coupon.discount_type || coupon.type || coupon.discountType;
  const startsAt = coupon.starts_at || coupon.start_at || coupon.valid_from || coupon.startDate;
  const endsAt = coupon.ends_at || coupon.end_at || coupon.valid_until || coupon.expirationDate || coupon.endDate;

  return {
    id,
    code,
    status,
    discount: discountValue,
    discountType,
    startsAt,
    endsAt,
  };
}

async function fetchAllCoupons() {
  const paramsCandidates = [
    { is_active: true, has_transactions: false },
    { is_active: 'true', has_transactions: 'false' },
    { is_active: 1, has_transactions: 0 },
    { is_active: '1', has_transactions: '0' },
    // Alternative naming just in case
    { active: true, has_transactions: false },
  ];

  const tokenToUse = ACCOUNT_TOKEN || API_TOKEN;

  // 1) Try with Bearer only, iterating through param encodings
  for (const params of paramsCandidates) {
    try {
      if (DEBUG) console.log(`🔎 GET /coupons Bearer with params:`, params);
      const { data } = await http.get('/coupons', { params });
      const list = Array.isArray(data?.data) ? data.data
                : Array.isArray(data?.items) ? data.items
                : Array.isArray(data) ? data
                : [];
      return list;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        // Try next param encoding
        if (DEBUG) console.log('↪️ 422 with this params shape, trying next encoding...');
        continue;
      }
      if (status === 401) {
        // Move to account token phase
        if (DEBUG) console.log('🔁 401 with Bearer, switching to X-Account-Token attempts...');
        break;
      }
      throw err;
    }
  }

  // 2) Try with X-Account-Token when available
  if (tokenToUse) {
    const httpAccount = axios.create({
      baseURL: API_BASE,
      timeout: 20000,
      headers: {
        'X-Account-Token': tokenToUse,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    for (const params of paramsCandidates) {
      try {
        if (DEBUG) console.log(`🔎 GET /coupons X-Account-Token with params:`, params);
        const { data } = await httpAccount.get('/coupons', { params });
        const list = Array.isArray(data?.data) ? data.data
                  : Array.isArray(data?.items) ? data.items
                  : Array.isArray(data) ? data
                  : [];
        return list;
      } catch (err2) {
        const status2 = err2?.response?.status;
        if (status2 === 422) {
          if (DEBUG) console.log('↪️ 422 with this params shape (X-Account-Token), trying next encoding...');
          continue;
        }
        if (status2 === 401) {
          if (DEBUG) console.log('🔁 401 with X-Account-Token, trying BOTH headers...');
          break;
        }
        throw err2;
      }
    }

    // 3) Try with BOTH headers
    const httpBoth = axios.create({
      baseURL: API_BASE,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'X-Account-Token': tokenToUse,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    for (const params of paramsCandidates) {
      try {
        if (DEBUG) console.log(`🔎 GET /coupons BOTH headers with params:`, params);
        const { data } = await httpBoth.get('/coupons', { params });
        const list = Array.isArray(data?.data) ? data.data
                  : Array.isArray(data?.items) ? data.items
                  : Array.isArray(data) ? data
                  : [];
        return list;
      } catch (err3) {
        const status3 = err3?.response?.status;
        if (status3 === 422) {
          if (DEBUG) console.log('↪️ 422 with this params shape (BOTH), trying next encoding...');
          continue;
        }
        throw err3;
      }
    }
  }

  throw new Error('Unable to fetch coupons with the attempted auth and parameter combinations.');
}

function printCoupons(coupons) {
  if (!coupons.length) {
    console.log('No active coupons found.');
    return;
  }

  // Format table-like output
  const rows = coupons.map(normalizeCoupon);

  // Determine column widths
  const headers = ['id', 'code', 'status', 'discount', 'discountType', 'startsAt', 'endsAt'];
  const colWidths = headers.map(h => Math.max(h.length, ...rows.map(r => String(r[h] ?? '').length)));

  const line = (vals) => vals.map((v, i) => String(v ?? '').padEnd(colWidths[i])).join('  ');

  console.log(line(headers));
  console.log(colWidths.map(w => '-'.repeat(w)).join('  '));
  for (const r of rows) {
    console.log(line(headers.map(h => r[h] ?? '')));
  }
}

(async () => {
  try {
    const all = await fetchAllCoupons();
    if (DEBUG) console.log(`📦 Received ${all.length} coupons`);

    const active = all.filter(isActiveCoupon).map(normalizeCoupon);

    if (!active.length) {
      console.log('⚠️ No active coupons found.');
      return;
    }

    console.log('\n✅ Active Coupons:\n');
    console.table(active);
  } catch (err) {
    console.error('❌ Failed to fetch coupons.');
    if (err?.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
      console.error('Hint: Ensure you are using a valid User Token (Authorization: Bearer) or pass --account-token to try X-Account-Token.');
    } else {
      console.error(err?.message || err);
    }
    process.exit(1);
  }
})();
