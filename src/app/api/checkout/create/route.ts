import { NextRequest, NextResponse } from "next/server";
import { calculatePricing, type MembershipPeriod, type PricingOption } from "@/lib/payments/pricing";

/*
  POST /api/checkout/create
  Body:
  {
    kind: "product" | "membership",
    priceCents: number,
    membershipPeriod?: "mensal" | "trimestral" | "semestral" | "anual",
    selectedInstallments?: number,
    items?: Array<{ amount?: number; quantity?: number; description?: string }>,
    customer?: { name?: string; email?: string },
    card?: { id?: string; token?: string },
    statement_descriptor?: string,
    dryRun?: boolean // default true - only returns the payload to send to Pagar.me
  }

  Behavior:
  - APR 2.9% per month applied automatically for installments > 1.
  - Product: if price > 97 BRL, allow up to 12x; otherwise default to 1x.
  - Membership: installments forced by period mapping (1,3,6,12).
  - Returns a payload ready for Pagar.me v5. If dryRun=false and credentials are configured,
    you may plug real submission logic here.
*/

function getEnvBool(val: string | undefined, def: boolean): boolean {
  if (val === undefined) return def;
  return ["1", "true", "yes", "on"].includes(val.toLowerCase());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      kind,
      priceCents,
      membershipPeriod,
      selectedInstallments,
      items,
      customer,
      card,
      statement_descriptor,
      dryRun,
    } = body as {
      kind: "product" | "membership";
      priceCents: number;
      membershipPeriod?: MembershipPeriod;
      selectedInstallments?: number;
      items?: Array<{ amount?: number; quantity?: number; description?: string }>;
      customer?: { name?: string; email?: string };
      card?: { id?: string; token?: string };
      statement_descriptor?: string;
      dryRun?: boolean;
    };

    if (!priceCents || typeof priceCents !== "number" || priceCents <= 0) {
      return NextResponse.json({ error: "priceCents must be a positive number (in cents)" }, { status: 400 });
    }
    if (kind !== "product" && kind !== "membership") {
      return NextResponse.json({ error: "kind must be 'product' or 'membership'" }, { status: 400 });
    }

    // Build pricing options according to rules (APR 2.9%)
    const pricing = calculatePricing({
      priceCents,
      kind,
      membershipPeriod,
      aprMonthly: 0.029,
    });

    // Choose number of installments
    let n: number;
    if (kind === "membership") {
      if (!membershipPeriod) {
        return NextResponse.json({ error: "membershipPeriod is required for kind=membership" }, { status: 400 });
      }
      // Membership mapping enforced -> only one option returned
      n = pricing.options[0].n;
    } else {
      // product
      const maxN = pricing.options[pricing.options.length - 1].n;
      const desired = selectedInstallments ?? 1;
      n = Math.max(1, Math.min(desired, maxN));
    }

    let chosen: PricingOption | undefined = pricing.options.find((o: PricingOption) => o.n === n);
    if (!chosen) {
      return NextResponse.json({ error: "Unable to resolve chosen installment option" }, { status: 400 });
    }

    // Enforce minimum per-installment value if configured
    const minInstallmentCents = parseInt(process.env.PAGARME_MIN_INSTALLMENT_CENTS || "0", 10) || 0;
    if (minInstallmentCents > 0) {
      // Reduce n until perValue >= min or n == 1
      while (chosen && chosen.n > 1 && chosen.perValue < minInstallmentCents) {
        const nextN: number = chosen.n - 1;
        const candidate: PricingOption | undefined = pricing.options.find((o: PricingOption) => o.n === nextN);
        if (!candidate) break;
        chosen = candidate;
      }
    }

    if (!chosen) {
      return NextResponse.json({ error: "No valid installment option after min installment enforcement" }, { status: 400 });
    }

    const total = chosen.total; // cents

    // Items: default to single item with total or per your preference
    const finalItems = (items && items.length > 0)
      ? items
      : [{ amount: kind === "membership" ? priceCents : Math.round(total / n), quantity: kind === "membership" ? 1 : n, description: kind === "membership" ? `Membership (${membershipPeriod})` : `${n}x` }];

    const creditCard: any = {
      installments: n,
    };
    if (statement_descriptor) creditCard.statement_descriptor = statement_descriptor;
    if (card?.id) creditCard.card = { id: card.id };
    if (card?.token) creditCard.card = { ...(creditCard.card || {}), token: card.token };

    const pagarmePayload = {
      items: finalItems.map((it) => ({
        amount: typeof it.amount === 'number' ? it.amount : undefined,
        quantity: it.quantity ?? 1,
        description: it.description ?? undefined,
      })),
      customer: customer ?? {},
      payments: [
        {
          payment_method: "credit_card",
          amount: total,
          credit_card: creditCard,
        },
      ],
    };

    // Decide dryRun: body overrides env default
    const defaultDryRun = getEnvBool(process.env.PAGARME_DRY_RUN, true);
    const doDryRun = typeof dryRun === 'boolean' ? dryRun : defaultDryRun;

    if (doDryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        selection: { installments: chosen.n, perValue: chosen.perValue, total: chosen.total, aprMonthly: chosen.apr },
        payload: pagarmePayload,
        info: { note: "Dry-run response. Set PAGARME_DRY_RUN=false or send dryRun:false to perform real charge." },
      });
    }

    // Perform real submission to Pagar.me v5
    const baseUrl = process.env.PAGARME_BASE_URL || "https://api.pagar.me/core/v5";
    const apiKey = process.env.PAGARME_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "PAGARME_API_KEY not configured on server" }, { status: 500 });
    }
    const auth = Buffer.from(`${apiKey}:`).toString('base64');
    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(pagarmePayload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Pagar.me API error", status: res.status, data }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      dryRun: false,
      selection: { installments: chosen.n, perValue: chosen.perValue, total: chosen.total, aprMonthly: chosen.apr },
      response: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid JSON payload", details: err?.message }, { status: 400 });
  }
}
