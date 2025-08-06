# Iframe Tracker for Adsense Events

Template GTM para rastreamento de eventos em iframes, especialmente otimizado para Google Adsense.

## 📋 O que faz

Este template injeta um script JavaScript que monitora iframes na página (como anúncios do Adsense) e captura eventos de visibilidade e interação, permitindo medir o desempenho e engajamento com elementos embutidos.

## ⚙️ Campos de Configuração

Este template não possui campos configuráveis. Ele funciona automaticamente após ser instalado e acionado.

### Configuração Interna:
- **Script URL**: `https://gtm-templates.s3.us-east-1.amazonaws.com/iframe-tracker-bundle.js`
- **Debug**: Logging automático em modo preview do GTM

## 🚀 Como Usar

### 1. Instalação
1. Importe o arquivo `template.tpl` no seu container GTM
2. Vá em **Tags** → **New**
3. Escolha o template "Iframe Tracker for Adsense Events"
4. Nomeie a tag (ex: "Adsense - Iframe Tracker")

### 2. Configuração do Acionador
Crie um acionador do tipo:
- **Trigger Type**: Page View - Window Loaded
- **This trigger fires on**: All Pages (ou páginas específicas com Adsense)

> ⚠️ **Importante**: Use "Window Loaded" para garantir que todos os iframes estejam carregados antes do rastreamento iniciar.

### 3. Eventos Capturados

O template monitora e envia eventos para o dataLayer:

```javascript
// Quando um iframe entra na viewport (visível)
{
  event: 'iframe_visible',
  iframe_src: 'URL_DO_IFRAME',
  iframe_id: 'ID_DO_IFRAME',
  iframe_class: 'CLASSES_DO_IFRAME',
  visibility_time: 1500 // tempo em ms
}

// Quando um iframe é clicado
{
  event: 'iframe_click',
  iframe_src: 'URL_DO_IFRAME',
  iframe_id: 'ID_DO_IFRAME',
  iframe_class: 'CLASSES_DO_IFRAME'
}

// Quando um iframe sai da viewport
{
  event: 'iframe_hidden',
  iframe_src: 'URL_DO_IFRAME',
  iframe_id: 'ID_DO_IFRAME',
  total_visible_time: 5000 // tempo total visível em ms
}
```

### 4. Configuração de Tags de Rastreamento

#### Para Google Analytics 4:
1. Crie uma nova tag GA4 Event
2. **Event Name**: `{{Event}}` ou nome customizado
3. **Event Parameters**:
   - `iframe_source`: `{{iframe_src}}`
   - `visibility_duration`: `{{visibility_time}}`
4. **Trigger**: Custom Event → `iframe_visible` (ou outro evento desejado)

#### Para Google Ads (Conversões):
1. Crie tag de Conversão do Google Ads
2. Use trigger customizado baseado em tempo de visibilidade mínimo
3. Exemplo: iframe_visible com condição visibility_time > 3000

## 🎯 Casos de Uso

### 1. Monitoramento de Adsense
- Medir viewability de anúncios
- Rastrear cliques em anúncios (quando permitido)
- Analisar posicionamento e performance

### 2. Embeds de Vídeo
- Rastrear visualizações de vídeos embutidos
- Medir tempo de exposição
- Identificar vídeos mais engajantes

### 3. Widgets de Terceiros
- Monitorar carregamento de widgets
- Medir interações com conteúdo externo
- Validar integrações

## 🔧 Requisitos Técnicos

### Permissões Necessárias:
- ✅ Injeção de scripts externos
- ✅ Logging (modo debug)
- ✅ Acesso ao dataLayer (via script injetado)

### Compatibilidade:
- Funciona com qualquer iframe acessível no DOM
- Suporta múltiplos iframes na mesma página
- Compatible com lazy loading

## 🐛 Debug e Troubleshooting

### Como Debugar:
1. Ative o Preview Mode do GTM
2. Abra o Console do navegador
3. Procure por logs com prefixo `[Iframe Tracker]`
4. Verifique eventos no painel Summary do GTM

### Problemas Comuns:

**Iframes não são rastreados:**
- Verifique se o trigger está configurado para Window Loaded
- Confirme que o iframe está no DOM quando o script roda
- Alguns iframes com sandbox podem bloquear rastreamento

**Eventos duplicados:**
- Verifique se não há múltiplas instâncias da tag
- Use deduplicação baseada em iframe_id se necessário

## ⚠️ Considerações de Privacidade

- Este template NÃO coleta dados pessoais
- Respeita políticas de Same-Origin
- Não interfere no conteúdo dos iframes
- Compatível com políticas do Google Adsense

## 📦 Build e Deploy (Desenvolvimento)

Para atualizar o script JavaScript:

```bash
cd client/tags/iframe-tracker
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

- [Google Adsense](https://www.google.com/adsense/)
- [Documentação GTM](https://support.google.com/tagmanager)
- [Métricas Boss](https://metricasboss.com.br)