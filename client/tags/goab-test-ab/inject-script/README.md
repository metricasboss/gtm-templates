# GoAB Initialization Script

Script de inicialização do GoAB para o template GTM.

## Estrutura

- `goab-init.js` - Código fonte do script de inicialização
- `webpack.config.js` - Configuração do Webpack para build
- `deploy.js` - Script de deploy para AWS S3
- `package.json` - Dependências e scripts

## Como funciona

1. O template GTM passa a configuração via `window.__goabConfig`
2. Este script lê a configuração e inicializa o GoAB
3. Aplica anti-flicker CSS
4. Carrega o script principal do GoAB CDN

## Build e Deploy

### Pré-requisitos

- Node.js 16+
- pnpm instalado
- Credenciais AWS com acesso ao bucket S3

### Instalação

```bash
pnpm install
```

### Configurar credenciais AWS

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Edite `.env`:
```
AWS_ACCESS_KEY_ID=sua_chave
AWS_SECRET_ACCESS_KEY=seu_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=gtm-templates
```

### Build

Gera o bundle minificado em `dist/`:

```bash
pnpm run build
```

### Deploy

Faz build E upload para S3:

```bash
pnpm run deploy
```

O arquivo será hospedado em:
```
https://gtm-templates.s3.us-east-1.amazonaws.com/goab-init-bundle.js
```

## Desenvolvimento

Para modificar o script:

1. Edite `goab-init.js`
2. Teste localmente se possível
3. Rode `pnpm run build` para verificar se compila
4. Rode `pnpm run deploy` para fazer upload
5. Teste o template GTM com o novo script

## Estrutura do código

O script cria o seguinte no `window`:

```javascript
window.goab_code = {
  accountId: '...',
  timeout: 1000,
  version: '2.0.0',
  accountType: 'devs',
  buildScriptUrl: function() { ... },
  getUserId: function() { ... },
  addAntiFlicker: function() { ... },
  removeAntiFlicker: function() { ... },
  loadMainScript: function(url) { ... },
  init: function() { ... }
};

window.goab = window.goab_code; // alias
```

## Cache

O arquivo é servido com cache de 1 ano:
```
Cache-Control: public, max-age=31536000
```

Para forçar atualização nos clientes, o GTM pode adicionar cache buster na URL.
