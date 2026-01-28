# GTM Template PRPs (Product Requirements Prompts)

Este diretório contém especificações (PRPs) para templates do Google Tag Manager antes de sua implementação.

## O que é um PRP?

Um **Product Requirements Prompt (PRP)** é uma especificação estruturada que fornece ao AI agent (ou desenvolvedor) tudo que ele precisa para implementar um template GTM corretamente na primeira tentativa.

**PRP = PRD + Contexto do Codebase + Guia de Implementação**

## Por que usar PRPs?

### Benefícios

✅ **Clareza**: Define exatamente o que será implementado antes de começar
✅ **Alinhamento**: Garante que todos entendem os requisitos
✅ **Documentação**: Serve como documentação técnica do template
✅ **Eficiência**: Reduz retrabalho por requisitos mal definidos
✅ **Qualidade**: Inclui casos de uso, edge cases e critérios de aceitação

### Quando criar um PRP

Crie um PRP sempre que for desenvolver um novo template GTM:

- ✅ Nova integração com plataforma externa
- ✅ Template complexo com múltiplos campos
- ✅ Template que requer validações específicas
- ✅ Template que outras pessoas vão usar
- ❌ Template extremamente simples (< 5 linhas de código)

## Como criar um PRP

### Opção 1: Usando a Skill (Recomendado)

A maneira mais fácil é usar a skill `/gtm-template-spec`:

```bash
# No Claude Code, digite:
/gtm-template-spec

# Ou deixe o Claude invocar automaticamente:
"Preciso criar um template GTM para rastrear conversões do Hotmart"
```

A skill vai:
1. Fazer perguntas sobre o template
2. Consultar a documentação GTM em `.claude/docs/`
3. Gerar um PRP completo em `.claude/prps/gtm-templates/`

### Opção 2: Manualmente

1. Copie o template de exemplo: `template-example.md`
2. Renomeie para `nome-do-seu-template.md`
3. Preencha todas as seções
4. Use o `quick-reference.md` como guia

## Estrutura de um PRP

Todo PRP tem 5 seções principais:

### 1. Business Context
- Problema que resolve
- Plataforma/Integração
- Tipo (Tag ou Variable)
- Público-alvo
- Benefícios

### 2. Technical Specifications
- Template Info (nome, descrição, ícone)
- Fields Configuration (todos os campos)
- Code Logic (APIs, validações)
- Permissions Required

### 3. Implementation Details
- Pseudocódigo
- Casos de uso práticos
- Edge cases
- Testing checklist

### 4. Documentation
- Template do README.md
- Comentários no código

### 5. Acceptance Criteria
- Critérios funcionais
- Critérios não-funcionais
- Segurança
- Compatibilidade

## Workflow

```
1. [Ideia] → 2. [PRP] → 3. [Review] → 4. [Implementação] → 5. [Testes] → 6. [Deploy]
     ↑           ↓
     └─────── Feedback
```

### 1. Ideia

Identifique a necessidade:
- Nova integração necessária
- Feedback de usuários
- Nova plataforma a integrar

### 2. Criar PRP

Use `/gtm-template-spec` ou crie manualmente:
- Defina requisitos claramente
- Liste todos os campos necessários
- Especifique validações
- Documente casos de uso

### 3. Review

Peça review antes de implementar:
- Stakeholders aprovam requisitos?
- Documentação técnica está clara?
- Casos de uso cobrem necessidades?
- Permissões são adequadas?

### 4. Implementação

Use o PRP como guia:
- Siga o pseudocódigo
- Implemente todas as validações
- Use as permissões especificadas
- Adicione comentários conforme documentado

### 5. Testes

Siga o testing checklist:
- Teste casos de uso documentados
- Valide edge cases
- Verifique permissões
- Teste em Preview Mode

### 6. Deploy

Publique o template:
- Commit do código + PRP
- Atualiza README principal
- Documenta no repositório

## Exemplos

### Template Simples (Pixel Tracking)

```markdown
# Google Analytics 4 Event - GTM Template Specification

## Business Context
Enviar eventos personalizados para GA4...

## Technical Specifications
- API: sendPixel
- Permissões: send_pixel
- Campos: measurementId, eventName
```

### Template Complexo (API Integration)

```markdown
# RD Station Conversions - GTM Template Specification

## Business Context
Integração completa com Conversions API...

## Technical Specifications
- API: sendHttpRequest, JSON
- Permissões: send_http, logging
- Campos: publicToken, email, customFields
- Validações: email format, required fields
- Edge cases: rate limiting, timeouts
```

## Arquivos de Referência

- **`template-example.md`**: Exemplo completo de PRP (RD Station)
- **`quick-reference.md`**: Guia rápido de referência
- **`gtm-templates/`**: PRPs de templates do projeto

## Integração com Skill

A skill `gtm-template-spec` usa os seguintes arquivos:

```
~/.claude/skills/gtm-template-spec/
├── SKILL.md                # Instruções principais da skill
├── template-example.md     # Exemplo de PRP completo
└── quick-reference.md      # Referência rápida
```

A skill tem acesso a:
- Toda documentação GTM em `.claude/docs/`
- Templates anteriores em `client/` e `server/`
- PRPs existentes neste diretório

## Boas Práticas

### ✅ Faça

- Seja específico e detalhado
- Inclua exemplos reais de uso
- Documente edge cases
- Liste todas as validações necessárias
- Especifique permissões mínimas
- Inclua testing checklist completo

### ❌ Evite

- Especificações vagas ou genéricas
- Omitir casos de uso importantes
- Ignorar requisitos de segurança
- Pular a seção de acceptance criteria
- Não documentar edge cases
- Esquecer de listar permissões

## Ferramentas

### Validar PRP

Use o Claude Code para validar seu PRP:

```
"Valide este PRP e me diga se falta alguma informação importante"
```

### Gerar Código a partir do PRP

```
"Implemente o template baseado neste PRP: .claude/prps/gtm-templates/nome-template.md"
```

### Atualizar PRP

```
"Atualize o PRP com os seguintes requisitos adicionais: [requisitos]"
```

## Recursos

### Documentação Interna
- [Visão Geral GTM Templates](../docs/visao-geral.md)
- [Referência de APIs](../docs/api-reference.md)
- [Permissões](../docs/permissoes-de-modelo-personalizado.md)
- [Guia de Estilo](../docs/guia-de-estilo-do-modelo.md)

### Recursos Externos
- [PRPs Agentic Engineering](https://github.com/Wirasm/PRPs-agentic-eng)
- [Context Engineering for PRPs](https://abvijaykumar.medium.com/context-engineering-2-2-product-requirements-prompts-46e6ed0aa0d1)
- [GTM Templates Documentation](https://developers.google.com/tag-platform/tag-manager/templates)

---

**Última atualização**: 2026-01-28
**Mantido por**: Métricas Boss Team
