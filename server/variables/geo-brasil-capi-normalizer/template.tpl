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
  "description": "Normaliza dados geográficos brasileiros (cidade, estado, país) vindos dos headers x-geo-* da Stape para formato compatível com APIs de conversão (Facebook CAPI, Google Ads, TikTok). Usa jsDelivr (CDN gratuito) para mapeamento de estados e normalização algorítmica local para cidades.",
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
    "name": "configGroup",
    "displayName": "Configuração do CDN",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "TEXT",
        "name": "cdnBaseUrl",
        "displayName": "Base URL do jsDelivr",
        "simpleValueType": true,
        "defaultValue": "https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data",
        "help": "URL base do CDN onde estão os JSONs de mapeamento. Use o padrão ou customize para seu fork do repositório.",
        "valueValidators": [
          {
            "type": "NON_EMPTY"
          },
          {
            "type": "REGEX",
            "args": ["^https?://.*"]
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "cdnTimeout",
        "displayName": "Timeout do CDN (ms)",
        "simpleValueType": true,
        "defaultValue": "2000",
        "help": "Tempo máximo de espera pela resposta do CDN em milissegundos",
        "valueValidators": [
          {
            "type": "POSITIVE_NUMBER"
          }
        ]
      }
    ]
  },
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
            "displayValue": "Estado (nome completo)"
          },
          {
            "value": "state_code",
            "displayValue": "Estado (código/sigla)"
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
            "value": "country_code",
            "displayValue": "País (código)"
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
    "name": "cacheGroup",
    "displayName": "Configuração de Cache",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "CHECKBOX",
        "name": "enableCache",
        "checkboxText": "Habilitar cache local",
        "simpleValueType": true,
        "defaultValue": true,
        "help": "Armazena resultados em cache (templateStorage) para reduzir chamadas à API e melhorar performance"
      },
      {
        "type": "TEXT",
        "name": "cacheTtl",
        "displayName": "Cache TTL (segundos)",
        "simpleValueType": true,
        "defaultValue": "3600",
        "help": "Tempo de vida do cache em segundos. Padrão: 3600 (1 hora)",
        "enablingConditions": [
          {
            "paramName": "enableCache",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "valueValidators": [
          {
            "type": "POSITIVE_NUMBER"
          }
        ]
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "fallbackGroup",
    "displayName": "Fallback e Recuperação",
    "groupStyle": "ZIPPY_CLOSED",
    "subParams": [
      {
        "type": "RADIO",
        "name": "cityNormalizationMode",
        "displayName": "Modo de normalização de cidades",
        "radioItems": [
          {
            "value": "algorithmic",
            "displayValue": "Algorítmica (remove acentos/espaços)"
          },
          {
            "value": "passthrough",
            "displayValue": "Passthrough (mantém original)"
          }
        ],
        "simpleValueType": true,
        "defaultValue": "algorithmic",
        "help": "Modo algorítmico: 'São Paulo' → 'saopaulo'. Passthrough: mantém 'São Paulo' (não recomendado para CAPI)"
      },
      {
        "type": "CHECKBOX",
        "name": "enableDebug",
        "checkboxText": "Habilitar logs de debug",
        "simpleValueType": true,
        "defaultValue": false,
        "help": "Registra informações detalhadas no console para debugging"
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "sourceGroup",
    "displayName": "Origem dos Dados (Avançado)",
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

const sendHttpRequest = require('sendHttpRequest');
const getRequestHeader = require('getRequestHeader');
const JSON = require('JSON');
const templateStorage = require('templateStorage');
const getTimestampMillis = require('getTimestampMillis');
const sha256Sync = require('sha256Sync');
const logToConsole = require('logToConsole');

// ============================================
// CONFIGURAÇÃO
// ============================================

const CDN_BASE_URL = data.cdnBaseUrl;
const OUTPUT_TYPE = data.outputType;
const CACHE_ENABLED = data.enableCache;
const CACHE_TTL = (data.cacheTtl || 3600) * 1000;
const CITY_MODE = data.cityNormalizationMode || 'algorithmic';
const DEBUG = data.enableDebug;
const CDN_TIMEOUT = data.cdnTimeout || 2000;

// ============================================
// LOGGING
// ============================================

const log = function(message, obj) {
  if (!DEBUG) return;
  if (obj) {
    logToConsole('[Geo Brasil]', message, obj);
  } else {
    logToConsole('[Geo Brasil]', message);
  }
};

// ============================================
// DADOS DE FALLBACK (se jsDelivr falhar)
// ============================================

const ESTADOS_FALLBACK = {
  'AC': { code: 'ac', name: 'acre' },
  'AL': { code: 'al', name: 'alagoas' },
  'AP': { code: 'ap', name: 'amapa' },
  'AM': { code: 'am', name: 'amazonas' },
  'BA': { code: 'ba', name: 'bahia' },
  'CE': { code: 'ce', name: 'ceara' },
  'DF': { code: 'df', name: 'distritofederal' },
  'ES': { code: 'es', name: 'espiritosanto' },
  'GO': { code: 'go', name: 'goias' },
  'MA': { code: 'ma', name: 'maranhao' },
  'MT': { code: 'mt', name: 'matogrosso' },
  'MS': { code: 'ms', name: 'matogrossodosul' },
  'MG': { code: 'mg', name: 'minasgerais' },
  'PA': { code: 'pa', name: 'para' },
  'PB': { code: 'pb', name: 'paraiba' },
  'PR': { code: 'pr', name: 'parana' },
  'PE': { code: 'pe', name: 'pernambuco' },
  'PI': { code: 'pi', name: 'piaui' },
  'RJ': { code: 'rj', name: 'riodejaneiro' },
  'RN': { code: 'rn', name: 'riograndedonorte' },
  'RS': { code: 'rs', name: 'riograndedosul' },
  'RO': { code: 'ro', name: 'rondonia' },
  'RR': { code: 'rr', name: 'roraima' },
  'SC': { code: 'sc', name: 'santacatarina' },
  'SP': { code: 'sp', name: 'saopaulo' },
  'SE': { code: 'se', name: 'sergipe' },
  'TO': { code: 'to', name: 'tocantins' }
};

const PAISES_FALLBACK = {
  'BR': { code: 'br', name: 'brazil' },
  'US': { code: 'us', name: 'unitedstates' },
  'PT': { code: 'pt', name: 'portugal' },
  'AR': { code: 'ar', name: 'argentina' },
  'UY': { code: 'uy', name: 'uruguay' },
  'PY': { code: 'py', name: 'paraguay' },
  'CL': { code: 'cl', name: 'chile' },
  'CO': { code: 'co', name: 'colombia' },
  'MX': { code: 'mx', name: 'mexico' }
};

// ============================================
// FUNÇÕES DE NORMALIZAÇÃO (FALLBACK)
// ============================================

const normalizar = function(texto) {
  if (!texto) return '';

  const mapa = {
    'á':'a', 'à':'a', 'ã':'a', 'â':'a', 'ä':'a',
    'é':'e', 'è':'e', 'ê':'e', 'ë':'e',
    'í':'i', 'ì':'i', 'î':'i', 'ï':'i',
    'ó':'o', 'ò':'o', 'õ':'o', 'ô':'o', 'ö':'o',
    'ú':'u', 'ù':'u', 'û':'u', 'ü':'u',
    'ç':'c', 'ñ':'n',
    'Á':'a', 'À':'a', 'Ã':'a', 'Â':'a', 'Ä':'a',
    'É':'e', 'È':'e', 'Ê':'e', 'Ë':'e',
    'Í':'i', 'Ì':'i', 'Î':'i', 'Ï':'i',
    'Ó':'o', 'Ò':'o', 'Õ':'o', 'Ô':'o', 'Ö':'o',
    'Ú':'u', 'Ù':'u', 'Û':'u', 'Ü':'u',
    'Ç':'c', 'Ñ':'n'
  };

  var result = '';
  for (var i = 0; i < texto.length; i++) {
    var c = texto.charAt(i);
    result += mapa[c] || c;
  }

  return result.toLowerCase().split(' ').join('').replace(/[^a-z0-9]/g, '');
};

const processarComDados = function(city, state, country, estadosData, paisesData) {
  log('Processando dados geográficos', { city: city, state: state, country: country });

  // Normaliza cidade
  const cityNorm = CITY_MODE === 'algorithmic' ? normalizar(city) : city.toLowerCase().trim();

  // Processa estado
  const stateUpper = state ? state.toUpperCase() : '';
  const stateData = estadosData[stateUpper] || {
    code: normalizar(state),
    name: normalizar(state)
  };

  // Processa país
  const countryUpper = country ? country.toUpperCase() : '';
  const countryData = paisesData[countryUpper] || {
    code: normalizar(country),
    name: normalizar(country)
  };

  return {
    city: cityNorm,
    city_sha256: cityNorm ? sha256Sync(cityNorm, {outputEncoding: 'hex'}) : '',
    state: stateData.name,
    state_code: stateData.code,
    state_sha256: stateData.name ? sha256Sync(stateData.name, {outputEncoding: 'hex'}) : '',
    country: countryData.name,
    country_code: countryData.code,
    country_sha256: countryData.name ? sha256Sync(countryData.name, {outputEncoding: 'hex'}) : ''
  };
};

// ============================================
// FUNÇÃO DE EXTRAÇÃO DE VALOR
// ============================================

const extrairValor = function(resultado, tipo) {
  if (tipo === 'full_object') {
    return resultado;
  }
  return resultado[tipo] || '';
};

// ============================================
// LEITURA DOS DADOS GEOGRÁFICOS
// ============================================

var city, state, country;

if (data.dataSource === 'custom') {
  city = data.customCity || '';
  state = data.customState || '';
  country = data.customCountry || '';
  log('Usando valores customizados', { city: city, state: state, country: country });
} else {
  city = getRequestHeader('x-geo-city') || '';
  state = getRequestHeader('x-geo-region') || '';
  country = getRequestHeader('x-geo-country') || '';
  log('Lendo headers', { city: city, state: state, country: country });
}

// Se não há dados, retorna vazio
if (!city && !state && !country) {
  log('Nenhum dado geográfico encontrado');
  return OUTPUT_TYPE === 'full_object' ? {} : '';
}

// ============================================
// CACHE DE RESULTADO FINAL
// ============================================

const resultCacheKey = 'geo_result_' + city + '_' + state + '_' + country;
const now = getTimestampMillis();

if (CACHE_ENABLED) {
  const cachedResult = templateStorage.getItem(resultCacheKey);
  if (cachedResult && cachedResult.data && (now - cachedResult.timestamp) < CACHE_TTL) {
    log('Cache HIT (resultado)', { key: resultCacheKey });
    return extrairValor(cachedResult.data, OUTPUT_TYPE);
  }
  log('Cache MISS (resultado)', { key: resultCacheKey });
}

// ============================================
// BUSCA MAPEAMENTOS DO jsDelivr
// ============================================

const estadosCacheKey = 'geo_cdn_estados';
const paisesCacheKey = 'geo_cdn_paises';

// Verifica cache dos JSONs do CDN
var estadosData = null;
var paisesData = null;

if (CACHE_ENABLED) {
  const cachedEstados = templateStorage.getItem(estadosCacheKey);
  const cachedPaises = templateStorage.getItem(paisesCacheKey);

  if (cachedEstados && (now - cachedEstados.timestamp) < CACHE_TTL) {
    estadosData = cachedEstados.data;
    log('Cache HIT (estados)');
  }

  if (cachedPaises && (now - cachedPaises.timestamp) < CACHE_TTL) {
    paisesData = cachedPaises.data;
    log('Cache HIT (paises)');
  }
}

// Se tem tudo em cache, processa e retorna
if (estadosData && paisesData) {
  log('Usando dados do cache CDN');
  const result = processarComDados(city, state, country, estadosData, paisesData);

  if (CACHE_ENABLED) {
    templateStorage.setItem(resultCacheKey, {
      data: result,
      timestamp: now
    });
  }

  return extrairValor(result, OUTPUT_TYPE);
}

// Precisa buscar do CDN
log('Buscando mapeamentos do jsDelivr');

// URLs dos JSONs
const estadosUrl = CDN_BASE_URL + '/' + 'estados.json';
const paisesUrl = CDN_BASE_URL + '/' + 'paises.json';

// Contador para sincronizar as duas requisições
var requestsCompleted = 0;
var hasError = false;

// Função para processar quando ambas requisições terminarem
const processarQuandoPronto = function() {
  if (requestsCompleted < 2) return;

  // Se houve erro, usa fallback
  if (hasError || !estadosData || !paisesData) {
    log('Erro ao buscar JSONs do CDN, usando fallback');
    estadosData = ESTADOS_FALLBACK;
    paisesData = PAISES_FALLBACK;
  }

  // Processa os dados
  const result = processarComDados(city, state, country, estadosData, paisesData);

  // Salva no cache
  if (CACHE_ENABLED) {
    if (!hasError) {
      // Salva os JSONs do CDN no cache
      templateStorage.setItem(estadosCacheKey, {
        data: estadosData,
        timestamp: now
      });
      templateStorage.setItem(paisesCacheKey, {
        data: paisesData,
        timestamp: now
      });
      log('JSONs do CDN salvos no cache');
    }

    // Salva o resultado no cache
    templateStorage.setItem(resultCacheKey, {
      data: result,
      timestamp: now
    });
    log('Resultado salvo no cache');
  }

  return extrairValor(result, OUTPUT_TYPE);
};

// Busca estados.json
if (!estadosData) {
  log('Buscando estados.json', { url: estadosUrl });
  sendHttpRequest(estadosUrl, function(statusCode, headers, body) {
    requestsCompleted++;

    if (statusCode === 200) {
      try {
        const parsed = JSON.parse(body);
        // Remove _meta
        delete parsed._meta;
        estadosData = parsed;
        log('Estados carregados com sucesso');
      } catch (e) {
        log('Erro ao parsear estados.json', { error: e });
        hasError = true;
      }
    } else {
      log('Erro ao buscar estados.json', { statusCode: statusCode });
      hasError = true;
    }

    return processarQuandoPronto();
  }, {
    method: 'GET',
    timeout: CDN_TIMEOUT
  });
} else {
  requestsCompleted++;
}

// Busca paises.json
if (!paisesData) {
  log('Buscando paises.json', { url: paisesUrl });
  sendHttpRequest(paisesUrl, function(statusCode, headers, body) {
    requestsCompleted++;

    if (statusCode === 200) {
      try {
        const parsed = JSON.parse(body);
        // Remove _meta
        delete parsed._meta;
        paisesData = parsed;
        log('Países carregados com sucesso');
      } catch (e) {
        log('Erro ao parsear paises.json', { error: e });
        hasError = true;
      }
    } else {
      log('Erro ao buscar paises.json', { statusCode: statusCode });
      hasError = true;
    }

    return processarQuandoPronto();
  }, {
    method: 'GET',
    timeout: CDN_TIMEOUT
  });
} else {
  requestsCompleted++;
}


___SERVER_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "send_http",
        "versionId": "1"
      },
      "param": [
        {
          "key": "allowedUrls",
          "value": {
            "type": 1,
            "string": "any"
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
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
  },
  {
    "instance": {
      "key": {
        "publicId": "access_template_storage",
        "versionId": "1"
      },
      "param": []
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "isRequired": true
  }
]


___TESTS___

scenarios:
- name: Deve normalizar cidade com acentos (fallback CDN)
  code: |-
    const mockData = {
      cdnBaseUrl: 'https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data',
      outputType: 'city',
      enableCache: false,
      cityNormalizationMode: 'algorithmic',
      enableDebug: false,
      cdnTimeout: 2000,
      dataSource: 'custom',
      customCity: 'Juiz de Fora',
      customState: 'MG',
      customCountry: 'BR'
    };

    // Simula CDN offline - deve usar fallback interno
    mock('sendHttpRequest', function(url, callback) {
      callback(500, {}, '');
    });

    const result = runCode(mockData);
    assertThat(result).isEqualTo('juizdefora');

- name: Deve retornar estado completo (fallback CDN)
  code: |-
    const mockData = {
      cdnBaseUrl: 'https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data',
      outputType: 'state',
      enableCache: false,
      cityNormalizationMode: 'algorithmic',
      enableDebug: false,
      cdnTimeout: 2000,
      dataSource: 'custom',
      customCity: '',
      customState: 'MG',
      customCountry: 'BR'
    };

    mock('sendHttpRequest', function(url, callback) {
      callback(500, {}, '');
    });

    const result = runCode(mockData);
    assertThat(result).isEqualTo('minasgerais');

- name: Deve retornar código do estado (fallback CDN)
  code: |-
    const mockData = {
      cdnBaseUrl: 'https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data',
      outputType: 'state_code',
      enableCache: false,
      cityNormalizationMode: 'algorithmic',
      enableDebug: false,
      cdnTimeout: 2000,
      dataSource: 'custom',
      customCity: '',
      customState: 'MG',
      customCountry: ''
    };

    mock('sendHttpRequest', function(url, callback) {
      callback(500, {}, '');
    });

    const result = runCode(mockData);
    assertThat(result).isEqualTo('mg');

- name: Deve retornar país normalizado (fallback CDN)
  code: |-
    const mockData = {
      cdnBaseUrl: 'https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data',
      outputType: 'country',
      enableCache: false,
      cityNormalizationMode: 'algorithmic',
      enableDebug: false,
      cdnTimeout: 2000,
      dataSource: 'custom',
      customCity: '',
      customState: '',
      customCountry: 'BR'
    };

    mock('sendHttpRequest', function(url, callback) {
      callback(500, {}, '');
    });

    const result = runCode(mockData);
    assertThat(result).isEqualTo('brazil');

- name: Deve retornar vazio quando não há dados
  code: |-
    const mockData = {
      cdnBaseUrl: 'https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data',
      outputType: 'city',
      enableCache: false,
      cityNormalizationMode: 'algorithmic',
      enableDebug: false,
      cdnTimeout: 2000,
      dataSource: 'custom',
      customCity: '',
      customState: '',
      customCountry: ''
    };

    const result = runCode(mockData);
    assertThat(result).isEqualTo('');

- name: Deve retornar SHA256 da cidade (fallback CDN)
  code: |-
    const mockData = {
      cdnBaseUrl: 'https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data',
      outputType: 'city_sha256',
      enableCache: false,
      cityNormalizationMode: 'algorithmic',
      enableDebug: false,
      cdnTimeout: 2000,
      dataSource: 'custom',
      customCity: 'São Paulo',
      customState: 'SP',
      customCountry: 'BR'
    };

    mock('sendHttpRequest', function(url, callback) {
      callback(500, {}, '');
    });

    const result = runCode(mockData);
    // SHA256 de "saopaulo"
    assertThat(result).isNotEqualTo('');
    assertThat(result.length).isEqualTo(64);


___NOTES___

# Geo Brasil CAPI Normalizer v1.0.0

## Descrição
Template de variável Server-Side que normaliza dados geográficos brasileiros (cidade, estado, país) para formato compatível com APIs de conversão (Facebook CAPI, Google Ads, TikTok, etc.).

## Recursos
- ✅ Normalização de cidade, estado e país
- ✅ Geração SHA256 nativa para Facebook/Meta CAPI
- ✅ Cache local em 3 níveis para máxima performance
- ✅ Busca mapeamentos do jsDelivr (CDN gratuito)
- ✅ Fallback interno se CDN falhar
- ✅ Lê headers x-geo-* da Stape automaticamente
- ✅ Suporte a valores customizados
- ✅ Logs de debug opcionais
- ✅ 100% gratuito (sem custos de API)

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
| Geo - State Code | state_code |
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
    "region": "{{Geo - State Code}}",
    "country": "{{Geo - Country Code}}"
  }
}
```

## Configurações

### Cache
- **Habilitado por padrão**: Sim
- **TTL padrão**: 3600 segundos (1 hora)
- **Storage**: templateStorage (local ao container)

### Fallback
- **Habilitado por padrão**: Sim
- **Método**: Normalização algorítmica (remove acentos, espaços e caracteres especiais)
- **Ativa quando**: API não responde ou retorna erro

### Debug
- Habilite "Logs de debug" para ver informações detalhadas no console
- Útil para troubleshooting

## API Endpoint

### Padrão
```
https://geo.metricasboss.workers.dev/geo/normalize
```

### Customizado
Se você deployou sua própria instância da API, altere o campo "URL da API" na configuração.

## Formato de Resposta da API

```json
{
  "city": "juizdefora",
  "city_sha256": "8a9b7c6d...",
  "state": "minasgerais",
  "state_code": "mg",
  "state_sha256": "1a2b3c...",
  "country": "brazil",
  "country_code": "br",
  "country_sha256": "3c4d5e..."
}
```

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

## Performance
- **Cache hit**: ~1-2ms
- **Cache miss (API)**: ~50-150ms
- **Fallback local**: ~5-10ms

## Autor
**Métricas Boss**
- Site: https://metricasboss.com.br
- Suporte: suporte@metricasboss.com.br
- GitHub: https://github.com/metricasboss

## Licença
MIT License - Uso livre para projetos comerciais e pessoais

## Changelog

### v1.0.0 (2025-12-05)
- Release inicial
- Normalização de cidade, estado e país
- Suporte a SHA256
- Cache local com templateStorage
- Fallback algorítmico
- Logs de debug
