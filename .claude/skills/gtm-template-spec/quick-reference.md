# Quick Reference - GTM Template PRP

Guia rápido de referência para criar PRPs (Product Requirements Prompts) de templates GTM.

## Estrutura Mínima

```markdown
# [Nome] - GTM Template Specification

## Business Context
- Problema que resolve
- Plataforma/Integração
- Tipo (Tag ou Variable)
- Público-alvo

## Technical Specifications
- Template Info (nome, descrição, categorias)
- Fields Configuration (tabela)
- Code Logic (fluxo, APIs, validações)
- Permissions Required

## Implementation Details
- Pseudocódigo
- Casos de uso
- Edge cases
- Testing checklist

## Documentation
- README.md template
- Comentários no código

## Acceptance Criteria
- Funcional
- Não-funcional
- Segurança
- Compatibilidade
```

## Checklist Rápido

### Antes de Começar

- [ ] Li a documentação em `.claude/docs/visao-geral.md`
- [ ] Entendi a diferença entre Tag e Variable template
- [ ] Tenho acesso à documentação da API/plataforma
- [ ] Sei quais dados vou enviar/receber

### Durante a Especificação

**Business Context:**
- [ ] Descrevi o problema claramente
- [ ] Identifiquei público-alvo
- [ ] Listei benefícios mensuráveis

**Technical Specs:**
- [ ] Nome segue padrão "[Função] da [Empresa]"
- [ ] Descrição tem 1-2 frases
- [ ] Campos têm help text útil
- [ ] Marquei campos obrigatórios
- [ ] Listei todas as APIs necessárias
- [ ] Listei permissões mínimas

**Implementation:**
- [ ] Pseudocódigo cobre fluxo completo
- [ ] Incluí validações de entrada
- [ ] Tratei callbacks success/failure
- [ ] Documentei edge cases
- [ ] Criei testing checklist

**Documentation:**
- [ ] README tem exemplos práticos
- [ ] Incluí seção de troubleshooting
- [ ] Documentei todos os campos
- [ ] Adicionei links para docs externas

### Acceptance Criteria

- [ ] Critérios funcionais verificáveis
- [ ] Critérios de performance definidos
- [ ] Requisitos de segurança listados
- [ ] Compatibilidade especificada

## APIs GTM Mais Comuns

### Enviar Dados

```javascript
const sendPixel = require('sendPixel');
const sendHttpRequest = require('sendHttpRequest');
const injectScript = require('injectScript');
```

### Ler Dados

```javascript
const copyFromDataLayer = require('copyFromDataLayer');
const getCookieValues = require('getCookieValues');
const getUrl = require('getUrl');
```

### Utilitários

```javascript
const JSON = require('JSON');
const encodeUriComponent = require('encodeUriComponent');
const logToConsole = require('logToConsole');
```

## Permissões Comuns

| Permissão | Quando usar | Exemplo |
|-----------|-------------|---------|
| `send_pixel` | Enviar GET request | `https://analytics.com/*` |
| `send_http` | Enviar POST/PUT | `https://api.example.com/*` |
| `inject_script` | Carregar JS externo | `https://cdn.example.com/script.js` |
| `read_data_layer` | Ler dataLayer | `ecommerce.*` |
| `get_cookies` | Ler cookies | `session_id` |
| `logging` | Console logs | (sempre incluir) |

## Template de Campos

```markdown
| Nome | Tipo | Label | Help Text | Obrigatório | Padrão |
|------|------|-------|-----------|-------------|--------|
| `apiKey` | Text Input | API Key | Encontre em Configurações > API | Sim | - |
| `eventType` | Dropdown | Tipo de Evento | pageview, event, purchase | Sim | pageview |
| `debug` | Checkbox | Debug Mode | Ativa logs | Não | false |
```

## Validações Essenciais

```javascript
// 1. Campos obrigatórios
if (!data.apiKey || !data.eventType) {
  return data.gtmOnFailure();
}

// 2. Formato de email
if (data.email && data.email.indexOf('@') === -1) {
  return data.gtmOnFailure();
}

// 3. URL válida
if (data.url && !data.url.startsWith('http')) {
  return data.gtmOnFailure();
}
```

## Padrão de Debug

```javascript
const logToConsole = require('logToConsole');

if (data.enableDebug) {
  logToConsole('[Template Name]:', 'mensagem', data);
}
```

## Callbacks Obrigatórios

```javascript
// SEMPRE incluir callbacks

// Sucesso
data.gtmOnSuccess();

// Falha
data.gtmOnFailure();

// Em APIs assíncronas
sendPixel(url, data.gtmOnSuccess, data.gtmOnFailure);
```

## Estrutura de Diretórios

```
client/tags/nome-do-template/
├── template.tpl          # Arquivo GTM (obrigatório)
├── README.md             # Documentação (obrigatório)
├── .claude/
│   └── prps/
│       └── nome-do-template.md  # Esta especificação
└── inject-script/        # Apenas se injetar JS
    ├── package.json
    ├── webpack.config.js
    └── src/
```

## Naming Conventions

**Parâmetros (camelCase):**
- apiKey, eventName, enableDebug
- ~~api_key, EventName, enable-debug~~

**Template name (kebab-case):**
- rd-station-conversions, panda-video
- ~~rdStationConversions, panda_video~~

**Display name:**
- "RD Station Conversions da Métricas Boss"
- ~~"rdStationConversions", "RD_STATION"~~

## Recursos Úteis

- [Visão Geral GTM Templates](../../docs/visao-geral.md)
- [Referência de APIs](../../docs/api-reference.md)
- [Permissões](../../docs/permissoes-de-modelo-personalizado.md)
- [Guia de Estilo](../../docs/guia-de-estilo-do-modelo.md)
- [Product Requirements Prompts](https://github.com/Wirasm/PRPs-agentic-eng)
