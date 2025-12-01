# Textos de E-mails (liberação, compra e acesso)

Este documento consolida os textos atuais dos e-mails enviados pelo sistema, com assuntos, destinatários e HTML conforme implementado no código.

- Fonte de envio: `src/lib/email.ts` (Nodemailer; remetente padrão: `EMAIL_FROM_NAME` / `EMAIL_FROM_ADDRESS`)
- Observação: variáveis entre `${...}` são interpoladas em tempo de execução.

---

## 1) Pagamento aprovado (Acesso liberado)
- Arquivo: `src/app/api/payment-webhook/route.ts`
- Condição: `paymentStatus === 'paid'`
- Assunto: `Acesso liberado: ${productDisplayName}`
- Para: `user.email`
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.5;">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h2>Seu acesso foi liberado 🎉</h2>
  <p>Olá${user!.name ? `, ${user!.name}` : ''}! Confirmamos o pagamento do seu produto <strong>${productDisplayName}</strong>.</p>
  <p><strong>Como acessar:</strong></p>
  <ol>
    <li>Acesse: <a href="${accessUrl}">${accessUrl}</a></li>
    <li>Entre com seu e-mail: <strong>${user!.email}</strong></li>
    ${tempPassword
      ? `<li>Senha temporária: <strong>${tempPassword}</strong></li>`
      : `<li>Se ainda não definiu uma senha, use "Esqueci minha senha": <a href="${resetUrl}">${resetUrl}</a></li>`}
  </ol>
  ${tempPassword ? `<p style="margin-top:8px;">Recomendamos alterar sua senha após o primeiro login: <a href="${resetUrl}">${resetUrl}</a></p>` : ''}
  <p>Qualquer dúvida, fale no WhatsApp <a href="/whatsapp-cliqueaqui" target="_blank" rel="noopener noreferrer">(73) 9177‑8075</a>.</p>
</div>
```

---

## 2) Pagamento em análise
- Arquivo: `src/app/api/payment-webhook/route.ts`
- Condição: `rootStatus === 'analysis'` (normalizado)
- Assunto: `Pagamento em análise: ${productDisplayName}`
- Para: `user.email`
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.5;">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h2>Seu pagamento está em análise</h2>
  <p>Olá${user.name ? `, ${user.name}` : ''}! Recebemos o seu pedido para <strong>${productDisplayName}</strong> e o pagamento está <strong>em análise</strong> pela operadora.</p>
  ${brand || last4 ? `<p>Forma de pagamento: ${brand ? brand.toUpperCase() : 'cartão'} ${last4 ? '•••• ' + last4 : ''}</p>` : ''}
  <p>Isso é normal e pode levar alguns minutos. Assim que for aprovado, seu acesso será liberado automaticamente e você receberá outro e‑mail.</p>
  <p>Se preferir acompanhar ou refazer o pagamento, acesse: <a href="${checkoutUrl}">${checkoutUrl}</a></p>
  <p>Qualquer dúvida, fale no WhatsApp <a href="/whatsapp-cliqueaqui" target="_blank" rel="noopener noreferrer">(73) 9177‑8075</a>.</p>
</div>
```

---

## 3) Pagamento pendente
- Arquivo: `src/app/api/payment-webhook/route.ts`
- Condição: `paymentStatus === 'pending'`
- Assunto: `Pagamento pendente: ${productDisplayName}`
- Para: `user.email`
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.5;">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h2>Estamos aguardando a confirmação do seu pagamento</h2>
  <p>Olá${user.name ? `, ${user.name}` : ''}! Recebemos seu pedido para <strong>${productDisplayName}</strong>, mas o pagamento ainda está <strong>pendente</strong>.</p>
  <p>Para concluir:</p>
  <ol>
    <li>Finalize o pagamento no seu checkout.</li>
    <li>Após a confirmação, seu acesso será liberado automaticamente e você receberá outro e‑mail.</li>
  </ol>
  <p style="margin-top:8px;">Dúvidas? Fale no WhatsApp: <a href="/whatsapp-cliqueaqui" target="_blank" rel="noopener noreferrer">(73) 9177‑8075</a></p>
  ${pixUrl || pixSignature ? `
    <div style="margin-top:16px;padding:12px;border:1px solid #eee;border-radius:8px;">
      <p><strong>Pagar via PIX</strong></p>
      ${pixUrl ? `<p>QR Code: <a href="${pixUrl}" target="_blank" rel="noopener noreferrer">Abrir QR Code</a></p>` : ''}
      ${pixSignature ? `<p style="word-break:break-all;"><strong>Copia e Cola:</strong><br/><code>${pixSignature}</code></p>` : ''}
      ${pixExpiration ? `<p>Expira em: ${pixExpiration}</p>` : ''}
    </div>
  ` : ''}
  <p>Se já pagou, aguarde alguns minutos — o sistema atualizará automaticamente.</p>
  <p>Qualquer dúvida, responda este e-mail ou fale no WhatsApp <a href="/whatsapp-cliqueaqui" target="_blank" rel="noopener noreferrer">(73) 9177‑8075</a>.</p>
</div>
```

---

## 4) Reenvio de acesso (Admin)
- Arquivo: `src/app/api/admin/resend-access/route.ts`
- Acionado manualmente por admin com e-mail no corpo
- Assunto: `Acesso confirmado • Automatizador Gold 10X`
- Para: e-mail informado
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b0b0b">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h2 style="margin:0 0 10px 0">Bem-vindo(a) ao Automatizador Gold 10X</h2>
  <p>Seu <strong>primeiro acesso</strong> está pronto. Para entrar com segurança, siga os passos abaixo:</p>
  <ol style="padding-left:18px; margin:10px 0 16px">
    <li>Altere sua senha agora (recomendado para primeiro acesso).</li>
    <li>Depois, acesse o painel do Automatizador Gold 10X.</li>
  </ol>
  <p style="margin:12px 0">
    <a href="${passwordLink}" style="display:inline-block;background:#111;color:#fff;border:1px solid #16a34a;text-decoration:none;padding:12px 16px;border-radius:8px;margin-right:8px">Alterar minha senha</a>
    <a href="${appLink}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px">Acessar o Automatizador</a>
  </p>
  <div style="font-size:13px;color:#333;margin-top:8px">
    <p style="margin:6px 0 2px">Se os botões não funcionarem, copie e cole estes links no seu navegador:</p>
    <p style="margin:0;word-break:break-all;background:#f5f5f5;padding:8px 12px;border-radius:6px"><strong>Alterar senha:</strong> ${passwordLink}</p>
    <p style="margin:8px 0 0;word-break:break-all;background:#f5f5f5;padding:8px 12px;border-radius:6px"><strong>Acessar app:</strong> ${appLink}</p>
  </div>
  <p style="font-size:12px;color:#555;margin-top:12px">Se você não solicitou este acesso, ignore este e-mail.</p>
  <p style="font-size:12px;color:#555;margin-top:8px">Dúvidas? Fale no WhatsApp: <a href="/whatsapp-cliqueaqui" target="_blank" rel="noopener noreferrer">(73) 9177‑8075</a></p>
</div>
```

---

## 5) Confirmação de e-mail (cadastro)
- Arquivo: `src/app/api/auth/register/route.ts`
- Assunto: `Confirme seu email`
- Para: `email` cadastrado
- HTML:

```html
<p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
<h1>Bem-vindo ao Katsu!</h1>
<p>Olá ${name},</p>
<p>Obrigado por se cadastrar. Por favor, confirme seu email clicando no botão abaixo:</p>
<a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px;">Confirmar Email</a>
<p>Se você não criou esta conta, por favor ignore este email.</p>
```

---

## 6) Esqueci minha senha (nova senha gerada)
- Arquivo: `src/app/api/auth/forgot-password/route.ts`
- Assunto: `Sua nova senha foi gerada`
- Para: `email` informado
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.5;">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h1>Recuperação de Senha</h1>
  <p>Geramos automaticamente uma nova senha para sua conta.</p>
  <p><strong>Nova senha:</strong> ${newPassword}</p>
  <p>Recomendamos alterá-la após o primeiro login.</p>
  <p>Se você não solicitou a recuperação de senha, ignore este e‑mail.</p>
</div>
```

---

## 7) Reset de senha por token (confirmação)
- Arquivo: `src/app/api/auth/reset-password/route.ts`
- Assunto: `Senha alterada com sucesso`
- Para: `user.email`
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.5;">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h1>Senha Alterada</h1>
  <p>Sua senha foi alterada com sucesso.</p>
  <p>Se você não realizou esta alteração, entre em contato conosco imediatamente.</p>
</div>
```

---

## 8) Troca autenticada de senha (nova senha gerada)
- Arquivo: `src/app/api/auth/change-password/route.ts`
- Assunto: `Sua nova senha foi gerada`
- Para: `session.user.email`
- HTML:

```html
<div style="font-family: Arial, sans-serif; line-height:1.5;">
  <p style="font-size:12px;color:#555;margin:0 0 8px 0">Remetente: <strong>${fromName}</strong> &lt;${fromAddress}&gt;</p>
  <h1>Sua senha foi alterada</h1>
  <p>Geramos automaticamente uma nova senha para sua conta.</p>
  <p><strong>Nova senha:</strong> ${generatedPassword}</p>
  <p>Recomendamos alterá-la após o primeiro login.</p>
  <p>Se você não fez esta solicitação, entre em contato conosco imediatamente.</p>
</div>
```

---

## Observações
- Todos os envs de SMTP precisam estar configurados (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`).
- Remetente padrão: `EMAIL_FROM_NAME` (padrão: "Katsu") e `EMAIL_FROM_ADDRESS` (padrão: `oi@k17.com.br`).
- Em `payment-webhook`, o nome do produto pode ser normalizado para “Automatizador Premium” quando detectar "gold" e "10x".
- `scripts/resendAccess.js` permite reenvio em lote/individual via CLI com o mesmo template do endpoint admin.
