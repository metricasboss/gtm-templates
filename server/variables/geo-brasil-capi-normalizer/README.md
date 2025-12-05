# Geo Brasil CAPI Normalizer

Template de variável Server-Side para Google Tag Manager que normaliza dados geográficos brasileiros (cidade, estado, país) para formato compatível com APIs de conversão. **100% gratuito** usando jsDelivr CDN.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Recursos](#recursos)
- [Arquitetura](#arquitetura)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Exemplos Práticos](#exemplos-práticos)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## 🎯 Visão Geral

Este template resolve um problema comum ao enviar eventos de conversão server-side: **dados geográficos com formatação inconsistente**.

### O Problema

Quando você captura dados geográficos do usuário via headers HTTP (ex: `x-geo-city`), eles vêm com:
- Acentos: `São Paulo`, `Juíz de Fora`
- Espaços: `Belo Horizonte`, `Ribeirão Preto`
- Capitalização inconsistente: `BRASILIA`, `brasília`, `Brasília`

APIs de conversão (Facebook CAPI, Google Ads, TikTok) exigem:
- Sem acentos: `saopaulo`, `juizdefora`
- Sem espaços: `belohorizonte`, `ribeiraopreto`
- Lowercase: `brasilia`
- Hash SHA256 (Facebook): `8a9b7c6d5e4f3a2b...`

### A Solução

Este template normaliza automaticamente os dados, garantindo:
- ✅ **Formato correto** para todas as APIs
- ✅ **Cache local em 3 níveis** para máxima performance
- ✅ **jsDelivr CDN** para mapeamentos (gratuito, global)
- ✅ **SHA256 nativo** gerado no GTM
- ✅ **Fallback robusto** se CDN falhar
- ✅ **Zero custo** de infraestrutura

## ⚡ Recursos

- **Normalização automática**: Remove acentos, espaços e caracteres especiais
- **Hash SHA256**: Geração nativa no GTM para Facebook CAPI
- **Cache inteligente 3 níveis**:
  1. Cache de resultados finais
  2. Cache dos JSONs do CDN
  3. Fallback em memória
- **jsDelivr CDN**: Busca mapeamentos de estados/países do GitHub
- **Fallback robusto**: Continua funcionando se CDN falhar
- **Mapeamento de estados**: Converte siglas (MG) para nomes completos (minasgerais)
- **Logs de debug**: Facilita troubleshooting
- **Valores customizados**: Aceita dados de outras fontes além dos headers
- **100% gratuito**: Sem custos de API ou infraestrutura

## 🏗️ Arquitetura

### Fluxo de Dados

```
Cliente faz requisição HTTP
        ↓
GTM Server-Side captura headers
  x-geo-city: "Juiz de Fora"
  x-geo-region: "MG"
  x-geo-country: "BR"
        ↓
Template verifica cache local
        ↓
Cache MISS → Busca JSONs do jsDelivr
  ├── estados.json (2KB)
  └── paises.json (1KB)
        ↓
Normaliza cidade algoritmicamente
Mapeia estado e país via JSON
Gera SHA256 localmente
        ↓
Resultado salvo no cache (1h TTL)
        ↓
Variável retorna o campo solicitado
```

### jsDelivr (CDN Gratuito)

Os mapeamentos de estados e países ficam hospedados no GitHub e são servidos pelo jsDelivr:

```
https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data/
  ├── estados.json  (27 estados brasileiros)
  └── paises.json   (principais países)
```

**Vantagens:**
- ✅ Cache global automático
- ✅ CDN distribuído (baixa latência)
- ✅ 100% gratuito
- ✅ Alta disponibilidade
- ✅ Versionamento via Git

### Fallback Interno

Se o jsDelivr não responder, o template tem mapeamento embutido e continua funcionando normalmente.

## 📦 Instalação

### 1. Importar Template

1. Acesse seu **GTM Server-Side Container**
2. Vá em **Templates** → **New**
3. Click no menu (⋮) no canto superior direito
4. Selecione **Import**
5. Escolha o arquivo `template.tpl`
6. Click **Save**

### 2. Verificar Importação

Você verá o template **Geo Brasil CAPI Normalizer** na lista de templates disponíveis.

## ⚙️ Configuração

### Criando Variáveis

Crie uma variável para cada campo que você precisar usar:

#### Passo a passo:

1. GTM → **Variables** → **New**
2. **Variable Configuration** → Selecione **Geo Brasil CAPI Normalizer**
3. Configure conforme a tabela abaixo
4. **Save**

#### Variáveis Recomendadas

| Nome da Variável | Tipo de Saída | Uso |
|------------------|---------------|-----|
| **Geo - City** | `city` | Cidade normalizada (juizdefora) |
| **Geo - City SHA256** | `city_sha256` | Hash da cidade para CAPI |
| **Geo - State** | `state` | Estado por extenso (minasgerais) |
| **Geo - State Code** | `state_code` | Sigla do estado (mg) |
| **Geo - State SHA256** | `state_sha256` | Hash do estado para CAPI |
| **Geo - Country** | `country` | País normalizado (brazil) |
| **Geo - Country Code** | `country_code` | Código do país (br) |
| **Geo - Country SHA256** | `country_sha256` | Hash do país para CAPI |

### Configurações Avançadas

#### Cache

- **Habilitado por padrão**: ✅ Sim
- **TTL padrão**: 3600 segundos (1 hora)
- **Storage**: templateStorage (local ao container)
- **3 níveis**: Resultado final + JSONs CDN + Fallback

#### CDN

- **URL padrão**: `https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data`
- **Timeout**: 2000 ms
- **Fallback**: Automático se CDN falhar

#### Normalização de Cidades

- **Modo Algorítmico** (padrão): Remove acentos/espaços → `São Paulo` vira `saopaulo`
- **Modo Passthrough**: Mantém original (não recomendado para CAPI)

#### Debug

- **Logs de debug**: ❌ (desabilitado por padrão)
- **Quando habilitar**: Durante troubleshooting

## 🚀 Uso

### 1. Uso Básico (Headers Automáticos)

O template lê automaticamente os headers da Stape:

```javascript
// Não precisa configurar nada!
// Usa automaticamente:
// - x-geo-city
// - x-geo-region
// - x-geo-country
```

### 2. Valores Customizados

Se você tem dados geográficos de outra fonte:

1. Na configuração da variável, vá em **Origem dos Dados (Avançado)**
2. Selecione **Valores customizados**
3. Preencha:
   - **Cidade (custom)**: `{{SuaVariavelCidade}}`
   - **Estado (custom)**: `{{SuaVariavelEstado}}`
   - **País (custom)**: `{{SuaVariavelPais}}`

### 3. Objeto Completo

Se você precisa de todos os campos de uma vez:

1. **Tipo de retorno**: `Objeto completo (todos os campos)`
2. Acesse os campos via JavaScript:

```javascript
var geo = {{Geo - Full Object}};

// Acesse os campos:
geo.city              // "juizdefora"
geo.city_sha256       // "8a9b7c6d..."
geo.state             // "minasgerais"
geo.state_code        // "mg"
geo.state_sha256      // "1a2b3c..."
geo.country           // "brazil"
geo.country_code      // "br"
geo.country_sha256    // "3c4d5e..."
```

## 💡 Exemplos Práticos

### Exemplo 1: Facebook CAPI - Purchase Event

```javascript
// Tag: Facebook Conversion API - Purchase
{
  "event_name": "Purchase",
  "event_time": {{Event Timestamp}},
  "user_data": {
    "em": "{{Email SHA256}}",
    "ph": "{{Phone SHA256}}",
    "ct": "{{Geo - City SHA256}}",
    "st": "{{Geo - State SHA256}}",
    "country": "{{Geo - Country SHA256}}",
    "client_ip_address": "{{Client IP}}",
    "client_user_agent": "{{User Agent}}"
  },
  "custom_data": {
    "value": {{Purchase Value}},
    "currency": "BRL"
  }
}
```

### Exemplo 2: Google Ads - Conversão com Endereço

```javascript
// Tag: Google Ads Enhanced Conversions
{
  "conversion_action": "purchase",
  "user_identifiers": [
    {
      "hashed_email": "{{Email SHA256}}"
    },
    {
      "address_info": {
        "city": "{{Geo - City}}",
        "region": "{{Geo - State Code}}",
        "country": "{{Geo - Country Code}}"
      }
    }
  ],
  "conversion_value": {{Purchase Value}},
  "currency_code": "BRL"
}
```

### Exemplo 3: TikTok Events API

```javascript
// Tag: TikTok Events API
{
  "event": "CompletePayment",
  "timestamp": {{Event Timestamp}},
  "user": {
    "email": "{{Email SHA256}}",
    "phone": "{{Phone SHA256}}",
    "city": "{{Geo - City SHA256}}",
    "state": "{{Geo - State SHA256}}",
    "country": "{{Geo - Country SHA256}}"
  },
  "properties": {
    "value": {{Purchase Value}},
    "currency": "BRL"
  }
}
```

### Exemplo 4: Webhook Genérico

```javascript
// Tag: Generic Webhook
{
  "event": "purchase",
  "user": {
    "id": "{{User ID}}",
    "location": {
      "city": "{{Geo - City}}",
      "state": "{{Geo - State}}",
      "state_code": "{{Geo - State Code}}",
      "country": "{{Geo - Country}}",
      "country_code": "{{Geo - Country Code}}"
    }
  },
  "transaction": {
    "value": {{Purchase Value}},
    "currency": "BRL"
  }
}
```

## ⚡ Performance

### Métricas Típicas

| Cenário | Latência | Cache |
|---------|----------|-------|
| Cache HIT (resultado) | ~1-2ms | ✅ |
| Cache HIT (JSONs CDN) | ~5-10ms | ✅ |
| Cache MISS (busca CDN) | ~50-100ms | ❌ → ✅ |
| Fallback interno | ~5-10ms | - |

### Otimizações

1. **Cache em 3 níveis**: Resultado final, JSONs CDN e fallback
2. **TTL de 1h**: Estados/países não mudam, cache longo é seguro
3. **jsDelivr global**: CDN distribuído com baixa latência
4. **Fallback instantâneo**: Zero dependência se CDN falhar

### Capacidade

- **jsDelivr**: Ilimitado (cache global)
- **Cache local**: Ilimitado (templateStorage)
- **Fallback**: Ilimitado (em memória)
- **Custo**: $0 (gratuito)

## 🐛 Troubleshooting

### Problema: Variável retorna vazio

**Causas possíveis:**

1. Headers não estão sendo enviados
2. Cache corrompido
3. jsDelivr offline e fallback falhou

**Soluções:**

```javascript
// 1. Verifique os headers
// Habilite "Logs de debug" na variável
// Console mostrará: "Lendo headers: { city: 'X', state: 'Y', country: 'Z' }"

// 2. Limpe o cache
// GTM → Preview → Console
// Execute: templateStorage.clear()

// 3. Verifique fallback
// Fallback está sempre ativo, mas verifique se há erros no console
```

### Problema: Latência alta no primeiro hit

**Causa:** Cache cold start (primeira busca ao jsDelivr)

**Solução:**

Isso é esperado. O primeiro hit de cada container pode levar ~50-100ms para buscar os JSONs do jsDelivr. Depois disso:
- **Cache hit**: ~1-5ms
- **Warm cache**: 99% dos requests

### Problema: jsDelivr retorna 404

**Causa:** URL do CDN incorreta ou repositório privado

**Soluções:**

1. **Verifique a URL**: Deve ser:
   ```
   https://cdn.jsdelivr.net/gh/metricasboss/gtm-templates@main/server/variables/geo-brasil-capi-normalizer/data
   ```

2. **Repositório deve ser público**: jsDelivr só funciona com repos públicos

3. **Use seu próprio fork**:
   - Fork o repositório `metricasboss/gtm-templates`
   - Altere a URL para: `https://cdn.jsdelivr.net/gh/SEU-USUARIO/gtm-templates@main/...`

### Problema: SHA256 incorreto

**Causa:** Normalização diferente do esperado

**Debug:**

```javascript
// Crie uma variável com outputType = "full_object"
var geo = {{Geo - Full Object}};

// Compare:
console.log('Cidade normalizada:', geo.city);           // "juizdefora"
console.log('SHA256 gerado:', geo.city_sha256);        // "8a9b7c..."

// Facebook CAPI espera lowercase sem acentos
// Certifique-se que está usando o SHA256, não o valor normalizado
```

### Problema: Estado não reconhecido

**Causa:** Sigla não é um dos 27 estados brasileiros

**Solução:**

```javascript
// Template suporta apenas estados brasileiros
// Se for outro país, use normalização genérica (fallback)

// Opção 1: Deixe o fallback ativo (padrão)
// Opção 2: Adicione o mapeamento customizado no seu fork
```

## ❓ FAQ

### 1. Preciso de infraestrutura externa?

**Não**. Tudo funciona 100% gratuito:
- jsDelivr (CDN): grátis ilimitado
- Template GTM: incluído no GTM Server-Side
- Fallback interno: sempre ativo

### 2. O que acontece se o jsDelivr cair?

O template tem **fallback interno embutido** com todos os 27 estados brasileiros. Se o jsDelivr não responder, usa o fallback e continua funcionando normalmente.

### 3. Quantas requisições posso fazer?

**Ilimitadas**. Com o cache ativado:
- 1ª requisição: ~50-100ms (busca jsDelivr)
- Próximas 1h: ~1-5ms (cache local)
- Após 1h: Renova cache automaticamente

### 4. Funciona para outros países?

**Sim**, mas o mapeamento de estados é específico do Brasil. Para outros países:
- **Estados/Regiões**: Use normalização algorítmica (fallback)
- **Países**: 25 países principais incluídos no `paises.json`
- **Adicionar mais**: Faça um fork e adicione ao JSON

### 5. Posso usar no GTM Web Container?

**Não**. Este é um template **Server-Side** específico. Para Web Container, você precisaria:
- Ler dados de outra fonte (não headers HTTP)
- Fazer requisição via fetch/XHR ao jsDelivr
- Processar no client-side (menos seguro)

### 6. O cache é compartilhado entre containers?

**Não**. O cache (templateStorage) é isolado por container GTM. Cada Server Container tem seu próprio cache.

### 7. Como atualizar o template?

1. Baixe a nova versão do `template.tpl`
2. GTM → Templates → Geo Brasil CAPI Normalizer
3. Click no menu (⋮) → **Import**
4. Selecione o novo arquivo
5. **Save**

Suas variáveis continuarão funcionando sem alteração.

### 8. É compatível com Stape?

**Sim**, 100% compatível. O template foi projetado para ler os headers padrão da Stape:
- `x-geo-city`
- `x-geo-region`
- `x-geo-country`

### 9. Posso customizar os mapeamentos?

**Sim**! Duas opções:

1. **Fork do repositório**:
   - Fork `metricasboss/gtm-templates`
   - Edite `data/estados.json` e `data/paises.json`
   - Altere a URL do CDN na configuração da variável

2. **Fallback interno**:
   - Edite o template `.tpl`
   - Modifique `ESTADOS_FALLBACK` e `PAISES_FALLBACK`

### 10. Quanto custa?

**Grátis**:
- Template: MIT License, uso livre
- jsDelivr: Ilimitado gratuito
- Cache local: Incluído no GTM Server-Side
- Fallback: Sempre disponível

**Custos opcionais**:
- GTM Server-Side: Cobrança padrão do Google Cloud (~$15-50/mês dependendo do volume)

### 11. É seguro enviar dados geográficos hasheados?

**Sim**. SHA256 é um hash unidirecional (não pode ser revertido). É o método recomendado por Facebook, Google, TikTok para GDPR/LGPD compliance.

**Exemplo:**
```
Entrada: "juizdefora"
SHA256: "8a9b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"

Não é possível reverter o hash para descobrir "juizdefora"
```

### 12. Posso usar em produção?

**Sim**! O template está pronto para produção:
- ✅ Testado com casos reais
- ✅ Fallback robusto
- ✅ Cache otimizado
- ✅ Zero dependência crítica
- ✅ Logs de debug para troubleshooting

## 📞 Suporte

### Canais

- **GitHub Issues**: [metricasboss/gtm-templates/issues](https://github.com/metricasboss/gtm-templates/issues)
- **Email**: suporte@metricasboss.com.br
- **Site**: https://metricasboss.com.br

### Informações para Suporte

Ao abrir um ticket, inclua:

1. **Versão do template**: (veja em ___INFO___ → version)
2. **Container GTM**: Server-Side
3. **Logs de debug**: Habilite debug e copie logs do console
4. **Headers recebidos**: x-geo-city, x-geo-region, x-geo-country
5. **Comportamento esperado vs real**

## 📄 Licença

MIT License - Uso livre para projetos comerciais e pessoais.

## 🏆 Créditos

Desenvolvido por **Métricas Boss**
Mantido pela comunidade brasileira de analytics e marketing.

---

**⭐ Se este template foi útil, considere dar uma estrela no GitHub!**

**🐛 Encontrou um bug? [Abra uma issue](https://github.com/metricasboss/gtm-templates/issues)**

**💡 Tem uma sugestão? [Contribua com o projeto](../../../CONTRIBUTING.md)**
