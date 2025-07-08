___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "FPID Cleaner",
  "description": {
    "text": "This template processes raw FPID values by removing cookie name prefixes and version identifiers, then performs URL decoding to extract the actual FPID value.",
    "translations": [
      {
        "locale": "br",
        "text": "Este template processa valores brutos de FPID removendo prefixos de nome de cookie e identificadores de versão, em seguida realiza decodificação de URL para extrair o valor real do FPID"
      }
    ]
  },
  "containerContexts": [
    "SERVER"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "fpid",
    "displayName": {
      "text": "Insert the variable that represents the value of the FPID cookie",
      "translations": [
        {
          "locale": "br",
          "text": "Coloque a variável que representa o valor do cookie FPID"
        }
      ]
    },
    "simpleValueType": true
  },
  {
    "type": "CHECKBOX",
    "name": "enableLog",
    "checkboxText": {
      "text": "Enable Logs",
      "translations": [
        {
          "locale": "br",
          "text": "Habilitar registros"
        }
      ]
    },
    "simpleValueType": true
  }
]


___SANDBOXED_JS_FOR_SERVER___

const makeString = require('makeString');
const logToConsole = require('logToConsole');
const decodeUriComponent = require('decodeUriComponent');

function log(message) {
  if (data.enableLog) {
    logToConsole('[FPID Cleaner] ' + message);
  }
}

const rawFpid = data.fpid;

if (!rawFpid || typeof rawFpid !== 'string') {
  log('Input value is not a valid string. Returning empty.');
  return '';
}

const parts = rawFpid.split('.');

const isNumber = function(str) {
  if (!str || str.length === 0) return false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (char < '0' || char > '9') {
      return false;
    }
  }
  return true;
};

if (parts.length >= 3 && isNumber(parts[1])) {
  const encodedContent = parts.slice(2).join('.');
  const cleanFpid = decodeUriComponent(encodedContent);
  
  log('Raw FPID: ' + rawFpid + ' -> Clean FPID (decoded): ' + cleanFpid);
  return makeString(cleanFpid);
} else {
  log('FPID not in expected pattern. Returning raw value: ' + rawFpid);
  return makeString(rawFpid);
}


___SERVER_PERMISSIONS___

[
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
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios: []


___NOTES___

Created on 08/07/2025, 15:37:45


