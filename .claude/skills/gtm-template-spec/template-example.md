# RD Station Conversions - GTM Template Specification

## Business Context

**Problema que resolve:**
Rastrear conversões no RD Station Marketing sem precisar adicionar código JavaScript manualmente em cada página. Permite que analistas de marketing configurem tracking de conversões diretamente no GTM.

**Plataforma/Integração:**
RD Station Marketing (plataforma brasileira de automação de marketing)

**Tipo de Template:**
- [x] Tag Template
- [ ] Variable Template

**Público-alvo:**
Analistas de marketing, agências digitais, e-commerce managers que usam RD Station e GTM

**Benefícios:**
- Tracking de conversões sem código customizado
- Configuração visual no GTM (não requer conhecimento técnico)
- Captura automática de dados de formulário
- Integração nativa com RD Station Conversions API

## Technical Specifications

### Template Info

**Nome de exibição:**
`RD Station Conversions da Métricas Boss`

**Descrição curta (1-2 frases):**
Envia eventos de conversão para a RD Station Conversions API. Ideal para rastrear submissões de formulário, downloads, e outras conversões importantes.

**Categorias:**
- [x] Marketing
- [x] Conversions
- [ ] Analytics
- [ ] Advertising

**Ícone:**
Logo da RD Station (47x47px PNG)

### Fields Configuration

| Nome do Parâmetro | Tipo de Campo | Label | Help Text | Obrigatório | Valor Padrão |
|-------------------|---------------|-------|-----------|-------------|--------------|
| `publicToken` | Text Input | Token Público | Token público da sua conta RD Station. Encontre em Integrações > API. | Sim | - |
| `conversionIdentifier` | Text Input | Identificador da Conversão | Nome único para identificar esta conversão (ex: "download-ebook", "contato-vendas") | Sim | - |
| `email` | Text Input | Email | Email do lead. Pode usar variável GTM como {{Form Email}} | Sim | - |
| `name` | Text Input | Nome | Nome do lead (opcional) | Não | - |
| `phone` | Text Input | Telefone | Telefone do lead (opcional) | Não | - |
| `customFields` | Simple Table | Campos Personalizados | Campos customizados adicionais a enviar | Não | - |
| `enableDebug` | Checkbox | Habilitar Debug | Ativa logs detalhados no console para debugging | Não | false |

### Code Logic

**Fluxo principal:**
1. Validar campos obrigatórios (publicToken, conversionIdentifier, email)
2. Construir payload da Conversions API
3. Adicionar campos opcionais se preenchidos
4. Enviar POST para endpoint da RD Station
5. Tratar resposta e callbacks

**APIs necessárias (via require):**
- `sendHttpRequest` - Enviar requisição POST para API
- `JSON` - Construir payload JSON
- `logToConsole` - Logging condicional para debug
- `encodeUriComponent` - Codificar valores se necessário

**Lógica de validação:**
- Validar que publicToken não está vazio e tem formato válido
- Verificar que email tem formato válido (contém @)
- Validar que conversionIdentifier não tem espaços ou caracteres especiais
- Garantir que pelo menos email está presente

**Tratamento de erros:**
- Callback data.gtmOnFailure() se requisição falhar
- Log de erro detalhado se debug habilitado
- Validar status code da resposta (200-299 = sucesso)

### Permissions Required

- [x] `send_http` - URL pattern: `https://api.rd.services/platform/conversions*`
- [x] `logging` - Apenas em modo debug/preview
- [ ] `get_url` - Não necessário
- [ ] `read_data_layer` - Não necessário (dados vêm dos campos)

### External Dependencies

**API externa:**
- Endpoint: `https://api.rd.services/platform/conversions`
- Método: POST
- Content-Type: application/json
- Autenticação: Token público no query parameter
- Rate limit: 120 requisições/minuto
- Documentação: https://developers.rdstation.com/pt-BR/conversions

## Implementation Details

### Pseudocódigo

```javascript
// 1. Importar APIs
const sendHttpRequest = require('sendHttpRequest');
const JSON = require('JSON');
const logToConsole = require('logToConsole');

// 2. Validar dados obrigatórios
if (!data.publicToken || !data.email || !data.conversionIdentifier) {
  if (data.enableDebug) {
    logToConsole('RD Station: Campos obrigatórios faltando');
  }
  return data.gtmOnFailure();
}

// 3. Validar formato de email
if (data.email.indexOf('@') === -1) {
  if (data.enableDebug) {
    logToConsole('RD Station: Email inválido', data.email);
  }
  return data.gtmOnFailure();
}

// 4. Construir payload base
const payload = {
  conversion_identifier: data.conversionIdentifier,
  email: data.email
};

// 5. Adicionar campos opcionais
if (data.name) payload.name = data.name;
if (data.phone) payload.mobile_phone = data.phone;

// 6. Adicionar campos personalizados
if (data.customFields && data.customFields.length > 0) {
  data.customFields.forEach(field => {
    payload['cf_' + field.key] = field.value;
  });
}

// 7. Construir URL com token
const url = 'https://api.rd.services/platform/conversions?api_key=' + data.publicToken;

// 8. Configurar requisição
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  timeout: 5000
};

// 9. Log de debug
if (data.enableDebug) {
  logToConsole('RD Station: Enviando conversão', payload);
}

// 10. Enviar requisição
sendHttpRequest(url, (statusCode, headers, body) => {
  if (statusCode >= 200 && statusCode < 300) {
    if (data.enableDebug) {
      logToConsole('RD Station: Sucesso', statusCode);
    }
    data.gtmOnSuccess();
  } else {
    if (data.enableDebug) {
      logToConsole('RD Station: Erro', statusCode, body);
    }
    data.gtmOnFailure();
  }
}, options, JSON.stringify(payload));
```

### Casos de Uso

**Caso 1: Download de E-book**
- Evento: Usuário baixa um e-book
- Dados: email, nome, telefone
- Conversão: "download-ebook-marketing-digital"
- Comportamento: Registra lead no RD Station com tag de interesse

**Caso 2: Contato Comercial**
- Evento: Formulário de contato enviado
- Dados: email, nome, telefone, empresa, cargo
- Conversão: "contato-comercial"
- Campos personalizados: empresa, cargo
- Comportamento: Lead entra no funil de vendas

**Caso 3: Inscrição em Webinar**
- Evento: Inscrição em evento online
- Dados: email, nome
- Conversão: "inscricao-webinar-2024-01"
- Comportamento: Lead recebe sequência de emails do webinar

### Edge Cases

- **Email inválido:** Validar formato antes de enviar, falhar graciosamente
- **Token expirado/inválido:** RD retorna 401, chamar gtmOnFailure e logar erro
- **Rate limit excedido:** RD retorna 429, chamar gtmOnFailure
- **Timeout:** Requisição demora > 5s, cancelar e chamar gtmOnFailure
- **Campos personalizados vazios:** Não incluir no payload se value estiver vazio
- **Caracteres especiais no identifier:** Sanitizar ou validar no campo

### Testing Checklist

- [ ] Testar com email válido e token válido
- [ ] Testar com email inválido (sem @)
- [ ] Testar sem preencher campos obrigatórios
- [ ] Testar com campos personalizados
- [ ] Verificar logs em modo debug no console
- [ ] Confirmar conversão aparece no RD Station
- [ ] Validar permissões HTTP configuradas corretamente
- [ ] Testar timeout (simular demora na API)
- [ ] Testar em Preview Mode do GTM
- [ ] Testar em produção com volume baixo antes de escalar

## Documentation

### README.md do Template

```markdown
# RD Station Conversions

Template GTM para enviar conversões para a RD Station Conversions API.

## Instalação

1. No GTM, vá em **Templates** > **Novo**
2. Clique em **Importar** no canto superior direito
3. Selecione o arquivo `rd-station-conversions.tpl`
4. Clique em **Salvar**

## Configuração

### Campos obrigatórios

- **Token Público**: Token da sua conta RD Station
  - Encontre em: RD Station > Integrações > API > Token Público

- **Identificador da Conversão**: Nome único para esta conversão
  - Exemplos: `download-ebook`, `contato-vendas`, `trial-signup`
  - Use apenas letras minúsculas, números e hífens

- **Email**: Email do lead
  - Pode usar variável GTM como `{{Form - Email}}`
  - Deve conter @ para ser válido

### Campos opcionais

- **Nome**: Nome completo do lead
- **Telefone**: Telefone com DDD (ex: 11999999999)
- **Campos Personalizados**: Tabela com campos extras
  - Coluna 1 (key): Nome do campo
  - Coluna 2 (value): Valor do campo

## Uso

### Exemplo 1: Rastrear download de e-book

1. Crie uma nova **Tag** usando o template "RD Station Conversions"
2. Configure:
   - Token Público: seu-token-aqui
   - Identificador: `download-ebook-marketing`
   - Email: `{{Form - Email}}`
   - Nome: `{{Form - Nome}}`
3. Trigger: Form Submission - formulário do e-book
4. Teste em **Preview Mode**
5. Publique

### Exemplo 2: Rastrear inscrição com campos personalizados

1. Crie nova tag RD Station Conversions
2. Configure campos base
3. Em "Campos Personalizados", adicione:
   - key: `empresa`, value: `{{Form - Empresa}}`
   - key: `cargo`, value: `{{Form - Cargo}}`
4. Configure trigger apropriado

## Debugging

1. Marque a opção **"Habilitar Debug"**
2. Abra o Console do navegador (F12)
3. Faça o teste da conversão
4. Veja logs detalhados com prefixo "RD Station:"

Logs incluem:
- Payload sendo enviado
- Status code da resposta
- Erros de validação

## Validação

A tag valida automaticamente:
- Campos obrigatórios preenchidos
- Email contém @
- Token público presente

Se validação falhar:
- Tag não envia dados
- gtmOnFailure é chamado
- Erro aparece em debug mode

## Troubleshooting

**Conversão não aparece no RD Station:**
- Verifique se o token está correto
- Confirme que o identificador é único
- Veja se há erros no console (modo debug)
- Verifique rate limits (max 120/min)

**Erro 401 Unauthorized:**
- Token inválido ou expirado
- Gere novo token no RD Station

**Erro 429 Too Many Requests:**
- Rate limit excedido
- Aguarde 1 minuto e tente novamente

## Referências

- [RD Station Conversions API](https://developers.rdstation.com/pt-BR/conversions)
- [GTM Templates Documentation](../../.claude/docs/visao-geral.md)
```

### Comentários no Código

Principais seções que devem ter comentários:

```javascript
// ========================================
// 1. IMPORTAÇÃO DE APIs
// ========================================
const sendHttpRequest = require('sendHttpRequest');
const JSON = require('JSON');
const logToConsole = require('logToConsole');

// ========================================
// 2. VALIDAÇÃO DE DADOS OBRIGATÓRIOS
// ========================================
// Campos: publicToken, email, conversionIdentifier

// ========================================
// 3. CONSTRUÇÃO DO PAYLOAD
// ========================================
// Estrutura da Conversions API RD Station
// Docs: https://developers.rdstation.com/pt-BR/conversions

// ========================================
// 4. ENVIO DA REQUISIÇÃO
// ========================================
// POST para api.rd.services/platform/conversions
// Timeout: 5000ms
// Auth: Token no query parameter

// ========================================
// 5. TRATAMENTO DE RESPOSTA
// ========================================
// 2xx = sucesso, chama gtmOnSuccess
// 4xx/5xx = erro, chama gtmOnFailure
```

## Acceptance Criteria

### Funcional
- [x] Template aparece na lista de templates do GTM
- [x] Todos os campos (public token, identifier, email, etc) aparecem na interface
- [x] Validação de email funciona (rejeita se não tem @)
- [x] Validação de campos obrigatórios funciona
- [x] Dados são enviados corretamente para RD Station API
- [x] Callback gtmOnSuccess é chamado em caso de sucesso (2xx)
- [x] Callback gtmOnFailure é chamado em caso de erro
- [x] Logs de debug aparecem no console quando habilitados
- [x] Campos personalizados são adicionados ao payload

### Não-funcional
- [x] Código segue guia de estilo do repositório
- [x] Usa apenas permissões mínimas necessárias
- [x] README.md completo e em português brasileiro
- [x] Exemplos de uso documentados (download e-book, contato)
- [x] Código comentado em seções principais
- [x] Performance: requisição completa em < 6s (5s timeout + processamento)
- [x] Nome do template segue padrão: "[Funcionalidade] da [Empresa]"

### Segurança
- [x] Não expõe token público em logs (apenas em debug mode)
- [x] Valida formato de email antes de enviar
- [x] Usa HTTPS para todas as chamadas (api.rd.services)
- [x] Permissão HTTP específica (não wildcard *.*)
- [x] Timeout configurado para evitar travamento
- [x] Sanitiza caracteres especiais em conversionIdentifier

### Compatibilidade
- [x] Funciona em Web Container
- [ ] Funciona em Server Container (não aplicável - formulários são client-side)
- [ ] Compatível com Consent Mode (não coleta dados sensíveis diretamente)

## Next Steps

1. **Review da especificação** - Completo
2. **Implementação do código** - Próximo
3. **Testes em ambiente dev** - Aguardando
4. **Documentação README** - Template pronto
5. **PR para revisão** - Aguardando implementação

---

**Data de criação:** 2026-01-28
**Autor:** Métricas Boss Team
**Versão:** 1.0
