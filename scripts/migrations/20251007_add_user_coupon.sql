-- Create UserCoupon table and indexes (PostgreSQL)

-- Base table
CREATE TABLE IF NOT EXISTS "UserCoupon" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "coupon" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
  "link" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserCoupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Ensure unique coupon
CREATE UNIQUE INDEX IF NOT EXISTS "UserCoupon_coupon_key" ON "UserCoupon" ("coupon");

-- Index for userId
CREATE INDEX IF NOT EXISTS "UserCoupon_userId_idx" ON "UserCoupon" ("userId");

-- In case the table existed without new columns (defensive), add missing columns
ALTER TABLE "UserCoupon" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "UserCoupon" ADD COLUMN IF NOT EXISTS "link" TEXT NOT NULL DEFAULT '';
ALTER TABLE "UserCoupon" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- If coupon column exists but is not unique, the unique index above will enforce it moving forward.
