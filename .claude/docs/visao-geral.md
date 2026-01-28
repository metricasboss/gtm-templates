# Visão Geral - GTM Templates Personalizados

Esta documentação serve como guia para criar templates personalizados no Google Tag Manager (GTM).

## O que são Templates Personalizados?

Templates personalizados permitem que você escreva suas próprias definições de tags e variáveis para que outras pessoas dentro da sua organização possam usá-las junto com os templates integrados de tag e variável.

> **Vantagem Principal:** Templates personalizados oferecem uma abordagem "mais segura e eficiente do que quando se usa tags HTML personalizadas e variáveis JavaScript personalizadas."

---

## Tipos de Templates

### Tag Templates

Executam ações específicas, como:
- Enviar dados para plataformas de analytics
- Injetar scripts de terceiros
- Fazer chamadas de API
- Enviar pixels de tracking
- Modificar o DOM

**Exemplo de uso:** Criar uma tag personalizada para enviar eventos para uma plataforma de analytics brasileira como RD Station ou Hotmart.

### Variable Templates

Retornam valores para uso em outras configurações do GTM, como:
- Extrair dados de objetos complexos (ex: VTEX orderForm)
- Processar e limpar dados
- Calcular valores derivados
- Acessar APIs específicas

**Exemplo de uso:** Criar uma variável que extrai o valor total de um pedido do objeto VTEX orderForm.

---

## Estrutura do Template Editor

O editor de templates possui quatro áreas principais:

### 1. Info (Informações)

Propriedades básicas do template:
- **Nome**: Como o template aparece na interface
- **Descrição**: Breve resumo da funcionalidade
- **Ícone**: Imagem representativa (PNG, JPEG ou GIF, 48x48 a 96x96 pixels)
- **Categorias**: Classificação do template
- **Versão**: Número da versão do template

**Boas práticas:**
- Use nomes descritivos: "Nome da Funcionalidade da Nome da Empresa"
- Descrições claras e concisas (1-2 frases)
- Ícone profissional e reconhecível

### 2. Fields (Campos)

Interface visual para campos de entrada que os usuários preencherão:

**Tipos de campo disponíveis:**
- Text Input (entrada de texto)
- Dropdown (menu suspenso)
- Checkbox (caixa de seleção)
- Radio Button (botão de opção)
- Simple Table (tabela simples)

**Exemplo de campos:**
```
- Tracking ID (Text Input)
- Habilitar Debug (Checkbox)
- Tipo de Evento (Dropdown: pageview, event, purchase)
```

### 3. Code (Código)

JavaScript em ambiente sandboxed que implementa a lógica do template.

**Características:**
- Baseado em ECMAScript 5.1 com suporte a recursos do ES6
- Ambiente sandbox seguro com acesso restrito
- Usa sistema `require()` para importar APIs
- Recebe parâmetro `data` com valores dos campos

**Estrutura básica:**
```javascript
// Importar APIs necessárias
const sendPixel = require('sendPixel');
const encodeUri = require('encodeUri');

// Acessar dados dos campos
const trackingId = data.trackingId;
const eventType = data.eventType;

// Implementar lógica
const url = 'https://analytics.example.com/collect?id=' + encodeUri(trackingId);
sendPixel(url, data.gtmOnSuccess, data.gtmOnFailure);
```

### 4. Permissions (Permissões)

Controle de permissões e restrições de segurança.

**Tipos de permissão:**
- `access_globals` - Acesso a variáveis globais
- `inject_script` - Injetar scripts
- `send_pixel` - Enviar pixels
- `get_cookies` - Ler cookies
- `set_cookies` - Definir cookies
- `read_data_layer` - Ler dataLayer
- `write_data_layer` - Escrever na dataLayer
- E muitas outras...

**Princípio importante:** Solicite apenas as permissões estritamente necessárias para o funcionamento do template.

---

## Templates Personalizados vs. HTML Customizado

| Aspecto | Templates Personalizados | HTML Customizado |
|---------|-------------------------|------------------|
| **Segurança** | Sandbox restrito com permissões | Acesso total (mais arriscado) |
| **Reutilização** | Interface configurável | Código duplicado |
| **Manutenção** | Centralizada no template | Em cada tag individual |
| **Performance** | Otimizado | Pode variar |
| **Documentação** | Interface auto-documentada | Requer documentação manual |

---

## Ambiente Sandbox

### O que é o JavaScript no Modo Sandbox?

É um subconjunto simplificado de JavaScript que oferece execução segura com:

- **Tipos suportados:** null, undefined, string, number, boolean, array, object, function
- **Sem acesso direto a:** window, document, construtores globais (new, String, Number)
- **Sem palavra-chave:** new, this
- **Alternativas:** Sistema require() para APIs controladas

### APIs Disponíveis

Mais de 50 APIs disponíveis via `require()`, incluindo:

**Acesso a dados:**
- copyFromDataLayer
- copyFromWindow
- getCookieValues

**URLs e navegação:**
- getUrl
- getReferrerUrl
- parseUrl

**Scripts e pixels:**
- injectScript
- sendPixel
- injectHiddenIframe

**Armazenamento:**
- localStorage
- templateStorage

**Utilitários:**
- JSON, Math, Object
- encodeUri, sha256
- getTimestamp

Consulte a [Referência de APIs](./api-reference.md) para lista completa.

---

## Workflow de Desenvolvimento

### 1. Planejamento

- Defina o objetivo do template
- Liste os dados necessários (campos)
- Identifique as APIs que precisará usar
- Determine as permissões necessárias

### 2. Criação

1. Abra GTM → Templates → Novo
2. Preencha a aba Info
3. Adicione campos na aba Fields
4. Implemente código na aba Code
5. Configure permissões na aba Permissions

### 3. Teste

Use as APIs de teste:
```javascript
// Em ___TESTS___
const mockData = {
  trackingId: 'UA-XXXXX-Y',
  eventType: 'pageview'
};

mock('sendPixel', (url) => {
  assertThat(url).contains('UA-XXXXX-Y');
});

runCode(mockData);
assertApi('sendPixel').wasCalled();
```

### 4. Uso

1. Salve o template
2. Crie nova tag/variável usando o template
3. Configure os campos
4. Teste em Preview Mode
5. Publique

---

## Boas Práticas

### Segurança

✅ **Faça:**
- Solicite apenas permissões necessárias
- Valide entrada de usuários
- Use URLs específicas (não wildcards amplos)
- Trate erros adequadamente

❌ **Evite:**
- Permissões excessivas
- Injetar scripts de domínios não confiáveis
- Expor dados sensíveis em logs
- Ignorar callbacks de erro

### Performance

✅ **Faça:**
- Use cache tokens em injectScript
- Minimize operações síncronas
- Reutilize valores calculados
- Use callLater para operações não urgentes

❌ **Evite:**
- Múltiplas chamadas copyFromWindow
- Loops desnecessários em arrays grandes
- Injetar múltiplos scripts iguais

### UX e Manutenção

✅ **Faça:**
- Nomes de campo descritivos
- Help text com exemplos
- Logging condicional (apenas em debug)
- Versionamento adequado

❌ **Evite:**
- Campos técnicos sem explicação
- Assumir conhecimento técnico do usuário
- Logs em produção sem necessidade
- Quebrar compatibilidade sem aviso

---

## Recursos de Aprendizado

### Documentação Oficial

- [Visão Geral de Templates](https://developers.google.com/tag-platform/tag-manager/templates)
- [Referência de APIs](./api-reference.md)
- [JavaScript no Modo Sandbox](./javascript-no-modo-sandbox.md)
- [Permissões](./permissoes-de-modelo-personalizado.md)
- [Guia de Estilo](./guia-de-estilo-do-modelo.md)
- [Biblioteca Padrão](./biblioteca-padrao.md)

### Tutoriais

- [Converter Tag Existente](./converter-tag-existente.md)
- [Galeria de Templates da Comunidade](https://tagmanager.google.com/gallery/)

---

## Limitações Importantes

> **Importante:** Templates personalizados estão disponíveis apenas para propriedades web e server-side no momento.

**Não disponível para:**
- Contêineres mobile (iOS/Android)
- AMP containers

**Limitações do Sandbox:**
- Sem acesso ao DOM diretamente
- Sem fetch/XMLHttpRequest nativos
- Sem setTimeout/setInterval (use callLater)
- Sem eval ou Function constructor
- Sem acesso a APIs modernas do navegador sem permissões

---

## Exemplos de Casos de Uso

### Tags Personalizadas

1. **Plataformas Brasileiras**
   - RD Station Conversions API
   - Hotmart tracking
   - ActiveCampaign events
   - Panda Video analytics

2. **E-commerce**
   - VTEX orderForm parser
   - Enhanced tracking personalizado
   - Checkout step tracking

3. **Analytics Customizado**
   - Event enrichment
   - User ID management
   - Session tracking

### Variáveis Personalizadas

1. **Data Extraction**
   - Parse de objetos complexos
   - URL parameter parsing customizado
   - Cookie parsing

2. **Transformação de Dados**
   - Normalização de valores
   - Cálculos customizados
   - Concatenação de campos

3. **Validação**
   - Format validation
   - Data quality checks
   - Conditional values

---

## Próximos Passos

1. Leia a [Referência de APIs](./api-reference.md) para conhecer todas as funções disponíveis
2. Estude o [JavaScript no Modo Sandbox](./javascript-no-modo-sandbox.md) para entender as limitações
3. Siga o [Guia de Estilo](./guia-de-estilo-do-modelo.md) para criar templates profissionais
4. Pratique com o tutorial [Converter Tag Existente](./converter-tag-existente.md)

---

**Fonte**: [Google Tag Manager Templates Documentation](https://developers.google.com/tag-platform/tag-manager/templates)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
