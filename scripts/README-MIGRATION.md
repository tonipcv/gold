# 🔧 Migração: Adicionar coluna isAdmin

## Problema

O erro `The column User.isAdmin does not exist in the current database` acontece porque:
1. Adicionamos `isAdmin` no schema do Prisma
2. Mas o banco de produção ainda não tem essa coluna
3. Queries tentam buscar todos os campos do User, incluindo `isAdmin`

## Solução Rápida

### Opção 1: Script Node.js (Recomendado)

Execute o script que adiciona a coluna automaticamente:

```bash
# Certifique-se de que DATABASE_URL aponta para produção no .env
node scripts/add-isAdmin-column.js
```

O script:
- ✅ Verifica se a coluna já existe
- ✅ Adiciona a coluna com valor padrão `false`
- ✅ É seguro executar múltiplas vezes

### Opção 2: SQL Direto

Se preferir executar SQL manualmente no banco:

```sql
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;
```

### Opção 3: Prisma Migrate (Desenvolvimento)

Se estiver em desenvolvimento local:

```bash
npx prisma migrate dev --name add_isAdmin_field
```

⚠️ **Não use em produção** sem testar antes!

## Após adicionar a coluna

### 1. Definir o primeiro admin

```bash
# Substitua pelo seu email
npx ts-node scripts/set-admin.ts seu-email@example.com
```

### 2. Reiniciar o servidor

```bash
# Se estiver usando PM2
pm2 restart all

# Se estiver usando Docker
docker-compose restart

# Se estiver usando Vercel/Netlify
# O deploy automático já reinicia
```

### 3. Fazer logout e login

**IMPORTANTE**: Você precisa fazer logout e login novamente para que o token JWT seja atualizado com a flag `isAdmin`.

## Verificar se funcionou

### Teste 1: Login deve funcionar
```bash
# Tente fazer login normalmente
# Não deve mais dar erro de coluna não encontrada
```

### Teste 2: Verificar isAdmin no banco
```sql
SELECT email, "isAdmin" FROM "User" WHERE email = 'seu-email@example.com';
```

### Teste 3: Acessar área admin
```bash
# Faça login com usuário admin
# Acesse: https://gold.k17.com.br/admin/consents
# Deve funcionar normalmente
```

## Troubleshooting

### Erro: "permission denied for table User"
- Verifique se o usuário do banco tem permissão de ALTER TABLE
- Pode precisar executar como superuser

### Erro: "column isAdmin already exists"
- A coluna já foi adicionada anteriormente
- Pode ignorar este erro

### Login ainda não funciona
1. Verifique se a coluna foi criada: `\d "User"` no psql
2. Reinicie o servidor completamente
3. Limpe o cache do navegador
4. Faça logout e login novamente

### Admin não consegue acessar /admin/consents
1. Verifique se `isAdmin = true` no banco
2. Faça logout e login novamente (atualiza o token)
3. Verifique os logs do servidor para mensagens de segurança

## Arquivos modificados (hotfix temporário)

Enquanto a coluna não existia, modificamos estes arquivos para usar `select`:

- ✅ `src/lib/auth.ts` - authorize e JWT callback
- ✅ `src/lib/getConsentStatus.ts`
- ✅ `src/lib/checkConsent.ts`
- ✅ `src/lib/product-access.ts`
- ✅ `src/app/api/consents/route.ts`
- ✅ `src/app/api/action-logs/route.ts`

Após adicionar a coluna, esses arquivos continuam funcionando normalmente.

## Próximos passos

1. ✅ Executar script para adicionar coluna
2. ✅ Definir primeiro admin
3. ✅ Reiniciar servidor
4. ✅ Testar login
5. ✅ Testar acesso admin
6. 📝 Documentar quem são os admins do sistema

## Comandos úteis

```bash
# Ver estrutura da tabela User
psql $DATABASE_URL -c "\d \"User\""

# Listar todos os admins
psql $DATABASE_URL -c "SELECT email, \"isAdmin\" FROM \"User\" WHERE \"isAdmin\" = true"

# Tornar usuário admin (SQL direto)
psql $DATABASE_URL -c "UPDATE \"User\" SET \"isAdmin\" = true WHERE email = 'seu-email@example.com'"

# Remover admin de usuário
psql $DATABASE_URL -c "UPDATE \"User\" SET \"isAdmin\" = false WHERE email = 'usuario@example.com'"
```

## Segurança

⚠️ **IMPORTANTE**: 
- Apenas usuários de confiança devem ter `isAdmin = true`
- Admins têm acesso a dados sensíveis de todos os usuários
- Revise regularmente quem tem acesso admin
- Use logs para monitorar acessos à área admin

## Suporte

Se ainda tiver problemas:
1. Verifique os logs do servidor
2. Verifique a estrutura do banco: `\d "User"`
3. Teste a query manualmente no psql
4. Verifique se o Prisma Client está atualizado: `npx prisma generate`
