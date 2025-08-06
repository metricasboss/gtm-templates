# Behiivee Iframe Tracker

Template GTM para rastreamento de eventos em embeds/formulários do Behiivee.

## 📋 O que faz

Este template injeta um script JavaScript que monitora iframes do Behiivee e captura eventos de interação com formulários de newsletter, enviando eventos para o dataLayer do GTM.

## ⚙️ Campos de Configuração

Este template não possui campos configuráveis. Ele funciona automaticamente após ser instalado e acionado.

### Configuração Interna (não editável pelo usuário):
- **originDomain**: Domínio origem dos embeds (`https://embeds.beehiiv.com`)
- **scriptUrl**: URL do script JavaScript hospedado na AWS S3
- **shouldLog**: Flag para debug (desativado por padrão)

## 🚀 Como Usar

### 1. Instalação
1. Importe o arquivo `template.tpl` no seu container GTM
2. Vá em **Tags** → **New**
3. Escolha o template "Behiivee Embed Tracking"
4. Nomeie a tag (ex: "Behiivee - Event Listener")

### 2. Configuração do Acionador
Crie um acionador do tipo:
- **Trigger Type**: Page View - DOM Ready
- **This trigger fires on**: All Pages (ou páginas específicas com embeds Behiivee)

### 3. Eventos Capturados
O template envia os seguintes eventos para o dataLayer:

```javascript
// Quando o formulário é visualizado
{
  event: 'behiivee_form_view',
  behiivee_publication_id: 'ID_DA_PUBLICACAO',
  behiivee_form_type: 'TIPO_DO_FORM'
}

// Quando o formulário é enviado
{
  event: 'behiivee_form_submit',
  behiivee_publication_id: 'ID_DA_PUBLICACAO',
  behiivee_form_type: 'TIPO_DO_FORM',
  behiivee_email: 'email@exemplo.com'
}
```

### 4. Configuração de Tags de Conversão

Para rastrear no GA4, crie uma tag com:
- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: `{{Event}}` (ou nome customizado)
- **Trigger**: Custom Event → `behiivee_form_submit`

## 🔧 Requisitos Técnicos

### Permissões Necessárias:
- ✅ Acesso ao dataLayer (leitura/escrita)
- ✅ Injeção de scripts externos
- ✅ Logging (apenas em modo debug)

### Script Externo:
O template injeta automaticamente o script de:
```
https://gtm-templates.s3.us-east-1.amazonaws.com/behiivee-iframe-tracker.js
```

## 🐛 Debug

Para debugar o funcionamento:
1. Ative o Preview Mode do GTM
2. Abra o console do navegador
3. Procure por mensagens iniciadas com "Behiivee Event Listener:"
4. Verifique os eventos no painel do GTM Preview

## ⚠️ Observações

- O template funciona apenas com embeds oficiais do Behiivee
- Requer que o embed esteja em um iframe com origem `embeds.beehiiv.com`
- Os eventos são disparados via postMessage API
- O script é carregado com cache buster para evitar problemas de cache

## 📦 Build e Deploy (Desenvolvimento)

Para atualizar o script JavaScript:

```bash
cd client/tags/behiivee-iframe-tracker
pnpm install
pnpm run build
pnpm run deploy
```

Configuração do `.env`:
```
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=seu_secret
AWS_REGION=us-east-1
S3_BUCKET=gtm-templates
```

## 🔗 Links Úteis

- [Behiivee](https://www.beehiiv.com/)
- [Documentação GTM](https://support.google.com/tagmanager)
- [Métricas Boss](https://metricasboss.com.br)