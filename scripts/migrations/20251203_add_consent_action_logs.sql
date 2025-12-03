-- Create ConsentLog table
CREATE TABLE IF NOT EXISTS "ConsentLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "consentType" TEXT NOT NULL,
  "textVersion" TEXT,
  "textHash" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "ip" TEXT,
  "userAgent" TEXT,
  "screenshotUrl" TEXT,
  "configSnapshot" JSONB,
  CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ConsentLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index for quick lookup by user and type
CREATE INDEX IF NOT EXISTS "ConsentLog_userId_consentType_idx" ON "ConsentLog" ("userId", "consentType");

-- Create ActionLog table
CREATE TABLE IF NOT EXISTS "ActionLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "configSnapshot" JSONB,
  "ip" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActionLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ActionLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index for user + action queries
CREATE INDEX IF NOT EXISTS "ActionLog_userId_action_idx" ON "ActionLog" ("userId", "action");
