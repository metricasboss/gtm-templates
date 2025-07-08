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
  "displayName": "Get LocalStorage Key Value",
  "description": {
    "text": "This Google Tag Manager variable template allows you to retrieve specific data stored in the user\u0027s browser localStorage. You simply specify the key for the data you wish to access, and the template will fetch the corresponding value. It also attempts to interpret and parse this retrieved value as a JSON object, making it useful for accessing both simple string data and more complex structured information stored client-side.",
    "translations": [
      {
        "locale": "br",
        "text": "Este modelo de variável do Google Tag Manager permite que você recupere dados específicos armazenados no localStorage do navegador do usuário. Você simplesmente especifica a chave para os dados que deseja acessar, e o modelo buscará o valor correspondente. Ele também tenta interpretar e analisar este valor recuperado como um objeto JSON, tornando-o útil para acessar tanto dados de string simples quanto informações estruturadas mais complexas armazenadas no lado do cliente."
      }
    ]
  },
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "TEXT",
    "name": "key",
    "displayName": {
      "text": "Key",
      "translations": [
        {
          "locale": "br",
          "text": "Chave"
        }
      ]
    },
    "simpleValueType": true
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const log = require('logToConsole');
const queryPermission = require("queryPermission");
const localStorage = require('localStorage');
const JSON = require('JSON');

const localStorageKey = data.key;

if (localStorageKey === "") {
  log("Erro: O campo 'key' (data.key) não pode ser uma string vazia. Por favor, forneça uma chave válida.");
  return undefined;
}

function isValidJSON(stringParaTestar) {
  if (!stringParaTestar) {
    return false;
  }
  return true;
}

if (queryPermission("access_local_storage", "read", localStorageKey)) {
  const storedValue = localStorage.getItem(localStorageKey);

  if (storedValue === null) {
    log("Nenhum valor encontrado no localStorage para a chave:", localStorageKey);
    return false;
  }

  log("Valor encontrado no localStorage:", storedValue);

  if (isValidJSON(storedValue)) {
    log("Tentando fazer o parse do valor como JSON.");
    const parsedValue = JSON.parse(storedValue);
    log("O valor é JSON válido. Retornando o objeto parseado.");
    return parsedValue;
  } else {
    log("O valor é uma string nula, indefinida ou vazia. Retornando como está.");
    return storedValue;
  }
} else {
  log("Permissão negada para acessar o localStorage com a chave:", localStorageKey);
}

log("Permissão negada ou o script chegou ao fim do fluxo principal. Retornando 'true' por padrão.");
return true;


___WEB_PERMISSIONS___

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
  },
  {
    "instance": {
      "key": {
        "publicId": "access_local_storage",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "login"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": false
                  }
                ]
              }
            ]
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

Created on 4/29/2025, 10:50:14 AM


