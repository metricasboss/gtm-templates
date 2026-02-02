# Form Funnel Tracker | Rastreamento de Formulários

Template do Google Tag Manager para rastreamento campo a campo de formulários, enviando eventos estruturados para o dataLayer para análise completa do funil de conversão.

## 📋 Sobre

O **Form Funnel Tracker** é um template GTM que monitora cada interação do usuário com formulários em seu site, permitindo identificar:

- **Pontos de abandono**: Quais campos fazem usuários desistirem do preenchimento
- **Campos problemáticos**: Quais campos causam mais dúvidas ou erros
- **Tempo de preenchimento**: Quanto tempo usuários levam em cada etapa
- **Taxa de conclusão**: Quantos usuários completam o formulário
- **Preenchimento automático**: Quando navegadores autocompletam campos

Ideal para otimizar formulários de checkout, cadastro, contato, lead generation e qualquer outro tipo de formulário.

## 📊 Tipos de Eventos Rastreados

O Form Funnel Tracker monitora **5 tipos de interações** com formulários. Entenda cada uma:

| Evento | O que é? | Quando dispara? | Exemplo Prático | Use para... |
|--------|----------|-----------------|-----------------|-------------|
| **🎯 Focus** | Usuário **clica ou navega** (Tab) para um campo | Quando o cursor entra no campo ou o campo é selecionado via teclado | Você clica no campo "E-mail" para começar a digitar | • Identificar campos que atraem atenção mas não são preenchidos<br>• Calcular taxa de abandono por campo<br>• Entender ordem de preenchimento |
| **👋 Blur** | Usuário **sai do campo** (clica fora ou aperta Tab) | Quando o cursor deixa o campo, independente de ter digitado algo | Você digita seu e-mail e clica no próximo campo | • Medir tempo gasto em cada campo<br>• Identificar campos que causam confusão<br>• Detectar hesitação do usuário |
| **✏️ Change** | **Valor do campo foi alterado** | Após o blur, se o valor foi modificado. Para select/checkbox/radio dispara imediatamente | Você digita "joao@email.com" e passa para o próximo campo | • Confirmar que campo foi realmente preenchido<br>• Distinguir entre "apenas olhou" vs "preencheu"<br>• Validar engajamento real |
| **⚡ Autocomplete** | Navegador **preencheu automaticamente** o campo | Detecta quando campo é preenchido sem o usuário estar focado nele | Chrome preenche automaticamente seu nome/endereço | • Entender quantos usam autocomplete<br>• Ajustar análise de tempo (autocomplete é instantâneo)<br>• Identificar campos que facilitam conversão |
| **🚀 Submit** | Usuário **enviou o formulário** | Quando botão submit é clicado ou Enter é pressionado | Você clica no botão "Finalizar Compra" | • Calcular taxa de conclusão<br>• Medir conversão final<br>• Criar funil completo (início → fim) |

### 🔍 Detalhamento: Como Cada Evento Funciona

#### 1️⃣ Focus (Foco)
**Gatilho**: Evento JavaScript `focus`

**O que significa?**
- Usuário **começou a interagir** com o campo
- Pode ser via mouse (clique) ou teclado (Tab)
- Campo está "ativo" e pronto para receber input

**Exemplo de jornada**:
```
1. Usuário vê formulário
2. Clica no campo "Nome" → 🎯 FOCUS dispara
3. Cursor pisca no campo, esperando digitação
```

**Dados capturados**:
```javascript
{
  event: 'form_funnel_focus',
  field_id: 'nome',
  field_value_length: 0,  // Ainda vazio
  form_progress: 0        // 0% preenchido
}
```

**⚠️ Importante**: Focus NÃO significa que o usuário digitou algo, apenas que o campo recebeu atenção.

---

#### 2️⃣ Blur (Desfoque)
**Gatilho**: Evento JavaScript `blur`

**O que significa?**
- Usuário **saiu do campo** (removeu o foco)
- Pode ter digitado algo ou não
- Campo não está mais ativo

**Exemplo de jornada**:
```
1. Campo "E-mail" está com focus
2. Usuário digita "joao@example.com"
3. Usuário clica no próximo campo → 👋 BLUR dispara
```

**Dados capturados**:
```javascript
{
  event: 'form_funnel_blur',
  field_id: 'email',
  field_value_length: 18,  // "joao@example.com" = 18 caracteres
  form_progress: 25        // 25% do formulário preenchido
}
```

**📏 Cálculo de tempo**:
Diferença entre `blur` e `focus` do mesmo campo = tempo gasto no campo

**Use para identificar**:
- Campos que tomam muito tempo (possível dificuldade)
- Campos abandonados rapidamente (possível confusão)

---

#### 3️⃣ Change (Alteração)
**Gatilho**: Evento JavaScript `change`

**O que significa?**
- **Valor do campo foi modificado** de fato
- Para inputs de texto: dispara após blur (quando sai do campo)
- Para select/checkbox/radio: dispara imediatamente ao selecionar

**Diferença Focus vs Change**:
- **Focus**: "Olhou para o campo" (pode estar vazio)
- **Change**: "Modificou o valor" (definitivamente preenchido)

**Exemplo de jornada**:
```
1. Campo "Telefone" recebe focus
2. Usuário digita "(11) 99999-9999"
3. Usuário sai do campo (blur)
4. → ✏️ CHANGE dispara (valor foi alterado)
```

**Dados capturados**:
```javascript
{
  event: 'form_funnel_change',
  field_id: 'telefone',
  field_value_length: 16,  // "(11) 99999-9999" = 16 caracteres
  form_progress: 50        // 50% do formulário preenchido
}
```

**⚠️ Casos especiais**:
- **Select**: Change dispara ao selecionar opção (não precisa blur)
- **Checkbox**: Change dispara ao marcar/desmarcar
- **Radio**: Change dispara ao selecionar opção

---

#### 4️⃣ Autocomplete (Preenchimento Automático)
**Gatilho**: Detecção customizada via `input` event

**O que significa?**
- Navegador **preencheu automaticamente** o campo
- Usuário não digitou manualmente
- Campo foi preenchido "instantaneamente"

**Como funciona a detecção**:
```javascript
// Lógica interna do tracker:
1. Campo recebe valor via evento 'input'
2. Aguarda 100ms
3. Se campo tem valor MAS usuário não está focado nele
   → É autocomplete! ⚡ AUTOCOMPLETE dispara
```

**Exemplo de jornada**:
```
1. Usuário clica em "Nome"
2. Chrome pergunta: "Preencher com João Silva?"
3. Usuário clica "Sim"
4. Múltiplos campos são preenchidos instantaneamente
   → ⚡ AUTOCOMPLETE dispara para cada um
```

**Dados capturados**:
```javascript
{
  event: 'form_funnel_autocomplete',
  field_id: 'nome',
  field_value_length: 10,  // "João Silva" = 10 caracteres
  form_progress: 75        // 75% preenchido via autocomplete
}
```

**📊 Impacto na análise**:
- Usuários com autocomplete preenchem **muito mais rápido**
- Pode distorcer médias de "tempo por campo"
- Use para criar segmentos: "Com autocomplete" vs "Sem autocomplete"

---

#### 5️⃣ Submit (Envio)
**Gatilho**: Evento JavaScript `submit`

**O que significa?**
- Usuário **enviou o formulário**
- Pode ser via botão "Enviar" ou tecla Enter
- Formulário está sendo processado

**Exemplo de jornada**:
```
1. Usuário preenche todos os campos
2. Clica no botão "Finalizar Compra"
3. → 🚀 SUBMIT dispara
4. Formulário é enviado ao servidor
```

**Dados capturados**:
```javascript
{
  event: 'form_funnel_submit',
  form_id: 'checkout-form',
  form_progress: 100,      // 100% preenchido
  timestamp: 1738051260000
}
```

**⚠️ Nota**: Evento submit NÃO inclui dados de campos individuais, apenas do formulário como um todo.

**Use para calcular**:
- **Taxa de conclusão**: `(Submits / Focus únicos) * 100`
- **Tempo total**: Diferença entre primeiro focus e submit
- **Abandono por etapa**: Onde usuários param antes de submeter

---

### 🎯 Combinando Eventos para Análises Avançadas

#### Exemplo 1: Taxa de Abandono por Campo
```
Campos com Focus mas sem Change = Campos que causam abandono
```

#### Exemplo 2: Tempo Médio por Campo
```
Tempo = Blur timestamp - Focus timestamp
```

#### Exemplo 3: Efetividade do Autocomplete
```
Taxa de conversão com autocomplete vs sem autocomplete
```

#### Exemplo 4: Funil Completo
```
Focus (100%) → Change (80%) → Submit (60%)
     ↓20% abandonam        ↓20% abandonam
```

---

## 🔧 Build e Deploy (Desenvolvedores)

Este template utiliza JavaScript externo hospedado no AWS S3. **Se você é usuário final**, pode pular esta seção e ir direto para [Como Testar](#-como-testar-início-rápido).

**Se você é desenvolvedor** e precisa modificar o JavaScript de tracking ou fazer deploy de uma nova versão:

### Pré-requisitos

- Node.js instalado (versão 16+)
- pnpm instalado (`npm install -g pnpm`)
- Credenciais AWS com acesso ao bucket S3

### Configuração

1. Navegue até a pasta `inject-script/`:

```bash
cd client/tags/form-funnel-tracker/inject-script/
```

2. Instale as dependências:

```bash
pnpm install
```

3. Crie um arquivo `.env` com suas credenciais AWS:

```env
AWS_ACCESS_KEY_ID=sua_chave_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_aqui
AWS_REGION=us-east-1
AWS_S3_BUCKET=gtm-templates
```

### Build Local

Para fazer build do JavaScript sem deploy:

```bash
pnpm run build
```

Isso irá:
- Minificar o código
- Gerar `dist/form-funnel-tracker-bundle.js`

### Deploy para S3

Para fazer build E deploy automático para o S3:

```bash
pnpm run deploy
```

Isso irá:
- Fazer build do JavaScript
- Fazer upload para `https://gtm-templates.s3.us-east-1.amazonaws.com/form-funnel-tracker-bundle.js`

### Estrutura de Arquivos

```
inject-script/
├── form-funnel-tracker.js    # Código-fonte do tracking
├── package.json               # Dependências e scripts
├── webpack.config.js          # Configuração de build
├── .env                       # Credenciais AWS (gitignored)
├── .gitignore                 # Ignora node_modules, dist, .env
└── dist/                      # Build output (gitignored)
    └── form-funnel-tracker-bundle.js
```

### Modificando o Código

1. Edite `form-funnel-tracker.js` com suas alterações
2. Faça build e teste localmente
3. Quando estiver satisfeito, faça deploy para S3
4. O template GTM automaticamente usará a nova versão

---

## 🚀 Como Testar (Início Rápido)

### 1. Importar o Template no GTM

1. Acesse seu contêiner GTM (Web Container)
2. Vá em **Templates** (menu lateral)
3. Na seção **Tags**, clique em **Novo**
4. No canto superior direito, clique nos 3 pontinhos ⋮ → **Importar**
5. Selecione o arquivo `template.tpl` desta pasta
6. Clique em **Salvar**

### 2. Criar uma Tag de Teste

1. Vá em **Tags** → **Novo**
2. Clique em **Configuração da tag**
3. Na seção **Personalizado**, selecione **Form Funnel Tracker | Rastreamento de Formulários**
4. Configure:
   - **Form CSS Selector**: `form` (rastreia todos os formulários)
   - **Enable console logging**: ✅ Marque esta opção para debug
   - Mantenha as outras opções nos valores padrão
5. Em **Acionamento**, selecione **All Pages** (Todas as páginas)
6. Salve a tag com o nome "Form Funnel Tracker - Test"

### 3. Testar no Preview Mode

1. No GTM, clique em **Visualizar** (Preview)
2. Digite a URL do seu site e clique em **Connect**
3. No site, abra o Console do navegador (F12 → Console)
4. Interaja com qualquer formulário:
   - Clique em um campo → Veja evento `form_funnel_focus`
   - Digite algo e saia do campo → Veja evento `form_funnel_blur`
   - Altere o valor → Veja evento `form_funnel_change`
5. No console, você verá logs detalhados:
   ```
   [Form Funnel Tracker] Initializing form tracking...
   [Form Funnel Tracker] Found 2 forms
   [Form Funnel Tracker] Event pushed: {event: "form_funnel_focus", ...}
   ```

### 4. Verificar dataLayer

No console do navegador, digite:

```javascript
// Ver todos os eventos do dataLayer
console.table(dataLayer);

// Filtrar apenas eventos form_funnel
dataLayer.filter(e => e.event && e.event.includes('form_funnel'));
```

Você deve ver eventos como:

```javascript
{
  event: 'form_funnel_focus',
  form_id: 'contact-form',
  field_id: 'email',
  field_type: 'email',
  field_name: 'user_email',
  field_label: 'E-mail',
  field_value_length: 0,
  form_progress: 0,
  timestamp: 1738051200000
}
```

### 5. Publicar (Quando Estiver Satisfeito)

1. Desmarque **Enable console logging** (para não poluir o console em produção)
2. Clique em **Enviar** no GTM
3. Adicione um nome da versão (ex: "Adiciona Form Funnel Tracker")
4. Publique

**✅ Pronto!** Seus formulários estão sendo rastreados. Para análise completa no GA4, veja a seção [📊 Integração com Google Analytics 4](#-integração-com-google-analytics-4).

---

## 🎯 Casos de Uso

### E-commerce - Checkout
Identifique onde usuários abandonam o carrinho durante o preenchimento de dados de pagamento e entrega.

### Lead Generation
Descubra quais campos de formulários de contato/orçamento causam mais fricção e reduzem conversões.

### Cadastro de Usuários
Otimize formulários de registro identificando campos que geram dúvidas ou abandonos.

### Formulários Multi-etapas
Acompanhe a progressão dos usuários através de cada etapa de formulários longos.

## ⚙️ Configuração

### Grupo 1: Configuration | Configuração

#### Form CSS Selector | Seletor CSS dos Formulários
**Campo**: `formSelector`
**Tipo**: Texto
**Padrão**: `form`

Seletor CSS para identificar quais formulários devem ser rastreados.

**Exemplos**:
```css
/* Rastrear todos os formulários */
form

/* Rastrear apenas formulário de checkout */
.checkout-form

/* Rastrear formulário específico por ID */
#contact-form

/* Rastrear múltiplos formulários */
.lead-form, .newsletter-form

/* Rastrear por atributo data */
form[data-track="true"]
```

#### Track all field types | Rastrear todos os tipos de campo
**Campo**: `trackFieldTypes`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Quando habilitado, rastreia todos os tipos de campo: text, email, tel, number, select, textarea, checkbox, radio, etc.

#### Event Name Prefix | Prefixo do Nome do Evento
**Campo**: `eventPrefix`
**Tipo**: Texto
**Padrão**: `form_funnel`

Prefixo usado para nomear os eventos no dataLayer.

**Exemplos**:
```javascript
// Com prefixo "form_funnel"
form_funnel_focus
form_funnel_blur
form_funnel_change
form_funnel_submit

// Com prefixo customizado "checkout"
checkout_focus
checkout_blur
checkout_change
checkout_submit
```

---

### Grupo 2: Tracking Options | Opções de Rastreamento

#### Track focus events | Rastrear quando campo recebe foco
**Campo**: `trackFocus`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Dispara evento quando usuário clica ou navega (Tab) para um campo.

**Evento gerado**: `form_funnel_focus`

**Utilidade**: Identificar campos que atraem atenção mas não são preenchidos (abandono precoce).

#### Track blur events | Rastrear quando campo perde foco
**Campo**: `trackBlur`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Dispara evento quando usuário sai de um campo (clica fora ou pressiona Tab).

**Evento gerado**: `form_funnel_blur`

**Utilidade**: Analisar tempo gasto em cada campo e identificar campos que causam dúvidas.

#### Track change events | Rastrear alterações em campos
**Campo**: `trackChange`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Dispara evento quando o valor de um campo é alterado (após blur ou para select/checkbox/radio).

**Evento gerado**: `form_funnel_change`

**Utilidade**: Confirmar que usuário realmente preencheu o campo (não apenas focou).

#### Track form progress | Rastrear progresso do preenchimento
**Campo**: `trackProgress`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Calcula e envia a porcentagem de campos preenchidos em cada interação.

**Parâmetro adicionado**: `form_progress` (0-100)

**Utilidade**: Criar relatórios de funil mostrando em que % de preenchimento usuários abandonam.

**Exemplo**:
```javascript
{
  event: 'form_funnel_blur',
  form_progress: 60,  // 60% dos campos preenchidos
  // ... outros campos
}
```

#### Track form submission | Rastrear envio do formulário
**Campo**: `trackSubmit`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Dispara evento quando formulário é submetido.

**Evento gerado**: `form_funnel_submit`

**Utilidade**: Medir taxa de conclusão (quantos iniciaram vs quantos concluíram).

#### Detect autocomplete | Detectar preenchimento automático
**Campo**: `trackAutocomplete`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Detecta quando campos são preenchidos automaticamente pelo navegador (autocomplete, gerenciadores de senha, etc.).

**Evento gerado**: `form_funnel_autocomplete`

**Utilidade**: Entender quantos usuários usam autocomplete (pode afetar análises de tempo de preenchimento).

---

### Grupo 3: Security & Debug | Segurança e Debug

#### Excluded Fields | Campos Excluídos
**Campo**: `excludeFields`
**Tipo**: Texto
**Padrão**: `password,credit_card,cvv,ssn`

Lista de nomes de campos separados por vírgula que NÃO devem ser rastreados (por segurança).

**Importante**: O template NUNCA captura valores de campos, apenas o comprimento do valor. Esta configuração impede até mesmo o rastreamento de interações com campos sensíveis.

**Exemplos**:
```
password,credit_card,cvv,ssn
senha,cartao,cpf,rg
passwd,cc_number,security_code
```

A exclusão é feita por correspondência parcial no nome ou tipo do campo. Por exemplo, `password` exclui campos com `name="user_password"`, `name="confirm_password"`, `type="password"`.

#### Prevent duplicate events | Prevenir eventos duplicados
**Campo**: `deduplicateEvents`
**Tipo**: Checkbox
**Padrão**: ✅ Habilitado

Impede que o mesmo evento (mesmo formulário + mesmo campo + mesma ação) seja disparado mais de uma vez em 500ms.

**Utilidade**: Evitar eventos duplicados causados por múltiplos listeners ou bugs de implementação.

#### Dynamic Form Detection | Detecção de Formulários Dinâmicos
**Campo**: `observerMode`
**Tipo**: Select
**Padrão**: `mutation` (Habilitado)

**Opções**:
- **none** (Desabilitado): Rastreia apenas formulários presentes no carregamento da página
- **mutation** (Habilitado): Usa MutationObserver para detectar formulários adicionados dinamicamente

**Quando usar mutation**:
- Sites single-page applications (SPA) com React, Vue, Angular
- Formulários que aparecem em modals/popups
- Formulários carregados via AJAX
- Checkout em múltiplas etapas que carrega formulários sob demanda

**Quando usar none**:
- Formulários estáticos (HTML tradicional)
- Otimização de performance em páginas com muitas mudanças no DOM

#### Enable console logging | Habilitar logs no console
**Campo**: `enableDebug`
**Tipo**: Checkbox
**Padrão**: ❌ Desabilitado

Habilita logs detalhados no console do navegador para debug.

**Logs incluem**:
- Configuração carregada
- Formulários encontrados
- Campos rastreados
- Eventos disparados
- Campos excluídos
- Eventos duplicados prevenidos

**⚠️ Importante**: Desabilite em produção para não poluir o console dos usuários.

---

## 📈 Eventos Rastreados

Todos os eventos seguem a estrutura abaixo e são enviados para o `dataLayer`:

### Estrutura Base dos Eventos

```javascript
{
  event: 'form_funnel_[action]',      // Nome do evento
  form_id: 'checkout-form',            // Identificador do formulário
  field_id: 'email',                   // Identificador do campo
  field_type: 'email',                 // Tipo do campo
  field_name: 'user_email',            // Atributo name do campo
  field_label: 'E-mail',               // Texto do label associado
  field_value_length: 15,              // Comprimento do valor (NÃO o valor)
  form_progress: 60,                   // Porcentagem de preenchimento (0-100)
  timestamp: 1738051200000             // Timestamp Unix do evento
}
```

### Catálogo de Eventos

#### 1. form_funnel_focus
Disparado quando usuário clica ou navega (Tab) para um campo.

```javascript
{
  event: 'form_funnel_focus',
  form_id: 'checkout-form',
  field_id: 'email',
  field_type: 'email',
  field_name: 'user_email',
  field_label: 'Seu e-mail',
  field_value_length: 0,
  form_progress: 0,
  timestamp: 1738051200000
}
```

#### 2. form_funnel_blur
Disparado quando usuário sai de um campo (remove o foco).

```javascript
{
  event: 'form_funnel_blur',
  form_id: 'checkout-form',
  field_id: 'email',
  field_type: 'email',
  field_name: 'user_email',
  field_label: 'Seu e-mail',
  field_value_length: 18,
  form_progress: 25,
  timestamp: 1738051215000
}
```

#### 3. form_funnel_change
Disparado quando o valor de um campo é alterado.

```javascript
{
  event: 'form_funnel_change',
  form_id: 'checkout-form',
  field_id: 'phone',
  field_type: 'tel',
  field_name: 'phone_number',
  field_label: 'Telefone',
  field_value_length: 14,
  form_progress: 50,
  timestamp: 1738051230000
}
```

#### 4. form_funnel_autocomplete
Disparado quando campo é preenchido automaticamente pelo navegador.

```javascript
{
  event: 'form_funnel_autocomplete',
  form_id: 'checkout-form',
  field_id: 'name',
  field_type: 'text',
  field_name: 'full_name',
  field_label: 'Nome completo',
  field_value_length: 25,
  form_progress: 75,
  timestamp: 1738051245000
}
```

#### 5. form_funnel_submit
Disparado quando formulário é enviado.

```javascript
{
  event: 'form_funnel_submit',
  form_id: 'checkout-form',
  form_progress: 100,
  timestamp: 1738051260000
}
```

**Nota**: O evento submit não contém informações de campos individuais, apenas do formulário como um todo.

---

## 📊 Integração com Google Analytics 4

### Passo 1: Criar Variáveis no GTM

Crie as seguintes variáveis do tipo **Variável da camada de dados**:

| Nome da Variável | Nome da Variável de Camada de Dados |
|------------------|--------------------------------------|
| DLV - Form ID | `form_id` |
| DLV - Field ID | `field_id` |
| DLV - Field Type | `field_type` |
| DLV - Field Name | `field_name` |
| DLV - Field Label | `field_label` |
| DLV - Field Value Length | `field_value_length` |
| DLV - Form Progress | `form_progress` |

### Passo 2: Criar Acionadores (Triggers)

Os acionadores determinam **quando** suas tags devem disparar. Você pode criar triggers genéricos (para todos os eventos) ou específicos (para casos de uso avançados).

#### 📌 Opção 1: Triggers Genéricos (Recomendado para Começar)

Crie 5 acionadores básicos, um para cada tipo de evento:

---

#### 🎯 Acionador: Form Funnel - Focus

**Quando usar**: Rastrear quando usuários **começam** a interagir com campos.

**Configuração**:
1. Vá em **Acionadores** → **Novo**
2. Clique em **Configuração do acionador**
3. Selecione **Evento personalizado**
4. Configure:
   - **Nome do evento**: `form_funnel_focus`
   - **Este acionador é disparado em**: `Todos os eventos personalizados`

**Casos de uso**:
- ✅ Enviar todos os eventos de focus para GA4
- ✅ Criar relatório de "campos mais focados"
- ✅ Identificar ordem de preenchimento

**Exemplo de filtro avançado** (se quiser rastrear apenas campos específicos):
```
Nome do evento = form_funnel_focus
E
{{DLV - Field ID}} corresponde a RegEx: email|phone|name
```
↑ Rastreia focus apenas em campos de e-mail, telefone e nome.

---

#### 👋 Acionador: Form Funnel - Blur

**Quando usar**: Rastrear quando usuários **saem** dos campos (útil para calcular tempo).

**Configuração**:
1. Vá em **Acionadores** → **Novo**
2. Clique em **Configuração do acionador**
3. Selecione **Evento personalizado**
4. Configure:
   - **Nome do evento**: `form_funnel_blur`
   - **Este acionador é disparado em**: `Todos os eventos personalizados`

**Casos de uso**:
- ✅ Calcular tempo gasto em cada campo
- ✅ Identificar campos que causam hesitação
- ✅ Detectar campos abandonados vazios

**Exemplo de filtro avançado** (rastrear apenas blur com valor preenchido):
```
Nome do evento = form_funnel_blur
E
{{DLV - Field Value Length}} maior que 0
```
↑ Ignora blur em campos vazios (usuário só olhou, não preencheu).

---

#### ✏️ Acionador: Form Funnel - Change

**Quando usar**: Rastrear quando campos são **efetivamente alterados** (confirmação de preenchimento).

**Configuração**:
1. Vá em **Acionadores** → **Novo**
2. Clique em **Configuração do acionador**
3. Selecione **Evento personalizado**
4. Configure:
   - **Nome do evento**: `form_funnel_change`
   - **Este acionador é disparado em**: `Todos os eventos personalizados`

**Casos de uso**:
- ✅ Confirmar que campo foi realmente preenchido
- ✅ Rastrear progresso real do formulário
- ✅ Ignorar campos que usuário apenas focou mas não preencheu

**Exemplo de filtro avançado** (rastrear apenas campos obrigatórios):
```
Nome do evento = form_funnel_change
E
{{DLV - Field ID}} corresponde a RegEx: email|phone|address|payment_method
```
↑ Rastreia change apenas em campos críticos do checkout.

---

#### 🚀 Acionador: Form Funnel - Submit

**Quando usar**: Rastrear quando formulário é **enviado** (conversão final).

**Configuração**:
1. Vá em **Acionadores** → **Novo**
2. Clique em **Configuração do acionador**
3. Selecione **Evento personalizado**
4. Configure:
   - **Nome do evento**: `form_funnel_submit`
   - **Este acionador é disparado em**: `Todos os eventos personalizados`

**Casos de uso**:
- ✅ Calcular taxa de conclusão
- ✅ Medir conversão
- ✅ Criar funil completo (focus → submit)

**Exemplo de filtro avançado** (rastrear apenas submit de formulários específicos):
```
Nome do evento = form_funnel_submit
E
{{DLV - Form ID}} corresponde a RegEx: checkout|contact|lead
```
↑ Rastreia submit apenas dos formulários principais.

---

#### ⚡ Acionador: Form Funnel - Autocomplete

**Quando usar**: Rastrear quando campos são **preenchidos automaticamente** pelo navegador.

**Configuração**:
1. Vá em **Acionadores** → **Novo**
2. Clique em **Configuração do acionador**
3. Selecione **Evento personalizado**
4. Configure:
   - **Nome do evento**: `form_funnel_autocomplete`
   - **Este acionador é disparado em**: `Todos os eventos personalizados`

**Casos de uso**:
- ✅ Identificar taxa de uso de autocomplete
- ✅ Comparar conversão: com vs sem autocomplete
- ✅ Ajustar análises de tempo (autocomplete é instantâneo)

**Exemplo de filtro avançado** (rastrear autocomplete apenas em checkout):
```
Nome do evento = form_funnel_autocomplete
E
{{DLV - Form ID}} igual a checkout-form
```
↑ Rastreia autocomplete apenas no formulário de checkout.

---

#### 📌 Opção 2: Triggers Avançados (Casos de Uso Específicos)

Para análises mais granulares, você pode criar triggers com condições específicas:

##### 🔥 Trigger: Campos de Alta Prioridade

**Objetivo**: Rastrear apenas campos críticos (e-mail, telefone, pagamento).

**Configuração**:
```
Nome do evento = form_funnel_change
E
{{DLV - Field ID}} corresponde a RegEx: email|phone|cpf|card_number|payment_method
```

**Use para**:
- Reduzir volume de eventos (apenas campos importantes)
- Focar em campos que impactam conversão

---

##### ⏱️ Trigger: Campos com Tempo Elevado

**Objetivo**: Rastrear blur apenas em campos onde usuário passou muito tempo.

**Configuração**:
```
Nome do evento = form_funnel_blur
E
{{DLV - Field Value Length}} maior que 5
```
↑ Assume que campos com mais de 5 caracteres tiveram mais tempo investido.

**Use para**:
- Identificar campos complexos
- Detectar campos que causam dúvidas

---

##### 🎯 Trigger: Abandono em Campos Vazios

**Objetivo**: Rastrear blur em campos que foram focados mas ficaram vazios.

**Configuração**:
```
Nome do evento = form_funnel_blur
E
{{DLV - Field Value Length}} igual a 0
```

**Use para**:
- Identificar campos que causam abandono
- Detectar labels confusas ou validações problemáticas

---

##### 📊 Trigger: Progresso do Formulário

**Objetivo**: Rastrear eventos apenas quando formulário atinge certo progresso.

**Configuração**:
```
Nome do evento corresponde a RegEx: form_funnel_(focus|blur|change)
E
{{DLV - Form Progress}} maior que 50
```

**Use para**:
- Rastrear apenas segunda metade do formulário
- Identificar gargalos após 50% de preenchimento

---

##### 🚫 Trigger: Exclusão de Campos Sensíveis

**Objetivo**: Garantir que campos sensíveis nunca sejam rastreados (segurança extra).

**Configuração**:
```
Nome do evento corresponde a RegEx: form_funnel_.*
E
{{DLV - Field ID}} NÃO corresponde a RegEx: password|cvv|card.*|credit.*
```

**Use para**:
- Camada extra de segurança
- Compliance com políticas de privacidade

---

#### 🎓 Dicas de Boas Práticas

1. **Comece simples**: Use os 5 triggers genéricos primeiro
2. **Teste no Preview**: Sempre teste triggers no Preview Mode do GTM
3. **Documente**: Adicione notas explicando cada trigger
4. **Nomeie bem**: Use nomes claros como "Form Funnel - Focus | Apenas Checkout"
5. **Monitore volume**: Triggers muito amplos geram muitos eventos (cuidado com limites do GA4)

---

#### 📈 Comparação: Triggers Genéricos vs Específicos

| Abordagem | Vantagens | Desvantagens | Quando usar |
|-----------|-----------|--------------|-------------|
| **Genéricos** | • Simples de configurar<br>• Rastreia tudo<br>• Flexível | • Mais eventos<br>• Pode atingir limites GA4 | Começando, formulários pequenos |
| **Específicos** | • Menos eventos<br>• Foco em campos críticos<br>• Otimizado | • Mais complexo<br>• Requer manutenção | Formulários grandes, otimização avançada |

**Recomendação**: Comece com triggers genéricos. Depois de analisar dados, crie triggers específicos para otimizar.

### Passo 3: Criar Tag GA4

Crie uma tag do tipo **Google Analytics: Evento GA4**:

**Configuração**:
- **Tag de configuração**: {{GA4 Configuration Tag}}
- **Nome do evento**: `{{Event}}`
- **Acionador**: Escolha todos os acionadores criados no Passo 2

**Parâmetros do evento**:
| Nome do Parâmetro | Valor |
|-------------------|-------|
| `form_id` | `{{DLV - Form ID}}` |
| `field_id` | `{{DLV - Field ID}}` |
| `field_type` | `{{DLV - Field Type}}` |
| `field_name` | `{{DLV - Field Name}}` |
| `field_label` | `{{DLV - Field Label}}` |
| `field_value_length` | `{{DLV - Field Value Length}}` |
| `form_progress` | `{{DLV - Form Progress}}` |

### Passo 4: Criar Dimensões Personalizadas no GA4

No Google Analytics 4, vá em **Administração > Definições > Dimensões personalizadas** e crie:

| Nome da Dimensão | Nome do parâmetro do evento | Escopo |
|------------------|------------------------------|--------|
| Form ID | `form_id` | Evento |
| Field ID | `field_id` | Evento |
| Field Type | `field_type` | Evento |
| Field Name | `field_name` | Evento |
| Field Label | `field_label` | Evento |

### Passo 5: Criar Métricas Personalizadas no GA4

Vá em **Administração > Definições > Métricas personalizadas** e crie:

| Nome da Métrica | Nome do parâmetro do evento | Unidade de medição |
|-----------------|------------------------------|---------------------|
| Field Value Length | `field_value_length` | Padrão |
| Form Progress | `form_progress` | Padrão |

### Relatórios Úteis no GA4

#### Relatório 1: Funil de Preenchimento por Campo

**Exploração > Funil**

1. Adicione as seguintes etapas:
   - Etapa 1: `form_funnel_focus` (onde `field_id` = "primeiro_campo")
   - Etapa 2: `form_funnel_change` (onde `field_id` = "primeiro_campo")
   - Etapa 3: `form_funnel_focus` (onde `field_id` = "segundo_campo")
   - Etapa 4: `form_funnel_submit`

2. **Detalhamento**: Form ID, Field ID
3. **Visualização**: Etapas do funil padrão

**Insights**: Identifique em qual campo usuários abandonam o formulário.

#### Relatório 2: Tempo Médio por Campo

**Exploração > Forma livre**

1. **Dimensões**: Field Label, Field ID
2. **Métricas**: Contagem de eventos
3. **Filtro**: Event name = "form_funnel_blur"

**Insights**: Descubra quais campos tomam mais tempo dos usuários (possível indicador de dúvida/dificuldade).

#### Relatório 3: Taxa de Conclusão por Formulário

**Exploração > Forma livre**

1. **Dimensões**: Form ID
2. **Métricas**:
   - Usuários únicos (filtro: `form_funnel_focus`)
   - Usuários únicos (filtro: `form_funnel_submit`)
3. Crie métrica calculada: `(Submissões / Focos) * 100`

**Insights**: Percentual de usuários que começam vs completam cada formulário.

#### Relatório 4: Análise de Autocomplete

**Exploração > Forma livre**

1. **Dimensões**: Field ID, Field Label
2. **Métricas**: Contagem de eventos
3. **Filtro**: Event name = "form_funnel_autocomplete"

**Insights**: Quais campos são mais preenchidos por autocomplete (pode afetar análise de tempo).

---

## 🧪 Testando o Rastreamento

### Método 1: Console do Navegador

1. Ative o modo de debug no template (checkbox "Enable console logging")
2. Publique ou visualize o contêiner no modo Preview
3. Abra o console do navegador (F12)
4. Interaja com o formulário
5. Veja os logs detalhados:

```
[Form Funnel Tracker] Initializing form tracking...
[Form Funnel Tracker] Found 2 forms
[Form Funnel Tracker] Tracking form: checkout-form
[Form Funnel Tracker] Event pushed: {event: "form_funnel_focus", form_id: "checkout-form", ...}
```

### Método 2: Visualizando o dataLayer

No console do navegador, digite:

```javascript
// Ver todos os eventos do dataLayer
console.table(dataLayer);

// Filtrar apenas eventos form_funnel
dataLayer.filter(e => e.event && e.event.includes('form_funnel'));

// Ver último evento
dataLayer[dataLayer.length - 1];

// Monitorar eventos em tempo real
const originalPush = dataLayer.push;
dataLayer.push = function() {
  console.log('DataLayer event:', arguments[0]);
  originalPush.apply(dataLayer, arguments);
};
```

### Método 3: GTM Preview Mode

1. No GTM, clique em **Visualizar**
2. Insira a URL do site e clique em **Connect**
3. No painel à direita, veja a aba **Data Layer**
4. Interaja com o formulário
5. Veja eventos aparecendo em tempo real:
   - `form_funnel_focus`
   - `form_funnel_blur`
   - `form_funnel_change`
   - `form_funnel_submit`

### Método 4: GA4 DebugView

1. Instale a extensão [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Ative a extensão
3. Acesse seu site
4. No GA4, vá em **Administração > DebugView**
5. Interaja com formulários
6. Veja eventos chegando no DebugView em tempo real

---

## 💡 Dicas e Boas Práticas

### 1. Comece Simples
Na primeira implementação, ative apenas `trackFocus` e `trackSubmit`. Depois adicione outros eventos conforme necessidade.

### 2. Nomeie Campos Corretamente
Use atributos `name` descritivos nos campos HTML:

```html
<!-- ❌ Ruim -->
<input type="text" name="f1">

<!-- ✅ Bom -->
<input type="text" name="email">
```

### 3. Use Labels Semânticos
Sempre associe `<label>` aos campos:

```html
<!-- ✅ Bom -->
<label for="email">E-mail</label>
<input type="email" id="email" name="email">
```

Isso melhora a qualidade do parâmetro `field_label` nos eventos.

### 4. Monitore o Volume de Eventos
Formulários com muitos campos podem gerar muitos eventos. Considere:
- Desabilitar `trackFocus` e `trackBlur` para formulários grandes
- Manter apenas `trackChange` e `trackSubmit`
- Usar seletores CSS específicos para rastrear apenas formulários críticos

### 5. Segmente por Formulário
Use a dimensão `form_id` para criar segmentos no GA4:

```
Segmento: Usuários Checkout
Condição: form_id exatamente igual a "checkout-form"
```

### 6. Configure Alertas
Crie alertas no GA4 para:
- Queda brusca em `form_funnel_submit` (possível bug)
- Aumento em abandonos em campos específicos
- Taxa de conclusão abaixo de X%

### 7. A/B Testing
Combine com ferramentas de A/B test para:
- Testar diferentes ordens de campos
- Testar labels diferentes
- Testar campos obrigatórios vs opcionais

---

## 🔧 Troubleshooting

### Eventos não estão sendo disparados

**Possíveis causas**:

1. **Seletor CSS incorreto**: Verifique se `formSelector` corresponde aos formulários da página.
   ```javascript
   // No console, teste o seletor
   document.querySelectorAll('form'); // Deve retornar os formulários
   ```

2. **Formulário carregado dinamicamente**: Habilite `observerMode: mutation`.

3. **Campos excluídos**: Verifique se o nome do campo não está na lista `excludeFields`.

4. **Tag não disparou**: Verifique no GTM Preview Mode se a tag está sendo disparada.

### Eventos duplicados no dataLayer

**Possíveis causas**:

1. **Deduplicação desabilitada**: Habilite `deduplicateEvents`.

2. **Múltiplas tags configuradas**: Verifique se não há duas tags Form Funnel Tracker ativas.

3. **Outros scripts interferindo**: Outros scripts podem estar disparando eventos. Use o parâmetro `timestamp` para identificar a origem.

### form_id aparece como "unknown_form"

**Causa**: Formulário não tem `id`, `name` ou `className`.

**Solução**: Adicione um ID ao formulário:

```html
<!-- Antes -->
<form>...</form>

<!-- Depois -->
<form id="contact-form">...</form>
```

Ou use o `className`:

```html
<form class="lead-form">...</form>
```

### field_label vazio ou genérico

**Causa**: Campo não tem `<label>` associado ou atributos `aria-label`/`placeholder`.

**Solução**: Sempre use `<label>`:

```html
<label for="email">E-mail</label>
<input type="email" id="email" name="email">
```

Ou use `aria-label`:

```html
<input type="email" name="email" aria-label="E-mail do usuário">
```

### form_progress sempre 0

**Possíveis causas**:

1. **trackProgress desabilitado**: Verifique se a opção está marcada.

2. **Campos sem name**: Campos precisam ter atributo `name` para serem contabilizados.

3. **Todos os campos excluídos**: Verifique `excludeFields`.

### Performance ruim (página lenta)

**Possíveis causas**:

1. **Muitos formulários na página**: Use seletor CSS mais específico.

2. **observerMode desnecessário**: Se formulários não são dinâmicos, use `observerMode: none`.

3. **Debug habilitado**: Desabilite `enableDebug` em produção.

### Eventos não aparecem no GA4

**Possíveis causas**:

1. **Variáveis não criadas**: Verifique se todas as variáveis do dataLayer foram criadas.

2. **Acionadores incorretos**: Confirme que acionadores usam os nomes de evento corretos (`form_funnel_focus`, etc.).

3. **Tag GA4 não dispara**: Verifique no GTM Preview Mode se a tag GA4 está sendo acionada.

4. **Parâmetros não mapeados**: Confirme que todos os parâmetros estão mapeados na tag GA4.

5. **Dimensões não criadas**: Crie dimensões personalizadas no GA4 para visualizar os dados nos relatórios.

---

## 📊 Como Usar os Dados

### Identificar Campos Problemáticos

1. No GA4, crie relatório de **Exploração > Forma livre**
2. **Dimensão**: Field Label
3. **Métrica**: Taxa de rejeição (usuários que deram focus mas não deram blur)
4. **Ordenar**: Por maior taxa de rejeição

**Insight**: Campos com alta taxa de rejeição podem ter labels confusos ou estar mal posicionados.

### Calcular Tempo por Campo

1. Exporte eventos `form_funnel_focus` e `form_funnel_blur` via BigQuery
2. Calcule diferença de `timestamp` entre blur e focus do mesmo campo
3. Agrupe por `field_id`

```sql
-- Exemplo SQL no BigQuery
SELECT
  field_id,
  field_label,
  AVG(time_spent_ms) / 1000 AS avg_time_seconds
FROM (
  SELECT
    field_id,
    field_label,
    MAX(CASE WHEN event_name = 'form_funnel_blur' THEN event_timestamp END) -
    MAX(CASE WHEN event_name = 'form_funnel_focus' THEN event_timestamp END) AS time_spent_ms
  FROM `project.dataset.events_*`
  WHERE event_name IN ('form_funnel_focus', 'form_funnel_blur')
  GROUP BY user_pseudo_id, field_id, field_label
)
GROUP BY field_id, field_label
ORDER BY avg_time_seconds DESC
```

**Insight**: Campos que tomam muito tempo podem indicar dúvidas, validações complexas ou má UX.

### Funil de Abandono por Progresso

1. No GA4, crie **Exploração > Funil**
2. Etapas:
   - `form_progress` >= 0 (Início)
   - `form_progress` >= 25 (25% preenchido)
   - `form_progress` >= 50 (50% preenchido)
   - `form_progress` >= 75 (75% preenchido)
   - `form_funnel_submit` (Conclusão)

**Insight**: Identifique em qual % de preenchimento há mais abandono.

### Análise de Autocomplete

Compare usuários que usaram autocomplete vs não usaram:

1. Crie segmento: Usuários que dispararam `form_funnel_autocomplete`
2. Compare métricas:
   - Taxa de conclusão
   - Tempo médio de preenchimento
   - Taxa de conversão

**Insight**: Autocomplete aumenta conversões? Usuários que o utilizam são mais qualificados?

---

## 🔒 Segurança e Privacidade (LGPD)

### Dados NÃO Capturados

O template foi desenvolvido com privacidade em mente e **NUNCA** captura:

- ❌ Valores digitados nos campos (`field_value` não existe)
- ❌ Senhas
- ❌ Dados de cartão de crédito
- ❌ Documentos (CPF, RG, CNH, passaporte)
- ❌ Dados bancários
- ❌ Informações médicas

### Dados Capturados

O template captura apenas **metadados de interação**:

- ✅ Nome do formulário (`form_id`)
- ✅ Nome do campo (`field_id`, `field_name`)
- ✅ Tipo do campo (`field_type`)
- ✅ Label do campo (`field_label`)
- ✅ **Comprimento** do valor digitado (`field_value_length`), não o valor
- ✅ Porcentagem de preenchimento (`form_progress`)
- ✅ Timestamp da interação

### Exemplo de Segurança

```javascript
// Usuário digita "meu-email@example.com" no campo de e-mail

// ❌ NUNCA é capturado:
{
  field_value: "meu-email@example.com"
}

// ✅ É capturado:
{
  field_value_length: 22  // Apenas o comprimento da string
}
```

### Conformidade com LGPD

O template está em conformidade com a LGPD (Lei Geral de Proteção de Dados) porque:

1. **Não captura dados pessoais**: Apenas metadados de interação
2. **Dados anonimizados**: Não é possível identificar usuários pelos eventos
3. **Exclusão de campos sensíveis**: Lista padrão exclui campos de senha, cartão, etc.
4. **Transparência**: Usuário pode ser informado no Aviso de Privacidade sobre a coleta de dados de interação

### Recomendações

1. **Informe usuários**: Adicione no Aviso de Privacidade que você coleta dados de interação com formulários para melhorar a experiência.

2. **Revise excludeFields**: Adicione outros campos sensíveis específicos do seu negócio.

3. **Anonimização de IPs**: No GA4, habilite a anonimização de IPs (já habilitado por padrão).

4. **Retenção de dados**: Configure no GA4 um período de retenção adequado (14 meses é o padrão).

---

## 🏷️ Tags

`form tracking`, `form funnel`, `form analytics`, `conversion optimization`, `cro`, `ux analytics`, `field tracking`, `form abandonment`, `gtm template`, `google tag manager`, `métricas boss`, `checkout optimization`, `lead generation`, `form completion`, `user behavior`, `e-commerce`, `analytics`

---

## 📝 Notas Importantes

1. **Não captura valores**: Por segurança e privacidade, o template captura apenas o comprimento dos valores (`field_value_length`), nunca os valores reais.

2. **Performance**: O template é otimizado para não afetar a performance do site. MutationObserver é usado apenas quando necessário.

3. **Compatibilidade**: Compatível com todos os navegadores modernos. MutationObserver tem suporte em IE11+, Chrome, Firefox, Safari, Edge.

4. **SPAs (React, Vue, Angular)**: Funciona perfeitamente com single-page applications quando `observerMode` está em `mutation`.

5. **Formulários Ajax**: Rastreia formulários carregados via Ajax/fetch automaticamente com `observerMode: mutation`.

6. **Múltiplos formulários**: Rastreia múltiplos formulários na mesma página simultaneamente.

7. **iFrames**: Não rastreia formulários dentro de iFrames (limitação de segurança dos navegadores).

8. **Formulários multi-etapas**: Funciona com formulários que aparecem/desaparecem em etapas diferentes.

9. **Validação em tempo real**: Eventos são disparados mesmo com validação JavaScript ativa.

10. **ShadowDOM**: Não rastreia formulários dentro de Shadow DOM (limitação técnica).

---

## 🤝 Contribuição

Este template é mantido pela **Métricas Boss**. Para reportar bugs, sugerir melhorias ou contribuir:

1. Abra uma issue no repositório
2. Descreva o problema ou sugestão
3. Inclua exemplos de código quando relevante
4. Aguarde revisão da equipe

Para contribuições diretas:
1. Fork do repositório
2. Crie branch com sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📞 Suporte

Precisa de ajuda com a implementação? Entre em contato:

- **Site**: [metricasboss.com.br](https://metricasboss.com.br)
- **E-mail**: contato@metricasboss.com.br

---

## 📄 Licença

Este template é fornecido "como está", sem garantias. Você é livre para usar, modificar e distribuir conforme necessário.

---

**Desenvolvido com ❤️ pela equipe Métricas Boss**

*Última atualização: 28/01/2026*
