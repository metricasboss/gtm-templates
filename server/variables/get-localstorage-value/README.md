# Get LocalStorage Value

Variável GTM Client-side para recuperar valores armazenados no localStorage do navegador.

## 📋 O que faz

Esta variável permite acessar dados específicos armazenados no localStorage do navegador do usuário. Ela recupera valores pela chave especificada e tenta automaticamente fazer parse de JSON quando aplicável, facilitando o acesso tanto a dados simples (strings) quanto a objetos complexos armazenados client-side.

## ⚙️ Campos de Configuração

### 1. Key (Obrigatório)
- **Tipo**: Texto
- **Descrição**: Chave do item no localStorage que você deseja acessar
- **Exemplos**:
  - `user_preferences`
  - `cart_items` 
  - `utm_data`
  - `session_info`

## 🚀 Como Usar

### 1. Instalação
1. Importe o arquivo `template.tpl` no seu container **client-side** GTM
2. Vá em **Variables** → **New** → **User-Defined Variables**  
3. Escolha o template "Get LocalStorage Key Value"
4. Nomeie a variável (ex: "LocalStorage - User Data")

### 2. Configuração Básica

```javascript
Key: user_preferences
```

### 3. Exemplos de Uso

#### Recuperar Dados do Usuário:
```javascript
// LocalStorage contém: 
// localStorage.setItem('user_data', '{"id": 123, "name": "João", "plan": "premium"}')

Variável: LocalStorage - User Data
Key: user_data
Resultado: {id: 123, name: "João", plan: "premium"} (objeto parseado)
```

#### Recuperar Itens do Carrinho:
```javascript
// LocalStorage contém:
// localStorage.setItem('cart', '[{"product": "Curso GTM", "price": 299}]')

Variável: LocalStorage - Cart
Key: cart  
Resultado: [{product: "Curso GTM", price: 299}] (array parseado)
```

#### Recuperar String Simples:
```javascript
// LocalStorage contém:
// localStorage.setItem('utm_source', 'google')

Variável: LocalStorage - UTM Source
Key: utm_source
Resultado: "google" (string)
```

## 📊 Casos de Uso Práticos

### 1. Rastreamento de Preferências do Usuário
```javascript
// Configurar variável
Key: user_preferences

// Usar em tags GA4
Custom Parameter:
  user_theme: {{LocalStorage - Preferences}}.theme
  user_language: {{LocalStorage - Preferences}}.language
```

### 2. E-commerce - Dados do Carrinho
```javascript
// Recuperar informações do carrinho
Key: shopping_cart

// Enviar para Facebook Pixel
Content IDs: {{LocalStorage - Cart}}.map(item => item.id)
Content Names: {{LocalStorage - Cart}}.map(item => item.name)
```

### 3. Recuperar UTM Persistente
```javascript
// UTMs salvas no localStorage para sessão
Key: utm_campaign_data

// Usar em conversões
Campaign Data: {{LocalStorage - UTM}}
Source: {{LocalStorage - UTM}}.source
Medium: {{LocalStorage - UTM}}.medium
```

### 4. Dados de Sessão/Autenticação
```javascript
// Verificar estado de login
Key: user_session

// Condicionar disparos baseado em login
Trigger Condition: {{LocalStorage - Session}}.logged_in equals true
```

## 🔧 Comportamento da Variável

### Retornos Possíveis:

1. **Chave existe com JSON válido**: Retorna objeto/array parseado
2. **Chave existe com string**: Retorna string original  
3. **Chave não existe**: Retorna `false`
4. **Chave vazia**: Retorna `undefined`
5. **Sem permissão**: Retorna `true` (fallback)

### Parse Automático de JSON:
```javascript
// Entrada: '{"user": "João", "age": 30}'
// Saída: {user: "João", age: 30}

// Entrada: '["item1", "item2", "item3"]'  
// Saída: ["item1", "item2", "item3"]

// Entrada: 'texto simples'
// Saída: "texto simples"
```

## 🔧 Requisitos Técnicos

### Permissões Necessárias:
- ✅ Logging (para debug)
- ✅ Access Local Storage (leitura específica por chave)

### APIs Utilizadas:
- `localStorage.getItem()`: Recupera valor do localStorage
- `JSON.parse()`: Parse automático de JSON
- `logToConsole()`: Logging de debug

### Limitações:
- ⚠️ Funciona apenas em containers **client-side** (WEB)
- ⚠️ Depende do localStorage estar habilitado no navegador
- ⚠️ Dados podem não existir em navegação privada/incógnita

## 🐛 Debug e Troubleshooting

### Como Debugar:
1. Abra o Preview Mode do GTM
2. Vá no console do navegador
3. Procure por mensagens da variável
4. Verifique o valor no localStorage: `localStorage.getItem('sua_chave')`

### Mensagens de Log:
```javascript
// Sucesso
"Valor encontrado no localStorage: [valor]"
"O valor é JSON válido. Retornando o objeto parseado."

// Erro
"Nenhum valor encontrado no localStorage para a chave: [chave]"
"Permissão negada para acessar o localStorage com a chave: [chave]"
"Erro: O campo 'key' não pode ser uma string vazia."
```

### Problemas Comuns:

**Variável retorna `false`:**
- Chave não existe no localStorage
- Valor foi removido ou expirou
- Usuário limpou dados do navegador

**Variável retorna `undefined`:**
- Campo "Key" está vazio
- Configuração incorreta da variável

**Permissão negada:**
- Template não tem permissão para acessar a chave específica
- Verificar configuração de permissões no template

**JSON não faz parse:**
- Valor no localStorage não é JSON válido
- Função `isValidJSON` pode ter bug (sempre retorna true no código atual)

## ⚠️ Boas Práticas

1. **Sempre valide** se o valor existe antes de usar
2. **Use condições** nos triggers baseadas no retorno da variável
3. **Documente** as chaves que sua aplicação usa
4. **Considere fallbacks** quando localStorage não está disponível
5. **Teste em navegação privada** onde localStorage pode falhar
6. **Cuidado com dados sensíveis** - localStorage é facilmente acessível

## 🔗 Links Úteis

- [MDN - localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)
- [GTM - Custom Variables](https://support.google.com/tagmanager/answer/6107124)
- [Métricas Boss](https://metricasboss.com.br)