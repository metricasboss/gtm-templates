# GoAB Test A/B - GTM Template Specification

## Business Context

**Problema que resolve:**
Implementar testes A/B em páginas web sem necessidade de código manual, permitindo otimização de conversão através de experimentos controlados. Atualmente, implementar ferramentas de teste A/B requer intervenção do desenvolvedor e múltiplas linhas de código.

**Plataforma/Integração:**
GoAB (goab.io) - Plataforma brasileira de testes A/B e otimização de conversão

**Tipo de Template:**
- [x] Tag Template
- [ ] Variable Template

**Público-alvo:**
- Especialistas em CRO (Conversion Rate Optimization)
- Gerentes de produto que executam experimentos
- Analistas de marketing que testam variações de página
- Agências digitais focadas em otimização de conversão
- E-commerces que otimizam funis de conversão

**Benefícios:**
- Implementação de teste A/B com 1 clique (sem código manual)
- Anti-flicker automático (evita "flash" de conteúdo original)
- Suporte a cookies de identificação de usuário
- Configuração flexível de timeout
- Modo de desenvolvimento e produção
- Desabilitação via parâmetro de URL para QA
- Sincronização com localStorage para configurações avançadas

---

## Technical Specifications

### Template Info

**Nome de exibição:**
`GoAB Test A/B da Métricas Boss`

**Descrição curta (1-2 frases):**
Implementa a ferramenta de teste A/B brasileira GoAB em páginas web, incluindo anti-flicker automático e gerenciamento de identificação de usuários.

**Categorias:**
- [ ] Analytics
- [x] Conversions
- [x] Marketing
- [ ] Advertising

**Ícone:**
Ícone de A/B test (A|B) - 48x48px PNG (fundo #4285f4)

### Fields Configuration

| Nome do Parâmetro | Tipo de Campo | Label | Help Text | Obrigatório | Valor Padrão |
|-------------------|---------------|-------|-----------|-------------|--------------|
| `accountId` | Text Input | Account ID | Seu ID de conta GoAB (encontrado no painel GoAB) | Sim | - |
| `accountType` | Select Dropdown | Tipo de Conta | Ambiente: desenvolvimento (devs) ou produção (prod) | Sim | devs |
| `timeout` | Text Input | Timeout Anti-Flicker (ms) | Tempo máximo em ms para esconder a página enquanto carrega o teste. Evita que usuário veja conteúdo original antes da variação. | Não | 1000 |
| `scriptVersion` | Text Input | Versão do Script | Versão do script GoAB a carregar. Deixe vazio para usar a versão mais recente. | Não | 2.0.0 |
| `enableDebug` | Checkbox | Modo Debug | Ativa logs detalhados no console | Não | false |

**Opções do Dropdown `accountType`:**
- `devs` - Desenvolvimento (carrega de devs.goab.io)
- `prod` - Produção (carrega de prod.goab.io)

### Code Logic

**Fluxo principal:**

1. **Validação de Configuração**
   - Validar que `accountId` foi fornecido
   - Validar que `timeout` é número positivo
   - Validar que `accountType` é um valor válido

2. **Preparação do Objeto GoAB**
   - Verificar se `window.goab_code` já existe (evitar duplicação)
   - Criar objeto de configuração com parâmetros do template
   - Incluir funções auxiliares (get URL, get cookie, anti-flicker)

3. **Anti-Flicker Implementation**
   - Injetar CSS inline que esconde o body
   - CSS: `body{opacity:0 !important;visibility:hidden !important}`
   - Style tag com ID `goab-af` para fácil remoção

4. **Script Loading**
   - Construir URL do script: `https://{accountType}.goab.io/{accountId}/application.js`
   - Adicionar query params: version, current URL, timestamp, user ID
   - Carregar script com `crossOrigin="anonymous"` e `fetchPriority="high"`

5. **Timeout & Cleanup**
   - Iniciar timer com `timeout` configurado
   - Quando script carregar OU timeout expirar: remover anti-flicker CSS
   - Limpar timer após conclusão

6. **Disable Flag**
   - Verificar se URL contém `__goab_disable`
   - Se presente, não inicializar GoAB (útil para QA/debug)

7. **Callbacks GTM**
   - `gtmOnSuccess` quando script inicia corretamente
   - `gtmOnFailure` se configuração inválida

**APIs necessárias (via require):**
- `injectScript` - Injetar JavaScript de inicialização na página
- `createQueue` - Criar objeto goab em window se necessário
- `copyFromWindow` - Verificar se goab_code já existe
- `setInWindow` - Definir window.goab_code
- `logToConsole` - Logging condicional para debug
- `callLater` - Timer para anti-flicker timeout
- `getTimestampMillis` - Timestamp para cache busting
- `getUrl` - Obter URL atual da página
- `getCookieValues` - Ler cookie goab_uid

**Lógica de validação:**
- `accountId` não pode estar vazio
- `accountId` deve ser string alfanumérica
- `timeout` deve ser número entre 0 e 10000 (10 segundos max)
- `accountType` deve ser 'devs' ou 'prod'
- `scriptVersion` se fornecido, deve seguir formato semver (x.x.x)

**Tratamento de erros:**
- Se `accountId` inválido, chamar `gtmOnFailure` e logar erro
- Se script já foi injetado (`window.goab_code` existe), chamar `gtmOnSuccess` sem reinjetar
- Se injeção de script falhar, remover anti-flicker e chamar `gtmOnFailure`
- Se timeout expirar, remover anti-flicker mas continuar (script pode carregar depois)
- Try/catch ao redor de todas operações críticas

**Comportamento do Anti-Flicker:**
1. Antes de carregar script: CSS esconde body completamente
2. Quando script carrega com sucesso: CSS removido, variação de teste aplicada
3. Se timeout expirar: CSS removido, conteúdo original mostrado
4. Usuário nunca vê "flash" entre original e variação

**Integração com LocalStorage:**
- GoAB pode sobrescrever `accountType` via localStorage key `goab_settings`
- Template não precisa gerenciar isso (script GoAB lida com isso)
- Formato: `{"atp": "prod"}` onde atp = account type override

**Integração com Cookies:**
- GoAB lê cookie `goab_uid` para identificar usuário
- Template não precisa criar/gerenciar cookie (script GoAB faz isso)
- Cookie é usado para manter usuário na mesma variação

### Permissions Required

- [x] `inject_script` - URL patterns:
  - `https://devs.goab.io/*`
  - `https://prod.goab.io/*`
  - Data URI para script inline de inicialização

- [x] `access_globals` - Chaves:
  - `goab_code` (Read/Write) - objeto principal do GoAB
  - `goab` (Write) - alias do objeto principal
  - Execute: Não necessário

- [x] `get_url` - Components:
  - `href` - URL completa (enviada para GoAB)
  - `search` - Query params (para detectar __goab_disable flag)

- [x] `access_local_storage` - Chaves:
  - `goab_settings` (Read only) - configurações avançadas

- [x] `get_cookies` - Nomes:
  - `goab_uid` - ID do usuário para testes

- [x] `logging` - Apenas em modo debug/preview
  - Para logs de diagnóstico

- [ ] `send_pixel` - Não necessário
- [ ] `read_data_layer` - Não necessário

### External Dependencies

**Scripts a injetar:**
1. **Script de inicialização (inline)**: ~100 linhas de JavaScript vanilla
2. **Script principal (externo)**:
   - URL: `https://{accountType}.goab.io/{accountId}/application.js`
   - Origem: CDN GoAB
   - Funcionalidade: Lógica completa de testes A/B

**Bibliotecas externas:**
- Nenhuma (100% vanilla JavaScript)
- Script GoAB é carregado do CDN oficial

**CDN GoAB:**
- Desenvolvimento: `devs.goab.io`
- Produção: `prod.goab.io`

### Script Original GoAB (Deminificado)

Para referência, aqui está o script original da GoAB em versão legível:

```javascript
(function() {
  var timeoutId, doc, antiFlickerRemoved, goabObj;

  // Evitar reinicialização
  if (window.goab_code) {
    return window.goab_code;
  }

  doc = document;
  antiFlickerRemoved = false;

  goabObj = {
    // Configurações
    accountId: "65",
    timeout: 1000, // 1e3
    version: "2.0.0",
    accountType: "devs",

    // Função 't': Constrói URL do script principal
    buildScriptUrl: function() {
      var settings = {};
      var actualAccountType, userId;

      // Ler override de accountType do localStorage
      try {
        settings = JSON.parse(localStorage.getItem("goab_settings") || "{}");
      } catch(e) {
        settings = {};
      }

      // Usar atp (account type) do localStorage se existir
      actualAccountType = settings.atp || this.accountType;

      // Obter user ID do cookie
      userId = this.getUserId();

      // Construir URL
      return "https://" + actualAccountType + ".goab.io/" +
             this.accountId + "/application.js" +
             "?v=" + this.version +
             "&u=" + encodeURIComponent(location.href) +
             "&t=" + Date.now() +
             (userId ? "&uid=" + encodeURIComponent(userId) : "");
    },

    // Função 'i': Lê user ID do cookie goab_uid
    getUserId: function() {
      var match = doc.cookie.match(/(?:^|;)\s*goab_uid=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : "";
    },

    // Função 'o': Adiciona anti-flicker CSS
    addAntiFlicker: function() {
      var style = doc.createElement("style");
      style.id = "goab-af";
      style.textContent = "body{opacity:0 !important;visibility:hidden !important}";
      doc.head.appendChild(style);
    },

    // Função 'u': Remove anti-flicker CSS
    removeAntiFlicker: function() {
      if (!antiFlickerRemoved) {
        antiFlickerRemoved = true;

        var styleEl = doc.getElementById("goab-af");
        if (styleEl) {
          styleEl.remove();
        }

        clearTimeout(timeoutId);
      }
    },

    // Função 'h': Carrega script principal
    loadMainScript: function(url) {
      var self = this;
      var script = doc.createElement("script");

      script.src = url;
      script.crossOrigin = "anonymous";
      script.fetchPriority = "high";

      // Remover anti-flicker quando carregar (sucesso ou erro)
      script.onload = script.onerror = function() {
        return self.removeAntiFlicker();
      };

      try {
        doc.head.appendChild(script);
      } catch(e) {
        this.removeAntiFlicker();
      }
    },

    // Função init: Inicializa GoAB
    init: function() {
      var self = this;

      // Verificar se deve desabilitar (flag na URL)
      if (location.search.includes("__goab_disable")) {
        return;
      }

      // Adicionar anti-flicker
      this.addAntiFlicker();

      // Configurar timeout para remover anti-flicker
      timeoutId = setTimeout(function() {
        return self.removeAntiFlicker();
      }, this.timeout);

      // Carregar script principal
      this.loadMainScript(this.buildScriptUrl());
    }
  };

  // Expor na window
  window.goab_code = goabObj;
  window.goab = goabObj;

  // Inicializar
  goabObj.init();

  return goabObj;
})();
```

**Diferenças entre script original e implementação GTM:**

| Aspecto | Script Original | Template GTM |
|---------|----------------|--------------|
| Configuração | Hardcoded no script | Campos configuráveis na UI |
| accountId | Fixo no código | Campo obrigatório no template |
| accountType | Fixo (pode ser sobrescrito via localStorage) | Dropdown no template |
| timeout | Fixo 1000ms | Campo configurável |
| Debug | Não tem | Campo enableDebug |
| Validações | Mínimas | Validações completas de entrada |
| Proteção duplicação | Simples (if window.goab_code) | Completa com logs |
| Callbacks | Não tem | gtmOnSuccess/gtmOnFailure |

---

## Implementation Details

### Pseudocódigo

```javascript
// ========================================
// 1. IMPORTAÇÃO DE APIs
// ========================================
const injectScript = require('injectScript');
const setInWindow = require('setInWindow');
const copyFromWindow = require('copyFromWindow');
const logToConsole = require('logToConsole');
const callLater = require('callLater');
const getTimestampMillis = require('getTimestampMillis');
const getUrl = require('getUrl');
const getCookieValues = require('getCookieValues');
const queryPermission = require('queryPermission');

// ========================================
// 2. VALIDAÇÃO DE CONFIGURAÇÃO
// ========================================
// Verificar accountId
if (!data.accountId || data.accountId.trim() === '') {
  if (data.enableDebug) {
    logToConsole('[GoAB] Erro: accountId é obrigatório');
  }
  return data.gtmOnFailure();
}

// Validar accountType
const accountType = data.accountType || 'devs';
if (accountType !== 'devs' && accountType !== 'prod') {
  if (data.enableDebug) {
    logToConsole('[GoAB] Erro: accountType deve ser "devs" ou "prod"');
  }
  return data.gtmOnFailure();
}

// Validar timeout
let timeout = 1000; // padrão
if (data.timeout !== undefined && data.timeout !== '') {
  timeout = parseInt(data.timeout);
  if (isNaN(timeout) || timeout < 0 || timeout > 10000) {
    if (data.enableDebug) {
      logToConsole('[GoAB] Timeout inválido, usando padrão (1000ms)');
    }
    timeout = 1000;
  }
}

// Versão do script
const scriptVersion = data.scriptVersion || '2.0.0';

if (data.enableDebug) {
  logToConsole('[GoAB] Configuração:', {
    accountId: data.accountId,
    accountType: accountType,
    timeout: timeout,
    version: scriptVersion
  });
}

// ========================================
// 3. VERIFICAR SE JÁ FOI INICIALIZADO
// ========================================
const existingGoabCode = copyFromWindow('goab_code');
if (existingGoabCode) {
  if (data.enableDebug) {
    logToConsole('[GoAB] Já inicializado, ignorando...');
  }
  return data.gtmOnSuccess();
}

// ========================================
// 4. VERIFICAR DISABLE FLAG
// ========================================
const currentUrl = getUrl('search');
if (currentUrl && currentUrl.indexOf('__goab_disable') !== -1) {
  if (data.enableDebug) {
    logToConsole('[GoAB] Desabilitado via URL flag (__goab_disable)');
  }
  return data.gtmOnSuccess();
}

// ========================================
// 5. CONSTRUIR SCRIPT DE INICIALIZAÇÃO
// ========================================
const initScript = `
(function(){
  var timeoutId, doc, antiFlickerRemoved, goabObj;

  doc = document;
  antiFlickerRemoved = false;

  goabObj = {
    accountId: "${data.accountId}",
    timeout: ${timeout},
    version: "${scriptVersion}",
    accountType: "${accountType}",

    // Função para construir URL do script principal
    buildScriptUrl: function() {
      var settings = {};
      var actualAccountType, userId;

      // Tentar ler accountType override do localStorage
      try {
        settings = JSON.parse(localStorage.getItem("goab_settings") || "{}");
      } catch(e) {
        settings = {};
      }

      actualAccountType = settings.atp || this.accountType;
      userId = this.getUserId();

      return "https://" + actualAccountType + ".goab.io/" +
             this.accountId + "/application.js" +
             "?v=" + this.version +
             "&u=" + encodeURIComponent(location.href) +
             "&t=" + Date.now() +
             (userId ? "&uid=" + encodeURIComponent(userId) : "");
    },

    // Função para ler user ID do cookie
    getUserId: function() {
      var match = doc.cookie.match(/(?:^|;)\\s*goab_uid=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : "";
    },

    // Função para adicionar anti-flicker CSS
    addAntiFlicker: function() {
      var style = doc.createElement("style");
      style.id = "goab-af";
      style.textContent = "body{opacity:0 !important;visibility:hidden !important}";
      doc.head.appendChild(style);

      ${data.enableDebug ? 'console.log("[GoAB] Anti-flicker CSS aplicado");' : ''}
    },

    // Função para remover anti-flicker CSS
    removeAntiFlicker: function() {
      if (!antiFlickerRemoved) {
        antiFlickerRemoved = true;

        var styleEl = doc.getElementById("goab-af");
        if (styleEl) {
          styleEl.remove();
        }

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        ${data.enableDebug ? 'console.log("[GoAB] Anti-flicker CSS removido");' : ''}
      }
    },

    // Função para carregar script principal
    loadMainScript: function(url) {
      var self = this;
      var script = doc.createElement("script");

      script.src = url;
      script.crossOrigin = "anonymous";
      script.fetchPriority = "high";

      script.onload = script.onerror = function() {
        self.removeAntiFlicker();
      };

      try {
        doc.head.appendChild(script);
        ${data.enableDebug ? 'console.log("[GoAB] Script principal carregando:", url);' : ''}
      } catch(e) {
        ${data.enableDebug ? 'console.error("[GoAB] Erro ao carregar script:", e);' : ''}
        this.removeAntiFlicker();
      }
    },

    // Função de inicialização
    init: function() {
      var self = this;

      ${data.enableDebug ? 'console.log("[GoAB] Inicializando...");' : ''}

      // Aplicar anti-flicker
      this.addAntiFlicker();

      // Configurar timeout
      timeoutId = setTimeout(function() {
        ${data.enableDebug ? 'console.log("[GoAB] Timeout atingido, removendo anti-flicker");' : ''}
        self.removeAntiFlicker();
      }, this.timeout);

      // Carregar script principal
      this.loadMainScript(this.buildScriptUrl());
    }
  };

  // Setar na window
  window.goab_code = goabObj;
  window.goab = goabObj;

  // Inicializar
  goabObj.init();

  ${data.enableDebug ? 'console.log("[GoAB] Objeto criado e inicializado");' : ''}
})();
`;

// ========================================
// 6. INJETAR SCRIPT DE INICIALIZAÇÃO
// ========================================
// Usar data URI para script inline
const scriptDataUri = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(initScript);

injectScript(
  scriptDataUri,
  () => {
    if (data.enableDebug) {
      logToConsole('[GoAB] Script de inicialização injetado com sucesso');
    }
    data.gtmOnSuccess();
  },
  () => {
    if (data.enableDebug) {
      logToConsole('[GoAB] Erro ao injetar script de inicialização');
    }
    // Tentar remover anti-flicker mesmo com erro
    callLater(() => {
      const style = copyFromWindow('document.getElementById("goab-af")');
      if (style) {
        style.remove();
      }
    });
    data.gtmOnFailure();
  }
);
```

### Casos de Uso

**Caso 1: E-commerce testando cores de botão CTA**
- **Cenário**: Loja quer testar botão verde vs azul vs vermelho
- **Configuração**:
  - Account ID: obtido do painel GoAB
  - Account Type: `devs` (para testar primeiro)
  - Timeout: 1000ms (padrão)
- **Resultado**: GoAB mostra variação aleatória e rastreia conversões
- **Análise**: Identificar qual cor converte mais

**Caso 2: Landing page testando headlines**
- **Cenário**: Página de captura com 3 headlines diferentes
- **Configuração**:
  - Account Type: `prod` (teste em produção)
  - Timeout: 800ms (página rápida, timeout menor)
- **Resultado**: Cada visitante vê uma headline, mantida entre sessões
- **Análise**: Headline que gera mais cadastros

**Caso 3: Teste multivariado (preço + imagem + CTA)**
- **Cenário**: Testar combinações de preço, imagem e texto de CTA
- **Configuração**:
  - Timeout: 1500ms (mudanças mais complexas, mais tempo)
- **Resultado**: GoAB gerencia todas as combinações
- **Análise**: Melhor combinação de elementos

**Caso 4: QA testando sem interferir**
- **Cenário**: Time de QA precisa ver versão original
- **Configuração**: Adicionar `?__goab_disable` na URL
- **Resultado**: GoAB não inicializa, página original mostrada
- **Análise**: QA pode validar sem variações A/B

**Caso 5: Desenvolvimento local antes de produção**
- **Cenário**: Testar configuração GoAB em ambiente de dev
- **Configuração**:
  - Account Type: `devs` (carrega de devs.goab.io)
  - Enable Debug: true
- **Resultado**: Logs detalhados no console, fácil debug
- **Análise**: Validar antes de ir para produção

### Edge Cases

1. **Script GoAB já carregado**
   - Template verifica `window.goab_code` antes de inicializar
   - **Comportamento**: Chama `gtmOnSuccess` e não reinicializa
   - **Motivo**: Evitar duplicação e conflitos

2. **Timeout muito baixo (< 100ms)**
   - Anti-flicker removido antes de script carregar
   - **Resultado**: Possível "flash" de conteúdo original
   - **Solução**: Usar timeout mínimo de 500ms
   - **Recomendação**: 1000-1500ms para conexões mais lentas

3. **Timeout muito alto (> 5000ms)**
   - Usuários com conexão boa veem página em branco por muito tempo
   - **Resultado**: Má experiência de usuário (tela branca)
   - **Solução**: Template limita a 10000ms (10s)
   - **Recomendação**: 1000-2000ms é ideal

4. **CDN GoAB indisponível**
   - Script principal falha ao carregar
   - **Comportamento**: Timeout expira, anti-flicker removido
   - **Resultado**: Página original mostrada (graceful degradation)

5. **localStorage bloqueado (modo privado)**
   - Override de accountType via localStorage não funciona
   - **Comportamento**: Usa accountType do template
   - **Impacto**: Funcionalidade avançada indisponível, mas teste funciona

6. **Cookies bloqueados**
   - goab_uid não pode ser lido/escrito
   - **Comportamento**: GoAB usa outro método (IP, fingerprint)
   - **Impacto**: Identificação de usuário menos precisa

7. **Tag disparada múltiplas vezes**
   - Proteção via verificação de `window.goab_code`
   - **Comportamento**: Primeira execução inicializa, demais são ignoradas
   - **Resultado**: Sem duplicação

8. **URL com __goab_disable flag**
   - Template detecta e não inicializa GoAB
   - **Uso**: QA, debug, preview
   - **Comportamento**: Chama `gtmOnSuccess` sem fazer nada

9. **Página sem body element (carregamento muito cedo)**
   - Anti-flicker tenta adicionar style antes de `<head>` existir
   - **Proteção**: Try/catch ao redor de `appendChild`
   - **Comportamento**: Se falhar, continua sem anti-flicker

10. **Single Page Application (SPA)**
    - Tag dispara apenas no primeiro carregamento
    - **Limitação**: Navegação client-side não reinicializa
    - **Solução**: Configurar trigger GTM para History Change

### Testing Checklist

- [ ] **Teste básico de inicialização**
  - [ ] Tag com accountId válido inicializa GoAB
  - [ ] `window.goab_code` é criado
  - [ ] `window.goab` aponta para mesmo objeto
  - [ ] Script principal é carregado do CDN correto

- [ ] **Teste de anti-flicker**
  - [ ] CSS `body{opacity:0}` é aplicado imediatamente
  - [ ] Style tag tem ID `goab-af`
  - [ ] CSS é removido quando script carrega
  - [ ] CSS é removido quando timeout expira
  - [ ] Usuário não vê "flash" de conteúdo

- [ ] **Teste de configurações**
  - [ ] accountType `devs` carrega de devs.goab.io
  - [ ] accountType `prod` carrega de prod.goab.io
  - [ ] Timeout customizado é respeitado
  - [ ] scriptVersion customizada aparece na URL

- [ ] **Teste de validações**
  - [ ] accountId vazio chama `gtmOnFailure`
  - [ ] accountType inválido chama `gtmOnFailure`
  - [ ] Timeout negativo usa padrão (1000ms)
  - [ ] Timeout > 10000ms usa padrão

- [ ] **Teste de disable flag**
  - [ ] URL com `?__goab_disable` não inicializa GoAB
  - [ ] URL com `?foo=bar&__goab_disable&x=1` detecta flag
  - [ ] Disable flag chama `gtmOnSuccess` (não é erro)

- [ ] **Teste de cookies**
  - [ ] Cookie `goab_uid` existente é lido e incluído na URL
  - [ ] Sem cookie, URL não inclui `&uid=`
  - [ ] Cookie com caracteres especiais é URL-encoded

- [ ] **Teste de localStorage**
  - [ ] localStorage `goab_settings.atp` sobrescreve accountType
  - [ ] Formato correto: `{"atp": "prod"}`
  - [ ] localStorage inválido não quebra (fallback para config)

- [ ] **Teste de debug**
  - [ ] `enableDebug: true` mostra logs no console
  - [ ] Logs têm prefixo `[GoAB]`
  - [ ] `enableDebug: false` não mostra logs

- [ ] **Teste de duplicação**
  - [ ] Tag disparando 2x não cria 2 instâncias
  - [ ] Segunda execução chama `gtmOnSuccess` sem reinicializar
  - [ ] Apenas 1 style tag `goab-af` existe

- [ ] **Teste de URL do script**
  - [ ] URL inclui accountId correto
  - [ ] URL inclui version
  - [ ] URL inclui current page URL (encoded)
  - [ ] URL inclui timestamp (cache busting)
  - [ ] URL inclui uid se cookie existe

- [ ] **Teste de callbacks GTM**
  - [ ] Inicialização com sucesso chama `gtmOnSuccess`
  - [ ] accountId inválido chama `gtmOnFailure`
  - [ ] Erro ao injetar script chama `gtmOnFailure`

- [ ] **Teste de edge cases**
  - [ ] Timeout muito baixo (100ms) funciona
  - [ ] Timeout muito alto (15000ms) é limitado a 10000ms
  - [ ] CDN indisponível: timeout remove anti-flicker
  - [ ] localStorage bloqueado não quebra
  - [ ] Cookies bloqueados não quebram

- [ ] **Teste de compatibilidade**
  - [ ] Chrome/Edge (últimas 2 versões)
  - [ ] Firefox (últimas 2 versões)
  - [ ] Safari (última versão)
  - [ ] Mobile Safari (iOS)
  - [ ] Mobile Chrome (Android)

- [ ] **Teste de performance**
  - [ ] Anti-flicker aplica em < 50ms
  - [ ] Script principal carrega em < 1s (conexão normal)
  - [ ] Timeout funciona corretamente
  - [ ] Memória não vaza

- [ ] **Validações GTM**
  - [ ] Tag aparece na lista de templates
  - [ ] Todos os campos aparecem na interface
  - [ ] Preview Mode mostra logs corretos
  - [ ] Permissões configuradas e funcionando

---

## Documentation

### README.md do Template

```markdown
# GoAB Test A/B

Template GTM para implementar a ferramenta brasileira de teste A/B GoAB (goab.io).

## O que faz

Injeta o script GoAB na página, permitindo executar testes A/B e multivariados sem código manual:

- ✅ Implementação com 1 clique (sem código manual)
- ✅ Anti-flicker automático (evita "flash" de conteúdo original)
- ✅ Suporte a identificação de usuários via cookies
- ✅ Configuração de timeout flexível
- ✅ Modo desenvolvimento e produção
- ✅ Desabilitação via URL para QA

## Pré-requisitos

1. **Conta GoAB**: Crie em [goab.io](https://goab.io)
2. **Account ID**: Obtenha no painel GoAB (ex: "65", "123", etc)
3. **GTM Web Container**: Template funciona apenas em client-side

## Instalação

1. No GTM, vá em **Templates** → **Novo**
2. Clique em **Importar**
3. Selecione `goab-test-ab.tpl`
4. Clique em **Salvar**

## Configuração

### Campos obrigatórios

#### Account ID
- **Campo**: `accountId`
- **Descrição**: Seu ID de conta GoAB
- **Onde obter**: Painel GoAB → Configurações → Account ID
- **Formato**: String alfanumérica (ex: "65", "abc123")

#### Tipo de Conta
- **Campo**: `accountType`
- **Opções**:
  - `devs` - Desenvolvimento (carrega de devs.goab.io)
  - `prod` - Produção (carrega de prod.goab.io)
- **Padrão**: `devs`
- **Uso**: Use `devs` para testar, `prod` para produção

### Campos opcionais

#### Timeout Anti-Flicker (ms)
- **Campo**: `timeout`
- **Descrição**: Tempo máximo (em milissegundos) para esconder página enquanto carrega teste
- **Padrão**: 1000 (1 segundo)
- **Range**: 0 - 10000ms
- **Recomendação**:
  - Conexão rápida: 800-1000ms
  - Conexão normal: 1000-1500ms
  - Conexão lenta: 1500-2000ms
  - **Não use > 3000ms** (má UX)

#### Versão do Script
- **Campo**: `scriptVersion`
- **Descrição**: Versão específica do script GoAB
- **Padrão**: 2.0.0
- **Uso**: Deixe padrão a menos que GoAB peça para alterar

#### Modo Debug
- **Campo**: `enableDebug`
- **Descrição**: Ativa logs detalhados no console
- **Padrão**: false
- **Uso**: Apenas para desenvolvimento/troubleshooting

## Uso

### Exemplo 1: Implementação básica em produção

**Configuração da Tag:**
1. Template: "GoAB Test A/B"
2. **Account ID**: `sua-conta-id` (obtido do painel GoAB)
3. **Tipo de Conta**: `prod`
4. **Timeout**: 1000 (padrão)

**Trigger:** Page View - All Pages (ou páginas específicas)

**Resultado:** GoAB carrega em todas as páginas e executa testes configurados no painel

### Exemplo 2: Teste em desenvolvimento

**Configuração:**
1. **Account ID**: `sua-conta-id`
2. **Tipo de Conta**: `devs`
3. **Enable Debug**: ✓

**Trigger:** Page View - All Pages

**Resultado:** GoAB carrega do ambiente de dev, com logs detalhados no console

### Exemplo 3: Timeout customizado

**Cenário**: Página com conexão lenta ou testes visuais complexos

**Configuração:**
1. **Timeout**: 2000 (2 segundos)
2. Demais configs padrão

**Resultado:** Usuários veem tela em branco por até 2s enquanto teste carrega

### Exemplo 4: QA sem interferência de testes

**Cenário**: Time de QA precisa validar versão original

**Solução**: Adicionar `?__goab_disable` na URL

**Exemplo:**
```
https://exemplo.com/produto?__goab_disable
```

**Resultado:** GoAB não inicializa, versão original é mostrada

## Como Funciona

### 1. Anti-Flicker

Quando a tag dispara:
1. CSS é injetado imediatamente: `body{opacity:0 !important}`
2. Página fica invisível enquanto GoAB carrega
3. Quando script carrega OU timeout expira: CSS removido
4. Usuário vê versão final (variação de teste ou original)

**Por que é necessário?**
Sem anti-flicker, usuário vê "flash":
1. Conteúdo original aparece
2. 0.5s depois, variação de teste substitui conteúdo
3. Usuário percebe mudança (má experiência)

Com anti-flicker:
1. Usuário vê loading ou tela branca por ~1s
2. Variação de teste aparece diretamente
3. Experiência suave

### 2. Identificação de Usuários

GoAB usa cookie `goab_uid` para:
- Manter usuário na mesma variação entre sessões
- Rastrear conversões atribuídas ao teste
- Garantir resultados estatísticos válidos

**Cookie é criado automaticamente pelo script GoAB** (template apenas lê).

### 3. Configurações Avançadas

GoAB pode ler `localStorage` key `goab_settings` para sobrescrever configurações:

```javascript
// Exemplo: Forçar produção via localStorage
localStorage.setItem('goab_settings', JSON.stringify({
  atp: 'prod' // atp = account type
}));
```

**Uso:** Testar ambiente de produção sem alterar tag GTM

### 4. Disable Flag

URL com parâmetro `__goab_disable` desabilita GoAB:

```
https://exemplo.com/?__goab_disable
https://exemplo.com/produto?utm_source=google&__goab_disable
```

**Uso:**
- QA validar versão original
- Debug sem interferência de testes
- Preview antes de publicar

## Estrutura Criada

O template cria os seguintes objetos no `window`:

```javascript
window.goab_code = {
  accountId: "sua-conta",
  timeout: 1000,
  version: "2.0.0",
  accountType: "devs",
  buildScriptUrl: function() { ... },
  getUserId: function() { ... },
  addAntiFlicker: function() { ... },
  removeAntiFlicker: function() { ... },
  loadMainScript: function() { ... },
  init: function() { ... }
};

window.goab = window.goab_code; // alias
```

**Não manipule esses objetos manualmente!**

## Criando Testes no Painel GoAB

Após template instalado:

1. Acesse painel GoAB
2. Crie novo teste A/B
3. Configure variações (ex: botão verde vs azul)
4. Defina objetivo (ex: cliques em botão, pageview de confirmação)
5. Publique teste
6. GoAB automaticamente divide tráfego e rastreia resultados

**O template GTM apenas carrega o GoAB. Testes são configurados no painel GoAB.**

## Debugging

### Habilitar Modo Debug

1. Marque **"Modo Debug"** na tag GTM
2. Abra Console (F12)
3. Recarregue página
4. Veja logs com prefixo `[GoAB]`

### Logs de Debug

```
[GoAB] Configuração: {accountId: "65", accountType: "devs", ...}
[GoAB] Inicializando...
[GoAB] Anti-flicker CSS aplicado
[GoAB] Script principal carregando: https://devs.goab.io/65/application.js?v=2.0.0&u=...
[GoAB] Anti-flicker CSS removido
[GoAB] Objeto criado e inicializado
```

### Verificar no GTM Preview

1. Ative Preview Mode
2. Carregue página
3. Verifique que tag "GoAB Test A/B" disparou
4. Veja status **"Tag Fired"**

### Verificar no Browser

**Network tab:**
- Procure request para `*.goab.io/*/application.js`
- Status deve ser 200 OK
- Arquivo JavaScript carregado

**Elements tab:**
- Procure `<style id="goab-af">` (deve estar ausente após carregamento)
- Verifique `<script>` tag com src goab.io

**Console tab:**
- Com debug habilitado: veja logs `[GoAB]`
- Sem debug: não deve ter erros

## Troubleshooting

### Tag não dispara

**Sintomas:** GoAB não carrega, testes não aparecem

**Possíveis causas:**
1. **Trigger incorreto**
   - **Solução**: Verificar que trigger é Page View
   - **Validação**: GTM Preview deve mostrar tag disparando

2. **Bloqueador de ads**
   - **Causa**: Browser/extensão bloqueando *.goab.io
   - **Solução**: Desabilitar bloqueador para testar

3. **accountId inválido**
   - **Sintoma**: Erro no console
   - **Solução**: Verificar accountId no painel GoAB

### Anti-flicker não remove (tela branca)

**Sintomas:** Página fica invisível indefinidamente

**Possíveis causas:**
1. **CDN GoAB indisponível**
   - **Solução**: Verificar status de goab.io
   - **Proteção**: Timeout deve remover CSS automaticamente

2. **Timeout muito alto**
   - **Solução**: Reduzir para 1000-2000ms

3. **Erro JavaScript**
   - **Solução**: Abrir console, verificar erros

4. **CSP (Content Security Policy) bloqueando**
   - **Sintoma**: Erro CSP no console
   - **Solução**: Adicionar `*.goab.io` ao CSP

### Testes não aparecem

**Sintomas:** GoAB carrega mas variações não aparecem

**Causa:** Testes não configurados/publicados no painel GoAB

**Solução:**
1. Acessar painel GoAB
2. Verificar que teste está **Publicado** (não Rascunho)
3. Verificar segmentação (URL, público-alvo)
4. Forçar variação via painel (para debug)

### "Flash" de conteúdo original

**Sintomas:** Usuário vê conteúdo original por 0.5s antes de variação

**Causas:**
1. **Timeout muito baixo**
   - **Solução**: Aumentar para 1000-1500ms

2. **Tag disparando tarde**
   - **Solução**: Mover trigger para Page View (não DOM Ready)

3. **Script GoAB lento**
   - **Solução**: Verificar conexão, CDN GoAB

### Cookies não funcionam

**Sintomas:** Usuário vê variação diferente a cada visita

**Causas:**
1. **Cookies bloqueados** (modo privado, configuração browser)
   - **Solução**: GoAB usa fallback (IP, fingerprint)

2. **Cookie goab_uid sendo deletado**
   - **Solução**: Verificar que não há script deletando cookies

3. **Domínio diferente**
   - **Causa**: www.exemplo.com vs exemplo.com
   - **Solução**: Configurar cookie no domínio raiz

### Tag dispara múltiplas vezes

**Sintomas:** Logs duplicados, múltiplas instâncias de GoAB

**Causa:** Trigger configurado incorretamente

**Solução:**
- Verificar que trigger é Page View (não History Change)
- Template tem proteção: segunda execução é ignorada

### Erro "accountId é obrigatório"

**Sintomas:** Tag chama `gtmOnFailure`, erro no console

**Causa:** Campo accountId vazio

**Solução:** Preencher accountId com valor do painel GoAB

## Performance

### Impacto no Page Load

**Anti-flicker:**
- CSS inline: ~100 bytes
- Aplicado em < 50ms
- **Impacto**: Negligível

**Script de inicialização:**
- Tamanho: ~3KB (minificado)
- Inline (data URI)
- **Impacto**: < 10ms

**Script principal (goab.io):**
- Tamanho: ~30-50KB (depende da versão)
- Carregado async do CDN
- **Impacto**: 200-500ms (conexão normal)

**Total:**
- Primeiro carregamento: ~500ms
- Carregamentos seguintes: ~200ms (cache)

### Otimizações

1. **Timeout adequado**: 1000-1500ms (não mais)
2. **CDN GoAB**: Latência baixa (Brasil)
3. **fetchPriority="high"**: Script carrega prioritariamente
4. **Cache**: Script principal é cached pelo browser

## Privacidade e Segurança

### ✅ O template É seguro

- **Scripts carregam de domínio oficial** (*.goab.io)
- **Apenas lê cookies necessários** (goab_uid)
- **Apenas lê localStorage necessário** (goab_settings)
- **Não envia dados para outros domínios** (apenas GoAB)
- **Código verificável** (template é open source)

### Conformidade com LGPD

GoAB usa cookies para identificação, portanto:
- **Requer consentimento** de cookies de analytics/marketing
- **Integre com seu sistema de consent** (ex: cookie banner)
- **Não carregue antes de consentimento** (configure trigger GTM)

### CSP (Content Security Policy)

Se seu site usa CSP, adicione:

```
script-src 'self' https://*.goab.io;
style-src 'self' 'unsafe-inline'; /* para anti-flicker CSS */
```

## Compatibilidade

- ✅ Chrome/Edge (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (última versão)
- ✅ Mobile Safari (iOS 12+)
- ✅ Mobile Chrome (Android 8+)
- ⚠️ IE11 (com limitações, não recomendado)

## Referências

- [GoAB Website](https://goab.io)
- [GoAB Documentação](https://goab.io/docs)
- [GTM Templates Documentation](../../.claude/docs/visao-geral.md)
- [Referência de APIs GTM](../../.claude/docs/api-reference.md)

## Suporte

**Problemas com o template GTM:**
- Abra issue no repositório

**Problemas com GoAB (plataforma):**
- Contate suporte GoAB: [goab.io](https://goab.io)
```

---

## Acceptance Criteria

### Funcional

- [ ] **Inicialização**
  - [ ] accountId válido inicializa GoAB
  - [ ] accountId vazio chama `gtmOnFailure`
  - [ ] `window.goab_code` é criado corretamente
  - [ ] `window.goab` aponta para mesmo objeto

- [ ] **Carregamento de script**
  - [ ] Script principal carrega de `{accountType}.goab.io`
  - [ ] URL do script inclui accountId, version, current URL, timestamp
  - [ ] URL inclui userId se cookie `goab_uid` existe
  - [ ] Script carrega com `crossOrigin="anonymous"`
  - [ ] Script carrega com `fetchPriority="high"`

- [ ] **Anti-flicker**
  - [ ] CSS aplicado imediatamente ao inicializar
  - [ ] Style tag tem ID `goab-af`
  - [ ] CSS é `body{opacity:0 !important;visibility:hidden !important}`
  - [ ] CSS removido quando script carrega com sucesso
  - [ ] CSS removido quando timeout expira
  - [ ] clearTimeout é chamado após remover CSS

- [ ] **Configurações**
  - [ ] accountType `devs` carrega de devs.goab.io
  - [ ] accountType `prod` carrega de prod.goab.io
  - [ ] Timeout customizado é respeitado
  - [ ] scriptVersion customizada aparece na URL

- [ ] **Validações**
  - [ ] accountId vazio retorna falha
  - [ ] accountType inválido retorna falha
  - [ ] Timeout negativo usa padrão (1000)
  - [ ] Timeout > 10000 usa padrão
  - [ ] Timeout não numérico usa padrão

- [ ] **Disable flag**
  - [ ] URL com `__goab_disable` não inicializa GoAB
  - [ ] Disable flag retorna sucesso (não é erro)

- [ ] **LocalStorage integration**
  - [ ] Lê `goab_settings.atp` se disponível
  - [ ] Override de accountType funciona
  - [ ] localStorage inválido não quebra

- [ ] **Cookie integration**
  - [ ] Lê cookie `goab_uid`
  - [ ] Inclui uid na URL do script se cookie existe
  - [ ] Cookies bloqueados não quebram inicialização

- [ ] **Debug**
  - [ ] `enableDebug: true` mostra logs no console
  - [ ] Logs têm prefixo `[GoAB]`
  - [ ] `enableDebug: false` não mostra logs

- [ ] **Proteção contra duplicação**
  - [ ] Verificar `window.goab_code` antes de inicializar
  - [ ] Segunda inicialização chama sucesso e retorna
  - [ ] Apenas 1 script injetado
  - [ ] Apenas 1 style tag anti-flicker

- [ ] **Callbacks GTM**
  - [ ] `gtmOnSuccess` chamado após injeção bem-sucedida
  - [ ] `gtmOnFailure` chamado se accountId inválido
  - [ ] `gtmOnFailure` chamado se injeção falhar

### Não-funcional

- [ ] **Código**
  - [ ] Segue guia de estilo do repositório
  - [ ] Comentários nas seções principais
  - [ ] Nome do template: "GoAB Test A/B da Métricas Boss"
  - [ ] JavaScript vanilla (sem jQuery)
  - [ ] Minificado para produção (opcional)

- [ ] **Performance**
  - [ ] Anti-flicker aplica em < 50ms
  - [ ] Script de inicialização < 5KB
  - [ ] Não bloqueia renderização da página
  - [ ] Timeout funciona com precisão de ±50ms

- [ ] **Documentação**
  - [ ] README.md completo em português
  - [ ] Exemplos de configuração
  - [ ] Troubleshooting guide detalhado
  - [ ] Explicação de como funciona anti-flicker
  - [ ] Casos de uso reais

- [ ] **Permissões**
  - [ ] Apenas permissões mínimas necessárias
  - [ ] `inject_script` para data URI e *.goab.io
  - [ ] `access_globals` apenas para goab_code e goab
  - [ ] `get_url` para href e search
  - [ ] `access_local_storage` read-only para goab_settings
  - [ ] `get_cookies` apenas para goab_uid
  - [ ] `logging` apenas em debug

### Segurança

- [ ] **Validações**
  - [ ] accountId é sanitizado
  - [ ] accountType aceita apenas 'devs' ou 'prod'
  - [ ] Timeout é validado como número
  - [ ] URL é encoded corretamente

- [ ] **Injeção segura**
  - [ ] Script inline via data URI (não eval)
  - [ ] Script externo apenas de domínios *.goab.io
  - [ ] crossOrigin="anonymous" para script externo
  - [ ] Try/catch ao redor de operações críticas

- [ ] **Privacidade**
  - [ ] Apenas lê cookies necessários (goab_uid)
  - [ ] Apenas lê localStorage necessário (goab_settings)
  - [ ] Não acessa dados sensíveis
  - [ ] Conformidade com LGPD (requer consentimento)

### Compatibilidade

- [ ] **Browsers**
  - [ ] Chrome/Edge (últimas 2 versões)
  - [ ] Firefox (últimas 2 versões)
  - [ ] Safari (última versão)
  - [ ] Mobile Safari (iOS 12+)
  - [ ] Mobile Chrome (Android 8+)

- [ ] **GTM**
  - [ ] Funciona em Web Container
  - [ ] Preview Mode mostra tag disparando
  - [ ] Debug Console mostra logs corretamente
  - [ ] Permissões aprovadas automaticamente

- [ ] **Cenários**
  - [ ] Página estática (HTML)
  - [ ] Single Page Application (SPA)
  - [ ] E-commerce
  - [ ] Landing pages
  - [ ] Múltiplas tags GTM na mesma página

---

## Next Steps

### 1. Review da Especificação ✅

Revisar com stakeholders:
- [ ] Requisitos funcionais cobrem necessidades de GoAB?
- [ ] Anti-flicker está implementado corretamente?
- [ ] Timeout padrão (1000ms) é adequado?
- [ ] Permissões estão corretas?
- [ ] Documentação está clara?

### 2. Implementação

Criar o template baseado nesta spec:
1. Criar arquivo `template.tpl` com código GTM
2. Adicionar campos na seção `___TEMPLATE_PARAMETERS___`
3. Implementar lógica na seção `___SANDBOXED_JS_FOR_WEB_TEMPLATE___`
4. Configurar permissões em `___WEB_PERMISSIONS___`
5. Adicionar testes em `___TESTS___`
6. Criar ícone 48x48px

### 3. Testes

Seguir testing checklist acima:
- [ ] Testar com conta GoAB real
- [ ] Validar anti-flicker visual
- [ ] Testar timeout com diferentes valores
- [ ] Testar disable flag
- [ ] Validar cross-browser
- [ ] Testar com localStorage/cookies bloqueados

### 4. Documentação

- [ ] Criar README.md baseado no template acima
- [ ] Adicionar screenshots do painel GTM
- [ ] Documentar integração com painel GoAB
- [ ] Criar guia visual de anti-flicker

### 5. Deploy

- [ ] Commit do código + PRP + README
- [ ] Atualizar README principal do repositório
- [ ] Adicionar ao índice de templates
- [ ] Testar em ambiente de produção real
- [ ] Publicar (se for compartilhar publicamente)

---

**Data de criação:** 2026-02-04
**Autor:** Métricas Boss Team
**Versão:** 1.0
**Status:** Em especificação
