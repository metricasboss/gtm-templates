# Permissões de Modelo Personalizado

Este documento descreve as permissões para modelos personalizados da Web.

## Características das Permissões

Todas as permissões são:

- **Verificadas** pelas APIs que as exigem
- **Detectadas automaticamente** em JavaScript em sandbox, com base em quais APIs são usadas. Isso acontece porque as edições são feitas no editor de modelos personalizados (para um loop de feedback rápido) e quando o código é compilado (para validar se as permissões corretas foram aplicadas)
- **Modificáveis** no editor de modelos personalizados para tornar a permissão mais específica
- **Consultáveis** em JavaScript no modo sandbox pela API `queryPermission`

---

## access_globals

**Nome de exibição**: Acessa as variáveis globais

**Descrição**: Permite acesso a uma variável global (possivelmente incluindo APIs confidenciais).

**Configuração**: Lista de chaves que podem ser acessadas. Cada chave é um caminho separado por pontos. Por exemplo: `foo.bar`. O primeiro token em cada caminho não pode ser uma chave predefinida no escopo global do navegador nem uma palavra-chave em JavaScript. Tem caixas de seleção de leitura, gravação e execução que controlam o acesso.

**Solicitado por**:
- [`setInWindow`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#setinwindow)
- [`copyFromWindow`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#copyfromwindow)
- [`callInWindow`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#callinwindow)
- [`createQueue`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#createqueue)
- [`createArgumentsQueue`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#createargumentsqueue)

**Assinatura da consulta**:
- `queryPermission('access_globals', 'read', <key to read from>)`
- `queryPermission('access_globals', 'write', <key to write to>)`
- `queryPermission('access_globals', 'readwrite', <key to read and write>)`
- `queryPermission('access_globals', 'execute', <key of function to execute>)`

**Observações**: Define se um modelo personalizado pode ler e/ou gravar nos valores globais.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const createQueue = require('createQueue');

if (queryPermission('access_globals', 'readwrite', 'dataLayer')) {
  const dataLayerPush = createQueue('dataLayer');
}
```

---

## access_local_storage

**Nome de exibição**: Acessa o armazenamento local

**Descrição**: Permite acesso às chaves especificadas no armazenamento local.

**Configuração**: Lista das chaves de armazenamento local que podem ser acessadas. Essa é uma matriz simples de chaves que não contém caracteres curinga. Tem caixas de seleção de leitura e gravação que controlam o acesso.

**Solicitado por**: [`localStorage`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#localstorage)

**Assinatura da consulta**:
- `queryPermission('access_local_storage', 'read', <key to read from>)`
- `queryPermission('access_local_storage', 'write', <key to write to>)`
- `queryPermission('access_local_storage', 'readwrite', <key to read and write>)`

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const localStorage = require('localStorage');

const key = 'my_key';
if (queryPermission('access_local_storage', 'read', key)) {
  const value = localStorage.getItem(key);
}
```

---

## access_template_storage

**Nome de exibição**: Acessa o armazenamento de modelos

**Descrição**: Permite acesso ao armazenamento temporário de modelos que podem persistir durante a vida útil da página.

**Configuração**: Nenhuma

**Solicitado por**: [`templateStorage`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#templatestorage)

**Assinatura da consulta**: `queryPermission('access_template_storage')`

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const templateStorage = require('templateStorage');

const key = 'my_key';
if (queryPermission('access_template_storage')) {
  const value = templateStorage.getItem(key);
}
```

---

## get_cookies

**Nome de exibição**: Reads cookie value(s)

**Descrição**: Lê os valores dos cookies com os nomes especificados.

**Configuração**: Lista de nomes dos cookies permitidos para leitura.

**Solicitado por**: [`getCookieValues`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#getcookievalues)

**Assinatura da consulta**: `queryPermission('get_cookies', <name>)`

**Observações**: Determina se um cookie pode ser lido, dependendo do nome.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const getCookieValues = require('getCookieValues');

const cookieName = 'info';
let cookieValues;

if (queryPermission('get_cookies', cookieName)) {
  cookieValues = getCookieValues(cookieName);
}
```

---

## get_referrer

**Nome de exibição**: Lê o URL do referenciador

**Descrição**: Concede acesso de leitura a partes restritas do referenciador.

**Configuração**: Os booleanos a seguir determinam qual parte do referenciador pode ser lida. Certos fragmentos dele só permitirão a leitura se a parte correspondente for `true`. O autor poderá chamar `getReferrerUrl` sem especificar um componente para receber o URL completo do referenciador se todos os booleanos forem definidos como `true`. Se nenhum valor for definido, o padrão será `all`. Se for definido, o valor precisará ser uma matriz de componentes em que um deles seja: `protocol`, `host`, `port`, `path`, `query` ou `extension`.

**queryKeys**: Se a consulta for selecionada, o autor do modelo poderá limitar ainda mais o conjunto de chaves de consulta em que é possível realizar a leitura. Essa é uma matriz simples de chaves que não contém caracteres curinga.

> **Observação**: Como o recurso que usa queryKeys ainda está sendo desenvolvido, a configuração ideal é permitir qualquer chave de consulta.

**Solicitado por**:
- [`getReferrerUrl`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#getreferrerurl)
- [`getReferrerQueryParameters`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#getreferrerqueryparameters)

**Assinatura da consulta**: `queryPermission('get_referrer', <url_component>)`

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const getReferrerUrl = require('getReferrerUrl');

let referrer;
if (queryPermission('get_referrer', 'query')) {
  referrer = getReferrerUrl('queryParams');
}
```

---

## get_url

**Nome de exibição**: Reads URL

**Descrição**: Retorna o URL parcial ou completo da página atual.

**Configuração**: Os seguintes booleanos determinam qual parte do URL pode ser lida. Uma parte específica do URL só poderá ser lida se a parte correspondente for verdadeira. O autor só poderá chamar `getUrl` sem um componente especificado para receber o URL completo se todos esses booleanos estiverem configurados como `true`. Se nenhum valor for definido, o padrão será `all`. Se for definido, o valor precisará ser uma matriz de componentes em que um deles seja: `protocol`, `host`, `port`, `path`, `query`, `extension` ou `fragment`.

**queryKeys**: Se a consulta for selecionada, o autor do modelo poderá limitar ainda mais o conjunto de chaves de consulta em que é possível realizar a leitura. Essa é uma matriz simples de chaves que não contém caracteres curinga.

> **Observação**: Como o recurso que usa queryKeys ainda está sendo desenvolvido, a configuração ideal é permitir qualquer chave de consulta.

**Solicitado por**: [`getUrl`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#geturl)

**Assinatura da consulta**: `queryPermission('get_url', <optional url component>, <optional query key>)`

Se fornecido, o componente de URL deverá ser uma destas opções: `'protocol'`, `'host'`, `'port'`, `'path'`, `'query'`, `'extension'` ou `'fragment'`. Se ele for omitido, a consulta de permissão será uma solicitação de acesso ao URL inteiro.

Se fornecida, a chave de consulta deverá ser o argumento de string de consulta que será lido pelo código do modelo.

**Observações**: Define se um modelo personalizado pode fazer a leitura no local atual. Permite restringir a uma parte específica do local.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const getUrl = require('getUrl');

if (queryPermission('get_url', 'query', 'gclid')) {
  const gclid = getUrl('query', false, null, 'gclid');
}
```

---

## inject_hidden_iframe

**Nome de exibição**: Injeta iframes ocultos

**Descrição**: Injeta um iframe invisível com um URL especificado.

**Configuração**: Lista de padrões do URL.

**Solicitado por**: [`injectHiddenIframe`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#injecthiddeniframe)

**Assinatura da consulta**: `queryPermission('inject_hidden_iframe', <url>)`

**Observações**: Define se um modelo personalizado pode injetar um iFrame invisível e em qual origem é possível fazer isso.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const injectHiddenIframe = require('injectHiddenIframe');

const url = 'https://www.example.com/iframes';
if (queryPermission('inject_hidden_iframe', url)) {
  injectHiddenIframe(url);
}
```

---

## inject_script

**Nome de exibição**: Injeta scripts

**Descrição**: Insere um script na página.

**Configuração**: Lista de padrões do URL.

**Solicitado por**: [`injectScript`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#injectscript)

**Assinatura da consulta**: `queryPermission('inject_script', <url>)`

**Observações**: Define se um modelo personalizado pode injetar JavaScript e em qual origem é possível fazer isso.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const injectScript = require('injectScript');

const url = 'https://www.example.com?api.js';
if (queryPermission('inject_script', url)) {
  injectScript(url);
}
```

---

## logging

**Nome de exibição**: Registra no console

**Descrição**: Faz registros no console para desenvolvedores e no modo de visualização do GTM.

**Configuração**: Opção para ativar registros em produção. O padrão é ativar os registros apenas na depuração/visualização. Quando a permissão é negada, `logToConsole` não gera um erro, mas suprime a mensagem de registro.

**Solicitado por**: [`logToConsole`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#logtoconsole)

**Assinatura da consulta**: `queryPermission('logging')`

**Observações**: Define se um modelo personalizado pode fazer registros no console do desenvolvedor.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const logToConsole = require('logToConsole');

// Note that it's fine to call log, since the log call will be ignored if
// logging isn't permitted in the current environment.
logToConsole('diagnostic info');
```

---

## read_data_layer

**Nome de exibição**: Lê a camada de dados

**Descrição**: Lê dados do objeto `dataLayer`.

**Configuração**: Conjunto de expressões de correspondência de chave em que uma correspondência pode ser uma série principal de referências pontilhadas, com um caractere curinga à direita; essas expressões definem quais propriedades podem ser lidas na camada de dados.

**Solicitado por**: [`copyFromDataLayer`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#copyfromdatalayer)

**Assinatura da consulta**: `queryPermission('read_data_layer', <data layer key to read from>)`

**Observações**: Define se um modelo personalizado pode ler a camada de dados.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const copyFromDataLayer = require('copyFromDataLayer');

const dlKey = 'foo.bar';
if (queryPermission('read_data_layer', dlKey)) {
  const dlContents = copyFromDataLayer(dlKey);
}
```

---

## read_character_set

**Nome de exibição**: Lê o conjunto de caracteres do documento

**Descrição**: Lê `document.characterSet`.

**Configuração**: Nenhuma

**Solicitado por**: [`readCharacterSet`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#readcharacterset)

**Assinatura da consulta**: `queryPermission('read_character_set')`

**Observações**: Controla se um modelo personalizado pode ler o `document.characterSet`.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const readCharacterSet = require('readCharacterSet');

if (queryPermission('read_character_set')) {
  const characterSet = readCharacterSet();
}
```

---

## read_container_data

**Nome de exibição**: Lê dados do contêiner

**Descrição**: Lê dados sobre o contêiner.

**Configuração**: Nenhuma

**Solicitado por**: [`getContainerVersion`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#getcontainerversion)

**Assinatura da consulta**: `queryPermission('read_container_data')`

**Observações**: Controla se um modelo personalizado pode ler dados sobre o contêiner.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const getContainerVersion = require('getContainerVersion');

let version;
if (queryPermission('read_container_data')) {
  version = getContainerVersion();
}
```

---

## read_event_metadata

**Nome de exibição**: Lê metadados de evento

**Descrição**: Lê metadados de evento em callbacks de evento.

**Configuração**: Nenhuma

**Solicitado por**: [`addEventCallback`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#addeventcallback)

**Assinatura da consulta**: `queryPermission('read_event_metadata')`

**Observações**: Controla se um modelo personalizado pode ler metadados de evento em callbacks.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const addEventCallback = require('addEventCallback');

if (queryPermission('read_event_metadata')) {
  addEventCallback((containerId, eventMetadata) => {
    // Read event metadata.
  });
}
```

---

## read_title

**Nome de exibição**: Lê o título do documento

**Descrição**: Lê `document.title`.

**Configuração**: Nenhuma

**Solicitado por**: [`readTitle`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#readtitle)

**Assinatura da consulta**: `queryPermission('read_title')`

**Observações**: Controla se um modelo personalizado pode ler o `document.title`.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const readTitle = require('readTitle');

if (queryPermission('read_title')) {
  const title = readTitle();
}
```

---

## send_pixel

**Nome de exibição**: Envia pixels

**Descrição**: Envia uma solicitação GET a um URL especificado. A resposta não é processada.

**Configuração**: Lista de padrões do URL permitidos.

**Solicitado por**: [`sendPixel`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#sendpixel)

**Assinatura da consulta**: `queryPermission('send_pixel', <url>)`

**Observações**: Define se um modelo personalizado pode enviar uma solicitação GET e para qual origem ele pode fazer isso.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const sendPixel = require('sendPixel');

const url = 'https://www.example.com?foo=3';
if (queryPermission('send_pixel', url)) {
  sendPixel(url);
}
```

---

## set_cookies

**Nome de exibição**: Sets a cookie

**Descrição**: Define um cookie com o nome e os parâmetros especificados.

**Configuração**: Tabela com os nomes dos cookies permitidos, cada um com restrições opcionais de nome, domínio, caminho, atributo secure e validade.

**Solicitado por**: [`setCookie`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#setcookie)

**Assinatura da consulta**: `queryPermission('set_cookies', <name>, <options>)`

**Observações**: Determina se um cookie pode ser gravado, dependendo do nome, domínio, caminho, atributo secure e validade dele.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const setCookie = require('setCookie');

const options = {
  'domain': 'www.example.com',
  'path': '/',
  'max-age': 60*60*24*365,
  'secure': true
};

if (queryPermission('set_cookies', 'info', options)) {
  setCookie('info', 'xyz', options);
}
```

---

## write_data_layer

**Nome de exibição**: Faz gravações na camada de dados

**Descrição**: Grava dados na camada de dados.

**Configuração**: Conjunto de expressões de correspondência de chave em que uma correspondência pode ser uma série principal de referências pontilhadas, com um caractere curinga à direita. Expressões de correspondência de chave definem quais propriedades podem fazer gravações na camada de dados.

**Solicitado por**: [`gtagSet`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#gtagSet)

**Assinatura da consulta**: `queryPermission('write_data_layer', <data layer key to write from>)`

**Observações**: Controla se um modelo personalizado pode fazer gravações na camada de dados.

### Exemplo de código

```javascript
const queryPermission = require('queryPermission');
const gtagSet = require('gtagSet');

const dlKey = 'foo.bar';
if (queryPermission('write_data_layer', dlKey)) {
  gtagSet({dlKey: 'baz'});
}
```

---

**Fonte**: [Google Tag Manager Templates - Permissões de modelo personalizado](https://developers.google.com/tag-platform/tag-manager/templates/permissions?hl=pt-br)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)

Última atualização: 2025-03-06 UTC
