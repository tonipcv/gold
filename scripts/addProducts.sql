-- Adicionar produtos
INSERT INTO "Product" (id, name, description, "createdAt", "updatedAt", "accessDurationDays")
VALUES 
  ('prod_futurostech', 'futurostech', 'Futuros Tech', NOW(), NOW(), 365),
  ('prod_copytrade', 'copytrade', 'Copy Trading com BH', NOW(), NOW(), 365)
ON CONFLICT (name) DO NOTHING;

-- Associar todos os usuários ao produto 'futurostech'
INSERT INTO "Purchase" (id, "userId", "productId", "purchaseDate", "expirationDate", status, "startDate", "endDate")
SELECT 
  gen_random_uuid(), 
  u.id, 
  'prod_futurostech', 
  NOW(), 
  NOW() + INTERVAL '365 days', 
  'ACTIVE', 
  NOW(), 
  NOW() + INTERVAL '365 days'
FROM "User" u
ON CONFLICT ("userId", "productId") DO NOTHING;
