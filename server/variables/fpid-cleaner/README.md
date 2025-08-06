# FPID Cleaner

Variável GTM Server-side para limpeza e processamento de First-Party IDs (FPID).

## 📋 O que faz

Esta variável processa valores brutos de cookies FPID removendo prefixos de nome de cookie, identificadores de versão e realizando decodificação URL para extrair o valor limpo do FPID. É essencial para garantir que os FPIDs sejam corretamente processados antes de serem enviados para plataformas de análise.

## ⚙️ Campos de Configuração

### 1. FPID Value (Obrigatório)
- **Tipo**: Texto
- **Descrição**: Variável que representa o valor bruto do cookie FPID
- **Exemplo**: `{{FPID Cookie}}`
- **Formato esperado**: `nome_cookie.versão.conteudo_codificado`

### 2. Enable Logs (Opcional)
- **Tipo**: Checkbox
- **Descrição**: Ativa logs detalhados no console para debug
- **Uso**: Marque apenas durante desenvolvimento/troubleshooting

## 🚀 Como Usar

### 1. Instalação
1. Importe o arquivo `template.tpl` no seu container **server-side** GTM
2. Vá em **Variables** → **New** → **User-Defined Variables**
3. Escolha o template "FPID Cleaner"
4. Nomeie a variável (ex: "Clean FPID")

### 2. Configuração Básica

```javascript
FPID Value: {{FPID Cookie}}
Enable Logs: ☐ (apenas para debug)
```

### 3. Configuração de Cookie FPID (pré-requisito)

Primeiro, crie uma variável para capturar o cookie FPID:

```javascript
Variable Type: HTTP Cookie
Cookie Name: _ga (para GA) ou seu cookie FPID customizado
```

## 💡 Como Funciona

### Processamento do FPID:

1. **Entrada**: Cookie bruto no formato `GA1.2.123456789.987654321`
2. **Análise**: Divide por pontos e verifica se tem pelo menos 3 partes
3. **Validação**: Verifica se a segunda parte é numérica (versão)
4. **Limpeza**: Remove prefixo e versão, mantém apenas o conteúdo
5. **Decodificação**: Aplica URL decode se necessário
6. **Saída**: FPID limpo pronto para uso

### Exemplos de Processamento:

```javascript
// Input: "GA1.2.123456789.987654321"
// Output: "123456789.987654321"

// Input: "_ga.G-XXXXXXXXXX.encoded%20content"  
// Output: "G-XXXXXXXXXX.encoded content"

// Input: "custom_fpid.1.user12345"
// Output: "user12345"

// Input: "invalid_format" (sem pontos ou versão)
// Output: "invalid_format" (retorna valor original)
```

## 📊 Casos de Uso

### 1. Limpeza de GA Client ID
```javascript
// Cookie: "_ga=GA1.2.1234567890.0987654321"
// Resultado: "1234567890.0987654321"

// Usar em tags GA4 Server-side
Client ID: {{Clean FPID}}
```

### 2. Processamento de FPID Customizado
```javascript
// Cookie customizado: "user_fpid.v2.abc123def456"
// Resultado: "abc123def456"

// Usar em integrações de terceiros
User ID: {{Clean FPID}}
```

### 3. Envio para Facebook CAPI
```javascript
// FPID limpo para hash
FBC/FBP: {{Clean FPID}}
```

## 🔧 Requisitos Técnicos

### Permissões Necessárias:
- ✅ Logging (para debug)

### APIs Utilizadas:
- `makeString()`: Converte para string
- `logToConsole()`: Logging de debug  
- `decodeUriComponent()`: Decodificação URL

### Compatibilidade:
- ✅ Google Analytics FPID (_ga cookie)
- ✅ FPIDs personalizados com formato padrão
- ✅ Conteúdo URL encoded
- ✅ Múltiplos pontos no conteúdo

## 🐛 Debug e Troubleshooting

### Como Debugar:
1. Ative "Enable Logs" na configuração
2. Use o Preview do GTM Server-side
3. Verifique os logs no console: `[FPID Cleaner] ...`
4. Compare input vs output nos logs

### Problemas Comuns:

**Variável retorna vazio:**
- Verifique se o cookie FPID existe
- Confirme que a variável de entrada está configurada
- Verifique se o valor não é null/undefined

**Valor não é processado (retorna original):**
- Cookie não segue formato esperado (nome.versão.conteudo)
- Segunda parte não é numérica
- Cookie tem menos de 3 partes separadas por ponto

**Logs não aparecem:**
- Confirme que "Enable Logs" está marcado
- Verifique no console do container server-side
- Logs só aparecem durante execução da variável

### Exemplo de Logs:
```
[FPID Cleaner] Raw FPID: GA1.2.1234567890.0987654321 -> Clean FPID (decoded): 1234567890.0987654321
[FPID Cleaner] FPID not in expected pattern. Returning raw value: invalid_cookie
[FPID Cleaner] Input value is not a valid string. Returning empty.
```

## ⚠️ Boas Práticas

1. **Sempre valide** se o cookie FPID existe antes de usar
2. **Use logs apenas** durante desenvolvimento
3. **Teste diferentes formatos** de cookie em seu ambiente
4. **Combine com validação** adicional se necessário
5. **Documente** o formato esperado dos seus FPIDs customizados

## 🔗 Links Úteis

- [Google Analytics - Client ID](https://support.google.com/analytics/answer/6205850)
- [First-party identifiers](https://developers.google.com/analytics/devguides/collection/ga4/cookies-user-id)
- [GTM Server-side Variables](https://developers.google.com/tag-platform/tag-manager/server-side)
- [Métricas Boss](https://metricasboss.com.br)