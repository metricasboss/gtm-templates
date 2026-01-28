# Referência de APIs - GTM Templates

Esta é a referência completa das APIs disponíveis para criar modelos personalizados no Google Tag Manager usando JavaScript em modo sandbox.

## Como Usar as APIs

Todas as APIs funcionam com instruções `require()`:

```javascript
const nomeDaAPI = require('nomeDaAPI');
```

---

## Consentimento

### addConsentListener

Registra uma função de listener a ser executada quando o estado do tipo de consentimento especificado muda.

**Uso:**
```javascript
const addConsentListener = require('addConsentListener');

addConsentListener('analytics_storage', (consentType, granted) => {
  if (granted) {
    // Consentimento foi concedido
  }
});
```

### isConsentGranted

Retorna booleano indicando se consentimento foi concedido para um tipo específico.

**Uso:**
```javascript
const isConsentGranted = require('isConsentGranted');

if (isConsentGranted('analytics_storage')) {
  // Executar código que requer consentimento
}
```

### setDefaultConsentState

Envia atualização padrão de consentimento.

**Uso:**
```javascript
const setDefaultConsentState = require('setDefaultConsentState');

setDefaultConsentState({
  'analytics_storage': 'denied',
  'ad_storage': 'denied'
});
```

### updateConsentState

Envia atualização de consentimento imediata.

**Uso:**
```javascript
const updateConsentState = require('updateConsentState');

updateConsentState({
  'analytics_storage': 'granted'
});
```

---

## Acesso a Dados

### copyFromDataLayer

Retorna valor de chave na camada de dados.

**Permissão necessária:** `read_data_layer`

**Uso:**
```javascript
const copyFromDataLayer = require('copyFromDataLayer');

const userId = copyFromDataLayer('user.id');
const eventName = copyFromDataLayer('event');
```

### copyFromWindow

Copia variável do objeto window.

**Permissão necessária:** `access_globals`

**Uso:**
```javascript
const copyFromWindow = require('copyFromWindow');

const dataLayer = copyFromWindow('dataLayer');
const customVar = copyFromWindow('myApp.config.apiKey');
```

> **Importante:** `copyFromWindow` cria uma cópia detalhada dos valores. Incluir esses valores no sandbox pode ser uma operação cara.

### getCookieValues

Retorna valores de cookies nomeados como um array.

**Permissão necessária:** `get_cookies`

**Uso:**
```javascript
const getCookieValues = require('getCookieValues');

const sessionIds = getCookieValues('session_id');
if (sessionIds.length > 0) {
  const sessionId = sessionIds[0];
}
```

### getQueryParameters

Acessa parâmetros de query da URL atual.

**Permissão necessária:** `get_url`

**Uso:**
```javascript
const getQueryParameters = require('getQueryParameters');

// Retorna todos os parâmetros como objeto
const allParams = getQueryParameters();

// Retorna valor de parâmetro específico
const utmSource = getQueryParameters('utm_source');
```

### getReferrerQueryParameters

Acessa parâmetros do referenciador.

**Permissão necessária:** `get_referrer`

**Uso:**
```javascript
const getReferrerQueryParameters = require('getReferrerQueryParameters');

const refParams = getReferrerQueryParameters();
```

---

## URLs e Componentes

### getUrl

Retorna uma string que representa o URL atual inteiro ou parte dele.

**Permissão necessária:** `get_url`

**Componentes disponíveis:**
- `protocol` - Ex: "https:"
- `host` - Ex: "www.example.com"
- `port` - Ex: "8080"
- `path` - Ex: "/products/item"
- `query` - Ex: "?id=123"
- `extension` - Ex: ".html"
- `fragment` - Ex: "#section"

**Uso:**
```javascript
const getUrl = require('getUrl');

const fullUrl = getUrl();
const hostname = getUrl('host');
const pathname = getUrl('path');
const queryString = getUrl('query');
```

### getReferrerUrl

Lê componentes do referenciador.

**Permissão necessária:** `get_referrer`

**Uso:**
```javascript
const getReferrerUrl = require('getReferrerUrl');

const refHost = getReferrerUrl('host');
const refPath = getReferrerUrl('path');
```

### parseUrl

Retorna objeto com todas as partes de um URL.

**Uso:**
```javascript
const parseUrl = require('parseUrl');

const urlParts = parseUrl('https://example.com:8080/path?query=value#hash');
// Retorna:
// {
//   protocol: 'https:',
//   host: 'example.com:8080',
//   hostname: 'example.com',
//   port: '8080',
//   pathname: '/path',
//   search: '?query=value',
//   hash: '#hash'
// }
```

---

## Utilitários

### getType

Diferencia entre array e object (diferente de typeof).

**Uso:**
```javascript
const getType = require('getType');

getType([1, 2, 3]); // 'array'
getType({a: 1}); // 'object'
getType('hello'); // 'string'
getType(123); // 'number'
getType(true); // 'boolean'
getType(null); // 'null'
getType(undefined); // 'undefined'
getType(() => {}); // 'function'
```

### JSON

Métodos `parse()` e `stringify()` para manipulação de JSON.

**Uso:**
```javascript
const JSON = require('JSON');

const obj = JSON.parse('{"name":"John","age":30}');
const str = JSON.stringify({name: 'John', age: 30});
```

### Math

Funções matemáticas disponíveis:
- `abs()` - Valor absoluto
- `floor()` - Arredonda para baixo
- `ceil()` - Arredonda para cima
- `round()` - Arredonda para o inteiro mais próximo
- `max()` - Valor máximo
- `min()` - Valor mínimo
- `pow()` - Potenciação
- `sqrt()` - Raiz quadrada

**Uso:**
```javascript
const Math = require('Math');

const absolute = Math.abs(-5); // 5
const rounded = Math.round(4.7); // 5
const maximum = Math.max(1, 5, 3); // 5
const power = Math.pow(2, 3); // 8
```

### Object

Métodos disponíveis:
- `keys()` - Retorna array com as chaves
- `values()` - Retorna array com os valores
- `entries()` - Retorna array de pares [chave, valor]
- `freeze()` - Congela objeto (impede modificações)
- `delete()` - Remove propriedade

**Uso:**
```javascript
const Object = require('Object');

const obj = {a: 1, b: 2, c: 3};
const keys = Object.keys(obj); // ['a', 'b', 'c']
const values = Object.values(obj); // [1, 2, 3]
const entries = Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]
```

---

## Codificação

### encodeUri / encodeUriComponent

Codificam caracteres especiais em URIs.

**Uso:**
```javascript
const encodeUri = require('encodeUri');
const encodeUriComponent = require('encodeUriComponent');

const fullUrl = encodeUri('https://example.com/path with spaces');
const param = encodeUriComponent('value with spaces & symbols');
```

### decodeUri / decodeUriComponent

Decodificam URIs codificadas.

**Uso:**
```javascript
const decodeUri = require('decodeUri');
const decodeUriComponent = require('decodeUriComponent');

const decoded = decodeUriComponent('value%20with%20spaces');
```

### toBase64 / fromBase64

Conversão para e de base64.

**Uso:**
```javascript
const toBase64 = require('toBase64');
const fromBase64 = require('fromBase64');

const encoded = toBase64('Hello World');
const decoded = fromBase64(encoded);
```

### sha256

Calcula hash SHA-256 com callback.

**Uso:**
```javascript
const sha256 = require('sha256');

sha256('Hello World', (hash) => {
  // hash contém o SHA-256 da string
  data.gtmOnSuccess();
}, () => {
  // Callback de erro
  data.gtmOnFailure();
});
```

---

## Armazenamento

### localStorage

Acessa o localStorage do navegador.

**Permissão necessária:** `access_local_storage`

**Métodos:**
- `getItem(key)` - Obtém valor
- `setItem(key, value)` - Define valor
- `removeItem(key)` - Remove valor

**Uso:**
```javascript
const localStorage = require('localStorage');

localStorage.setItem('user_preference', 'dark_mode');
const preference = localStorage.getItem('user_preference');
localStorage.removeItem('user_preference');
```

### templateStorage

Armazenamento compartilhado entre execuções do modelo durante a vida útil da página.

**Permissão necessária:** `access_template_storage`

**Métodos:**
- `getItem(key)` - Obtém valor
- `setItem(key, value)` - Define valor
- `removeItem(key)` - Remove valor

**Uso:**
```javascript
const templateStorage = require('templateStorage');

templateStorage.setItem('initialization_count', 1);
const count = templateStorage.getItem('initialization_count');
```

---

## Scripts e Pixels

### injectScript

Carrega script assincronamente com callbacks.

**Permissão necessária:** `inject_script`

**Parâmetros:**
1. `url` - URL do script
2. `onSuccess` - Callback de sucesso
3. `onFailure` - Callback de falha
4. `cacheToken` - (Opcional) Token para cache

**Uso:**
```javascript
const injectScript = require('injectScript');

const url = 'https://www.example.com/script.js';
injectScript(url, data.gtmOnSuccess, data.gtmOnFailure, url);
```

> **Importante:** O URL do script geralmente é um valor `cacheToken` adequado. Usar o mesmo `cacheToken` evita carregar o script múltiplas vezes.

### injectHiddenIframe

Adiciona iframe invisível à página.

**Permissão necessária:** `inject_hidden_iframe`

**Uso:**
```javascript
const injectHiddenIframe = require('injectHiddenIframe');

const url = 'https://www.example.com/pixel';
injectHiddenIframe(url, data.gtmOnSuccess, data.gtmOnFailure);
```

### sendPixel

Faz requisição GET a endpoint (resposta não é processada).

**Permissão necessária:** `send_pixel`

**Uso:**
```javascript
const sendPixel = require('sendPixel');

const pixelUrl = 'https://analytics.example.com/track?event=pageview';
sendPixel(pixelUrl, data.gtmOnSuccess, data.gtmOnFailure);
```

---

## Controle de Fluxo

### callLater

Programa execução assíncrona (similar a setTimeout).

**Uso:**
```javascript
const callLater = require('callLater');

callLater(() => {
  // Código executado assincronamente
});
```

### addEventCallback

Callback executado ao fim de evento.

**Permissão necessária:** `read_event_metadata`

**Uso:**
```javascript
const addEventCallback = require('addEventCallback');

addEventCallback((containerId, eventData) => {
  // Código executado após o evento
  if (eventData.event === 'purchase') {
    // Processar compra
  }
});
```

---

## Variáveis Globais

### setInWindow

Define valor em variável global.

**Permissão necessária:** `access_globals`

**Parâmetros:**
1. `key` - Caminho da variável (separado por pontos)
2. `value` - Valor a definir
3. `overwrite` - (Boolean) Se deve sobrescrever valor existente

**Uso:**
```javascript
const setInWindow = require('setInWindow');

setInWindow('myApp.config.apiKey', 'abc123', false);
setInWindow('dataLayer', [], false);
```

### callInWindow

Chama função no contexto global.

**Permissão necessária:** `access_globals`

**Uso:**
```javascript
const callInWindow = require('callInWindow');

callInWindow('myApp.initialize', arg1, arg2);
```

### createQueue

Cria uma fila de comandos (como o dataLayer).

**Permissão necessária:** `access_globals`

**Uso:**
```javascript
const createQueue = require('createQueue');

const dataLayerPush = createQueue('dataLayer');
dataLayerPush({event: 'custom_event', data: 'value'});
```

### createArgumentsQueue

Cria uma fila de argumentos (como o Google Analytics).

**Permissão necessária:** `access_globals`

**Uso:**
```javascript
const createArgumentsQueue = require('createArgumentsQueue');

const ga = createArgumentsQueue('ga', 'ga.q');
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');
```

---

## Outros

### getContainerVersion

Retorna dados sobre contêiner atual.

**Permissão necessária:** `read_container_data`

**Retorna objeto com:**
- `containerId` - ID do contêiner (ex: "GTM-XXXXX")
- `version` - Versão do contêiner
- `environmentName` - Nome do ambiente
- `environmentMode` - Modo (ex: "Live", "Preview")
- `debugMode` - Boolean indicando modo debug

**Uso:**
```javascript
const getContainerVersion = require('getContainerVersion');

const containerInfo = getContainerVersion();
if (containerInfo.debugMode) {
  // Código específico para debug
}
```

### getTimestamp / getTimestampMillis

Retorna tempo em milissegundos desde época Unix.

**Uso:**
```javascript
const getTimestamp = require('getTimestamp');
const getTimestampMillis = require('getTimestampMillis');

const now = getTimestampMillis();
```

### gtagSet

Envia comando "set" para camada de dados.

**Permissão necessária:** `write_data_layer`

**Uso:**
```javascript
const gtagSet = require('gtagSet');

gtagSet({'custom_parameter': 'value'});
```

### logToConsole

Registra mensagens no console (apenas em modo debug/preview por padrão).

**Permissão necessária:** `logging`

**Uso:**
```javascript
const logToConsole = require('logToConsole');

logToConsole('Debug message:', data);
logToConsole('Error:', error);
```

### readTitle

Lê `document.title`.

**Permissão necessária:** `read_title`

**Uso:**
```javascript
const readTitle = require('readTitle');

const pageTitle = readTitle();
```

### readCharacterSet

Lê `document.characterSet`.

**Permissão necessária:** `read_character_set`

**Uso:**
```javascript
const readCharacterSet = require('readCharacterSet');

const charset = readCharacterSet();
```

---

## APIs de Teste

Estas APIs não requerem `require()` e são usadas apenas em testes:

### assertThat

Fluent assertions com verificações.

**Métodos disponíveis:**
- `isUndefined()`
- `isDefined()`
- `isNull()`
- `isNotNull()`
- `isTrue()`
- `isFalse()`
- `isEqualTo(value)`
- `isNotEqualTo(value)`
- `isStrictlyEqualTo(value)`
- `isNotStrictlyEqualTo(value)`
- `contains(value)` (para arrays e strings)
- `doesNotContain(value)`
- `isArray()`
- `isObject()`
- `isString()`
- `isNumber()`
- `isBoolean()`
- `isFunction()`

**Uso:**
```javascript
assertThat(actualValue).isEqualTo(expectedValue);
assertThat(myArray).contains('item');
assertThat(myVar).isDefined();
```

### assertApi

Verifica chamadas de API.

**Métodos:**
- `wasCalled()` - Verifica se API foi chamada
- `wasCalledWith(args)` - Verifica se foi chamada com argumentos específicos
- `wasNotCalled()` - Verifica se não foi chamada

**Uso:**
```javascript
const mockSendPixel = mock('sendPixel');
runCode();
assertApi('sendPixel').wasCalled();
assertApi('sendPixel').wasCalledWith('https://example.com/pixel');
```

### mock

Substitui comportamento de APIs em testes.

**Uso:**
```javascript
mock('getCookieValues', ['cookie_value']);
mock('getUrl', 'https://example.com');
```

### runCode

Executa código do modelo com dados de entrada.

**Uso:**
```javascript
runCode({
  trackingId: 'UA-XXXXX-Y',
  eventName: 'purchase'
});
```

### fail

Falha teste imediatamente com mensagem.

**Uso:**
```javascript
if (unexpectedCondition) {
  fail('This should not happen');
}
```

---

## Referências

- [Documentação oficial das APIs](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br)
- [Permissões de modelo personalizado](https://developers.google.com/tag-platform/tag-manager/templates/permissions?hl=pt-br)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
