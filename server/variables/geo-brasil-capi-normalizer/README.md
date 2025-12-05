# Geo Brasil CAPI Normalizer

Template de variável Server-Side para Google Tag Manager que normaliza dados geográficos brasileiros (cidade, estado, país) para formato compatível com APIs de conversão (Facebook CAPI, Google Ads, TikTok, etc.).

## 🚀 Recursos

- ✅ **Normalização simples e eficaz**: converte para minúsculas e remove espaços
- ✅ **Geração SHA256 nativa**: hash pronto para Facebook/Meta CAPI
- ✅ **Leitura automática de headers**: integração direta com Stape (x-geo-*)
- ✅ **Suporte a valores customizados**: use dados de qualquer fonte
- ✅ **Zero dependências**: sem chamadas externas, extremamente rápido
- ✅ **Leve**: apenas ~50 linhas de código

## 📦 Instalação

### 1. Importar o Template

1. Acesse seu **GTM Server-Side Container**
2. Vá em **Templates** → **Variáveis** → **Novo**
3. Clique no menu (⋮) → **Importar**
4. Selecione o arquivo `template.tpl`
5. Clique em **Salvar**

### 2. Criar Variáveis

Crie uma variável para cada campo que precisar:

| Nome da Variável | Tipo de Saída | Uso |
|------------------|---------------|-----|
| `Geo - City` | city | Cidade normalizada |
| `Geo - City SHA256` | city_sha256 | Cidade em SHA256 para CAPI |
| `Geo - State` | state | Estado normalizado |
| `Geo - State SHA256` | state_sha256 | Estado em SHA256 para CAPI |
| `Geo - Country` | country | País normalizado |
| `Geo - Country SHA256` | country_sha256 | País em SHA256 para CAPI |
| `Geo - Full Object` | full_object | Objeto com todos os campos |

## 📝 Exemplos de Uso

### Facebook Conversion API (CAPI)

```javascript
// Na sua tag Facebook CAPI
{
  "user_data": {
    "ct": "{{Geo - City SHA256}}",
    "st": "{{Geo - State SHA256}}",
    "country": "{{Geo - Country SHA256}}"
  }
}
```

### Google Ads Enhanced Conversions

```javascript
// Na sua tag Google Ads
{
  "user_address": {
    "city": "{{Geo - City}}",
    "region": "{{Geo - State}}",
    "country": "{{Geo - Country}}"
  }
}
```

### TikTok Events API

```javascript
// Na sua tag TikTok
{
  "user": {
    "city": "{{Geo - City SHA256}}",
    "state": "{{Geo - State SHA256}}",
    "country": "{{Geo - Country SHA256}}"
  }
}
```

## 🔧 Como Funciona

### Entrada de Dados

Por padrão, o template lê automaticamente os headers HTTP fornecidos pela Stape:

- `x-geo-city` → Cidade do usuário
- `x-geo-region` → Estado/região do usuário
- `x-geo-country` → País do usuário

### Processamento

A função `cleanString()` aplica:

1. **Conversão para minúsculas**: `"São Paulo"` → `"são paulo"`
2. **Remoção de espaços**: `"são paulo"` → `"sãopaulo"`

### Saída de Dados

**Exemplo de entrada:**
```
Cidade: "São Paulo"
Estado: "SP"
País: "Brasil"
```

**Exemplo de saída:**
```javascript
{
  city: "sãopaulo",
  city_sha256: "a1b2c3d4...",
  state: "sp",
  state_sha256: "e5f6g7h8...",
  country: "brasil",
  country_sha256: "i9j0k1l2..."
}
```

## ⚙️ Configurações

### Fonte dos Dados

#### Headers HTTP (Padrão)
Lê automaticamente dos headers `x-geo-*` fornecidos pela Stape.

```javascript
// Configuração: dataSource = "headers"
// Lê automaticamente:
// - x-geo-city
// - x-geo-region
// - x-geo-country
```

#### Valores Customizados
Use quando quiser passar valores de outras fontes (variáveis, dataLayer, etc).

```javascript
// Configuração: dataSource = "custom"
customCity: "{{DLV - City}}"
customState: "{{DLV - State}}"
customCountry: "{{DLV - Country}}"
```

## 🎯 Casos de Uso

### 1. Facebook CAPI com dados da Stape
```javascript
// Crie variáveis:
// - Geo - City SHA256 (city_sha256)
// - Geo - State SHA256 (state_sha256)
// - Geo - Country SHA256 (country_sha256)

// Use na tag Facebook CAPI
{
  "user_data": {
    "ct": "{{Geo - City SHA256}}",
    "st": "{{Geo - State SHA256}}",
    "country": "{{Geo - Country SHA256}}"
  }
}
```

### 2. Google Ads com dados customizados
```javascript
// Configure a variável para usar dataSource = "custom"
// customCity: "{{User City}}"
// customState: "{{User State}}"
// customCountry: "{{User Country}}"

// Use na tag Google Ads
{
  "user_address": {
    "city": "{{Geo - City}}",
    "region": "{{Geo - State}}",
    "country": "{{Geo - Country}}"
  }
}
```

### 3. Objeto completo para processamento customizado
```javascript
// Crie variável com outputType = "full_object"
// Retorna:
{
  city: "saopaulo",
  city_sha256: "a1b2c3...",
  state: "sp",
  state_sha256: "e5f6g7...",
  country: "brasil",
  country_sha256: "i9j0k1..."
}

// Use em variáveis JavaScript customizadas
function() {
  var geo = {{Geo - Full Object}};
  return geo.city + ', ' + geo.state;
}
```

## 🌍 Compatibilidade

O template é compatível com:

- ✅ **Facebook Conversion API (CAPI)**
- ✅ **Google Ads Enhanced Conversions**
- ✅ **TikTok Events API**
- ✅ **Snapchat Conversions API**
- ✅ **Pinterest Conversions API**
- ✅ **LinkedIn Conversions API**
- ✅ **Twitter Conversions API**
- ✅ Qualquer API que aceite dados geográficos normalizados

## 🔒 Privacidade e Segurança

- ✅ **SHA256 local**: hash gerado dentro do GTM, dados não enviados para serviços externos
- ✅ **Sem tracking**: não coleta, armazena ou envia dados para terceiros
- ✅ **Sem dependências externas**: não faz chamadas HTTP para APIs ou CDNs
- ✅ **LGPD/GDPR compliant**: processa apenas dados necessários

## 🚀 Performance

- **Velocidade**: < 1ms por execução
- **Tamanho**: ~10KB (template completo)
- **Dependências**: Zero
- **Chamadas externas**: Nenhuma

## 📋 Requisitos

- Google Tag Manager Server-Side
- Container Server-Side ativo
- Headers `x-geo-*` disponíveis (se usar modo padrão) ou dados customizados

## 🐛 Troubleshooting

### Variável retorna vazio

**Problema**: A variável retorna string vazia.

**Solução**:
1. Verifique se os headers `x-geo-*` estão disponíveis (modo Preview)
2. Se usar modo custom, verifique se as variáveis customizadas têm valores
3. Ative o modo Preview do GTM e inspecione a variável

### SHA256 não está funcionando

**Problema**: O campo `*_sha256` retorna vazio.

**Solução**:
1. Verifique se o campo base (city, state, country) tem valor
2. O SHA256 só é gerado se houver valor no campo base
3. Use o campo base primeiro para validar os dados

### Acentos não são removidos

**Observação**: O template **mantém propositalmente os acentos**.

Por quê?
- Algumas APIs (como Facebook CAPI) aceitam acentos e os normalizam internamente
- Preservar acentos mantém maior precisão dos dados
- O SHA256 funciona perfeitamente com caracteres UTF-8

Se precisar remover acentos, você pode:
1. Fazer um pré-processamento antes de passar para o template
2. Ou criar uma variável JavaScript customizada que processe a saída

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Apache 2.0 License - Veja [LICENSE](../../LICENSE) para mais detalhes.

## 👥 Autor

**Métricas Boss**
- 🌐 Site: [metricasboss.com.br](https://metricasboss.com.br)
- 📧 Email: suporte@metricasboss.com.br
- 💼 GitHub: [@metricasboss](https://github.com/metricasboss)

## 🙏 Agradecimentos

- Comunidade GTM Server-Side
- Stape.io pela infraestrutura de headers geo
- Meta/Facebook pela documentação CAPI

## 📚 Links Úteis

- [Documentação GTM Server-Side](https://developers.google.com/tag-platform/tag-manager/server-side)
- [Facebook Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Google Ads Enhanced Conversions](https://support.google.com/google-ads/answer/11062876)
- [Stape.io Documentation](https://stape.io/docs)

---

**💡 Dica**: Para melhores resultados, combine este template com outras variáveis de normalização (email, telefone, nome) para criar payloads completos para suas APIs de conversão.
