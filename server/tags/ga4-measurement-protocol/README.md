# GA4 Measurement Protocol

Tag server-side para envio de eventos diretamente ao Google Analytics 4 via Measurement Protocol. Otimizada para integração com webhooks e rastreamento server-side.

## 📋 O que faz

Este template permite enviar eventos para o Google Analytics 4 usando o [Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4), eliminando a necessidade de JavaScript no navegador. Ideal para:

- **Webhooks**: Receba eventos de plataformas externas (Stripe, Shopify, WooCommerce)
- **Server-side tracking**: Rastreie eventos que acontecem no servidor
- **Integrações customizadas**: Envie dados de qualquer sistema para GA4
- **Eventos offline**: Registre conversões e eventos que ocorrem fora do navegador

## ✨ Diferenciais desta Versão

✅ **Busca recursiva inteligente**: Encontra campos em qualquer nível de nested objects
✅ **Filtragem automática**: Remove objetos nested e metadata de webhook
✅ **Auto-detecção inteligente**: Client ID, User ID e Event Name detectados automaticamente
✅ **Logs detalhados**: Debug completo para troubleshooting
✅ **Limpeza automática**: Remove campos null/undefined automaticamente
✅ **Validação de dados**: Verifica campos obrigatórios antes de enviar
✅ **Suporte a e-commerce**: Limpeza automática de items
✅ **Endpoint de debug**: Teste eventos sem impactar relatórios
✅ **Webhook-agnóstico**: Funciona com qualquer estrutura de webhook
✅ **Documentação completa**: Interface em português e inglês
✅ **Brand Métricas Boss**: Qualidade garantida

## 🔧 Campos de Configuração

### 1. Enable Debug Logs (Opcional)
- **Tipo**: Checkbox
- **Descrição**: Ativa logs detalhados no console do servidor GTM
- **Uso**: Marque para troubleshooting e desenvolvimento
- **⚠️ Atenção**: Desative em produção para melhor performance

### 2. Measurement ID (Obrigatório)
- **Tipo**: Text
- **Formato**: `G-XXXXXXXXX`
- **Descrição**: ID da propriedade do Google Analytics 4
- **Como obter**:
  1. Acesse o [GA4](https://analytics.google.com/)
  2. Vá em **Admin** > **Fluxos de Dados**
  3. Selecione seu fluxo de dados
  4. Copie o **ID de medição**

### 3. API Secret (Obrigatório)
- **Tipo**: Text
- **Descrição**: Chave secreta para autenticação da API
- **Como criar**:
  1. No GA4, vá em **Admin** > **Fluxos de Dados**
  2. Selecione seu fluxo
  3. Clique em **Segredos de API do Measurement Protocol**
  4. Clique em **Criar**
  5. Copie o valor da chave secreta

### 4. Use Debug Endpoint (Opcional)
- **Tipo**: Checkbox
- **Descrição**: Envia eventos para o endpoint de validação do GA4
- **⚠️ Importante**: Eventos enviados para debug **NÃO** aparecem nos relatórios
- **Uso**: Ative para testar a estrutura dos eventos antes de ir para produção

### 5. Client & User Identifiers

#### Client ID Field Name
- **Padrão**: `client_id`
- **Descrição**: Nome do campo no evento que contém o client_id
- **Exemplo**: Se seu webhook envia `cid`, altere para `cid`
- **🔍 Busca Recursiva**: Se o campo não for encontrado no nível raiz, o template automaticamente busca em objetos nested até 10 níveis de profundidade
- **Exemplo nested**:
  ```json
  {
    "data": {
      "client_id": "123.456"
    }
  }
  ```
  ✅ O template encontra automaticamente em `data.client_id`

#### Manual Client ID (Opcional)
- **Descrição**: Define o client_id manualmente
- **Uso**: Use quando não houver client_id no evento
- **⚠️ Nota**: Sobrescreve a detecção automática

#### User ID Field Name (Opcional)
- **Padrão**: `user_id`
- **Descrição**: Nome do campo que contém o user_id
- **Uso**: Para rastreamento cross-device e relatórios User-ID

### 6. Event Configuration

#### Event Name Field
- **Padrão**: `event_name`
- **Descrição**: Campo que contém o nome do evento
- **Exemplo**: `purchase`, `lead`, `sign_up`

#### Manual Event Name (Opcional)
- **Descrição**: Define o nome do evento manualmente
- **Uso**: Quando todos os eventos devem ter o mesmo nome
- **⚠️ Nota**: Sobrescreve a detecção automática

#### Session ID Field Name
- **Padrão**: `session_id`
- **Descrição**: Campo que contém o ID da sessão
- **Uso**: Ajuda a agrupar eventos na mesma sessão

### 7. Event Parameters

#### Forward All Event Parameters
- **Padrão**: ✅ Ativado
- **Descrição**: Encaminha automaticamente todos os parâmetros do evento
- **⚠️ Filtragem Automática**:
  - **Campos internos removidos**: `event_name`, `client_id`, `webhook_data`, `webhook_path`, etc.
  - **Objetos nested ignorados**: Apenas valores primitivos (string, number, boolean) são enviados
  - **Exceção**: Array `items` para e-commerce é preservado
- **Por quê?**: O GA4 MP não aceita objetos nested na URL, eles virariam `[object Object]`

#### Parameters to Skip
- **Descrição**: Lista de parâmetros que NÃO devem ser enviados ao GA4
- **Exemplo**: `internal_id`, `temp_data`, `debug_info`

#### Custom Parameters to Add
- **Descrição**: Adiciona ou sobrescreve parâmetros customizados
- **Uso**: Para enriquecer dados ou corrigir valores
- **Formato**:
  - **Name**: `campaign_source`
  - **Value**: `{{Campaign Source}}`

### 8. User Properties

#### User Properties
- **Descrição**: Propriedades do usuário a serem enviadas
- **Formato GA4**: Automaticamente convertido para `{value: "..."}`
- **Exemplo**:
  - **Name**: `customer_lifetime_value`
  - **Value**: `1500.00`

## 🔍 Busca Recursiva em Webhooks Nested

Uma das principais vantagens deste template é a **busca recursiva automática** de campos. Isso significa que você **não precisa se preocupar** com a estrutura exata do webhook.

### Como Funciona

O template usa a seguinte estratégia de busca:

1. **Primeiro**: Busca no nível raiz do evento
2. **Depois**: Se não encontrar, busca recursivamente em todos os objetos nested (até 10 níveis)
3. **Retorna**: O primeiro valor encontrado

### Exemplos Práticos

#### Webhook com estrutura simples (root level)
```json
{
  "client_id": "123.456",
  "event_name": "purchase",
  "value": 100
}
```
✅ Encontra `client_id` no root

#### Webhook com estrutura nested (Stripe style)
```json
{
  "id": "evt_123",
  "type": "checkout.session.completed",
  "data": {
    "client_id": "123.456",
    "session_id": "789.012",
    "event_name": "purchase"
  }
}
```
✅ Encontra `client_id` em `data.client_id`

#### Webhook com estrutura profundamente nested
```json
{
  "webhook_data": {
    "payload": {
      "user": {
        "client_id": "123.456"
      }
    }
  }
}
```
✅ Encontra `client_id` em `webhook_data.payload.user.client_id`

### Campos com Busca Recursiva

Os seguintes campos suportam busca recursiva:
- ✅ `client_id`
- ✅ `user_id`
- ✅ `event_name`
- ✅ `session_id`

### Configuração Zero

Na maioria dos casos, você **não precisa configurar nada**:
- Mantenha os nomes de campo padrão (`client_id`, `event_name`, etc.)
- O template encontra automaticamente, independente da estrutura
- Configure manualmente apenas se os campos tiverem nomes diferentes

### ⚠️ Importante: Busca vs. Forwarding

- **Busca recursiva**: Usada para encontrar `client_id`, `user_id`, `event_name`, `session_id` em qualquer nível
- **Forwarding de parâmetros**: Apenas valores primitivos (string, number, boolean) do **root level** são enviados ao GA4
- **Objetos nested**: Não são enviados como parâmetros (virariam `[object Object]`)
- **Metadata de webhook**: Campos como `webhook_data`, `webhook_path` são automaticamente filtrados

## 📊 Como Usar

### Pré-requisitos

1. ✅ Container Server-side do GTM configurado
2. ✅ Propriedade do GA4 criada
3. ✅ API Secret gerado no GA4
4. ✅ Client genérico (webhook client) configurado

### Instalação

1. No GTM Server Container, vá em **Templates**
2. Clique em **New** na seção Tags
3. Clique nos **3 pontos** > **Import**
4. Selecione o arquivo `template.tpl`
5. Salve o template

### Configuração Básica

#### Exemplo 1: Webhook de Compra (Stripe)

**Cliente (Webhook Client)**:
```
Webhook Path: /stripe
```

**Tag GA4 MP**:
```
Measurement ID: G-ABC123XYZ
API Secret: abcd1234efgh5678
Client ID Field Name: client_id
Event Name Field: event_name
✓ Forward All Event Parameters
```

**Trigger**:
```
Event Name: webhook_received
webhook_path equals /stripe
```

**Payload do Stripe**:
```json
{
  "event_name": "purchase",
  "client_id": "123456.7890",
  "session_id": "1234567890",
  "transaction_id": "stripe_ch_abc123",
  "value": 199.90,
  "currency": "BRL",
  "items": [
    {
      "item_id": "SKU123",
      "item_name": "Produto Premium",
      "price": 199.90,
      "quantity": 1
    }
  ]
}
```

#### Exemplo 2: Lead de Formulário

**Payload do Webhook**:
```json
{
  "event_name": "generate_lead",
  "client_id": "GA1.1.123456789.1234567890",
  "user_id": "user_abc123",
  "email": "cliente@exemplo.com",
  "lead_source": "landing_page",
  "lead_value": 50.00
}
```

**Configuração**:
```
✓ Forward All Event Parameters
Parameters to Skip:
  - email (PII - não enviar para GA4)
```

#### Exemplo 3: Conversão Offline

**Tag GA4 MP**:
```
Measurement ID: G-ABC123XYZ
API Secret: xxx
Manual Client ID: {{Client ID Variable}}
Manual Event Name: offline_conversion
✓ Use Debug Endpoint (para testar)
```

**Custom Parameters**:
```
Name: conversion_type | Value: phone_call
Name: call_duration | Value: {{Call Duration}}
Name: conversion_value | Value: {{Call Value}}
```

## 🧪 Testando o Template

### Usando Debug Endpoint

1. ✅ Marque **Use Debug Endpoint**
2. ✅ Marque **Enable Debug Logs**
3. Envie um evento de teste
4. Verifique os logs do GTM Server
5. Resposta de sucesso:
```json
{
  "validationMessages": []
}
```

### Debug no GA4

1. Acesse **Admin** > **DebugView** no GA4
2. Envie eventos com o debug endpoint ativado
3. Os eventos aparecerão no DebugView em tempo real
4. ⚠️ Lembre: eventos de debug **NÃO** vão para relatórios

### Verificando Eventos em Produção

1. Desmarque **Use Debug Endpoint**
2. Envie eventos reais
3. Aguarde 24-48h para processamento
4. Verifique em **Relatórios** > **Eventos**

## 🔍 Troubleshooting

### Problema: Events Not Appearing in GA4

**Sintomas**:
- Tag dispara com sucesso
- Mas eventos não aparecem no GA4

**Soluções**:
1. ✅ Verifique se o Measurement ID está correto
2. ✅ Confirme que o API Secret está válido
3. ✅ Aguarde até 48h (processamento do GA4)
4. ✅ Use o Debug Endpoint para validar estrutura
5. ✅ Verifique se `client_id` está presente

### Problema: Error 403 (Forbidden)

**Causa**: API Secret inválido ou expirado

**Solução**:
1. Gere um novo API Secret no GA4
2. Atualize a tag com o novo valor
3. Teste novamente

### Problema: Missing client_id Error

**Sintomas**: Logs mostram "ERROR: client_id not found"

**Soluções**:
1. ✅ Verifique o campo **Client ID Field Name**
2. ✅ Use **Manual Client ID** se necessário
3. ✅ Confirme que o webhook está enviando o client_id

**Debug**:
```javascript
// Ative Debug Logs e verifique:
log('Received event data:', eventData);
// Procure pelo campo client_id
```

### Problema: Wrong Event Structure

**Sintomas**: Eventos chegam mas com dados incorretos

**Soluções**:
1. ✅ Use **Debug Endpoint** para validar estrutura
2. ✅ Ative **Enable Debug Logs** para ver payload final
3. ✅ Verifique **Parameters to Skip**
4. ✅ Confirme mapeamento de campos

## 📚 Referências da Documentação Oficial

### Measurement Protocol GA4
- [Visão Geral](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [Referência da API](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference)
- [Eventos Recomendados](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events)
- [Changelog](https://developers.google.com/analytics/devguides/collection/protocol/ga4/changelog)

### Eventos E-commerce
- [purchase](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#purchase)
- [add_to_cart](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#add_to_cart)
- [begin_checkout](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events#begin_checkout)

### Estrutura de Dados
- [Items Array](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference#items)
- [User Properties](https://developers.google.com/analytics/devguides/collection/protocol/ga4/user-properties)

## ⚠️ Limitações e Boas Práticas

### Limitações do GA4 Measurement Protocol

❌ **Não suportado**:
- Coleta automática de page_view
- Enhanced Measurement (scroll, outbound clicks, etc.)
- Atribuição automática de tráfego
- Remarketing automático

✅ **Suportado**:
- Todos os eventos customizados
- Eventos de e-commerce
- User properties
- Conversões e goals

### Boas Práticas

1. **Client ID**:
   - Use o mesmo client_id do GTM web quando possível
   - Formato: `GA1.1.random.timestamp`
   - Nunca use PII (email, telefone) como client_id

2. **User ID**:
   - Somente envie se tiver View User-ID habilitada
   - Use após login/identificação do usuário
   - Nunca use PII diretamente

3. **Event Parameters**:
   - Limite: 25 parâmetros por evento
   - Tamanho máximo: 100 caracteres por valor
   - Use snake_case para nomes

4. **User Properties**:
   - Limite: 25 propriedades por usuário
   - Atualizam-se automaticamente

5. **Performance**:
   - Desative debug logs em produção
   - Use batching quando possível
   - Timeout: 5 segundos (configurável)

## 🔐 Segurança

### API Secret

⚠️ **NUNCA** exponha seu API Secret publicamente:
- ✅ Armazene apenas no GTM Server
- ✅ Use variáveis de ambiente quando possível
- ✅ Rotacione periodicamente
- ❌ Não commit em repositórios públicos
- ❌ Não envie via URL parameters

### PII (Personally Identifiable Information)

❌ **Não envie para GA4**:
- Email
- Telefone
- CPF/CNPJ
- Endereço completo
- Nome completo

✅ **Use Parameters to Skip** para remover PII automaticamente

## 📞 Suporte

### Links Úteis
- [Documentação Métricas Boss](https://metricasboss.com.br)
- [GA4 Measurement Protocol Docs](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
- [GTM Server-side Docs](https://developers.google.com/tag-platform/tag-manager/server-side)

### Issues Conhecidos
Verifique o [changelog do GA4 MP](https://developers.google.com/analytics/devguides/collection/protocol/ga4/changelog) para updates

---

**Desenvolvido por [Métricas Boss](https://metricasboss.com.br)**
*Especialistas em GTM e Analytics para E-commerce*

**Versão**: 1.0.0
**Última atualização**: Janeiro 2025
