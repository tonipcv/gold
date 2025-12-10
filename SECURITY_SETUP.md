# 🔒 Configuração de Segurança - Admin Protection

## ⚠️ CRÍTICO - Executar Imediatamente

A página `/admin/consents` estava **completamente desprotegida** e expondo dados sensíveis de todos os usuários (nomes, emails, status de consentimento).

## Proteções Implementadas

### 1. Campo `isAdmin` no Banco de Dados
- ✅ Adicionado campo `isAdmin` no modelo `User` do Prisma
- ✅ Integrado no sistema de autenticação (JWT + Session)
- ✅ Middleware protegendo todas as rotas `/admin/*`
- ✅ Verificação server-side na página `/admin/consents`
- ✅ Proteção na rota de exportação CSV `/admin/consents.csv`

### 2. Camadas de Proteção

#### Camada 1: Middleware (Edge)
- Bloqueia acesso não autorizado antes mesmo de chegar na página
- Redireciona para `/cursos` se não for admin
- Loga tentativas de acesso não autorizado

#### Camada 2: Server Component
- Verificação adicional na página usando `getServerSession`
- Redireciona para `/login` se não autenticado
- Redireciona para `/cursos` se não for admin

#### Camada 3: API Routes
- Todas as rotas `/api/admin/*` verificam `isAdmin`
- Retorna 401 Unauthorized se não for admin

## 📋 Passos para Ativar a Proteção

### Passo 1: Executar Migração do Banco de Dados

```bash
# Gerar e aplicar a migração
npx prisma migrate dev --name add_isAdmin_field

# Ou se preferir criar a migração manualmente
npx prisma migrate dev
```

### Passo 2: Definir o Primeiro Admin

Você precisa definir manualmente qual usuário será admin. Escolha uma das opções:

#### Opção A: Via Prisma Studio (Recomendado)
```bash
npx prisma studio
```
1. Abra a tabela `User`
2. Encontre seu usuário
3. Marque `isAdmin` como `true`
4. Salve

#### Opção B: Via SQL Direto
```sql
-- Substitua 'seu-email@example.com' pelo seu email
UPDATE "User" SET "isAdmin" = true WHERE email = 'seu-email@example.com';
```

#### Opção C: Via Script Node.js
Crie um arquivo `scripts/set-admin.ts`:

```typescript
import { prisma } from '../src/lib/prisma'

async function setAdmin(email: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true }
  })
  console.log('✅ Admin definido:', user.email)
}

// Substitua pelo seu email
setAdmin('seu-email@example.com')
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
```

Execute:
```bash
npx ts-node scripts/set-admin.ts
```

### Passo 3: Reiniciar o Servidor

```bash
# Parar o servidor atual (Ctrl+C)
# Reiniciar
npm run dev
```

### Passo 4: Fazer Logout e Login Novamente

**IMPORTANTE**: Você precisa fazer logout e login novamente para que o token JWT seja atualizado com a flag `isAdmin`.

1. Acesse `/api/auth/signout`
2. Faça login novamente
3. Tente acessar `/admin/consents`

## 🧪 Testar a Proteção

### Teste 1: Acesso sem autenticação
```bash
# Abra uma aba anônima e tente acessar
http://localhost:3000/admin/consents
# Deve redirecionar para /login
```

### Teste 2: Acesso com usuário não-admin
```bash
# Faça login com um usuário comum (isAdmin = false)
# Tente acessar /admin/consents
# Deve redirecionar para /cursos
```

### Teste 3: Acesso com admin
```bash
# Faça login com usuário admin (isAdmin = true)
# Acesse /admin/consents
# Deve funcionar normalmente
```

### Teste 4: Exportação CSV
```bash
# Tente acessar sem ser admin
http://localhost:3000/admin/consents.csv
# Deve retornar 401 Unauthorized
```

## 🔍 Monitoramento

O middleware loga tentativas de acesso não autorizado:
```
[Security] Unauthorized admin access attempt: user@example.com
```

Monitore os logs do servidor para detectar tentativas de acesso suspeitas.

## 📝 Notas Importantes

1. **Erro de TypeScript**: O erro `Property 'isAdmin' does not exist` é esperado até você executar `npx prisma generate` após a migração.

2. **Erro do Prisma Schema**: O aviso sobre `datasource url` é um warning do Prisma 7, mas não afeta a funcionalidade. Pode ser ignorado por enquanto.

3. **Outras Páginas Admin**: Verifique se existem outras páginas em `/admin/*` e adicione a mesma proteção se necessário.

## 🚨 Outras Rotas Admin a Verificar

Execute este comando para encontrar todas as páginas admin:
```bash
find src/app/admin -name "page.tsx" -o -name "route.ts"
```

Para cada arquivo encontrado, adicione a verificação de admin no início:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }
  
  if (!(session.user as any).isAdmin) {
    redirect('/cursos')
  }
  
  // ... resto do código
}
```

## ✅ Checklist de Segurança

- [ ] Migração do banco executada
- [ ] Primeiro admin definido
- [ ] Servidor reiniciado
- [ ] Logout/Login realizado
- [ ] Teste de acesso sem auth (deve bloquear)
- [ ] Teste de acesso com usuário comum (deve bloquear)
- [ ] Teste de acesso com admin (deve funcionar)
- [ ] Teste de exportação CSV protegida
- [ ] Outras páginas admin verificadas e protegidas
- [ ] Logs de segurança monitorados

## 🆘 Problemas Comuns

### "Não consigo acessar /admin/consents mesmo sendo admin"
- Faça logout e login novamente
- Verifique se `isAdmin = true` no banco de dados
- Verifique os logs do servidor

### "Erro ao executar migração"
- Certifique-se de que o banco de dados está rodando
- Verifique a variável `DATABASE_URL` no `.env`
- Tente `npx prisma db push` como alternativa

### "TypeScript reclamando de isAdmin"
- Execute `npx prisma generate`
- Reinicie o TypeScript server no VS Code
