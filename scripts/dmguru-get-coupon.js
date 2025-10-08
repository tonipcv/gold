#!/usr/bin/env node

/**
 * Digital Manager Guru - Get Coupon Details (Standalone)
 * ------------------------------------------------------
 * Usage:
 *   node scripts/dmguru-get-coupon.js --id <COUPON_ID> \
 *       --token "<USER_TOKEN>" [--account-token "<ACCOUNT_TOKEN>"] [--debug]
 *
 * Example:
 *   node scripts/dmguru-get-coupon.js \
 *     --id a00eda1d-9808-4cf5-aae9-f6ebfe027769 \
 *     --token "USER_TOKEN" \
 *     --account-token "ACCOUNT_TOKEN" \
 *     --debug
 */

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
const COUPON_ID = getArg('--id');
const USER_TOKEN = getArg('--token');
const ACCOUNT_TOKEN = getArg('--account-token');

if (!COUPON_ID) {
  console.error('❌ Missing required --id <COUPON_ID>');
  process.exit(1);
}
if (!USER_TOKEN && !ACCOUNT_TOKEN) {
  console.error('❌ Provide at least one token: --token <USER_TOKEN> and/or --account-token <ACCOUNT_TOKEN>');
  process.exit(1);
}

const API_BASE = 'https://digitalmanager.guru/api/v2';

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

async function getCouponById(id) {
  const path = `/coupons/${encodeURIComponent(id)}`;

  // 1) Try Bearer
  if (httpBearer) {
    try {
      if (DEBUG) console.log(`🔎 GET ${API_BASE}${path} using Authorization: Bearer <user_token>`);
      const { data } = await httpBearer.get(path);
      return data;
    } catch (err) {
      if (DEBUG) console.log('↪️ Bearer failed with status:', err?.response?.status);
      // continue
    }
  }

  // 2) Try Account Token
  if (httpAccount) {
    try {
      if (DEBUG) console.log(`🔎 GET ${API_BASE}${path} using X-Account-Token`);
      const { data } = await httpAccount.get(path);
      return data;
    } catch (err) {
      if (DEBUG) console.log('↪️ X-Account-Token failed with status:', err?.response?.status);
      // continue
    }
  }

  // 3) Try BOTH headers
  if (httpBoth) {
    try {
      if (DEBUG) console.log(`🔎 GET ${API_BASE}${path} using BOTH Authorization + X-Account-Token`);
      const { data } = await httpBoth.get(path);
      return data;
    } catch (err) {
      if (DEBUG) console.log('↪️ BOTH headers failed with status:', err?.response?.status);
      throw err;
    }
  }

  throw new Error('All auth methods failed');
}

(async () => {
  try {
    const details = await getCouponById(COUPON_ID);

    // Pretty print the JSON
    console.log(JSON.stringify(details, null, 2));
  } catch (err) {
    console.error('❌ Failed to fetch coupon details.');
    if (err?.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err?.message || err);
    }
    process.exit(1);
  }
})();
