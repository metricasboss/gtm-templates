# Políticas de Template Personalizado

As políticas de template personalizado controlam como determinados recursos e funcionalidades podem ser usados quando um contêiner do GTM executa em uma página.

## Visão Geral

O sistema de políticas é implementado através da API `gtag('policy', ...)` e permite que você:

- Controle quais scripts podem ser injetados
- Restrinja envio de pixels a domínios específicos
- Limite acesso a variáveis globais
- Valide permissões antes de executar ações

---

## Implementação Básica

### Pré-requisitos

As políticas requerem definição prévia de `dataLayer` e função `gtag()`:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
```

### Sintaxe

```javascript
gtag('policy', <permissionId>, <function>);
```

**Parâmetros:**
- `permissionId` - Tipo de permissão a validar
- `function` - Função callback que valida a permissão

---

## Tipos de Permissão

### inject_script

Controla quais scripts podem ser injetados na página.

**Exemplo:**

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  const allowedDomains = [
    'www.google-analytics.com',
    'www.googletagmanager.com',
    'analytics.example.com'
  ];

  const url = data.url;
  const isAllowed = allowedDomains.some(domain => url.includes(domain));

  if (!isAllowed) {
    return false; // Bloqueia o script
  }

  return true; // Permite o script
});
```

### send_pixel

Controla envio de pixels de tracking.

**Exemplo:**

```javascript
gtag('policy', 'send_pixel', (containerId, permissionId, data) => {
  const allowedHosts = ['analytics.example.com', 'tracking.example.com'];

  const url = new URL(data.url);
  const isAllowed = allowedHosts.includes(url.hostname);

  if (!isAllowed) {
    throw new Error('Pixel domain not allowed: ' + url.hostname);
  }

  return true;
});
```

### write_globals

Controla acesso de escrita a variáveis globais.

**Exemplo:**

```javascript
gtag('policy', 'write_globals', (containerId, permissionId, data) => {
  const protectedKeys = ['jQuery', 'angular', 'React'];

  if (protectedKeys.includes(data.key)) {
    throw new Error('Cannot modify protected global: ' + data.key);
  }

  return true;
});
```

### 'all'

Valida múltiplos tipos de permissão com uma única função.

**Exemplo:**

```javascript
gtag('policy', 'all', (containerId, permissionId, data) => {
  // Aplicar lógica específica por tipo de permissão
  switch(permissionId) {
    case 'inject_script':
      return validateScriptUrl(data.url);

    case 'send_pixel':
      return validatePixelUrl(data.url);

    case 'write_globals':
      return validateGlobalWrite(data.key);

    default:
      // Rejeitar permissões desconhecidas
      return false;
  }
});
```

---

## Função de Política

### Parâmetros da Callback

A função callback recebe três parâmetros:

#### 1. containerId

ID do contêiner que está executando.

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  // Aplicar política apenas para contêiner específico
  if (containerId !== 'GTM-XXXXX') {
    return false;
  }

  return true;
});
```

#### 2. permissionId

Tipo de política sendo verificada.

Valores possíveis:
- `'inject_script'`
- `'send_pixel'`
- `'write_globals'`
- Outros tipos de permissão

#### 3. data

Objeto com informações relevantes à permissão.

**Estrutura varia por tipo de permissão:**

```javascript
// Para inject_script e send_pixel
{
  url: 'https://example.com/script.js'
}

// Para write_globals
{
  key: 'variableName'
}
```

### Valor de Retorno

A função pode retornar:

- **`true`** - Permite a ação
- **`false`** - Bloqueia a ação
- **Exceção (throw)** - Bloqueia e registra erro

---

## Comportamento de Rejeição

Uma função **rejeita uma solicitação de permissão** quando ela:

1. Retorna `false`
2. Gera uma exceção

### Registro de Erros

Exceções do tipo `string` ou `Error` aparecem no painel de depuração em modo de visualização.

**Exemplo com erro informativo:**

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  const url = data.url;

  if (!url.startsWith('https://')) {
    throw new Error('Only HTTPS scripts are allowed. Blocked: ' + url);
  }

  if (url.includes('suspicious-domain.com')) {
    throw 'Blocked suspicious domain';
  }

  return true;
});
```

---

## Exemplos Práticos

### Política de Domínios Permitidos

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  // Lista de domínios confiáveis
  const trustedDomains = [
    'www.google-analytics.com',
    'www.googletagmanager.com',
    'connect.facebook.net',
    'analytics.company.com'
  ];

  const url = data.url;

  // Verificar se URL contém domínio confiável
  const isTrusted = trustedDomains.some(domain => url.includes(domain));

  if (!isTrusted) {
    throw new Error('Script from untrusted domain blocked: ' + url);
  }

  return true;
});
```

### Política por Contêiner

```javascript
gtgt('policy', 'all', (containerId, permissionId, data) => {
  // Permitir tudo no ambiente de desenvolvimento
  if (containerId === 'GTM-DEV123') {
    return true;
  }

  // Aplicar restrições em produção
  if (containerId === 'GTM-PROD456') {
    if (permissionId === 'inject_script') {
      return data.url.includes('approved-domain.com');
    }

    if (permissionId === 'send_pixel') {
      return data.url.startsWith('https://');
    }
  }

  // Bloquear por padrão
  return false;
});
```

### Política com Logging

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  const url = data.url;

  // Log de todas as tentativas (apenas em debug)
  if (window.location.search.includes('gtm_debug=true')) {
    console.log('GTM Policy Check:', {
      container: containerId,
      permission: permissionId,
      url: url
    });
  }

  // Validar domínio
  const allowedPattern = /^https:\/\/(www\.)?approved-domain\.com/;

  if (!allowedPattern.test(url)) {
    console.error('Blocked script:', url);
    return false;
  }

  return true;
});
```

### Política de HTTPS Obrigatório

```javascript
gtag('policy', 'all', (containerId, permissionId, data) => {
  // Validar apenas permissões que envolvem URLs
  if (permissionId === 'inject_script' || permissionId === 'send_pixel') {
    const url = data.url;

    // Rejeitar HTTP não seguro
    if (!url.startsWith('https://')) {
      throw new Error('Only HTTPS URLs are allowed. Blocked: ' + url);
    }

    // Rejeitar localhost em produção
    if (window.location.hostname !== 'localhost' && url.includes('localhost')) {
      throw new Error('Localhost URLs not allowed in production');
    }
  }

  return true;
});
```

### Política com Whitelist e Blacklist

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  const url = data.url;

  // Blacklist - bloquear sempre
  const blocked = [
    'malicious-site.com',
    'suspicious-tracker.net'
  ];

  if (blocked.some(domain => url.includes(domain))) {
    throw 'Blocked domain in blacklist';
  }

  // Whitelist - permitir sempre
  const allowed = [
    'www.google-analytics.com',
    'www.googletagmanager.com',
    'cdn.company.com'
  ];

  if (allowed.some(domain => url.includes(domain))) {
    return true;
  }

  // Padrão: rejeitar o que não está na whitelist
  console.warn('Script not in whitelist:', url);
  return false;
});
```

---

## Boas Práticas

### 1. Princípio do Menor Privilégio

Permita apenas o necessário:

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  // Lista específica, não wildcards amplos
  const allowed = [
    'https://www.google-analytics.com/analytics.js',
    'https://cdn.company.com/tracker-v2.js'
  ];

  return allowed.includes(data.url);
});
```

### 2. Validação Rigorosa

Use validação forte, não apenas `includes()`:

```javascript
gtag('policy', 'send_pixel', (containerId, permissionId, data) => {
  try {
    const url = new URL(data.url);

    // Validar protocolo
    if (url.protocol !== 'https:') {
      return false;
    }

    // Validar hostname exato
    const allowedHosts = ['analytics.example.com'];
    if (!allowedHosts.includes(url.hostname)) {
      return false;
    }

    return true;
  } catch (e) {
    // URL inválida
    return false;
  }
});
```

### 3. Logging Adequado

Log informativo para debugging:

```javascript
gtag('policy', 'all', (containerId, permissionId, data) => {
  const logPrefix = `[GTM Policy ${containerId}]`;

  if (permissionId === 'inject_script') {
    console.log(logPrefix, 'Checking script:', data.url);

    const allowed = validateScript(data.url);

    if (!allowed) {
      console.error(logPrefix, 'BLOCKED script:', data.url);
    }

    return allowed;
  }

  return true;
});
```

### 4. Ambiente Específico

Aplique políticas diferentes por ambiente:

```javascript
gtag('policy', 'all', (containerId, permissionId, data) => {
  const isDev = window.location.hostname.includes('localhost') ||
                window.location.hostname.includes('dev.');

  // Desenvolvimento: mais permissivo
  if (isDev) {
    console.log('[Dev Mode] Allowing:', permissionId, data);
    return true;
  }

  // Produção: restritivo
  return applyProductionPolicy(permissionId, data);
});
```

### 5. Tratamento de Erros

Use mensagens de erro claras:

```javascript
gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  const url = data.url;

  if (!url.startsWith('https://')) {
    throw new Error(
      `Security Policy Violation: Non-HTTPS script blocked.\n` +
      `URL: ${url}\n` +
      `Container: ${containerId}`
    );
  }

  return true;
});
```

---

## Depuração

### Visualizar Bloqueios

Use Preview Mode do GTM para ver políticas em ação:

```javascript
gtag('policy', 'all', (containerId, permissionId, data) => {
  // Log detalhado no console
  console.group(`Policy Check: ${permissionId}`);
  console.log('Container:', containerId);
  console.log('Data:', data);

  const result = validatePermission(permissionId, data);

  console.log('Result:', result ? 'ALLOWED' : 'BLOCKED');
  console.groupEnd();

  return result;
});
```

### Modo Debug

Ative logging condicional:

```javascript
const DEBUG = window.location.search.includes('policy_debug=true');

gtag('policy', 'inject_script', (containerId, permissionId, data) => {
  if (DEBUG) {
    console.table({
      Container: containerId,
      Permission: permissionId,
      URL: data.url,
      Allowed: validateUrl(data.url)
    });
  }

  return validateUrl(data.url);
});
```

---

## Limitações

### Políticas não afetam:

- Tags nativas do GTM
- Código executado antes da definição da política
- Scripts já carregados na página

### Políticas afetam:

- Templates personalizados
- Tags HTML customizadas
- Variáveis JavaScript customizadas

---

## Referências

- [Documentação oficial de Políticas](https://developers.google.com/tag-platform/tag-manager/templates/policies?hl=pt-br)
- [Permissões de Modelo Personalizado](./permissoes-de-modelo-personalizado.md)
- [Referência de APIs](./api-reference.md)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
