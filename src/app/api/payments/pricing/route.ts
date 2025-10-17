import { NextRequest, NextResponse } from "next/server";
import { calculatePricing, type MembershipPeriod } from "@/lib/payments/pricing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { priceCents, kind, membershipPeriod } = body as {
      priceCents: number;
      kind: "product" | "membership";
      membershipPeriod?: MembershipPeriod;
    };

    if (typeof priceCents !== "number" || priceCents <= 0) {
      return NextResponse.json({ error: "priceCents must be a positive number (in cents)" }, { status: 400 });
    }
    if (kind !== "product" && kind !== "membership") {
      return NextResponse.json({ error: "kind must be 'product' or 'membership'" }, { status: 400 });
    }
    if (kind === "membership" && !membershipPeriod) {
      return NextResponse.json({ error: "membershipPeriod is required for kind=membership" }, { status: 400 });
    }

    const result = calculatePricing({
      priceCents,
      kind,
      membershipPeriod,
      aprMonthly: 0.029,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid JSON payload", details: err?.message }, { status: 400 });
  }
}
