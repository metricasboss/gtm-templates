# JavaScript no Modo Sandbox

É um subconjunto simplificado da linguagem JavaScript que oferece uma maneira segura para executar a lógica arbitrária de JavaScript diretamente dos modelos personalizados do Gerenciador de tags do Google. Para proporcionar esse ambiente de execução seguro, alguns recursos do JavaScript foram restringidos ou removidos. O JavaScript no modo sandbox baseia-se no **ECMAScript 5.1**. Estão disponíveis recursos do **ECMAScript 6** como funções de seta e declarações `const`/`let`.

## Ambiente de Execução Global

O JavaScript no modo sandbox não pode ser usado no ambiente de execução global como o JavaScript normal, então o objeto `window` e as respectivas propriedades não estão disponíveis. Isso inclui:

- Métodos definidos no escopo global (como `encodeURI` ou `setTimeout`)
- Valores globais (como `location` ou `document`)
- Valores globais definidos pelos scripts carregados

Para substituí-los, uma função `require` global que oferece muitas dessas funções está disponível para todos os JavaScript no modo sandbox. Os valores podem ser lidos na janela com o utilitário [`copyFromWindow`](https://developers.google.com/tag-platform/tag-manager/templates/api?hl=pt-br#copyfromwindow).

> **Observação**: `copyFromWindow` cria uma cópia detalhada dos valores. Incluir esses valores no sandbox ou retirá-los dele pode ser uma operação cara.

## Sistema de Tipo Simplificado

O JavaScript no modo sandbox é compatível com os seguintes tipos:

- `null`
- `undefined`
- `string`
- `number`
- `boolean`
- `array`
- `object`
- `function`

### Limitações

- As matrizes e os objetos são criados usando a sintaxe literal (`[]` `{}`)
- Como não há acesso ao ambiente de execução global padrão, construtores globais como `String()` e `Number()` não estão disponíveis
- Não há palavra-chave `new` no JavaScript no modo sandbox
- As funções não têm acesso à palavra-chave `this`
- Alguns métodos nativos também foram removidos

Consulte a [biblioteca padrão](https://developers.google.com/tag-platform/tag-manager/templates/standard-library?hl=pt-br) para ver a lista completa dos métodos nativos aceitos.

## Formato de Código do Modelo Personalizado

O código escrito para implementar um modelo personalizado representa o corpo de uma função que será executada sempre que:

- Sua tag for disparada, ou
- A variável for avaliada

Essa função tem um único parâmetro `data` que contém todos os valores configurados na IU para essa tag ou instância de variável, com as chaves definidas como os nomes dos parâmetros de modelo especificados no modelo personalizado.

## Exemplo de Implementação de Tag de Beacon

```javascript
const sendPixel = require('sendPixel');
const encodeUri = require('encodeUri');
const encodeUriComponent = require('encodeUriComponent');

let url = encodeUri(data['url']);

if (data['useCacheBuster']) {
  const encode = require('encodeUriComponent');
  const cacheBusterQueryParam = data['cacheBusterQueryParam'] || 'gtmcb';
  const last = url.charAt(url.length - 1);
  let delimiter = '&';

  if (url.indexOf('?') < 0) {
    delimiter = '?';
  } else if (last == '?' || last == '&') {
    delimiter = '';
  }

  url += delimiter +
    encodeUriComponent(cacheBusterQueryParam) + '=' + encodeUriComponent(data['randomNumber']);
}

sendPixel(url, data['gtmOnSuccess'], data['gtmOnFailure']);
```

---

**Fonte**: [Google Tag Manager Templates - JavaScript no modo sandbox](https://developers.google.com/tag-platform/tag-manager/templates/sandboxed-javascript?hl=pt-br)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)

Última atualização: 2022-12-05 UTC
