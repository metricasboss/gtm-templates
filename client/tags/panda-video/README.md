# Panda Video Event Listener

Template GTM para rastreamento de eventos do player Panda Video.

## 📋 O que faz

Este template injeta um script JavaScript que captura automaticamente todos os eventos disparados pelo player do Panda Video, incluindo reprodução, pausa, progresso e conclusão de vídeos, enviando-os para o dataLayer do GTM.

## ⚙️ Campos de Configuração

Este template não possui campos configuráveis. Ele funciona automaticamente após ser instalado e acionado.

### Configuração Interna:
- **Script URL**: `https://gtm-templates.s3.us-east-1.amazonaws.com/bundle.js`
- **Debug**: Logging automático em modo preview do GTM

## 🚀 Como Usar

### 1. Instalação
1. Importe o arquivo `template.tpl` no seu container GTM
2. Vá em **Tags** → **New**
3. Escolha o template "Listener for events from Panda Videos"
4. Nomeie a tag (ex: "Panda Video - Event Listener")

### 2. Configuração do Acionador
Crie um acionador do tipo:
- **Trigger Type**: Page View - DOM Ready
- **This trigger fires on**: All Pages (ou páginas específicas com vídeos Panda)

> ⚠️ **Importante**: O script detecta automaticamente quando o player Panda é carregado na página.

### 3. Eventos Capturados

O template captura e envia os seguintes eventos para o dataLayer:

```javascript
// Quando o player é carregado
{
  event: 'panda_video_ready',
  video_id: 'ID_DO_VIDEO',
  video_title: 'TITULO_DO_VIDEO',
  video_duration: 180 // duração em segundos
}

// Quando o vídeo começa a tocar
{
  event: 'panda_video_play',
  video_id: 'ID_DO_VIDEO',
  video_title: 'TITULO_DO_VIDEO',
  video_current_time: 0
}

// Quando o vídeo é pausado
{
  event: 'panda_video_pause',
  video_id: 'ID_DO_VIDEO',
  video_title: 'TITULO_DO_VIDEO',
  video_current_time: 45,
  video_percent: 25
}

// Marcos de progresso (25%, 50%, 75%)
{
  event: 'panda_video_progress',
  video_id: 'ID_DO_VIDEO',
  video_title: 'TITULO_DO_VIDEO',
  video_percent: 50,
  video_current_time: 90
}

// Quando o vídeo termina
{
  event: 'panda_video_complete',
  video_id: 'ID_DO_VIDEO',
  video_title: 'TITULO_DO_VIDEO',
  video_duration: 180,
  watch_time: 175 // tempo real assistido
}

// Quando o usuário pula para outra parte
{
  event: 'panda_video_seek',
  video_id: 'ID_DO_VIDEO',
  video_title: 'TITULO_DO_VIDEO',
  seek_from: 30,
  seek_to: 120
}
```

### 4. Configuração de Tags de Rastreamento

#### Para Google Analytics 4:

**Tag de Engajamento de Vídeo:**
1. Crie uma nova tag GA4 Event
2. **Event Name**: `video_{{Event}}`
3. **Event Parameters**:
   - `video_id`: `{{video_id}}`
   - `video_title`: `{{video_title}}`
   - `video_percent`: `{{video_percent}}`
   - `engagement_time`: `{{video_current_time}}`
4. **Trigger**: Custom Event → Regex: `panda_video_(play|pause|progress|complete)`

**Tag de Conversão (Vídeo Completo):**
1. Crie uma nova tag GA4 Event
2. **Event Name**: `video_conversion`
3. **Event Parameters**:
   - `video_id`: `{{video_id}}`
   - `watch_time`: `{{watch_time}}`
4. **Trigger**: Custom Event → `panda_video_complete`

#### Para Facebook Pixel:
1. Crie tag do Facebook Pixel
2. **Track Type**: Custom
3. **Event Name**: `ViewContent` ou `CompleteRegistration`
4. **Object Properties**:
   - `content_name`: `{{video_title}}`
   - `content_ids`: `{{video_id}}`
5. **Trigger**: Escolha o evento Panda desejado

## 🎯 Métricas Importantes

### KPIs de Engajamento:
- **Taxa de Play**: Quantos usuários iniciaram o vídeo
- **Taxa de Conclusão**: Quantos assistiram até o final
- **Drop-off Points**: Onde os usuários param de assistir
- **Tempo Médio de Visualização**: Engagement real com conteúdo

### Funil de Vídeo:
1. **Impressões**: Página com vídeo carregada
2. **Plays**: Vídeo iniciado
3. **25% Progress**: Primeiro quartil
4. **50% Progress**: Meio do vídeo
5. **75% Progress**: Terceiro quartil
6. **Complete**: Vídeo finalizado

## 🔧 Requisitos Técnicos

### Permissões Necessárias:
- ✅ Injeção de scripts externos
- ✅ Logging (modo debug)
- ✅ Acesso ao dataLayer (via script injetado)

### Compatibilidade:
- Funciona com todos os embeds do Panda Video
- Suporta múltiplos vídeos na mesma página
- Detecta vídeos carregados dinamicamente

## 🐛 Debug e Troubleshooting

### Como Debugar:
1. Ative o Preview Mode do GTM
2. Abra o Console do navegador
3. Procure por logs com prefixo `[Panda Video]`
4. Verifique eventos no painel do GTM Preview

### Problemas Comuns:

**Eventos não aparecem:**
- Verifique se o player Panda está presente na página
- Confirme que o trigger está acionando a tag
- Aguarde o player carregar completamente

**Eventos duplicados:**
- Verifique se há apenas uma instância da tag
- Use o video_id para deduplicação se necessário

**Dados incompletos:**
- Alguns dados podem não estar disponíveis imediatamente
- Use o evento `panda_video_ready` para dados completos

## ⚠️ Observações

- O template funciona apenas com o player oficial do Panda Video
- Eventos são disparados via API do player
- Não interfere na reprodução ou performance do vídeo
- Respeita configurações de privacidade do player

## 📦 Build e Deploy (Desenvolvimento)

Para atualizar o script JavaScript:

```bash
cd client/tags/panda-video
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

- [Panda Video](https://www.pandavideo.com.br/)
- [Documentação GTM](https://support.google.com/tagmanager)
- [Métricas Boss](https://metricasboss.com.br)