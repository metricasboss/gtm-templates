# Quick Start - Criar Especificação de Template GTM

Guia rápido para criar uma especificação (PRP) de template GTM em 5 minutos.

## Opção 1: Deixar o Claude fazer (Recomendado)

### Passo 1: Descreva o que você precisa

Abra o Claude Code no projeto e descreva o template que você quer:

```
"Preciso criar um template GTM para rastrear conversões do Hotmart"
```

ou

```
"Quero um template que envia eventos para a API do ActiveCampaign"
```

### Passo 2: Claude usa a skill automaticamente

O Claude vai:
1. ✅ Detectar que você quer criar um template
2. ✅ Carregar a skill `/gtm-template-spec` automaticamente
3. ✅ Fazer perguntas para entender melhor
4. ✅ Consultar documentação GTM em `.claude/docs/`
5. ✅ Gerar PRP completo em `.claude/prps/gtm-templates/`

### Passo 3: Review e ajustes

```
"Adicione validação de CPF ao campo documento"
```

ou

```
"Inclua um campo para selecionar o ambiente (produção/sandbox)"
```

---

## Opção 2: Invocar manualmente

### Comando direto

```
/gtm-template-spec Hotmart Conversions API
```

Claude vai criar a especificação baseada no argumento fornecido.

---

## Exemplos de Uso

### Exemplo 1: Template de Tag

```
Você: "Criar template para enviar conversões para RD Station"

Claude: *carrega skill automaticamente*
        "Vou criar uma especificação para o template RD Station Conversions.

         Algumas perguntas:
         1. Quais campos o usuário vai configurar? (token, email, etc)
         2. É conversão de formulário ou outro evento?
         3. Precisa de campos personalizados?"

Você: "Sim, token público, email, nome, telefone e campos personalizados"

Claude: *gera PRP em .claude/prps/gtm-templates/rd-station-conversions.md*
        "✅ PRP criado! Próximos passos:
         1. Review a especificação
         2. Se ok, posso implementar o template
         3. Depois criamos testes"
```

### Exemplo 2: Template de Variável

```
Você: "Criar variável que extrai valor total do orderForm da VTEX"

Claude: *detecta necessidade de PRP e usa skill*
        "Vou especificar uma variável GTM para VTEX orderForm.

         Confirme:
         - Vai ler de window.vtexjs.checkout.orderForm?
         - Retorna apenas o valor total ou objeto completo?
         - Precisa validar se orderForm existe?"

Você: "Sim, ler de window.vtexjs.checkout.orderForm.value"

Claude: *gera PRP completo*
```

---

## Estrutura do PRP Gerado

Quando a skill terminar, você terá um arquivo assim:

```
.claude/prps/gtm-templates/nome-do-template.md
├── Business Context          # O que resolve, para quem
├── Technical Specifications  # Campos, APIs, permissões
├── Implementation Details    # Pseudocódigo, casos de uso
├── Documentation            # README, comentários
└── Acceptance Criteria      # Como validar que está ok
```

---

## Próximos Passos Após Criar PRP

### 1. Review (Recomendado)

```
"Revise este PRP e me diga se falta algo importante"
```

### 2. Implementar

```
"Implemente o template baseado no PRP: .claude/prps/gtm-templates/rd-station-conversions.md"
```

### 3. Testar

```
"Crie casos de teste baseados no testing checklist do PRP"
```

### 4. Documentar

```
"Gere o README.md baseado na seção Documentation do PRP"
```

---

## Dicas Pro

### 1. Seja específico ao descrever

❌ "Criar template de conversão"
✅ "Criar template que envia conversões para RD Station via API, com campos para email, nome e telefone"

### 2. Mencione a plataforma

❌ "Template de tracking"
✅ "Template para Hotmart postback de vendas"

### 3. Especifique o tipo

❌ "Template GTM"
✅ "Tag template para enviar eventos" ou "Variável template para ler dados"

### 4. Inclua requisitos especiais

```
"Criar template RD Station que:
- Valide formato de email
- Suporte campos personalizados
- Tenha modo debug
- Funcione em formulários AJAX"
```

---

## Troubleshooting

### Skill não foi acionada automaticamente

**Sintoma:** Claude não usou a skill `/gtm-template-spec`

**Solução:** Invoque manualmente:
```
/gtm-template-spec [descrição do template]
```

### PRP ficou incompleto

**Sintoma:** Faltam seções ou detalhes

**Solução:** Peça para completar:
```
"Complete o PRP com:
- Edge cases de validação
- Exemplos de uso
- Testing checklist detalhado"
```

### Preciso modificar o PRP

**Sintoma:** Requisitos mudaram

**Solução:**
```
"Atualize o PRP em .claude/prps/gtm-templates/nome-template.md adicionando [novos requisitos]"
```

---

## Recursos Rápidos

### Ver skill disponíveis
```
O que skills estão disponíveis?
```

### Ver documentação GTM
```
ls .claude/docs/
```

### Ver PRPs existentes
```
ls .claude/prps/gtm-templates/
```

### Exemplo completo de PRP
```
cat .claude/skills/gtm-template-spec/template-example.md
```

---

## Atalhos

| Comando | O que faz |
|---------|-----------|
| `/gtm-template-spec` | Cria novo PRP |
| `/gtm-template-spec [nome]` | Cria PRP com nome específico |
| Descrever necessidade | Claude aciona skill automaticamente |

---

**Tempo estimado:** 5-10 minutos para criar PRP completo
**Próximo passo:** Implementar o template baseado no PRP

Pronto para começar? Digite sua necessidade ou use `/gtm-template-spec`!
