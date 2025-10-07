-- Create ReferralCoupon table for coupon indication requests
CREATE TABLE IF NOT EXISTS "ReferralCoupon" (
  "id" TEXT NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text),
  "name" TEXT NOT NULL,
  "purchaseEmail" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "divulgacao" TEXT NOT NULL,
  "desiredCouponName" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "ReferralCoupon_pkey" PRIMARY KEY ("id")
);

-- Index to speed up lookups by purchaseEmail
CREATE INDEX IF NOT EXISTS idx_referral_coupon_purchase_email
  ON "ReferralCoupon" ("purchaseEmail");
