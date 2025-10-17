// Pricing utilities for installments (Pagar.me v5)
// Rules:
// - APR: 2.9% per month (0.029) applied when installments > 1
// - Product: if price > 97 (BRL), allow up to 12x, otherwise default to 1x
// - Membership: installments based on period -> mensal:1x, trimestral:3x, semestral:6x, anual:12x
// - Monetary amounts handled in centavos

export type Currency = "BRL";

export type MembershipPeriod = "mensal" | "trimestral" | "semestral" | "anual";

export type PricingInput = {
  priceCents: number; // base price in cents
  currency?: Currency; // default BRL
  kind: "product" | "membership";
  membershipPeriod?: MembershipPeriod; // required when kind = membership
  aprMonthly?: number; // default 0.029
};

export type PricingOption = {
  n: number; // installments
  perValue: number; // cents per installment (with rounding & adjustments)
  total: number; // total charged (cents)
  apr: number; // monthly APR applied for this n (0 for n=1)
  interestFree: boolean; // true when n=1
  lastInstallmentAdjustment?: number; // cents added/subtracted in last installment to close rounding
};

export type PricingResult = {
  currency: Currency;
  priceBase: number; // cents
  options: PricingOption[];
};

const PERIOD_TO_INSTALLMENTS: Record<MembershipPeriod, number> = {
  mensal: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

export function amortizedMonthlyPayment(P: number, i: number, n: number): number {
  // A = P * [ i(1+i)^n / ((1+i)^n - 1) ]
  const pow = Math.pow(1 + i, n);
  const numerator = i * pow;
  const denominator = pow - 1;
  if (n <= 0) return P;
  if (i === 0) return P / n;
  return (P * numerator) / denominator;
}

function roundToCents(x: number): number {
  return Math.round(x);
}

function buildOption(priceCents: number, n: number, aprMonthly: number): PricingOption {
  if (n <= 1) {
    return {
      n: 1,
      perValue: priceCents,
      total: priceCents,
      apr: 0,
      interestFree: true,
    };
  }

  const Afloat = amortizedMonthlyPayment(priceCents, aprMonthly, n);
  // Round each installment to cents
  const perRounded = roundToCents(Afloat);
  // Compute total and adjust last installment if needed
  let total = perRounded * n;
  const diff = total - priceCents; // diff is the interest collected in cents + rounding effects

  // Ensure total is exactly n * perRounded; we already calculated as such.
  // We also expose the rounding adjustment relative to pure amortization sum.
  // For transparency, compute the exact-amortization total and the rounding delta applied to last installment
  const exactTotal = Math.round(Afloat * n);
  const lastInstallmentAdjustment = total - exactTotal; // could be 0, +/- a few cents

  return {
    n,
    perValue: perRounded,
    total,
    apr: aprMonthly,
    interestFree: false,
    lastInstallmentAdjustment: lastInstallmentAdjustment || undefined,
  };
}

export function calculateProductOptions(input: PricingInput): PricingResult {
  const currency: Currency = input.currency || "BRL";
  const price = input.priceCents;
  const aprMonthly = input.aprMonthly ?? 0.029;

  // Rule: if price > 97 (BRL), allow up to 12x; else only 1x by default
  const priceReais = price / 100;
  const maxInstallments = priceReais > 97 ? 12 : 1;

  const options: PricingOption[] = [];
  for (let n = 1; n <= maxInstallments; n++) {
    options.push(buildOption(price, n, n > 1 ? aprMonthly : 0));
  }

  return { currency, priceBase: price, options };
}

export function calculateMembershipOptions(input: PricingInput): PricingResult {
  const currency: Currency = input.currency || "BRL";
  const price = input.priceCents;
  const aprMonthly = input.aprMonthly ?? 0.029;
  const period = input.membershipPeriod;
  if (!period) {
    throw new Error("membershipPeriod is required for kind=membership");
  }
  const n = PERIOD_TO_INSTALLMENTS[period];
  const option = buildOption(price, n, n > 1 ? aprMonthly : 0);
  return { currency, priceBase: price, options: [option] };
}

export function calculatePricing(input: PricingInput): PricingResult {
  if (input.kind === "product") return calculateProductOptions(input);
  return calculateMembershipOptions(input);
}
