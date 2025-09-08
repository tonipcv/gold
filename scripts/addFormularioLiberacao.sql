-- Create FormularioLiberacao table if it doesn't exist
CREATE TABLE IF NOT EXISTS "FormularioLiberacao" (
  "id" TEXT NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text),
  "name" TEXT NOT NULL,
  "purchaseEmail" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "FormularioLiberacao_pkey" PRIMARY KEY ("id")
);

-- Optional: basic index on purchaseEmail for lookups
CREATE INDEX IF NOT EXISTS idx_formulario_liberacao_purchase_email
  ON "FormularioLiberacao" ("purchaseEmail");
