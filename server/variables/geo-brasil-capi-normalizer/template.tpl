___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "MACRO",
  "id": "geo_brasil_capi_normalizer",
  "version": 1,
  "securityGroups": [],
  "displayName": "Geo Brasil CAPI Normalizer",
  "description": "Normaliza dados geográficos brasileiros (cidade, estado, país) para formato compatível com APIs de conversão. Remove espaços e converte para minúsculas.",
  "containerContexts": [
    "SERVER"
  ],
  "categories": [
    "UTILITY",
    "TAG_MANAGEMENT"
  ],
  "brand": {
    "id": "metricas_boss",
    "displayName": "Métricas Boss",
    "thumbnail": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "GROUP",
    "name": "outputGroup",
    "displayName": "Tipo de Saída",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "SELECT",
        "name": "outputType",
        "displayName": "Campo a retornar",
        "macrosInSelect": false,
        "selectItems": [
          {
            "value": "city",
            "displayValue": "Cidade (normalizada)"
          },
          {
            "value": "city_sha256",
            "displayValue": "Cidade (SHA256)"
          },
          {
            "value": "state",
            "displayValue": "Estado (normalizado)"
          },
          {
            "value": "state_sha256",
            "displayValue": "Estado (SHA256)"
          },
          {
            "value": "country",
            "displayValue": "País (normalizado)"
          },
          {
            "value": "country_sha256",
            "displayValue": "País (SHA256)"
          },
          {
            "value": "full_object",
            "displayValue": "Objeto completo (todos os campos)"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "city",
        "help": "Selecione qual campo deve ser retornado pela variável. Use 'Objeto completo' para acessar todos os valores."
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "sourceGroup",
    "displayName": "Origem dos Dados",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "RADIO",
        "name": "dataSource",
        "displayName": "Fonte dos dados geográficos",
        "radioItems": [
          {
            "value": "headers",
            "displayValue": "Headers HTTP (padrão Stape)"
          },
          {
            "value": "custom",
            "displayValue": "Valores customizados"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "headers",
        "help": "Por padrão lê dos headers x-geo-*. Use 'custom' para passar valores manualmente."
      },
      {
        "type": "TEXT",
        "name": "customCity",
        "displayName": "Cidade (custom)",
        "simpleValueType": true,
        "help": "Valor customizado para cidade",
        "enablingConditions": [
          {
            "paramName": "dataSource",
            "paramValue": "custom",
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "customState",
        "displayName": "Estado (custom)",
        "simpleValueType": true,
        "help": "Valor customizado para estado",
        "enablingConditions": [
          {
            "paramName": "dataSource",
            "paramValue": "custom",
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "customCountry",
        "displayName": "País (custom)",
        "simpleValueType": true,
        "help": "Valor customizado para país",
        "enablingConditions": [
          {
            "paramName": "dataSource",
            "paramValue": "custom",
            "type": "EQUALS"
          }
        ]
      }
    ]
  }
]


___SANDBOXED_JS_FOR_SERVER___

const getRequestHeader = require('getRequestHeader');
const sha256Sync = require('sha256Sync');

const OUTPUT_TYPE = data.outputType;

const cleanString = function(input) {
  if (!input) return '';
  if (typeof input !== 'string') return '';

  var inputClear = input.toLowerCase().split(' ').join('');
  return inputClear;
};

var city = '';
var state = '';
var country = '';

if (data.dataSource === 'custom') {
  city = data.customCity || '';
  state = data.customState || '';
  country = data.customCountry || '';
} else {
  city = getRequestHeader('x-geo-city') || '';
  state = getRequestHeader('x-geo-region') || '';
  country = getRequestHeader('x-geo-country') || '';
}

if (!city && !state && !country) {
  return OUTPUT_TYPE === 'full_object' ? {} : '';
}

var cityNorm = cleanString(city);
var stateNorm = cleanString(state);
var countryNorm = cleanString(country);

var sha256Options = {};
sha256Options.outputEncoding = 'hex';

var result = {};
result.city = cityNorm;
result.city_sha256 = cityNorm ? sha256Sync(cityNorm, sha256Options) : '';
result.state = stateNorm;
result.state_sha256 = stateNorm ? sha256Sync(stateNorm, sha256Options) : '';
result.country = countryNorm;
result.country_sha256 = countryNorm ? sha256Sync(countryNorm, sha256Options) : '';

if (OUTPUT_TYPE === 'full_object') {
  return result;
}

return result[OUTPUT_TYPE] || '';


___SERVER_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "read_request",
        "versionId": "1"
      },
      "param": [
        {
          "key": "headerWhitelist",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "x-geo-city"
              },
              {
                "type": 1,
                "string": "x-geo-region"
              },
              {
                "type": 1,
                "string": "x-geo-country"
              }
            ]
          }
        },
        {
          "key": "headersAllowed",
          "value": {
            "type": 8,
            "boolean": true
          }
        },
        {
          "key": "requestAccess",
          "value": {
            "type": 1,
            "string": "specific"
          }
        },
        {
          "key": "headerAccess",
          "value": {
            "type": 1,
            "string": "specific"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: Deve normalizar cidade removendo espaços
  code: |-
    const mockData = {
      outputType: 'city',
      dataSource: 'custom',
      customCity: 'São Paulo',
      customState: 'SP',
      customCountry: 'BR'
    };

    const result = runCode(mockData);
    assertThat(result).isEqualTo('sãopaulo');

- name: Deve normalizar estado removendo espaços
  code: |-
    const mockData = {
      outputType: 'state',
      dataSource: 'custom',
      customCity: '',
      customState: 'Minas Gerais',
      customCountry: ''
    };

    const result = runCode(mockData);
    assertThat(result).isEqualTo('minasgerais');

- name: Deve retornar SHA256 da cidade
  code: |-
    const mockData = {
      outputType: 'city_sha256',
      dataSource: 'custom',
      customCity: 'Rio de Janeiro',
      customState: '',
      customCountry: ''
    };

    const result = runCode(mockData);
    assertThat(result).isNotEqualTo('');
    assertThat(result.length).isEqualTo(64);

- name: Deve retornar vazio quando não há dados
  code: |-
    const mockData = {
      outputType: 'city',
      dataSource: 'custom',
      customCity: '',
      customState: '',
      customCountry: ''
    };

    const result = runCode(mockData);
    assertThat(result).isEqualTo('');

- name: Deve retornar objeto completo
  code: |-
    const mockData = {
      outputType: 'full_object',
      dataSource: 'custom',
      customCity: 'Belo Horizonte',
      customState: 'MG',
      customCountry: 'Brasil'
    };

    const result = runCode(mockData);
    assertThat(result.city).isEqualTo('belohorizonte');
    assertThat(result.state).isEqualTo('mg');
    assertThat(result.country).isEqualTo('brasil');


___NOTES___

# Geo Brasil CAPI Normalizer v1.0.0

## Descrição
Template de variável Server-Side que normaliza dados geográficos brasileiros (cidade, estado, país) para formato compatível com APIs de conversão (Facebook CAPI, Google Ads, TikTok, etc.).

## Recursos
- ✅ Normalização simples: lowercase + remove espaços
- ✅ Geração SHA256 nativa para Facebook/Meta CAPI
- ✅ Lê headers x-geo-* da Stape automaticamente
- ✅ Suporte a valores customizados
- ✅ Extremamente leve e rápido

## Como usar

### 1. Importar o template
1. GTM Server-Side → Templates → New
2. Click no menu (⋮) → Import
3. Selecione este arquivo `.tpl`
4. Save

### 2. Criar variáveis
Crie uma variável para cada campo que precisar:

| Nome da Variável | Tipo de Saída |
|------------------|---------------|
| Geo - City | city |
| Geo - City SHA256 | city_sha256 |
| Geo - State | state |
| Geo - State SHA256 | state_sha256 |
| Geo - Country | country |
| Geo - Country SHA256 | country_sha256 |

### 3. Usar nas tags

#### Exemplo Facebook CAPI:
```javascript
{
  "user_data": {
    "ct": "{{Geo - City SHA256}}",
    "st": "{{Geo - State SHA256}}",
    "country": "{{Geo - Country SHA256}}"
  }
}
```

#### Exemplo Google Ads:
```javascript
{
  "user_address": {
    "city": "{{Geo - City}}",
    "region": "{{Geo - State}}",
    "country": "{{Geo - Country}}"
  }
}
```

## Formato de Saída

Para "São Paulo, SP, Brasil":
- city: "sãopaulo"
- state: "sp"
- country: "brasil"

## Headers Lidos (Stape)
- `x-geo-city`: Cidade do usuário
- `x-geo-region`: Estado/região do usuário
- `x-geo-country`: País do usuário

## Compatibilidade
- ✅ Facebook Conversion API (CAPI)
- ✅ Google Ads Enhanced Conversions
- ✅ TikTok Events API
- ✅ Snapchat Conversions API
- ✅ Pinterest Conversions API
- ✅ Qualquer API que aceite dados geográficos normalizados

## Autor
**Métricas Boss**
- Site: https://metricasboss.com.br
- Suporte: suporte@metricasboss.com.br
- GitHub: https://github.com/metricasboss

## Licença
Apache 2.0 License

## Changelog

### v1.0.0 (2025-12-05)
- Release inicial
- Normalização simples (lowercase + remove espaços)
- Suporte a SHA256
- Sem dependências externas
