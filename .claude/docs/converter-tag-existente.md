# Converter uma Tag Existente

Neste guia, você vai aprender a converter uma tag HTML personalizada para usar o JavaScript no modo sandbox.

Este tutorial usará a API [injectScript](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#injectscript). A `injectScript` é uma API comum usada para converter uma tag existente que se baseia em scripts de terceiros. Essas tags geralmente definem a funcionalidade básica quando um script está sendo carregado e incluem um recurso adicional quando o processo é concluído.

> **Observação**: na prática, evite o `injectScript()`. Implemente o script de destino diretamente no JavaScript no modo sandbox. Com isso, você dependerá menos de um terceiro, o que aumenta a probabilidade do processo ser permitido pelas [políticas em vigor](https://developers.google.com/tag-platform/tag-manager/templates/policies?hl=pt-br).

## Tag Original

> **Atenção**: o script analytics.js é usado como exemplo neste guia, mas não o utilize na produção. Siga as etapas no artigo [Implantar o Google Analytics com o Gerenciador de tags](https://support.google.com/tagmanager/answer/6107124?hl=pt-br).

## Converter o Código

Considere a parte JavaScript da tag acima:

```html
<!-- Google Analytics -->
<script>
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXXX-1', 'auto');
ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
<!-- End Google Analytics -->
```

Para criar o JavaScript no modo sandbox necessário, observe quais APIs JavaScript nativas esse script usa e converta seu código para usar as APIs JavaScript equivalentes no modo sandbox.

Por exemplo, as seguintes APIs JavaScript nativas são usadas na tag analytics.js:

| JavaScript nativo | JavaScript no modo sandbox |
|-------------------|---------------------------|
| `window.ga` | `setInWindow` |
| `arguments` | `createArgumentsQueue` |
| `+ new Date` | `getTimestamp` |

### Passo 1: Importar APIs Necessárias

Para usar as APIs JavaScript no modo sandbox no seu script, você precisa solicitá-las usando o comando `require`. Por exemplo, para usar a API `setInWindow()`, adicione-a à parte superior do script:

```javascript
const setInWindow = require('setInWindow');
```

### Passo 2: Converter window.ga

```javascript
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)}

// becomes

const createArgumentsQueue = require('createArgumentsQueue');
const ga = createArgumentsQueue('ga', 'ga.q');
```

### Passo 3: Converter a atribuição ga.l

```javascript
ga.l=+new Date;

// becomes

const getTimestamp = require('getTimestamp');
setInWindow('ga.l', getTimestamp(), true);
```

### Passo 4: Converter as chamadas ga()

```javascript
ga('create', 'UA-XXXXXX-1', 'auto');
ga('send', 'pageview');

// becomes

const trackingId = data.trackingId;
ga('create', trackingId, 'auto');
ga('send', 'pageview');
```

## Adicionar Campo ao Template

Para usar `data.trackingId`, adicione um campo ao seu modelo:

1. Navegue até a guia **Fields** e clique em **Add Field**
2. Escolha o tipo de campo **Text input**
3. Altere o ID de `text1` para `trackingId`

## Carregar o Script de Suporte

Neste ponto, você já converteu a primeira tag `<script/>`, mas também precisa carregá-la no script de suporte:

```html
<script async src='https://www.google-analytics.com/analytics.js'></script>
```

Converta para:

```javascript
const injectScript = require('injectScript');
const url = 'https://www.google-analytics.com/analytics.js';
injectScript(url, data.gtmOnSuccess, data.gtmOnFailure, url);
```

> **Observação**: o URL do script geralmente é um valor `cacheToken` adequado.

Transmitir um `cacheToken` para `injectScript()` permite uma otimização. Nos cenários a seguir, o script analytics.js será carregado apenas quando:

- uma tag for executada várias vezes
- houver mais de uma tag desse modelo personalizado no mesmo contêiner
- outros modelos usarem `injectScript()` com o mesmo `cacheToken`

> **Importante**: lembre-se de informar a chamada de `data.gtmOnSuccess` para `injectScript()`. É preciso chamar `data.gtmOnSuccess` para todos os modelos personalizados. Se você enviar seu próprio callback de sucesso, ele precisará chamar `data.gtmOnSuccess`.

## Configurar Permissões

Se você tentou executar esse código anteriormente, deve ter notado alguns erros no console.

Esses erros aparecem porque o JavaScript no modo sandbox exige que você declare os valores e URLs acessados. Neste exemplo, você precisa acessar as variáveis globais `ga.q`, `ga.l` e `ga`, e injetar um script hospedado em `https://www.google-analytics.com/analytics.js`.

### Permissões Global Variables

Para configurar as permissões Global Variables, faça o seguinte:

1. Navegue até a guia **Permissions**, expanda **Accesses Global Variables** e clique em **Add Key**
2. Use o `ga` para a chave e marque as caixas ao lado de **Read**, **Write** e **Execute**
3. Repita esse processo para `ga.q` e `ga.l`. Esses campos não precisam da permissão **Execute**

### Permissões Inject Scripts

Nesse ponto, se você clicar novamente em **Executar código**, um novo erro será exibido no console. Desta vez, o erro mencionará Inject Scripts.

Para configurar a permissão do Inject Scripts, faça o seguinte:

1. Adicione `https://www.google-analytics.com/analytics.js` ao **Allowed URL Match Patterns**

> **Observação**: o URL Match Patterns permite o uso de caracteres curinga no subdomínio e no caminho, então você pode utilizar `https://www.google-analytics.com/*`. No entanto, se possível, prefira padrões de correspondência mais específicos. Veja a [política sobre o inject_script](https://developers.google.com/tag-platform/tag-manager/templates/permissions?hl=pt-br#inject_script) para saber todos os detalhes.

Agora, ao clicar em **Executar código**, não haverá mais erros no console. Você converteu a tag em um modelo personalizado. Clique em **Save** e use a nova tag como qualquer outra tag no Gerenciador de tags do Google.

## Tag Convertida (Código Final)

O resultado final do JavaScript no modo sandbox será parecido com este:

```javascript
const setInWindow = require('setInWindow');
const copyFromWindow = require('copyFromWindow');
const createArgumentsQueue = require('createArgumentsQueue');
const getTimestamp = require('getTimestamp');
const injectScript = require('injectScript');

const trackingId = data.trackingId;
const ga = createArgumentsQueue('ga', 'ga.q');

setInWindow('ga.l', getTimestamp(), false);
ga('create', trackingId, 'auto');
ga('send', 'pageview');

const url = 'https://www.google-analytics.com/analytics.js';
injectScript(url, data.gtmOnSuccess, data.gtmOnFailure, url);
```

---

**Fonte**: [Google Tag Manager Templates - Converter uma tag existente](https://developers.google.com/tag-platform/tag-manager/templates/convert-existing-tag?hl=pt-br)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
