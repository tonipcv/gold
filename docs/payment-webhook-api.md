# Documentação da API de Webhook de Pagamento

## Visão Geral

Esta API recebe notificações de webhook da plataforma de pagamento e processa os dados para atualizar o status de acesso dos usuários aos produtos. A API suporta a criação automática de usuários quando necessário e identifica produtos pelo ID externo (`guruProductId`).

## Endpoint

```
POST /api/payment-webhook
```

## Funcionalidades

- Recebe notificações de pagamento da plataforma
- Cria usuários automaticamente se não existirem
- Identifica produtos pelo ID externo (guruProductId)
- Atualiza registros de compra com status e datas de acesso
- Libera acesso apenas para pagamentos confirmados (status 'paid' ou 'active')
- Fornece logs detalhados para depuração

## Payload Esperado

O webhook espera receber um payload JSON com a seguinte estrutura:

```json
{
  "id": "string",
  "internal_id": "string",
  "api_token": "string",
  "webhook_type": "string",
  "last_status": "string",
  "product": {
    "id": "string",           // ID externo do produto (guruProductId)
    "marketplace_id": "string",
    "name": "string"
  },
  "subscriber": {
    "id": "string",
    "name": "string",
    "email": "string",        // Email usado para identificar ou criar o usuário
    "doc": "string",
    "phone_local_code": "string",
    "phone_number": "string"
  },
  "credit_card": {            // Opcional
    "brand": "string",
    "expiration_month": 0,
    "expiration_year": 0,
    "last_four": "string"
  },
  "current_invoice": {        // Opcional
    "status": "string",
    "period_start": "string",
    "period_end": "string"
  },
  "dates": {                  // Opcional
    "cycle_start_date": "string",
    "cycle_end_date": "string",
    "next_cycle_at": "string"
  }
}
```

## Status de Pagamento

A API processa os seguintes status de pagamento:

- **paid/active**: Pagamento confirmado, acesso liberado
- **pending/waiting_payment**: Pagamento pendente, acesso não liberado
- **cancelled/canceled**: Pagamento cancelado, acesso revogado
- **expired**: Pagamento expirado, acesso revogado

## Resposta da API

### Sucesso (200 OK)

```json
{
  "message": "Pagamento confirmado e acesso liberado",
  "status": "paid",
  "accessGranted": true,
  "product": "Nome do Produto",
  "user": "email@usuario.com"
}
```

### Produto não encontrado (404 Not Found)

```json
{
  "error": "Produto não encontrado",
  "message": "A tentativa de compra foi registrada, mas o produto não foi encontrado no sistema."
}
```

### Erro de dados (400 Bad Request)

```json
{
  "error": "ID do produto ausente ou inválido"
}
```

### Erro interno (500 Internal Server Error)

```json
{
  "error": "Erro ao processar webhook",
  "message": "Detalhes do erro"
}
```

## Configuração de Produtos

Para que a API funcione corretamente, é necessário configurar os produtos no sistema com o ID externo correspondente:

1. Cada produto deve ter um campo `guruProductId` preenchido com o ID do produto na plataforma de pagamento
2. Este ID é usado para mapear os produtos entre os sistemas

## Verificação de Status

Para verificar se a API está funcionando, você pode enviar uma requisição GET para o mesmo endpoint:

```
GET /api/payment-webhook
```

A resposta será:

```json
{
  "status": "ok",
  "message": "API de webhook de pagamento está funcionando"
}
```

## Segurança

- A API não implementa autenticação específica, confiando na segurança da URL
- Recomenda-se implementar autenticação adicional conforme necessário
- Considere usar HTTPS para proteger os dados em trânsito

## Logs e Depuração

A API registra logs detalhados para facilitar a depuração:

- Headers da requisição
- Corpo da requisição (raw e parsed)
- Status do pagamento
- Detalhes do produto e usuário
- Erros encontrados durante o processamento

## Integração com a Plataforma de Pagamento

1. Configure o webhook na plataforma de pagamento para apontar para a URL da API
2. Certifique-se de que todos os produtos tenham o `guruProductId` configurado corretamente
3. Teste o webhook com diferentes status de pagamento para verificar o comportamento
