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
2. **Account ID**: Obtenha no painel GoAB
3. **GTM Web Container**: Template funciona apenas em client-side

## Instalação

1. No GTM, vá em **Templates** → **Novo**
2. Clique em **Importar**
3. Selecione `template.tpl`
4. Clique em **Salvar**

## Configuração

### Campos obrigatórios

#### ID da Conta
- **Campo**: `accountId`
- **Descrição**: Seu ID de conta GoAB
- **Onde obter**: Painel GoAB → Configurações → Account ID
- **Formato**: String alfanumérica

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
2. **ID da Conta**: `sua-conta-id` (obtido do painel GoAB)
3. **Tipo de Conta**: `prod`
4. **Timeout**: 1000 (padrão)

**Trigger:** Page View - All Pages (ou páginas específicas)

**Resultado:** GoAB carrega em todas as páginas e executa testes configurados no painel

### Exemplo 2: Teste em desenvolvimento

**Configuração:**
1. **ID da Conta**: `sua-conta-id`
2. **Tipo de Conta**: `devs`
3. **Habilitar logs de debug**: ✓

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

1. Marque **"Habilitar logs de debug no console"** na tag GTM
2. Abra Console (F12)
3. Recarregue página
4. Veja logs com prefixo `[GoAB]`

### Logs de Debug

```
[GoAB] Iniciando template GoAB...
[GoAB] Configuração: {accountId: "65", accountType: "devs", ...}
[GoAB] Inicializando...
[GoAB] Anti-flicker CSS aplicado
[GoAB] Script principal carregando: https://devs.goab.io/65/application.js?v=2.0.0&u=...
[GoAB] Anti-flicker CSS removido
[GoAB] Objeto criado e inicializado
[GoAB] Script de inicialização injetado com sucesso
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
- [GTM Templates Documentation](../../CLAUDE.md)

## Suporte

**Problemas com o template GTM:**
- Abra issue no repositório

**Problemas com GoAB (plataforma):**
- Contate suporte GoAB: [goab.io](https://goab.io)
