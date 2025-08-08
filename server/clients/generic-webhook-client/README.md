# Generic Webhook Client

Cliente GTM Server-side genérico para receber webhooks de qualquer plataforma e transformá-los em eventos do GTM.

## O que faz

Este template cria um endpoint HTTP no seu container server-side do GTM que pode receber webhooks de qualquer serviço (Stripe, WooCommerce, Shopify, sistemas customizados, etc.) e transforma os dados recebidos em eventos processáveis pelo GTM.

O cliente é completamente agnóstico ao formato dos dados, aceitando qualquer payload JSON e disponibilizando-o integralmente para processamento por tags server-side.

## Campos de Configuração

### 1. Enable Debug (Opcional)
- **Tipo**: Checkbox
- **Descrição**: Ativa logs detalhados para troubleshooting
- **Padrão**: Desativado
- **Uso**: Marque apenas durante desenvolvimento/debug

### 2. Webhook Path (Obrigatório)
- **Tipo**: Text
- **Descrição**: Caminho URL onde o webhook será recebido
- **Exemplo**: `/webhook`, `/stripe`, `/woocommerce`
- **Padrão**: `/webhook`
- **Nota**: O path deve começar com `/`

### 3. Webhook Secret Key (Opcional)
- **Tipo**: Text
- **Descrição**: Chave secreta para autenticação do webhook
- **Como funciona**: Será comparada com headers `Authorization`, `X-Webhook-Secret` ou `X-API-Key`
- **Exemplo**: `sk_live_abc123...`

### 4. Enable Security Validation (Opcional)
- **Tipo**: Checkbox
- **Descrição**: Exige header de autenticação para processar webhooks
- **Padrão**: Desativado
- **Nota**: Quando ativado, requer que `Webhook Secret Key` esteja configurado

## Como Usar

### Pré-requisitos
- Container Server-side do GTM configurado e funcionando
- URL do servidor GTM acessível publicamente
- Serviço externo capaz de enviar webhooks

### Instalação
1. Importe o arquivo `template.tpl` no seu container **server-side** GTM
2. Vá em **Clients** → **New**
3. Escolha o template "Generic Webhook Client"
4. Configure os campos necessários
5. Salve e publique o container

### Configuração Básica

#### Exemplo 1: Webhook sem autenticação
```
Enable Debug: [ ] Desativado
Webhook Path: /webhook
Webhook Secret Key: (vazio)
Enable Security: [ ] Desativado
```

#### Exemplo 2: Webhook com autenticação
```
Enable Debug: [ ] Desativado
Webhook Path: /stripe-webhook
Webhook Secret Key: whsec_abc123xyz...
Enable Security: [✓] Ativado
```

### URL do Webhook

Após configurar, seu webhook estará disponível em:
```
https://seu-servidor-gtm.com/webhook-path
```

Exemplo:
```
https://gtm.suaempresa.com.br/webhook
```

## Exemplos de Implementação

### Exemplo 1: Recebendo webhook do Stripe

**Configuração do Cliente:**
```
Webhook Path: /stripe
Webhook Secret Key: whsec_test_...
Enable Security: [✓] Ativado
```

**Payload recebido:**
```json
{
  "id": "evt_1234",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "amount": 2000,
      "currency": "brl",
      "customer": "cus_abc123"
    }
  }
}
```

**Evento criado no GTM:**
```javascript
{
  "event_name": "webhook_received",
  "webhook_timestamp": 1234567890,
  "webhook_path": "/stripe",
  "webhook_data": {
    // Todo o payload do Stripe
  }
}
```

### Exemplo 2: Webhook do WooCommerce

**Configuração do Cliente:**
```
Webhook Path: /woocommerce
Webhook Secret Key: wc_secret_key_123
Enable Security: [✓] Ativado
```

**Como processar com uma Tag:**
```javascript
// Em uma tag server-side
const webhookData = event.webhook_data;

if (webhookData.status === 'completed') {
  // Processar pedido completo
  const orderValue = webhookData.total;
  const customerId = webhookData.customer_id;
  // ... enviar para GA4, Facebook, etc
}
```

### Exemplo 3: Webhook customizado

**Configuração do Cliente:**
```
Webhook Path: /custom-system
Enable Security: [ ] Desativado
```

**Trigger para processar:**
```javascript
Trigger Type: Custom Event
Event Name: webhook_received
Additional Conditions:
  - webhook_path equals /custom-system
```

## Requisitos Técnicos

### Permissões do Template:
- Read Event Metadata
- Read Request (headers, body, path)
- Return Response
- Logging (para debug)
- Access Response (headers, status)
- Run Container

### Headers Aceitos para Autenticação:
- `Authorization`
- `X-Webhook-Secret`
- `X-API-Key`

### Respostas HTTP:
- **200**: Webhook processado com sucesso
- **400**: Corpo da requisição vazio ou JSON inválido
- **401**: Autenticação falhou (quando security ativado)

## Debug e Troubleshooting

### Como Debugar:
1. Ative "Enable Debug" no cliente
2. Use o Preview Mode do GTM Server-side
3. Envie um webhook de teste
4. Verifique os logs no console do servidor
5. Confirme que o evento `webhook_received` foi criado

### Problemas Comuns:

**Webhook não chega ao GTM:**
- Verifique se a URL está correta
- Confirme que o servidor GTM está acessível publicamente
- Teste com curl: `curl -X POST https://seu-gtm.com/webhook -d '{"test":true}'`

**Erro 401 - Unauthorized:**
- Verifique se o secret key está correto
- Confirme que o header de autenticação está sendo enviado
- Teste com: `curl -H "X-Webhook-Secret: sua_key" ...`

**Erro 400 - Bad Request:**
- Verifique se o body está em formato JSON válido
- Confirme que o Content-Type é `application/json`

**Evento não dispara tags:**
- Verifique o trigger da sua tag
- Confirme que está usando `event_name equals webhook_received`
- Verifique condições adicionais no trigger

### Testando com curl:

```bash
# Teste simples
curl -X POST https://seu-gtm.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true, "value": 100}'

# Teste com autenticação
curl -X POST https://seu-gtm.com/webhook \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: sua_secret_key" \
  -d '{"test": true, "value": 100}'
```

## Boas Práticas

1. **Sempre use autenticação** em produção para evitar spam
2. **Valide os dados** recebidos antes de processar
3. **Use paths descritivos** como `/stripe`, `/shopify` ao invés de `/webhook`
4. **Implemente retry logic** no serviço que envia o webhook
5. **Monitore erros** através dos logs do servidor GTM
6. **Documente** os webhooks configurados e seus formatos
7. **Teste exaustivamente** antes de ir para produção

## Estrutura do Evento

O cliente cria um evento com a seguinte estrutura:

```javascript
{
  "event_name": "webhook_received",     // Nome fixo do evento
  "webhook_timestamp": 1234567890000,   // Timestamp em ms
  "webhook_path": "/webhook",           // Path configurado
  "webhook_data": {                     // Payload completo
    // ... todos os dados do webhook
  }
}
```

## Processamento com Tags

Para processar o webhook, crie uma tag server-side com:

1. **Trigger:**
   - Event Name: `webhook_received`
   - Condições adicionais baseadas no path ou dados

2. **Variáveis úteis:**
   ```javascript
   // Variável: Webhook Data
   {{Event Data.webhook_data}}
   
   // Variável: Webhook Path
   {{Event Data.webhook_path}}
   
   // Variável: Specific Field
   {{Event Data.webhook_data.field_name}}
   ```

3. **Exemplo de Tag para GA4:**
   ```javascript
   Event Name: purchase
   Value: {{Event Data.webhook_data.amount}}
   Currency: {{Event Data.webhook_data.currency}}
   Transaction ID: {{Event Data.webhook_data.id}}
   ```

## Links Úteis

- [GTM Server-side Documentation](https://developers.google.com/tag-platform/tag-manager/server-side)
- [Webhook Best Practices](https://webhook.site/blog/webhook-best-practices)
- [Métricas Boss](https://metricasboss.com.br)

---

**Desenvolvido por [Métricas Boss](https://metricasboss.com.br)**  
*Especialistas em GTM e Analytics para E-commerce*