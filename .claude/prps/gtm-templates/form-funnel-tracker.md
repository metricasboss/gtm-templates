# Form Funnel Tracker - GTM Template Specification

## Business Context

**Problema que resolve:**
Rastrear a progressão de preenchimento de formulários campo por campo, identificando onde os usuários abandonam o funil e quais campos causam mais fricção. Atualmente, os analistas só conseguem ver conversão final (submit) mas não entendem o comportamento durante o preenchimento.

**Plataforma/Integração:**
JavaScript puro (Vanilla JS) - Funciona em qualquer formulário HTML da página

**Tipo de Template:**
- [x] Tag Template
- [ ] Variable Template

**Público-alvo:**
- Analistas de CRO (Conversion Rate Optimization)
- Gerentes de produto que otimizam formulários
- Especialistas em UX que analisam comportamento de usuários
- Agências digitais focadas em otimização de conversão

**Benefícios:**
- Identifica campos problemáticos que causam abandono
- Cria funil detalhado de preenchimento (campo por campo)
- Não requer instrumentação manual de código
- Funciona com formulários dinâmicos e AJAX
- Envia eventos automaticamente para dataLayer (GA4, analytics)
- Rastreia tempo de preenchimento por campo
- Detecta campos vazios vs preenchidos no submit

---

## Technical Specifications

### Template Info

**Nome de exibição:**
`Form Funnel Tracker da Métricas Boss`

**Descrição curta (1-2 frases):**
Rastreia progressão de preenchimento de formulários campo por campo, enviando eventos para dataLayer. Identifica onde usuários abandonam o funil e quais campos causam fricção.

**Categorias:**
- [x] Analytics
- [x] Conversions
- [ ] Marketing
- [ ] Advertising

**Ícone:**
Ícone de formulário com funil - 48x48px PNG (fundo #4285f4)

### Fields Configuration

| Nome do Parâmetro | Tipo de Campo | Label | Help Text | Obrigatório | Valor Padrão |
|-------------------|---------------|-------|-----------|-------------|--------------|
| `formSelector` | Text Input | Seletor do Formulário | Seletor CSS do formulário (ex: #contact-form, .lead-form). Deixe vazio para rastrear TODOS os formulários. | Não | (vazio = todos) |
| `trackFieldTypes` | Simple Table | Tipos de Campo | Tipos de campo a rastrear (input, textarea, select, etc.) | Não | input, textarea, select |
| `eventPrefix` | Text Input | Prefixo dos Eventos | Prefixo para nomes de eventos no dataLayer | Não | form_field |
| `trackFocus` | Checkbox | Rastrear Foco | Envia evento quando usuário foca em um campo | Sim | true |
| `trackBlur` | Checkbox | Rastrear Blur | Envia evento quando usuário sai de um campo | Sim | true |
| `trackChange` | Checkbox | Rastrear Mudança | Envia evento quando valor do campo muda | Sim | true |
| `trackProgress` | Checkbox | Rastrear Progresso | Envia evento de progresso do formulário (% preenchido) | Sim | true |
| `progressThreshold` | Text Input | Threshold de Progresso | Porcentagens para disparar evento de progresso (separadas por vírgula) | Não | 25,50,75,100 |
| `trackTiming` | Checkbox | Rastrear Tempo | Mede tempo de preenchimento por campo | Não | false |
| `ignoreFields` | Text Input | Campos Ignorados | Nomes ou IDs de campos a ignorar (separados por vírgula) | Não | password, credit-card |
| `enableDebug` | Checkbox | Modo Debug | Ativa logs detalhados no console | Não | false |

### Code Logic

**Fluxo principal:**

1. **Inicialização**
   - Valida configurações
   - Injeta script de tracking na página
   - Configura variáveis globais

2. **Detecção de Formulários**
   - Encontra formulários baseado em `formSelector`
   - Se vazio, detecta TODOS os formulários da página
   - Aguarda DOM ready se necessário

3. **Instrumentação de Campos**
   - Para cada formulário detectado:
     - Itera sobre campos do tipo especificado
     - Adiciona event listeners (focus, blur, change, input)
     - Ignora campos na lista `ignoreFields`
     - Cria objeto de estado para cada campo

4. **Rastreamento de Eventos**
   - **Focus**: Quando usuário clica/foca em campo
   - **Blur**: Quando usuário sai do campo
   - **Change**: Quando valor muda
   - **Progress**: Quando threshold de % preenchido é atingido
   - **Submit**: Captura submit do formulário

5. **Envio para dataLayer**
   - Formata evento com dados do campo
   - Push para `window.dataLayer`
   - Callback `gtmOnSuccess`

**APIs necessárias (via require):**
- `injectScript` - Injetar JavaScript de tracking na página
- `createQueue` - Criar função push para dataLayer
- `copyFromWindow` - Verificar se dataLayer existe
- `setInWindow` - Definir configuração global do tracker
- `logToConsole` - Logging condicional para debug
- `callLater` - Atrasar inicialização se DOM não está pronto
- `getTimestampMillis` - Timestamp para timing de campos

**Lógica de validação:**
- Verificar que pelo menos um tipo de evento está habilitado (focus, blur, change, progress)
- Validar formato de `progressThreshold` (números entre 0-100, separados por vírgula)
- Se `formSelector` especificado, validar que é um seletor CSS válido
- Validar que `trackFieldTypes` contém pelo menos um tipo de campo

**Tratamento de erros:**
- Se formulário não encontrado, logar erro em debug e chamar `gtmOnSuccess` (não é erro fatal)
- Se script de tracking falhar ao injetar, chamar `gtmOnFailure`
- Try/catch em event listeners para não quebrar página
- Se `dataLayer` não existe, criar automaticamente

**Estrutura de Evento enviado ao dataLayer:**

```javascript
{
  event: 'form_field_focus',              // ou blur, change, progress, submit
  form_id: 'contact-form',                // ID do formulário
  form_name: 'Contact Form',              // name attribute ou derivado
  field_id: 'email',                      // ID do campo
  field_name: 'email',                    // name attribute
  field_type: 'email',                    // tipo: text, email, tel, etc
  field_label: 'Your Email',              // label do campo (se existir)
  field_position: 3,                      // posição no formulário (1-indexed)
  field_value_length: 15,                 // tamanho do valor (sem expor conteúdo)
  form_progress: 60,                      // % de campos preenchidos
  fields_filled: 3,                       // quantidade de campos preenchidos
  fields_total: 5,                        // total de campos no formulário
  time_on_field: 2350,                    // tempo no campo em ms (se trackTiming=true)
  timestamp: 1706543210000                // timestamp do evento
}
```

### Permissions Required

- [x] `inject_script` - URL pattern: Self-hosted script ou inline
  - Precisa injetar o JavaScript de tracking na página
  - Pode ser inline (via data URI) ou externo

- [x] `access_globals` - Chaves: `dataLayer`, `_formFunnelConfig`
  - Read/Write: `dataLayer` - para push de eventos
  - Write: `_formFunnelConfig` - para passar configurações ao script
  - Execute: Não necessário

- [x] `logging` - Apenas em modo debug/preview
  - Para logs de diagnóstico

- [ ] `get_url` - Não necessário
- [ ] `send_pixel` - Não necessário
- [ ] `read_data_layer` - Não necessário (usa createQueue)

### External Dependencies

**Scripts a injetar:**
- JavaScript inline ou self-hosted
- Código: ~150-200 linhas de Vanilla JS
- Sem dependências externas (jQuery-free)
- Compatível com todos os browsers modernos + IE11

**Bibliotecas externas:**
- Nenhuma (100% vanilla JavaScript)

---

## Implementation Details

### Pseudocódigo

```javascript
// ========================================
// 1. IMPORTAÇÃO DE APIs
// ========================================
const injectScript = require('injectScript');
const createQueue = require('createQueue');
const setInWindow = require('setInWindow');
const copyFromWindow = require('copyFromWindow');
const logToConsole = require('logToConsole');
const callLater = require('callLater');
const getTimestampMillis = require('getTimestampMillis');

// ========================================
// 2. VALIDAÇÃO DE CONFIGURAÇÃO
// ========================================
// Verificar que pelo menos um tipo de evento está habilitado
if (!data.trackFocus && !data.trackBlur && !data.trackChange && !data.trackProgress) {
  if (data.enableDebug) {
    logToConsole('[Form Funnel] Erro: Nenhum tipo de evento habilitado');
  }
  return data.gtmOnFailure();
}

// Validar progressThreshold
let thresholds = [25, 50, 75, 100]; // padrão
if (data.progressThreshold) {
  thresholds = data.progressThreshold.split(',')
    .map(t => parseInt(t.trim()))
    .filter(t => t >= 0 && t <= 100);

  if (thresholds.length === 0) {
    if (data.enableDebug) {
      logToConsole('[Form Funnel] Threshold inválido, usando padrão');
    }
    thresholds = [25, 50, 75, 100];
  }
}

// ========================================
// 3. PREPARAR CONFIGURAÇÃO GLOBAL
// ========================================
const config = {
  formSelector: data.formSelector || null,
  trackFieldTypes: data.trackFieldTypes || ['input', 'textarea', 'select'],
  eventPrefix: data.eventPrefix || 'form_field',
  trackFocus: data.trackFocus,
  trackBlur: data.trackBlur,
  trackChange: data.trackChange,
  trackProgress: data.trackProgress,
  progressThresholds: thresholds,
  trackTiming: data.trackTiming || false,
  ignoreFields: (data.ignoreFields || 'password,credit-card,cvv,ccv').split(',').map(f => f.trim()),
  debug: data.enableDebug
};

// Setar configuração global para o script acessar
setInWindow('_formFunnelConfig', config, false);

// Debug log
if (data.enableDebug) {
  logToConsole('[Form Funnel] Configuração:', config);
}

// ========================================
// 4. VERIFICAR/CRIAR DATALAYER
// ========================================
let dataLayer = copyFromWindow('dataLayer');
if (!dataLayer) {
  setInWindow('dataLayer', [], false);
  if (data.enableDebug) {
    logToConsole('[Form Funnel] dataLayer criado');
  }
}

// ========================================
// 5. INJETAR SCRIPT DE TRACKING
// ========================================
// Script inline usando data URI para evitar dependência externa
const trackingScript = `
(function() {
  const config = window._formFunnelConfig || {};
  const dataLayer = window.dataLayer || [];

  function log(...args) {
    if (config.debug && console && console.log) {
      console.log('[Form Funnel]', ...args);
    }
  }

  log('Inicializando tracker...');

  // Estado do tracker
  const trackedForms = new Map();
  const fieldTimings = new Map();
  const progressMilestones = new Map();

  // ========================================
  // FUNÇÕES AUXILIARES
  // ========================================

  function getFieldLabel(field) {
    // Tentar label associado
    if (field.id) {
      const label = document.querySelector('label[for="' + field.id + '"]');
      if (label) return label.textContent.trim();
    }

    // Tentar label parent
    const parentLabel = field.closest('label');
    if (parentLabel) return parentLabel.textContent.trim();

    // Tentar placeholder
    if (field.placeholder) return field.placeholder;

    // Fallback: name ou id
    return field.name || field.id || 'unknown';
  }

  function getFieldPosition(form, field) {
    const fields = Array.from(form.querySelectorAll(
      config.trackFieldTypes.map(t => t).join(',')
    ));
    return fields.indexOf(field) + 1;
  }

  function isFieldIgnored(field) {
    const name = field.name || '';
    const id = field.id || '';
    const type = field.type || '';

    return config.ignoreFields.some(ignored =>
      name.includes(ignored) ||
      id.includes(ignored) ||
      type.includes(ignored)
    );
  }

  function getFormProgress(form) {
    const fields = Array.from(form.querySelectorAll(
      config.trackFieldTypes.map(t => t).join(',')
    ));

    const validFields = fields.filter(f => !isFieldIgnored(f));
    const filledFields = validFields.filter(f => {
      if (f.type === 'checkbox' || f.type === 'radio') {
        return f.checked;
      }
      return f.value && f.value.trim() !== '';
    });

    return {
      filled: filledFields.length,
      total: validFields.length,
      percent: validFields.length > 0
        ? Math.round((filledFields.length / validFields.length) * 100)
        : 0
    };
  }

  function pushToDataLayer(eventData) {
    try {
      dataLayer.push(eventData);
      log('Evento enviado:', eventData.event, eventData);
    } catch (e) {
      log('Erro ao enviar evento:', e);
    }
  }

  // ========================================
  // EVENT HANDLERS
  // ========================================

  function handleFieldFocus(event) {
    const field = event.target;
    const form = field.closest('form');
    if (!form) return;

    const fieldKey = form.id + ':' + (field.id || field.name);

    // Iniciar timing
    if (config.trackTiming) {
      fieldTimings.set(fieldKey, Date.now());
    }

    if (config.trackFocus) {
      const progress = getFormProgress(form);

      pushToDataLayer({
        event: config.eventPrefix + '_focus',
        form_id: form.id || 'form-' + trackedForms.get(form),
        form_name: form.name || form.id || 'unnamed',
        field_id: field.id || field.name || 'unnamed',
        field_name: field.name || field.id || 'unnamed',
        field_type: field.type || 'text',
        field_label: getFieldLabel(field),
        field_position: getFieldPosition(form, field),
        form_progress: progress.percent,
        fields_filled: progress.filled,
        fields_total: progress.total,
        timestamp: Date.now()
      });
    }
  }

  function handleFieldBlur(event) {
    const field = event.target;
    const form = field.closest('form');
    if (!form) return;

    const fieldKey = form.id + ':' + (field.id || field.name);
    let timeOnField = null;

    // Calcular tempo no campo
    if (config.trackTiming && fieldTimings.has(fieldKey)) {
      timeOnField = Date.now() - fieldTimings.get(fieldKey);
      fieldTimings.delete(fieldKey);
    }

    if (config.trackBlur) {
      const progress = getFormProgress(form);

      const eventData = {
        event: config.eventPrefix + '_blur',
        form_id: form.id || 'form-' + trackedForms.get(form),
        form_name: form.name || form.id || 'unnamed',
        field_id: field.id || field.name || 'unnamed',
        field_name: field.name || field.id || 'unnamed',
        field_type: field.type || 'text',
        field_label: getFieldLabel(field),
        field_position: getFieldPosition(form, field),
        field_value_length: field.value ? field.value.length : 0,
        form_progress: progress.percent,
        fields_filled: progress.filled,
        fields_total: progress.total,
        timestamp: Date.now()
      };

      if (timeOnField !== null) {
        eventData.time_on_field = timeOnField;
      }

      pushToDataLayer(eventData);
    }
  }

  function handleFieldChange(event) {
    const field = event.target;
    const form = field.closest('form');
    if (!form) return;

    if (config.trackChange) {
      const progress = getFormProgress(form);

      pushToDataLayer({
        event: config.eventPrefix + '_change',
        form_id: form.id || 'form-' + trackedForms.get(form),
        form_name: form.name || form.id || 'unnamed',
        field_id: field.id || field.name || 'unnamed',
        field_name: field.name || field.id || 'unnamed',
        field_type: field.type || 'text',
        field_label: getFieldLabel(field),
        field_position: getFieldPosition(form, field),
        field_value_length: field.value ? field.value.length : 0,
        form_progress: progress.percent,
        fields_filled: progress.filled,
        fields_total: progress.total,
        timestamp: Date.now()
      });
    }

    // Checar progress milestones
    if (config.trackProgress) {
      const progress = getFormProgress(form);
      const formKey = form.id || 'form-' + trackedForms.get(form);

      if (!progressMilestones.has(formKey)) {
        progressMilestones.set(formKey, new Set());
      }

      const reached = progressMilestones.get(formKey);

      config.progressThresholds.forEach(threshold => {
        if (progress.percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);

          pushToDataLayer({
            event: config.eventPrefix + '_progress',
            form_id: formKey,
            form_name: form.name || form.id || 'unnamed',
            form_progress: progress.percent,
            progress_milestone: threshold,
            fields_filled: progress.filled,
            fields_total: progress.total,
            timestamp: Date.now()
          });
        }
      });
    }
  }

  function handleFormSubmit(event) {
    const form = event.target;
    const progress = getFormProgress(form);

    pushToDataLayer({
      event: config.eventPrefix + '_submit',
      form_id: form.id || 'form-' + trackedForms.get(form),
      form_name: form.name || form.id || 'unnamed',
      form_progress: progress.percent,
      fields_filled: progress.filled,
      fields_total: progress.total,
      timestamp: Date.now()
    });
  }

  // ========================================
  // INSTRUMENTAÇÃO DE FORMULÁRIOS
  // ========================================

  function instrumentForm(form, index) {
    if (trackedForms.has(form)) {
      log('Formulário já instrumentado:', form.id || index);
      return;
    }

    trackedForms.set(form, index);
    log('Instrumentando formulário:', form.id || 'form-' + index);

    // Adicionar listener de submit
    form.addEventListener('submit', handleFormSubmit, false);

    // Encontrar campos
    const fieldSelectors = config.trackFieldTypes.map(t => t).join(',');
    const fields = form.querySelectorAll(fieldSelectors);

    log('Campos encontrados:', fields.length);

    fields.forEach(field => {
      // Skip ignored fields
      if (isFieldIgnored(field)) {
        log('Campo ignorado:', field.name || field.id);
        return;
      }

      // Adicionar listeners
      if (config.trackFocus) {
        field.addEventListener('focus', handleFieldFocus, false);
      }

      if (config.trackBlur) {
        field.addEventListener('blur', handleFieldBlur, false);
      }

      if (config.trackChange) {
        field.addEventListener('change', handleFieldChange, false);
        // Para inputs de texto, também escutar input
        if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
          field.addEventListener('input', handleFieldChange, false);
        }
      }
    });
  }

  // ========================================
  // INICIALIZAÇÃO
  // ========================================

  function init() {
    log('Buscando formulários...');

    let forms;
    if (config.formSelector) {
      forms = document.querySelectorAll(config.formSelector);
      log('Formulários encontrados (seletor específico):', forms.length);
    } else {
      forms = document.querySelectorAll('form');
      log('Formulários encontrados (todos):', forms.length);
    }

    if (forms.length === 0) {
      log('Nenhum formulário encontrado');
      return;
    }

    forms.forEach((form, index) => {
      instrumentForm(form, index + 1);
    });

    log('Tracker inicializado com sucesso');
  }

  // Aguardar DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
`;

// Criar data URI para script inline
const scriptDataUri = 'data:text/javascript;base64,' + btoa(trackingScript);

// Injetar script
injectScript(
  scriptDataUri,
  () => {
    if (data.enableDebug) {
      logToConsole('[Form Funnel] Script injetado com sucesso');
    }
    data.gtmOnSuccess();
  },
  () => {
    if (data.enableDebug) {
      logToConsole('[Form Funnel] Erro ao injetar script');
    }
    data.gtmOnFailure();
  }
);
```

### Casos de Uso

**Caso 1: Formulário de Contato Comercial**
- **Cenário**: Formulário com 6 campos (nome, email, telefone, empresa, cargo, mensagem)
- **Eventos gerados**:
  1. `form_field_focus` - usuário foca no campo nome
  2. `form_field_blur` - usuário sai do campo nome (preenchido)
  3. `form_field_change` - valor do campo nome mudou
  4. `form_field_progress` - 25% do formulário preenchido (2/6 campos)
  5. `form_field_progress` - 50% preenchido
  6. `form_field_submit` - formulário enviado
- **Análise**: Ver em qual campo usuários param de preencher

**Caso 2: Checkout Multi-step**
- **Cenário**: Formulário de checkout com 10+ campos
- **Configuração**: `progressThreshold: "20,40,60,80,100"`
- **Eventos gerados**: Progress milestones ajudam a criar funil detalhado
- **Análise**: Identificar etapa exata de abandono

**Caso 3: Lead Generation Form**
- **Cenário**: Formulário curto (3 campos: nome, email, telefone)
- **Configuração**: `trackTiming: true`
- **Eventos gerados**: Inclui `time_on_field` em cada evento blur
- **Análise**: Identificar campos que causam hesitação (tempo alto = dúvida)

**Caso 4: Formulário com Campos Sensíveis**
- **Cenário**: Formulário inclui senha e número de cartão
- **Configuração**: `ignoreFields: "password,credit-card,cvv,ccv"`
- **Eventos**: Campos sensíveis não são rastreados (privacidade)
- **Análise**: Dados seguros, apenas campos públicos rastreados

### Edge Cases

1. **Formulários dinâmicos (AJAX)**
   - Script roda no DOM ready, pode não detectar forms carregados depois
   - **Solução**: Reinvocar tag quando novo form aparecer, ou usar MutationObserver
   - **Workaround**: Configurar trigger GTM para detectar mudanças no DOM

2. **Formulários sem ID**
   - Script gera ID automático `form-1`, `form-2`, etc.
   - **Atenção**: ID pode mudar se ordem de formulários mudar
   - **Melhor prática**: Sempre adicionar ID aos formulários importantes

3. **Campos sem name/id**
   - Script tenta obter de `name`, depois `id`, depois gera `unnamed`
   - **Atenção**: Dificulta análise posterior
   - **Melhor prática**: Garantir que campos tenham `name` ou `id`

4. **DataLayer não existe**
   - Template cria automaticamente `window.dataLayer = []`
   - **Funcionamento**: Não causa erro, cria array vazio
   - **Atenção**: Dados ficam em memória mas não vão para lugar nenhum

5. **Multiplos formulários na página**
   - Script instrumenta TODOS se `formSelector` vazio
   - **Performance**: Pode gerar muitos eventos
   - **Solução**: Usar `formSelector` específico para limitar

6. **Campos preenchidos automaticamente (autocomplete)**
   - Browser autocomplete não dispara evento `change`
   - **Limitação**: Progress pode não refletir realidade
   - **Workaround**: Escutar evento `input` também (já implementado)

7. **Eventos duplicados**
   - Se tag dispara múltiplas vezes, listeners são duplicados
   - **Proteção**: Script checa `trackedForms.has(form)` antes de instrumentar
   - **Funcionamento**: Não adiciona listeners duplicados

8. **Formulários em iframes**
   - Script não acessa formulários dentro de iframes por cross-origin
   - **Limitação**: Apenas same-origin iframes funcionam
   - **Solução**: Adicionar tag dentro do iframe se possível

### Testing Checklist

- [ ] **Teste básico de detecção**
  - [ ] Formulário com ID é detectado e instrumentado
  - [ ] Formulário sem ID é detectado e recebe ID automático
  - [ ] `formSelector` específico detecta apenas forms correspondentes
  - [ ] `formSelector` vazio detecta TODOS os formulários

- [ ] **Teste de eventos**
  - [ ] Evento `form_field_focus` dispara ao focar campo
  - [ ] Evento `form_field_blur` dispara ao sair do campo
  - [ ] Evento `form_field_change` dispara ao mudar valor
  - [ ] Evento `form_field_progress` dispara nos thresholds corretos
  - [ ] Evento `form_field_submit` dispara ao enviar form

- [ ] **Teste de dados do evento**
  - [ ] `form_id` está correto
  - [ ] `field_id` e `field_name` estão corretos
  - [ ] `field_label` é extraído corretamente
  - [ ] `field_position` reflete ordem correta
  - [ ] `form_progress` calcula porcentagem correta
  - [ ] `field_value_length` não expõe conteúdo (apenas tamanho)

- [ ] **Teste de timing**
  - [ ] `trackTiming: true` adiciona `time_on_field`
  - [ ] Tempo é medido em milliseconds
  - [ ] Timing zerado quando campo recebe foco novamente

- [ ] **Teste de campos ignorados**
  - [ ] Campos em `ignoreFields` não disparam eventos
  - [ ] Password fields são ignorados por padrão
  - [ ] Validar múltiplos padrões (name, id, type)

- [ ] **Teste de progress**
  - [ ] Progress 0% no início
  - [ ] Progress aumenta conforme campos preenchidos
  - [ ] Progress 100% quando todos preenchidos
  - [ ] Milestones disparam apenas uma vez

- [ ] **Teste de debug**
  - [ ] `enableDebug: true` mostra logs no console
  - [ ] `enableDebug: false` não mostra logs
  - [ ] Erros são logados mesmo sem debug

- [ ] **Teste de edge cases**
  - [ ] Formulário dinâmico (carregado via AJAX) - manual trigger
  - [ ] Múltiplos formulários na mesma página
  - [ ] Form sem campos válidos
  - [ ] Campos com autocomplete do browser
  - [ ] Submit via JavaScript (não clique no botão)

- [ ] **Teste de compatibilidade**
  - [ ] Chrome/Edge (últimas 2 versões)
  - [ ] Firefox (últimas 2 versões)
  - [ ] Safari (última versão)
  - [ ] Mobile Safari (iOS)
  - [ ] Mobile Chrome (Android)

- [ ] **Teste de performance**
  - [ ] Formulário com 50+ campos não trava
  - [ ] Eventos não atrasam digitação do usuário
  - [ ] Memória não cresce indefinidamente

- [ ] **Validações GTM**
  - [ ] Tag aparece na lista de templates
  - [ ] Todos os campos aparecem na interface
  - [ ] Preview Mode mostra eventos no dataLayer
  - [ ] Permissões configuradas corretamente

---

## Documentation

### README.md do Template

```markdown
# Form Funnel Tracker

Template GTM para rastrear progressão de preenchimento de formulários campo por campo.

## O que faz

Monitora a interação do usuário com formulários e envia eventos para o `dataLayer` do GTM, permitindo:

- ✅ Criar funil de conversão detalhado campo por campo
- ✅ Identificar campos que causam abandono
- ✅ Medir tempo de preenchimento por campo
- ✅ Rastrear progresso do formulário (% preenchido)
- ✅ Analisar comportamento de usuários em formulários

## Instalação

1. No GTM, vá em **Templates** → **Novo**
2. Clique em **Importar**
3. Selecione `form-funnel-tracker.tpl`
4. Clique em **Salvar**

## Configuração

### Campos obrigatórios

Nenhum! O template funciona com configuração padrão (rastreia todos os formulários).

### Campos opcionais

#### Seletor do Formulário
- **Campo**: `formSelector`
- **Descrição**: Seletor CSS do formulário específico a rastrear
- **Exemplos**: `#contact-form`, `.lead-form`, `form[name="signup"]`
- **Padrão**: (vazio = rastreia TODOS os formulários)

#### Prefixo dos Eventos
- **Campo**: `eventPrefix`
- **Descrição**: Prefixo para nomes de eventos
- **Padrão**: `form_field`
- **Resultado**: Eventos como `form_field_focus`, `form_field_blur`, etc.

#### Tipos de Evento

- **Rastrear Foco**: Evento quando usuário foca no campo
- **Rastrear Blur**: Evento quando usuário sai do campo
- **Rastrear Mudança**: Evento quando valor do campo muda
- **Rastrear Progresso**: Evento de % preenchido do formulário

#### Threshold de Progresso
- **Campo**: `progressThreshold`
- **Descrição**: Porcentagens para disparar evento de progresso
- **Formato**: Números separados por vírgula
- **Padrão**: `25,50,75,100`
- **Exemplo**: `20,40,60,80,100` para 5 checkpoints

#### Rastrear Tempo
- **Campo**: `trackTiming`
- **Descrição**: Medir tempo que usuário passa em cada campo
- **Padrão**: Desabilitado (performance)

#### Campos Ignorados
- **Campo**: `ignoreFields`
- **Descrição**: Campos a não rastrear (por nome ou ID)
- **Padrão**: `password,credit-card,cvv,ccv`
- **Exemplo**: `password,ssn,credit-card,secret`

#### Modo Debug
- **Campo**: `enableDebug`
- **Descrição**: Ativa logs detalhados no console
- **Uso**: Apenas para desenvolvimento/troubleshooting

## Uso

### Exemplo 1: Rastrear formulário de contato

**Configuração da Tag:**
1. Crie nova tag usando template "Form Funnel Tracker"
2. **Seletor do Formulário**: `#contact-form`
3. **Rastrear Foco**: ✓
4. **Rastrear Blur**: ✓
5. **Rastrear Mudança**: ✓
6. **Rastrear Progresso**: ✓

**Trigger:** Page View - All Pages

**Resultado:** Eventos enviados ao dataLayer conforme usuário interage com form

### Exemplo 2: Rastrear TODOS os formulários

**Configuração da Tag:**
1. Template "Form Funnel Tracker"
2. **Seletor do Formulário**: (deixe vazio)
3. Habilite eventos desejados

**Trigger:** Page View - All Pages

**Resultado:** Todos os formulários da página são rastreados

### Exemplo 3: Rastrear com timing

**Configuração:**
1. Template "Form Funnel Tracker"
2. **Rastrear Tempo**: ✓
3. Demais configs padrão

**Resultado:** Eventos incluem campo `time_on_field` com tempo em ms

## Eventos Gerados

O template envia eventos para `window.dataLayer` com a seguinte estrutura:

### form_field_focus
Disparado quando usuário foca em um campo.

```javascript
{
  event: 'form_field_focus',
  form_id: 'contact-form',
  form_name: 'Contact Form',
  field_id: 'email',
  field_name: 'email',
  field_type: 'email',
  field_label: 'Your Email',
  field_position: 3,
  form_progress: 40,
  fields_filled: 2,
  fields_total: 5,
  timestamp: 1706543210000
}
```

### form_field_blur
Disparado quando usuário sai de um campo.

```javascript
{
  event: 'form_field_blur',
  // ... mesmos campos do focus
  field_value_length: 15,        // tamanho do valor
  time_on_field: 2350            // tempo no campo (se trackTiming=true)
}
```

### form_field_change
Disparado quando valor do campo muda.

```javascript
{
  event: 'form_field_change',
  // ... campos do blur
}
```

### form_field_progress
Disparado quando threshold de progresso é atingido.

```javascript
{
  event: 'form_field_progress',
  form_id: 'contact-form',
  form_name: 'Contact Form',
  form_progress: 50,             // % atual
  progress_milestone: 50,        // threshold atingido
  fields_filled: 3,
  fields_total: 5,
  timestamp: 1706543210000
}
```

### form_field_submit
Disparado quando formulário é enviado.

```javascript
{
  event: 'form_field_submit',
  form_id: 'contact-form',
  form_name: 'Contact Form',
  form_progress: 100,
  fields_filled: 5,
  fields_total: 5,
  timestamp: 1706543210000
}
```

## Criando Triggers e Tags no GTM

### 1. Criar Triggers baseados nos eventos

**Exemplo: Trigger para Focus em Campo Email**

- Tipo: Custom Event
- Nome do evento: `form_field_focus`
- Condição: `field_name` equals `email`

**Exemplo: Trigger para Progresso 50%**

- Tipo: Custom Event
- Nome do evento: `form_field_progress`
- Condição: `progress_milestone` equals `50`

### 2. Criar Tags de Analytics

**Exemplo: Enviar evento para GA4**

- Tipo: GA4 Event
- Nome do evento: `{{Event}}`
- Parâmetros:
  - `form_id`: `{{DLV - form_id}}`
  - `field_name`: `{{DLV - field_name}}`
  - `form_progress`: `{{DLV - form_progress}}`

**Variáveis dataLayer necessárias:**
- Crie variáveis dataLayer para cada campo do evento que quiser usar

## Análises Possíveis

### 1. Funil de Conversão por Campo

Crie funil no GA4 com steps:
1. form_field_focus (campo 1)
2. form_field_focus (campo 2)
3. form_field_focus (campo 3)
4. ...
5. form_field_submit

**Insight**: Ver em qual campo usuários abandonam

### 2. Análise de Tempo por Campo

Se `trackTiming` habilitado:
- Compare `time_on_field` médio por `field_name`
- Campos com tempo alto = hesitação/dúvida
- Campos com tempo baixo = fáceis de preencher

**Insight**: Otimizar campos problemáticos

### 3. Taxa de Abandono por Progresso

Compare:
- Usuários que atingiram progress 25%
- Usuários que atingiram progress 50%
- Usuários que atingiram progress 75%
- Usuários que completaram (100%)

**Insight**: Identificar ponto crítico de abandono

### 4. Heatmap de Campos

Visualize:
- Quantos usuários focaram em cada campo
- Quantos preencheram (blur com length > 0)
- Taxa de preenchimento por campo

**Insight**: Campos ignorados vs campos preenchidos

## Debugging

### Habilitar Modo Debug

1. Marque **"Modo Debug"** na configuração da tag
2. Abra Console do navegador (F12)
3. Recarregue a página
4. Veja logs com prefixo `[Form Funnel]`

### Logs de Debug

```
[Form Funnel] Configuração: {formSelector: "#contact", ...}
[Form Funnel] dataLayer criado
[Form Funnel] Script injetado com sucesso
[Form Funnel] Inicializando tracker...
[Form Funnel] Buscando formulários...
[Form Funnel] Formulários encontrados (todos): 2
[Form Funnel] Instrumentando formulário: contact-form
[Form Funnel] Campos encontrados: 5
[Form Funnel] Tracker inicializado com sucesso
[Form Funnel] Evento enviado: form_field_focus {...}
```

### Verificar eventos no GTM Preview

1. Ative Preview Mode no GTM
2. Interaja com o formulário
3. Veja eventos aparecendo na aba **Data Layer**
4. Verifique valores dos campos do evento

## Troubleshooting

### Eventos não aparecem no dataLayer

**Possíveis causas:**
1. Formulário não foi detectado
   - **Solução**: Verificar `formSelector` ou deixar vazio
   - **Debug**: Checar logs para "Formulários encontrados: 0"

2. Nenhum tipo de evento habilitado
   - **Solução**: Habilitar pelo menos Focus, Blur, Change ou Progress

3. Campos estão sendo ignorados
   - **Solução**: Verificar `ignoreFields`, remover se necessário

### Eventos duplicados

**Causa**: Tag disparou múltiplas vezes na mesma página

**Solução**:
- Verificar trigger da tag (deve disparar 1x por página)
- Script tem proteção contra duplicação

### Performance lenta

**Causa**: Formulário com muitos campos + `trackTiming` habilitado

**Solução**:
- Desabilitar `trackTiming` se não for necessário
- Usar `formSelector` específico (não rastrear todos os forms)
- Desabilitar eventos não essenciais

### Campos sem nome/ID

**Sintoma**: `field_id` e `field_name` aparecem como "unnamed"

**Solução**: Adicionar atributos `name` ou `id` aos campos HTML

```html
<!-- Antes -->
<input type="text" placeholder="Email">

<!-- Depois -->
<input type="text" name="email" id="email" placeholder="Email">
```

## Privacidade e Segurança

### ✅ O template É seguro

- **NÃO captura valores dos campos** (apenas tamanho com `field_value_length`)
- **Ignora campos sensíveis por padrão** (password, credit-card, etc)
- **Não envia dados para servidores externos** (apenas dataLayer local)
- **Código 100% client-side** (JavaScript na página)

### ⚠️ Atenção

- Campos como email e telefone **têm eventos rastreados** (mas sem valor)
- Se precisar ignorar mais campos, adicione em `ignoreFields`
- **Não use para formulários de pagamento** sem revisar campos ignorados

## Compatibilidade

- ✅ Chrome/Edge (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (última versão)
- ✅ Mobile Safari (iOS 12+)
- ✅ Mobile Chrome (Android 8+)
- ✅ IE11 (com limitações em timing)

## Referências

- [GTM Templates Documentation](../../.claude/docs/visao-geral.md)
- [Referência de APIs GTM](../../.claude/docs/api-reference.md)
- [Form Tracking Best Practices](#)
```

### Comentários no Código

```javascript
// ========================================
// 1. IMPORTAÇÃO DE APIs GTM
// ========================================
// APIs necessárias para injetar script e interagir com dataLayer

// ========================================
// 2. VALIDAÇÃO DE CONFIGURAÇÃO
// ========================================
// Garantir que configuração é válida antes de prosseguir
// Verificar que pelo menos um tipo de evento está habilitado

// ========================================
// 3. PREPARAR CONFIGURAÇÃO GLOBAL
// ========================================
// Objeto config será acessado pelo JavaScript injetado
// Setar em window._formFunnelConfig

// ========================================
// 4. VERIFICAR/CRIAR DATALAYER
// ========================================
// Garantir que window.dataLayer existe
// Se não existir, criar array vazio

// ========================================
// 5. INJETAR SCRIPT DE TRACKING
// ========================================
// Script inline usando data URI para evitar dependência externa
// Script contém toda lógica de tracking de formulários
// Vanilla JavaScript, sem dependências (jQuery-free)

// === FUNÇÕES DO SCRIPT INJETADO ===

// getFieldLabel(): Extrai label do campo (busca label, placeholder, name)
// getFieldPosition(): Retorna posição do campo no formulário (1-indexed)
// isFieldIgnored(): Verifica se campo deve ser ignorado (password, etc)
// getFormProgress(): Calcula % de preenchimento do formulário
// pushToDataLayer(): Envia evento para window.dataLayer

// === EVENT HANDLERS ===

// handleFieldFocus(): Disparado quando campo recebe foco
// handleFieldBlur(): Disparado quando campo perde foco (calcula timing)
// handleFieldChange(): Disparado quando valor muda (checa progress milestones)
// handleFormSubmit(): Disparado quando form é enviado

// === INSTRUMENTAÇÃO ===

// instrumentForm(): Adiciona listeners em todos os campos do formulário
// init(): Detecta formulários e chama instrumentForm() para cada um
```

---

## Acceptance Criteria

### Funcional

- [ ] **Detecção de formulários**
  - [ ] Detecta formulário específico com `formSelector`
  - [ ] Detecta TODOS os formulários se `formSelector` vazio
  - [ ] Não quebra se formulário não existe

- [ ] **Eventos gerados**
  - [ ] `form_field_focus` dispara ao focar campo
  - [ ] `form_field_blur` dispara ao sair do campo
  - [ ] `form_field_change` dispara ao mudar valor
  - [ ] `form_field_progress` dispara nos thresholds corretos
  - [ ] `form_field_submit` dispara ao enviar form

- [ ] **Estrutura dos eventos**
  - [ ] Todos eventos têm `event` com nome correto
  - [ ] Incluem `form_id`, `form_name`
  - [ ] Incluem `field_id`, `field_name`, `field_type`, `field_label`
  - [ ] Incluem `form_progress`, `fields_filled`, `fields_total`
  - [ ] `field_value_length` presente em blur/change (não o valor real)
  - [ ] `time_on_field` presente quando `trackTiming=true`

- [ ] **Cálculo de progresso**
  - [ ] Progress 0% no início
  - [ ] Progress aumenta conforme campos preenchidos
  - [ ] Progress 100% quando todos campos preenchidos
  - [ ] Progress ignora campos em `ignoreFields`
  - [ ] Checkboxes/radios contam quando checked

- [ ] **Campos ignorados**
  - [ ] Campos em `ignoreFields` não disparam eventos
  - [ ] Password fields ignorados por padrão
  - [ ] Match funciona em name, id e type

- [ ] **Debug e logs**
  - [ ] `enableDebug=true` mostra logs no console
  - [ ] `enableDebug=false` não mostra logs
  - [ ] Logs têm prefixo `[Form Funnel]`

- [ ] **Callbacks GTM**
  - [ ] `gtmOnSuccess` chamado quando script injeta com sucesso
  - [ ] `gtmOnFailure` chamado se injeção falha
  - [ ] `gtmOnFailure` chamado se configuração inválida

### Não-funcional

- [ ] **Código**
  - [ ] Segue guia de estilo do repositório
  - [ ] Comentários em seções principais
  - [ ] Nome do template: "Form Funnel Tracker da Métricas Boss"
  - [ ] Código JavaScript vanilla (sem jQuery)

- [ ] **Performance**
  - [ ] Formulário com 50+ campos não trava
  - [ ] Eventos não causam lag na digitação
  - [ ] Script injeta em < 100ms
  - [ ] Memória não vaza (listeners limpos ao remover form)

- [ ] **Documentação**
  - [ ] README.md completo em português
  - [ ] Exemplos de configuração
  - [ ] Estrutura de eventos documentada
  - [ ] Troubleshooting guide incluído
  - [ ] Exemplos de análises possíveis

- [ ] **Permissões**
  - [ ] Apenas permissões mínimas necessárias
  - [ ] `inject_script` para data URI inline
  - [ ] `access_globals` para dataLayer
  - [ ] `logging` apenas em debug

### Segurança

- [ ] **Privacidade**
  - [ ] NÃO captura valores dos campos
  - [ ] Apenas `field_value_length` (tamanho)
  - [ ] Ignora password, credit-card, cvv por padrão
  - [ ] Não envia dados para servidores externos

- [ ] **Validações**
  - [ ] Valida entrada do usuário (thresholds, seletores)
  - [ ] Try/catch em event listeners (não quebra página)
  - [ ] Verifica existência de dataLayer

- [ ] **Injeção segura**
  - [ ] Script inline via data URI (sem URL externo)
  - [ ] Sem eval() ou Function() constructor
  - [ ] Sem acesso a cookies ou localStorage

### Compatibilidade

- [ ] **Browsers**
  - [ ] Chrome/Edge (últimas 2 versões)
  - [ ] Firefox (últimas 2 versões)
  - [ ] Safari (última versão)
  - [ ] Mobile Safari (iOS 12+)
  - [ ] Mobile Chrome (Android)

- [ ] **GTM**
  - [ ] Funciona em Web Container
  - [ ] Preview Mode mostra eventos corretamente
  - [ ] Debug Console mostra erros claramente

- [ ] **Formulários**
  - [ ] Forms estáticos (HTML puro)
  - [ ] Forms com campos dinâmicos (desde que presentes no DOM ready)
  - [ ] Múltiplos formulários na mesma página
  - [ ] Forms em single page apps (requer retrigger manual)

---

## Next Steps

### 1. Review da Especificação ✅

Revisar com stakeholders:
- [ ] Requisitos funcionais cobrem necessidades?
- [ ] Estrutura de eventos está adequada para análises?
- [ ] Campos ignorados estão corretos?
- [ ] Performance é aceitável?

### 2. Implementação

Criar o template baseado nesta spec:
1. Criar arquivo `template.tpl` com código GTM
2. Adicionar campos na seção `___TEMPLATE_PARAMETERS___`
3. Implementar lógica na seção `___SANDBOXED_JS_FOR_WEB_TEMPLATE___`
4. Configurar permissões em `___WEB_PERMISSIONS___`
5. Adicionar testes em `___TESTS___`

### 3. Testes

Seguir testing checklist acima:
- [ ] Testar em ambiente de dev
- [ ] Validar eventos no GTM Preview
- [ ] Testar edge cases
- [ ] Testar performance com forms grandes
- [ ] Validar cross-browser

### 4. Documentação

- [ ] Criar README.md baseado no template acima
- [ ] Adicionar exemplos visuais (screenshots se possível)
- [ ] Documentar casos de uso reais
- [ ] Criar guia de análises no GA4

### 5. Deploy

- [ ] Commit do código + PRP + README
- [ ] Atualizar README principal do repositório
- [ ] Adicionar ao índice de templates
- [ ] Publicar (se for compartilhar publicamente)

---

**Data de criação:** 2026-01-28
**Autor:** Métricas Boss Team
**Versão:** 1.0
**Status:** Em especificação
