# Webhook de Liberação Automática (Turmas)

Este documento descreve como funciona a liberação automática de acesso após a compra e como isso se relaciona com as “turmas”. Ele cobre o fluxo do webhook, mapeamento de produtos, atualização de acesso no banco e como os dados podem ser usados na aplicação.

## Endpoints e arquivos relevantes

- API de webhook de pagamento: `src/app/api/payment-webhook/route.ts`
- Auth (NextAuth): `src/lib/auth.ts`
- Verificação de acesso por produto: `src/lib/product-access.ts`
- Formulário de liberação (define turma): `src/app/formulario/page.tsx`
- Admin (listar formulários): `src/app/admin/formularios/page.tsx`

## Visão geral do fluxo (pagamento → acesso)

1. **Plataforma de pagamento** envia um POST para `POST /api/payment-webhook` quando há atualização de pagamento (transaction/subscription).
2. O webhook:
   - Normaliza o status do pagamento (`paid`, `pending`, `cancelled`, etc.).
   - Garante que o usuário exista (cria se necessário) com base no email recebido.
   - Resolve o produto local pelo `guruProductId` (ou por nome como fallback) e cria o produto se não existir.
   - Calcula `startDate` e `endDate` do acesso (usa dados do payload se houver; caso contrário, soma `accessDurationDays`, padrão 365 dias).
   - Executa `upsert` em `Purchase` (chave composta `userId + productId`) com `status`, `startDate`, `endDate` e `expirationDate`.
   - Envia e‑mails transacionais (pago/pendente/análise), criando senha temporária se o usuário ainda não tiver.
3. A aplicação pode consultar o acesso do usuário via util `hasProductAccess(productName)`.

> Importante: por padrão, o webhook NÃO altera `user.isPremium`. Se “Premium” for um produto que libera tudo, você pode (opcional) setar `user.isPremium = true` no trecho `paymentStatus === 'paid'`.

## Como o status é interpretado

Arquivo: `src/app/api/payment-webhook/route.ts`

- O código busca status em múltiplas chaves do payload (`last_status`, `current_invoice.status`, `status`), aceitando variações como `approved`, `paid`, `active`, `canceled/cancelled`, `expired`.
- Resultado é normalizado para um de: `paid`, `pending`, `cancelled`, `expired`.

## Datas de acesso (start/end)

- Se o payload trouxer janelas (ex.: `dates.cycle_start_date`/`cycle_end_date` ou `current_invoice.period_start/period_end`), elas são usadas.
- Se não houver datas explícitas, calcula‑se `endDate = startDate + accessDurationDays` do produto (padrão 365).

## Mapeamento de produto

- Tenta primeiro via `guruProductId` (`product.marketplace_id`/`id` ou `items[0]`).
- Se não achar, tenta por nome (fallback). Caso não exista, cria o `Product` automaticamente com `guruProductId` e `accessDurationDays: 365`.

## Upsert de compra (Purchase)

- Usa `prisma.purchase.upsert` com `where: { userId_productId }` para ser idempotente.
- Dados gravados:
  - `status`: `paid`/`pending`/`cancelled` etc.
  - `startDate`, `endDate` (apenas quando `paid`).
  - `expirationDate` (em `paid`, igual ao `endDate`).

## E-mails transacionais

- Envia e‑mails conforme o status: `paid` (acesso liberado), `pending`, `analysis`.
- Se o usuário ainda não possuir senha, cria uma senha temporária e inclui instruções de login.

## Como usar o acesso na aplicação (turmas)

- O webhook grava **compras** (tabela `Purchase`) e opcionalmente você pode usar um **produto por turma**. Exemplos:
  - `Produto: Automatizador Premium — Turma 4` → libera acesso à turma 4.
  - Para páginas/rotas de uma turma, chame `hasProductAccess('Automatizador Premium — Turma 4')` para validar o acesso do usuário logado.
- Utilidade: `src/lib/product-access.ts`
```ts
const ok = await hasProductAccess('Automatizador Premium — Turma 4')
if (!ok) redirect('/login') // ou página de acesso negado
```

## Formulário e “Turma 4”

- O formulário em `src/app/formulario/page.tsx` envia agora `customField: "turma 4"` por padrão (manual e auto‑submit). Esse campo aparece no admin em `src/app/admin/formularios/page.tsx` na coluna **Turma**.
- Esse formulário é um canal de suporte/liberação manual e não interfere no webhook de pagamento, mas ajuda a organizar a fila de liberações por turma.

## Como liberar tudo por “Premium” (opcional)

Se você deseja que uma compra específica torne o usuário `premium` (liberando todas as turmas/módulos):

1. No `payment-webhook/route.ts`, dentro do bloco `if (paymentStatus === 'paid')`, após resolver o produto, adicione:
```ts
// Exemplo: se o produto é o pacote Premium
if (localProduct.name.toLowerCase().includes('premium')) {
  await prisma.user.update({ where: { id: userId }, data: { isPremium: true } })
}
```
2. Na UI, verifique `session.user.isPremium` para liberar a grade completa de cursos.

## Testando o webhook

- Requisição de teste (ajuste Host e corpo conforme sua plataforma):
```bash
curl -X POST "https://SEU_HOST/api/payment-webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "last_status": "paid",
    "product": { "marketplace_id": "PROD_123", "name": "Automatizador Premium — Turma 4" },
    "subscriber": { "email": "aluno@exemplo.com", "name": "Aluno Teste" },
    "current_invoice": { "status": "paid", "period_start": "2025-11-01T00:00:00Z", "period_end": "2026-11-01T00:00:00Z" }
  }'
```
- Verifique no banco a `Purchase` criada/atualizada e se o e‑mail foi enviado.

## Segurança

- Se a plataforma oferecer assinatura/verificação de webhook, valide a assinatura no início da request (não implementado por padrão neste projeto). 
- Restrinja a URL do endpoint só para o provedor (firewall/VPN) quando possível.

## Decisões atuais do projeto

- **Webhook**: cria/atualiza `Purchase` com base no status do pagamento. Não altera `user.isPremium` por padrão.
- **Turma**: controlada via `customField` no formulário (exibida no admin) e/ou por **produtos específicos por turma** (recomendado para gate automático via `hasProductAccess`).
- **UI de cursos**: hoje o gate principal da grade usa `session.user.isPremium`; considere migrar para `hasProductAccess()` por turma/produto se quiser granularidade por turma.

---

Se quiser, implemento agora:
- Gate por produto/turma nas páginas de curso e módulos (usando `hasProductAccess`).
- Marcação automática de `isPremium` para um produto definido (pacote completo).
- Validação de assinatura do webhook da sua plataforma de pagamento.
