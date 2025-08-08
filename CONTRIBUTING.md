# Guia de Contribuição - GTM Templates by Métricas Boss

Este guia documenta como contribuir com novos templates para este repositório de templates GTM.

## Tipos de Templates GTM

### 1. Client-side Templates (Web Container)
Templates que executam no navegador do usuário:

#### **Tags** (`client/tags/`)
- Executam ações como enviar dados para ferramentas de analytics
- Devem chamar `data.gtmOnSuccess()` ou `data.gtmOnFailure()`
- Categorias comuns: Analytics, Advertising, Marketing, Utilities

#### **Variables** (`client/variables/`)
- Retornam valores para uso em tags e triggers
- Devem sempre retornar um valor
- Categorias: Page Variables, Utilities, User Variables

### 2. Server-side Templates (Server Container)
Templates que executam no servidor:

#### **Tags** (`server/tags/`)
- Processam e enviam dados server-side
- Maior controle sobre dados sensíveis
- Ideal para APIs e integrações backend

#### **Variables** (`server/variables/`)
- Processam dados no servidor
- Úteis para limpeza e transformação de dados

#### **Clients** (`server/clients/`)
- Recebem e processam requisições HTTP
- Criam eventos para o container
- Devem usar `claimRequest()` para processar requisições

## Estrutura de Pastas

```
gtm-templates/
├── client/                    # Templates client-side
│   ├── tags/                  # Tags para web container
│   │   └── [template-name]/   # Pasta do template
│   │       ├── template.tpl   # Arquivo do template (OBRIGATÓRIO)
│   │       ├── README.md      # Documentação (OBRIGATÓRIO)
│   │       ├── CHANGELOG.md   # Histórico de versões
│   │       ├── config.json    # Configurações do template
│   │       └── inject-script/ # Scripts JavaScript (se aplicável)
│   │           ├── package.json
│   │           ├── [script].js
│   │           ├── webpack.config.js
│   │           └── dist/      # JavaScript compilado
│   └── variables/             # Mesmo padrão de tags
│       └── [template-name]/
│
└── server/                    # Templates server-side
    ├── tags/                  # Tags para server container
    │   └── [template-name]/   # Mesmo padrão de client/tags
    ├── variables/             # Variables server-side
    │   └── [template-name]/   # Mesmo padrão
    └── clients/               # Clients (endpoints)
        └── [template-name]/   # Mesmo padrão
```

## Convenções de Nomenclatura

### Nomes de Pastas
- Use kebab-case: `panda-video-tracker`, `rd-station-api`
- Seja descritivo: `ga4-identity-hub` ao invés de `gih`
- Prefixe com plataforma quando relevante: `vtex-orderform-data`

### Nomes de Templates (displayName)
- Client-side: Em inglês com marca
  - Correto: "Panda Video Tracker - Métricas Boss"
  - Incorreto: "Tracker"

- Server-side: Pode incluir tipo
  - Correto: "RD Station Conversion API"
  - Correto: "Generic Webhook Client"

## Estrutura do Template (.tpl)

### 1. Header de Licença
```javascript
___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.
```

### 2. Seção INFO
```javascript
___INFO___
{
  "type": "TAG|VARIABLE|CLIENT",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "Nome do Template",
  "brand": {
    "id": "brand_dummy",
    "displayName": "Métricas Boss",
    "thumbnail": "data:image/png;base64,..."  // Logo em base64
  },
  "description": "Descrição clara do que o template faz",
  "containerContexts": ["WEB"] // ou ["SERVER"]
}
```

### 3. Parâmetros do Template
```javascript
___TEMPLATE_PARAMETERS___
[
  {
    "type": "TEXT|CHECKBOX|SELECT|TABLE|GROUP|LABEL|RADIO",
    "name": "parameterName",
    "displayName": "Nome Exibido",
    "simpleValueType": true,
    "help": "Texto de ajuda para o usuário",
    "valueValidators": [{
      "type": "NON_EMPTY"
    }]
  }
]
```

### 4. Código JavaScript Sandboxed
```javascript
// Client-side
___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// Server-side
___SANDBOXED_JS_FOR_SERVER___

// Imports necessários
const log = require('logToConsole');
const sendPixel = require('sendPixel');

// Lógica do template
if (data.enableDebug) {
  log('Debug:', data);
}

// Sempre finalizar com:
data.gtmOnSuccess(); // ou data.gtmOnFailure()
```

### 5. Permissões
```javascript
___WEB_PERMISSIONS___ // ou ___SERVER_PERMISSIONS___
[
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [{
        "key": "environments",
        "value": {
          "type": 1,
          "string": "debug"
        }
      }]
    },
    "isRequired": true
  }
]
```

### 6. Testes
```javascript
___TESTS___
scenarios: [{
  name: 'Test Case 1',
  code: |
    // Código de teste
    assertApi('sendPixel').wasCalled();
}]
```

## Documentação README.md

Todo template DEVE incluir um README.md com:

### Estrutura Recomendada
```markdown
# Nome do Template

Breve descrição do que o template faz.

## O que faz

Explicação detalhada da funcionalidade.

## Campos de Configuração

### 1. Campo Nome (Obrigatório/Opcional)
- **Tipo**: Text/Checkbox/Select
- **Descrição**: O que este campo controla
- **Exemplo**: valor_exemplo
- **Como obter**: Instruções se necessário

## Como Usar

### Pré-requisitos
- Lista de requisitos

### Instalação
1. Passo a passo
2. De como instalar

### Configuração
Exemplos de configuração

## Exemplos de Implementação

### Exemplo 1: Caso de Uso
\```javascript
// Código de exemplo
\```

## Requisitos Técnicos

### Permissões:
- Permissão 1
- Permissão 2

## Debug e Troubleshooting

### Problemas Comuns:
- Problema 1: Solução
- Problema 2: Solução

## Boas Práticas

1. Prática recomendada 1
2. Prática recomendada 2

## Links Úteis

- [Documentação Oficial]()
- [Métricas Boss](https://metricasboss.com.br)
```

## Templates com JavaScript Injetado

Para templates que precisam injetar JavaScript:

### 1. Estrutura da pasta `inject-script/`
```
inject-script/
├── package.json        # Dependências do projeto
├── pnpm-lock.yaml     # Lock file (use pnpm!)
├── webpack.config.js  # Configuração do webpack
├── src/
│   └── script.js      # Código fonte
└── dist/
    └── bundle.js      # JavaScript compilado
```

### 2. package.json básico
```json
{
  "name": "template-name-script",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  },
  "devDependencies": {
    "webpack": "^5.89.0",
    "webpack-cli": "^5.1.4"
  }
}
```

### 3. webpack.config.js básico
```javascript
const path = require('path');

module.exports = {
  entry: './src/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'TemplateName',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
```

### 4. Comandos
```bash
# Instalar dependências (SEMPRE use pnpm)
pnpm install

# Build para produção
pnpm run build

# Desenvolvimento com watch
pnpm run dev
```

## Checklist para Novo Template

Antes de fazer commit de um novo template, verifique:

### Estrutura de Pastas
- [ ] Pasta nomeada em kebab-case
- [ ] Arquivo `template.tpl` presente
- [ ] README.md com documentação completa

### Template (.tpl)
- [ ] Header de licença incluído
- [ ] Seção INFO com displayName e brand "Métricas Boss"
- [ ] Parâmetros bem documentados com help text
- [ ] Código usa `data.gtmOnSuccess()` ou `data.gtmOnFailure()`
- [ ] Debug logs condicionais com flag
- [ ] Permissões mínimas necessárias

### Documentação
- [ ] README em português (foco no mercado brasileiro)
- [ ] Exemplos de configuração
- [ ] Troubleshooting comum
- [ ] Links para documentação externa

### Qualidade
- [ ] Código testado no GTM Preview Mode
- [ ] Sem informações sensíveis (API keys, secrets)
- [ ] Tratamento de erros implementado
- [ ] Logs apenas quando debug ativado

## Processo de Contribuição

### 1. Desenvolvimento
1. Clone o repositório
2. Crie uma branch: `feature/nome-do-template`
3. Desenvolva seguindo este guia
4. Teste no GTM (web ou server conforme o tipo)

### 2. Validação
1. Execute o template no Preview Mode
2. Verifique logs e comportamento
3. Confirme que não há erros no console
4. Valide que as permissões são mínimas

### 3. Pull Request
1. Commit com mensagem clara: `feat: add [template-name] template`
2. Push para sua branch
3. Abra PR com:
   - Descrição do que o template faz
   - Screenshots da configuração
   - Link para teste se disponível

### 4. Review
- Código será revisado para:
  - Aderência aos padrões
  - Segurança (sem vazamento de dados)
  - Performance
  - Documentação completa

## Segurança

### Princípios Importantes:
1. **Nunca** hardcode credenciais no template
2. **Sempre** valide inputs do usuário
3. **Use** permissões mínimas necessárias
4. **Implemente** tratamento de erros
5. **Evite** logs em produção (apenas com debug flag)
6. **Sanitize** dados antes de enviar para APIs
7. **Valide** URLs e endpoints

## Suporte

- **Issues**: Abra uma issue no GitHub
- **Email**: contato@metricasboss.com.br
- **Site**: [metricasboss.com.br](https://metricasboss.com.br)

## Licença

Todos os templates devem incluir o header de Terms of Service do Google Tag Manager.

---

**Mantido por [Métricas Boss](https://metricasboss.com.br)** 
*Especialistas em GTM e Analytics para E-commerce*