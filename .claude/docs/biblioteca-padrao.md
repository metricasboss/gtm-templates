# Biblioteca Padrão - JavaScript no Modo Sandbox

Esta biblioteca fornece métodos nativos de JavaScript disponíveis no ambiente sandbox do Google Tag Manager.

## Visão Geral

O sandbox do GTM aceita um conjunto limitado de métodos nativos de JavaScript para manipulação de arrays, strings e outros tipos. Estes métodos complementam as APIs globais acessadas via `require()`.

---

## Métodos de Array

O sandbox aceita **20 métodos de array**:

### Iteração

#### forEach

Executa função para cada elemento do array.

```javascript
const array = [1, 2, 3, 4, 5];
array.forEach((item, index) => {
  // Processar cada item
});
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

#### map

Cria novo array com resultados da função aplicada a cada elemento.

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2);
// [2, 4, 6, 8, 10]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

#### filter

Cria novo array com elementos que passam no teste.

```javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter((num) => num % 2 === 0);
// [2, 4, 6]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

#### reduce

Reduz array a um único valor.

```javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
// 15
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

#### reduceRight

Reduz array da direita para esquerda.

```javascript
const array = ['a', 'b', 'c'];
const result = array.reduceRight((acc, curr) => acc + curr);
// 'cba'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)

#### every

Testa se todos os elementos passam no teste.

```javascript
const numbers = [2, 4, 6, 8];
const allEven = numbers.every((num) => num % 2 === 0);
// true
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)

#### some

Testa se pelo menos um elemento passa no teste.

```javascript
const numbers = [1, 3, 5, 6, 7];
const hasEven = numbers.some((num) => num % 2 === 0);
// true
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)

---

### Manipulação

#### push

Adiciona elementos ao final do array.

```javascript
const array = [1, 2, 3];
array.push(4, 5);
// array agora é [1, 2, 3, 4, 5]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)

#### pop

Remove e retorna o último elemento.

```javascript
const array = [1, 2, 3];
const last = array.pop();
// last = 3, array = [1, 2]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

#### shift

Remove e retorna o primeiro elemento.

```javascript
const array = [1, 2, 3];
const first = array.shift();
// first = 1, array = [2, 3]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)

#### unshift

Adiciona elementos ao início do array.

```javascript
const array = [3, 4, 5];
array.unshift(1, 2);
// array = [1, 2, 3, 4, 5]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)

#### splice

Adiciona/remove elementos em posições específicas.

```javascript
const array = [1, 2, 3, 4, 5];

// Remove 2 elementos a partir do índice 2
array.splice(2, 2);
// array = [1, 2, 5]

// Adiciona elementos no índice 1
array.splice(1, 0, 'a', 'b');
// array = [1, 'a', 'b', 2, 5]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

#### concat

Combina arrays.

```javascript
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const combined = array1.concat(array2);
// [1, 2, 3, 4, 5, 6]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)

#### slice

Retorna cópia de parte do array.

```javascript
const array = [1, 2, 3, 4, 5];
const sliced = array.slice(1, 4);
// [2, 3, 4]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

#### reverse

Inverte ordem dos elementos (modifica o array original).

```javascript
const array = [1, 2, 3, 4, 5];
array.reverse();
// array = [5, 4, 3, 2, 1]
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

---

### Busca

#### indexOf

Retorna índice da primeira ocorrência do elemento.

```javascript
const array = ['a', 'b', 'c', 'd', 'b'];
const index = array.indexOf('b');
// 1
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)

#### lastIndexOf

Retorna índice da última ocorrência do elemento.

```javascript
const array = ['a', 'b', 'c', 'd', 'b'];
const index = array.lastIndexOf('b');
// 4
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf)

---

### Utilitários

#### join

Junta elementos em string.

```javascript
const array = ['a', 'b', 'c'];
const joined = array.join('-');
// 'a-b-c'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)

#### sort

Ordena elementos (modifica o array original).

```javascript
const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
numbers.sort((a, b) => a - b);
// [1, 1, 2, 3, 4, 5, 6, 9]

const words = ['banana', 'apple', 'cherry'];
words.sort();
// ['apple', 'banana', 'cherry']
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

#### toString

Converte array em string.

```javascript
const array = [1, 2, 3];
const str = array.toString();
// '1,2,3'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)

---

## Métodos de String

O sandbox aceita **15 métodos de string**:

### Busca e Substituição

#### indexOf

Retorna índice da primeira ocorrência da substring.

```javascript
const str = 'Hello World';
const index = str.indexOf('World');
// 6
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)

#### lastIndexOf

Retorna índice da última ocorrência da substring.

```javascript
const str = 'Hello World World';
const index = str.lastIndexOf('World');
// 12
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf)

#### match

Retorna array com correspondências de regex.

```javascript
const str = 'The year is 2024';
const matches = str.match(/\d+/g);
// ['2024']
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)

#### replace

Substitui substring ou padrão regex.

```javascript
const str = 'Hello World';
const replaced = str.replace('World', 'GTM');
// 'Hello GTM'

const str2 = 'foo bar foo';
const replaced2 = str2.replace(/foo/g, 'baz');
// 'baz bar baz'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

#### search

Retorna índice da primeira correspondência de regex.

```javascript
const str = 'The answer is 42';
const index = str.search(/\d+/);
// 14
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search)

---

### Extração

#### charAt

Retorna caractere em índice específico.

```javascript
const str = 'Hello';
const char = str.charAt(1);
// 'e'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt)

#### slice

Extrai parte da string.

```javascript
const str = 'Hello World';
const part = str.slice(0, 5);
// 'Hello'

const end = str.slice(-5);
// 'World'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice)

#### substring

Extrai substring entre dois índices.

```javascript
const str = 'Hello World';
const sub = str.substring(6, 11);
// 'World'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring)

---

### Conversão de Caso

#### toLowerCase

Converte para minúsculas.

```javascript
const str = 'Hello World';
const lower = str.toLowerCase();
// 'hello world'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)

#### toUpperCase

Converte para maiúsculas.

```javascript
const str = 'Hello World';
const upper = str.toUpperCase();
// 'HELLO WORLD'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)

#### toLocaleLowerCase

Converte para minúsculas considerando localização.

```javascript
const str = 'ISTANBUL';
const lower = str.toLocaleLowerCase('tr-TR');
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleLowerCase)

#### toLocaleUpperCase

Converte para maiúsculas considerando localização.

```javascript
const str = 'istanbul';
const upper = str.toLocaleUpperCase('tr-TR');
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLocaleUpperCase)

---

### Utilitários

#### concat

Concatena strings.

```javascript
const str1 = 'Hello';
const str2 = 'World';
const combined = str1.concat(' ', str2);
// 'Hello World'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat)

#### split

Divide string em array.

```javascript
const str = 'a,b,c,d';
const array = str.split(',');
// ['a', 'b', 'c', 'd']

const words = 'Hello World'.split(' ');
// ['Hello', 'World']
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

#### trim

Remove espaços em branco do início e fim.

```javascript
const str = '  Hello World  ';
const trimmed = str.trim();
// 'Hello World'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim)

#### toString

Converte para string.

```javascript
const str = 'Hello';
const same = str.toString();
// 'Hello'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toString)

---

## Métodos de Outros Tipos

### Object

#### toString

Converte objeto para string.

```javascript
const obj = {a: 1, b: 2};
const str = obj.toString();
// '[object Object]'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString)

---

### Boolean

#### toString

Converte boolean para string.

```javascript
const bool = true;
const str = bool.toString();
// 'true'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/toString)

---

### Number

#### toString

Converte número para string.

```javascript
const num = 42;
const str = num.toString();
// '42'

const hex = num.toString(16);
// '2a'
```

[Documentação MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString)

---

## Limitações Importantes

> **Observação:** Estes métodos existem dentro do ambiente sandbox, o que significa **acesso restrito** comparado à execução JavaScript sem restrições.

### O que NÃO está disponível:

- Construtores globais como `new String()`, `new Array()`, `new Object()`
- Palavra-chave `new`
- Palavra-chave `this` em funções
- Métodos não listados acima
- Acesso direto ao objeto `window`
- APIs do navegador (DOM, fetch, XMLHttpRequest, etc.)

### Alternativas:

Use as APIs fornecidas via `require()` para funcionalidades não disponíveis nativamente. Consulte a [Referência de APIs](./api-reference.md) para detalhes completos.

---

## Exemplos Práticos

### Processar Array de Produtos

```javascript
const products = [
  {name: 'Product A', price: 10},
  {name: 'Product B', price: 20},
  {name: 'Product C', price: 15}
];

// Filtrar produtos caros
const expensive = products.filter((p) => p.price > 15);

// Calcular total
const total = products.reduce((sum, p) => sum + p.price, 0);

// Extrair apenas nomes
const names = products.map((p) => p.name);
```

### Manipular Strings de URLs

```javascript
const url = 'https://example.com/page?utm_source=google&utm_medium=cpc';

// Extrair query string
const queryStart = url.indexOf('?');
const queryString = url.slice(queryStart + 1);

// Dividir parâmetros
const params = queryString.split('&');

// Processar cada parâmetro
const paramObj = {};
params.forEach((param) => {
  const parts = param.split('=');
  paramObj[parts[0]] = parts[1];
});
```

### Validação e Limpeza de Dados

```javascript
const userInput = '  hello@example.com  ';

// Limpar espaços
const email = userInput.trim().toLowerCase();

// Validar formato
const isValid = email.indexOf('@') > 0 && email.indexOf('.') > email.indexOf('@');
```

---

## Referências

- [Documentação oficial da Biblioteca Padrão](https://developers.google.com/tag-platform/tag-manager/templates/standard-library?hl=pt-br)
- [JavaScript no Modo Sandbox](./javascript-no-modo-sandbox.md)
- [Referência de APIs](./api-reference.md)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)

Última atualização: 2024-02-06 UTC
