# Base de Conhecimento - GTM Templates

Esta é a base de conhecimento completa sobre desenvolvimento de templates personalizados para Google Tag Manager (GTM), compilada a partir da documentação oficial do Google.

## 📚 Índice de Documentação

### Introdução e Conceitos

- **[Visão Geral](./visao-geral.md)** - Introdução aos templates do GTM, tipos de templates, estrutura do editor, boas práticas e workflow de desenvolvimento

### Desenvolvimento

- **[JavaScript no Modo Sandbox](./javascript-no-modo-sandbox.md)** - Ambiente de execução seguro, limitações, tipos suportados e alternativas

- **[Biblioteca Padrão](./biblioteca-padrao.md)** - Métodos nativos JavaScript disponíveis (arrays, strings, objetos) com exemplos práticos

- **[Referência de APIs](./api-reference.md)** - Documentação completa de todas as APIs disponíveis via `require()`, organizadas por categoria:
  - Consentimento
  - Acesso a dados
  - URLs e componentes
  - Utilitários
  - Codificação
  - Armazenamento
  - Scripts e pixels
  - Controle de fluxo
  - Variáveis globais
  - APIs de teste

### Segurança e Permissões

- **[Permissões de Modelo Personalizado](./permissoes-de-modelo-personalizado.md)** - Todas as 18 permissões disponíveis, configurações, assinaturas de consulta e exemplos

- **[Políticas](./politicas.md)** - Sistema de políticas para controlar recursos e funcionalidades, implementação e boas práticas

### Guias e Tutoriais

- **[Guia de Estilo do Modelo](./guia-de-estilo-do-modelo.md)** - Diretrizes de nomenclatura, formatação, campos, ícones e UX

- **[Converter Tag Existente](./converter-tag-existente.md)** - Tutorial completo para converter tags HTML em templates GTM

---

## 🚀 Quick Start

### 1. Comece aqui

Leia a [Visão Geral](./visao-geral.md) para entender:
- O que são templates personalizados
- Diferença entre Tag e Variable templates
- Estrutura do Template Editor
- Vantagens sobre HTML customizado

### 2. Entenda o ambiente

Estude [JavaScript no Modo Sandbox](./javascript-no-modo-sandbox.md) para conhecer:
- Limitações do ambiente sandbox
- Tipos suportados
- O que NÃO está disponível
- Sistema `require()`

### 3. Conheça as ferramentas

Consulte:
- [Biblioteca Padrão](./biblioteca-padrao.md) - Métodos nativos disponíveis
- [Referência de APIs](./api-reference.md) - APIs que você pode usar

### 4. Configure segurança

Aprenda sobre [Permissões](./permissoes-de-modelo-personalizado.md):
- Quais permissões existem
- Como configurá-las
- Princípio do menor privilégio

### 5. Siga boas práticas

Leia o [Guia de Estilo](./guia-de-estilo-do-modelo.md) para criar templates profissionais

### 6. Pratique

Siga o tutorial [Converter Tag Existente](./converter-tag-existente.md)

---

## 📖 Guia de Referência Rápida

### APIs Mais Usadas

```javascript
// Acesso a dados
const copyFromDataLayer = require('copyFromDataLayer');
const getCookieValues = require('getCookieValues');

// URLs
const getUrl = require('getUrl');
const parseUrl = require('parseUrl');

// Scripts e tracking
const injectScript = require('injectScript');
const sendPixel = require('sendPixel');

// Logs
const logToConsole = require('logToConsole');

// Utilitários
const JSON = require('JSON');
const encodeUriComponent = require('encodeUriComponent');
```

### Permissões Comuns

- `read_data_layer` - Ler dataLayer
- `send_pixel` - Enviar pixels
- `inject_script` - Injetar scripts
- `get_cookies` - Ler cookies
- `access_globals` - Acessar variáveis globais
- `logging` - Registrar logs

### Estrutura Básica de uma Tag

```javascript
// 1. Importar APIs
const sendPixel = require('sendPixel');
const encodeUri = require('encodeUri');
const logToConsole = require('logToConsole');

// 2. Acessar dados dos campos
const trackingUrl = data.trackingUrl;
const eventName = data.eventName;

// 3. Log condicional (apenas debug)
if (data.enableDebug) {
  logToConsole('Sending event:', eventName);
}

// 4. Executar ação
const url = trackingUrl + '?event=' + encodeUri(eventName);
sendPixel(url, data.gtmOnSuccess, data.gtmOnFailure);
```

### Estrutura Básica de uma Variável

```javascript
// 1. Importar APIs
const copyFromDataLayer = require('copyFromDataLayer');

// 2. Extrair dados
const ecommerce = copyFromDataLayer('ecommerce');

// 3. Processar e retornar
if (ecommerce && ecommerce.purchase) {
  return ecommerce.purchase.actionField.revenue;
}

return undefined;
```

---

## 🎯 Casos de Uso

### Templates de Tags

**Plataformas Brasileiras:**
- RD Station Conversions API
- Hotmart tracking
- ActiveCampaign events
- Panda Video analytics

**E-commerce:**
- VTEX orderForm tracking
- Enhanced e-commerce customizado
- Checkout step tracking

**Analytics:**
- Event enrichment
- User ID management
- Session tracking

### Templates de Variáveis

**Data Extraction:**
- Parse de VTEX orderForm
- URL parameter parsing
- Cookie parsing customizado

**Transformação:**
- Normalização de valores
- Cálculos customizados
- Concatenação de campos

**Validação:**
- Format validation
- Data quality checks
- Conditional values

---

## ⚠️ Limitações Importantes

### O que NÃO está disponível no Sandbox

- Construtores globais (`new String()`, `new Array()`)
- Palavra-chave `new`
- Palavra-chave `this` em funções
- Acesso direto ao `window` (use `copyFromWindow`)
- APIs do navegador (DOM, fetch, XMLHttpRequest)
- `setTimeout`/`setInterval` (use `callLater`)

### Compatibilidade

Templates personalizados estão disponíveis apenas para:
- ✅ Web containers
- ✅ Server-side containers
- ❌ Mobile containers (iOS/Android)
- ❌ AMP containers

---

## 🔗 Links Externos Úteis

### Documentação Oficial Google

- [GTM Templates Overview](https://developers.google.com/tag-platform/tag-manager/templates)
- [API Reference](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br)
- [Permissions](https://developers.google.com/tag-platform/tag-manager/templates/permissions?hl=pt-br)
- [Policies](https://developers.google.com/tag-platform/tag-manager/templates/policies?hl=pt-br)
- [Style Guide](https://developers.google.com/tag-platform/tag-manager/templates/style?hl=pt-br)

### Recursos Adicionais

- [Community Template Gallery](https://tagmanager.google.com/gallery/)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

---

## 📝 Contribuindo

Esta base de conhecimento foi compilada a partir da documentação oficial do Google Tag Manager Templates.

**Fontes:**
- Documentação oficial do Google Developers
- Material Design Writing Principles
- Community best practices

**Licença:** [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)

---

## 🗂️ Organização dos Arquivos

```
.claude/docs/
├── README.md (este arquivo)
├── visao-geral.md
├── javascript-no-modo-sandbox.md
├── biblioteca-padrao.md
├── api-reference.md
├── permissoes-de-modelo-personalizado.md
├── politicas.md
├── guia-de-estilo-do-modelo.md
└── converter-tag-existente.md
```

---

Última atualização: 2026-01-28
