---
name: gtm-template-spec
description: Cria especificação completa (PRP) para desenvolvimento de templates GTM. Use quando precisar planejar um novo template de tag ou variável, definir requisitos, ou documentar antes de implementar.
context: fork
agent: Plan
allowed-tools: Read, Write, Grep, Glob
---

# GTM Template Specification Generator

Você vai criar uma especificação completa (PRP - Product Requirements Prompt) para um template do Google Tag Manager.

## Contexto do Projeto

Este repositório contém templates GTM para plataformas brasileiras de e-commerce e marketing. Consulte a documentação em `.claude/docs/` para entender:

- Estrutura de templates (visao-geral.md)
- APIs disponíveis (api-reference.md)
- Permissões (permissoes-de-modelo-personalizado.md)
- Guia de estilo (guia-de-estilo-do-modelo.md)

## Sua Tarefa

Crie um arquivo de especificação em `.claude/prps/gtm-templates/[nome-do-template].md` com a seguinte estrutura:

### 1. Business Context

```markdown
# [Nome do Template] - GTM Template Specification

## Business Context

**Problema que resolve:**
[Descreva o problema ou necessidade de negócio]

**Plataforma/Integração:**
[Nome da plataforma: RD Station, Hotmart, VTEX, Panda Video, etc.]

**Tipo de Template:**
- [ ] Tag Template
- [ ] Variable Template

**Público-alvo:**
[Quem vai usar: analistas de marketing, devs, agências]

**Benefícios:**
- [Benefício 1]
- [Benefício 2]
- [Benefício 3]
```

### 2. Technical Specifications

```markdown
## Technical Specifications

### Template Info

**Nome de exibição:**
`[Nome funcional] da [Nome da Empresa]`

**Descrição curta (1-2 frases):**
[Descrição que aparecerá na interface do GTM]

**Categorias:**
- [ ] Analytics
- [ ] Advertising
- [ ] Conversions
- [ ] Marketing
- [ ] Other: [especificar]

**Ícone:**
[URL ou descrição do ícone - PNG/JPEG/GIF, 48x48 a 96x96px]

### Fields Configuration

Lista todos os campos que o usuário vai configurar:

| Nome do Parâmetro | Tipo de Campo | Label | Help Text | Obrigatório | Valor Padrão |
|-------------------|---------------|-------|-----------|-------------|--------------|
| `trackingId` | Text Input | ID de Tracking | Ex: UA-XXXXX-Y ou G-XXXXXXX | Sim | - |
| `eventName` | Dropdown | Tipo de Evento | Selecione o tipo de evento a enviar | Sim | pageview |
| `enableDebug` | Checkbox | Habilitar Debug | Ativa logs no console para debugging | Não | false |

### Code Logic

**Fluxo principal:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**APIs necessárias (via require):**
- `sendPixel` - Enviar pixel de tracking
- `encodeUriComponent` - Codificar parâmetros
- `logToConsole` - Logging condicional
- [outras APIs necessárias]

**Lógica de validação:**
- Validar que trackingId não está vazio
- Verificar formato do email (se aplicável)
- [outras validações]

**Tratamento de erros:**
- Callback data.gtmOnFailure() em caso de erro
- Log de erro se debug habilitado
- [outros tratamentos]

### Permissions Required

Liste todas as permissões necessárias:

- [ ] `send_pixel` - URL pattern: `https://analytics.example.com/*`
- [ ] `get_url` - Componentes: query
- [ ] `logging` - Apenas em modo debug
- [ ] `read_data_layer` - Chaves: `ecommerce.*`
- [outras permissões]

### External Dependencies

**Scripts a injetar:**
- URL: `https://example.com/script.js`
- Cache token: [URL ou identificador único]
- Quando: [condição para carregar]

**APIs externas:**
- Endpoint: `https://api.example.com/track`
- Método: POST/GET
- Autenticação: [se aplicável]
```

### 3. Implementation Details

```markdown
## Implementation Details

### Pseudocódigo

\`\`\`javascript
// 1. Importar APIs
const sendPixel = require('sendPixel');
const encodeUriComponent = require('encodeUriComponent');

// 2. Validar dados
if (!data.trackingId) {
  return data.gtmOnFailure();
}

// 3. Construir URL
const baseUrl = 'https://analytics.example.com/collect';
const params = '?id=' + encodeUriComponent(data.trackingId);

// 4. Enviar pixel
sendPixel(baseUrl + params, data.gtmOnSuccess, data.gtmOnFailure);
\`\`\`

### Casos de Uso

**Caso 1: E-commerce Purchase Tracking**
- Evento: Compra finalizada
- Dados: valor, produto, transaction ID
- Comportamento esperado: Enviar conversão para plataforma

**Caso 2: Lead Generation**
- Evento: Formulário enviado
- Dados: email, nome, telefone
- Comportamento esperado: Registrar lead na plataforma

### Edge Cases

- **Campo vazio:** Se campo obrigatório vazio, chamar gtmOnFailure
- **URL inválida:** Validar formato antes de enviar
- **Timeout:** Configurar timeout apropriado
- [outros edge cases]

### Testing Checklist

- [ ] Testar com dados válidos
- [ ] Testar com dados inválidos
- [ ] Verificar logs em modo debug
- [ ] Confirmar pixel enviado corretamente
- [ ] Validar permissões configuradas
- [ ] Testar em Preview Mode do GTM
```

### 4. Documentation

```markdown
## Documentation

### README.md do Template

Estrutura do README que deve acompanhar o template:

\`\`\`markdown
# [Nome do Template]

Template para [descrição]

## Instalação

1. No GTM, vá em Templates → Novo
2. Clique em "Importar" e selecione \`template.tpl\`
3. Salve o template

## Configuração

### Campos obrigatórios

- **[Campo 1]**: [descrição]
- **[Campo 2]**: [descrição]

### Campos opcionais

- **[Campo 3]**: [descrição]

## Uso

1. Crie uma nova tag usando este template
2. Configure os campos necessários
3. Configure um trigger apropriado
4. Teste em Preview Mode
5. Publique

## Debugging

Habilite a opção "Debug Mode" para ver logs no console.

## Exemplos

### Exemplo 1: [Nome]
[Configuração exemplo]

### Exemplo 2: [Nome]
[Configuração exemplo]

## Referências

- [Link para documentação da plataforma]
- [Link para guia de uso]
\`\`\`

### Comentários no Código

Principais seções que devem ter comentários:
- Importação de APIs
- Validação de dados
- Construção de payload
- Envio de dados
- Tratamento de erros
```

### 5. Acceptance Criteria

```markdown
## Acceptance Criteria

### Funcional
- [ ] Template aparece na lista de templates do GTM
- [ ] Todos os campos configurados aparecem na interface
- [ ] Validação de campos funciona corretamente
- [ ] Dados são enviados corretamente para plataforma
- [ ] Callbacks gtmOnSuccess/gtmOnFailure funcionam
- [ ] Logs de debug funcionam quando habilitados

### Não-funcional
- [ ] Código segue guia de estilo do repositório
- [ ] Permissões são mínimas necessárias
- [ ] README.md completo e em português
- [ ] Exemplos de uso documentados
- [ ] Código comentado em pontos-chave
- [ ] Performance: executa em < 100ms

### Segurança
- [ ] Não expõe dados sensíveis em logs
- [ ] Valida entrada de usuário
- [ ] Usa HTTPS para todas as chamadas externas
- [ ] Permissões específicas (não wildcards amplos)

### Compatibilidade
- [ ] Funciona em Web Container
- [ ] Funciona em Server Container (se aplicável)
- [ ] Compatível com Consent Mode (se aplicável)
```

## Próximos Passos

Após criar a especificação:

1. **Review**: Peça review da especificação antes de implementar
2. **Implementação**: Use a especificação como guia para criar o template
3. **Testes**: Siga o testing checklist
4. **Documentação**: Crie o README.md baseado na seção Documentation
5. **PR**: Submeta para revisão

## Template de Saída

Crie o arquivo em: `.claude/prps/gtm-templates/[nome-do-template].md`

Use o template acima e preencha TODAS as seções com informações específicas baseadas no que o usuário solicitou.

---

**Fontes de Referência:**
- [Product Requirements Prompts para Agentic Engineering](https://github.com/Wirasm/PRPs-agentic-eng)
- [Context Engineering para PRPs](https://abvijaykumar.medium.com/context-engineering-2-2-product-requirements-prompts-46e6ed0aa0d1)
- Documentação GTM Templates em `.claude/docs/`
