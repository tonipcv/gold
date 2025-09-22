-- Create the FormularioLiberacao2 table
CREATE TABLE IF NOT EXISTS "FormularioLiberacao2" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "purchaseEmail" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "accountNumber" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on purchaseEmail for faster lookups
CREATE INDEX IF NOT EXISTS "FormularioLiberacao2_purchaseEmail_idx" ON "FormularioLiberacao2"("purchaseEmail");

-- Add a comment to the table
COMMENT ON TABLE "FormularioLiberacao2" IS 'Tabela para armazenar os dados do segundo formulário de liberação';
