# RD Station Conversion API

Template GTM Server-side para envio de conversões para a API da RD Station.

## 📋 O que faz

Este template permite enviar eventos de conversão diretamente para a RD Station através do container server-side do GTM, garantindo maior confiabilidade e controle sobre os dados enviados. Ideal para rastreamento de conversões importantes como leads, vendas e eventos customizados.

## ⚙️ Campos de Configuração

### 1. API Key (Obrigatório)
- **Tipo**: Texto
- **Descrição**: Chave de API da sua conta RD Station
- **Como obter**: Acesse RD Station → Configurações → Integrações → API → Gerar nova chave

### 2. Conversion Identifier (Obrigatório)
- **Tipo**: Texto
- **Descrição**: Identificador único da conversão
- **Exemplos**: 
  - `lead-form-contato`
  - `purchase-completed`
  - `newsletter-signup`
- **Dica**: Use identificadores descritivos e únicos para cada tipo de conversão

### 3. Fields (Opcional)
- **Tipo**: Tabela (Field Name | Field Value)
- **Descrição**: Campos adicionais para enviar com a conversão
- **Campos comuns**:
  - `email`: Email do lead
  - `name`: Nome completo
  - `phone`: Telefone
  - `company`: Empresa
  - `job_title`: Cargo
- **Campos personalizados**: Prefixe com `cf_` (ex: `cf_origem`, `cf_produto`)

### 4. Enable Logs (Opcional)
- **Tipo**: Checkbox
- **Descrição**: Ativa logs detalhados no console
- **Uso**: Marque apenas para debug/troubleshooting

## 🚀 Como Usar

### 1. Pré-requisitos
- Container Server-side do GTM configurado
- Conta RD Station com API habilitada
- API Key gerada na RD Station

### 2. Instalação
1. Importe o arquivo `template.tpl` no seu container **server-side** GTM
2. Vá em **Tags** → **New**
3. Escolha o template "RD Station Conversion API"
4. Nomeie a tag (ex: "RD Station - Lead Form")

### 3. Configuração Básica

```javascript
// Exemplo de configuração para formulário de contato
API Key: sua_api_key_aqui
Conversion Identifier: form-contato
Fields:
  email     → {{email}}
  name      → {{nome}}
  phone     → {{telefone}}
  cf_origem → {{utm_source}}
```

### 4. Configuração do Acionador

**Para eventos GA4 (recomendado):**
```javascript
Trigger Type: Custom Event
Event Name: generate_lead
Additional Conditions: 
  - Event Name equals generate_lead
  - email is not empty
```

**Para requisições HTTP diretas:**
```javascript
Trigger Type: Custom Event
Event Name: /conversao-rdstation
Path: equals /conversao-rdstation
```

## 📊 Exemplos de Implementação

### Exemplo 1: Lead de Formulário
```javascript
// Configuração da Tag
API Key: abc123...
Conversion Identifier: lead-form-home
Fields:
  email            → {{event.email}}
  name             → {{event.name}}
  phone            → {{event.phone}}
  cf_utm_source    → {{event.utm_source}}
  cf_utm_medium    → {{event.utm_medium}}
  cf_utm_campaign  → {{event.utm_campaign}}
```

### Exemplo 2: Venda Completa
```javascript
// Configuração da Tag
API Key: abc123...
Conversion Identifier: purchase-completed
Fields:
  email           → {{event.email}}
  name            → {{event.name}}
  cf_valor        → {{event.value}}
  cf_produto      → {{event.items.0.item_name}}
  cf_payment_type → {{event.payment_type}}
```

### Exemplo 3: Download de Material
```javascript
// Configuração da Tag
API Key: abc123...
Conversion Identifier: material-download
Fields:
  email          → {{event.email}}
  cf_material    → {{event.content_name}}
  cf_categoria   → {{event.content_category}}
```

## 🔧 Requisitos Técnicos

### Permissões do Template:
- ✅ Logging (para debug)
- ✅ Read Event Data (leitura de dados do evento)
- ✅ Send HTTP (envio para api.rd.services)

### Endpoint da API:
```
POST https://api.rd.services/platform/conversions
```

### Estrutura do Payload:
```json
{
  "event_type": "CONVERSION",
  "event_family": "CDP",
  "payload": {
    "conversion_identifier": "seu-identificador",
    "email": "usuario@exemplo.com",
    "name": "Nome do Lead",
    "cf_campo_custom": "valor"
  }
}
```

## 🐛 Debug e Troubleshooting

### Como Debugar:
1. Ative "Enable Logs" na configuração da tag
2. Use o Preview do GTM Server-side
3. Verifique os logs no console do servidor
4. Confirme no RD Station em Contatos → Atividades

### Códigos de Resposta:
- **200-299**: Sucesso - conversão registrada
- **400**: Erro de validação - verifique campos obrigatórios
- **401**: API Key inválida
- **422**: Dados inválidos - verifique formato dos campos
- **500**: Erro no servidor RD Station

### Problemas Comuns:

**Conversão não aparece no RD Station:**
- Verifique se a API Key está correta
- Confirme que o email é válido
- Verifique se campos custom (cf_) existem no RD Station

**Erro 422 - Unprocessable Entity:**
- Email inválido ou faltando
- Campo personalizado não existe na conta
- Formato de dados incorreto

**Tag não dispara:**
- Verifique o trigger no Preview Mode
- Confirme que os dados do evento estão disponíveis
- Teste com Enable Logs ativado

## ⚠️ Boas Práticas

1. **Sempre valide o email** antes de enviar
2. **Use identificadores únicos** para cada tipo de conversão
3. **Crie campos personalizados** no RD Station antes de usar
4. **Desative logs** em produção para melhor performance
5. **Implemente validação** no trigger para evitar envios desnecessários
6. **Use variáveis** do GTM para reutilizar valores

## 🔗 Links Úteis

- [Documentação API RD Station](https://developers.rdstation.com/reference/conversao)
- [RD Station - Campos Personalizados](https://ajuda.rdstation.com.br/hc/pt-br/articles/360045263731)
- [GTM Server-side Documentation](https://developers.google.com/tag-platform/tag-manager/server-side)
- [Métricas Boss](https://metricasboss.com.br)