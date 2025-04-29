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
  "displayName": "Get orderform data from vtexIO localstorage",
  "description": "Retrieves VTEX orderForm object from localStorage. Contains cart items, shipping info, discounts and totals for tracking implementations and real-time checkout customizations.",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// Insira aqui o código do modelo.
const log = require('logToConsole');
const queryPermission = require("queryPermission");
const localStorage = require('localStorage');
const JSON = require('JSON');

const vtexKey = 'orderform';



function isValidJSON(string) {
  log("string encontrada:", string);
  if(!string)  return false;
  
  let isValid = true;
  let object = false;
  
  object = JSON.parse(string);
  
  if(typeof object === 'undefined') {
    isValid = false;
  }
  
  return isValid;
  
}

if(queryPermission("access_local_storage", "read", vtexKey)) {
  log(vtexKey);
  const orderForm = localStorage.getItem(vtexKey);

  if(!orderForm) {
    log("orderForm não encontrado");
    return false;
  }
  
  log("orderform encontrado: ",orderForm);
  
  if(isValidJSON(orderForm)) {
    return JSON.parse(orderForm);
  } else {
    return orderForm;
  }
  
}


// As variáveis precisam retornar um valor.
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
                    "string": "orderform"
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


