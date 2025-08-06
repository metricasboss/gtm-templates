# GTM Templates - Métricas Boss

Coleção de templates customizados para Google Tag Manager desenvolvidos pela [Métricas Boss](https://metricasboss.com.br).

## 📦 Templates Disponíveis

### Client-side Tags

| Template | Descrição | Documentação |
|----------|-----------|--------------|
| **Behiivee Iframe Tracker** | Rastreamento de eventos em embeds do Behiivee (newsletter) | [📖 Ver docs](./client/tags/behiivee-iframe-tracker/README.md) |
| **Dedup Transaction ID** | Previne duplicação de eventos de compra/transação | [📖 Ver docs](./client/tags/dedup-transaction-id/README.md) |
| **GA4 Identity Hub** | Gerenciamento centralizado de client_id e session_id do GA4 | [📖 Ver docs](./client/tags/ga4-identity-hub/README.md) |
| **Iframe Tracker** | Rastreamento de eventos em iframes (ex: Adsense) | [📖 Ver docs](./client/tags/iframe-tracker/README.md) |
| **Panda Video** | Listener de eventos para player Panda Video | [📖 Ver docs](./client/tags/panda-video/README.md) |

### Client-side Variables

| Template | Descrição | Documentação |
|----------|-----------|--------------|
| **Get OrderForm VTEX IO Data** | Extração de dados do orderForm em lojas VTEX IO | [📖 Ver docs](./client/variables/get-orderform-vtexio-data/README.md) |

### Server-side Tags

| Template | Descrição | Documentação |
|----------|-----------|--------------|
| **RD Station Conversion API** | Integração com API de conversão do RD Station | [📖 Ver docs](./server/tags/rd-station-conversion-api/README.md) |

### Server-side Variables

| Template | Descrição | Documentação |
|----------|-----------|--------------|
| **FPID Cleaner** | Limpeza e validação de First-Party IDs | [📖 Ver docs](./server/variables/fpid-cleaner/README.md) |
| **Get LocalStorage Value** | Obtenção de valores do localStorage no servidor | [📖 Ver docs](./server/variables/get-localstorage-value/README.md) |

## 🚀 Como Usar

### Instalação Manual

1. Acesse seu container do Google Tag Manager
2. Vá em **Templates** → **New**
3. Clique nos três pontos no canto superior direito
4. Selecione **Import**
5. Escolha o arquivo `template.tpl` do template desejado
6. Salve o template

### Configuração

Cada template possui sua própria documentação com instruções detalhadas de configuração. Acesse a documentação específica através dos links na tabela acima.

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
gtm-templates/
├── client/             # Templates Web Container
│   ├── tags/          # Tags client-side
│   └── variables/     # Variáveis client-side
├── server/            # Templates Server Container
│   ├── tags/          # Tags server-side
│   └── variables/     # Variáveis server-side
├── docs/              # Documentação adicional
└── scripts/           # Scripts auxiliares
```

### Templates com Build

Alguns templates possuem JavaScript injetado que requer build:
- behiivee-iframe-tracker
- iframe-tracker
- panda-video

Para estes templates:

```bash
# Instalar dependências
pnpm install

# Build do JavaScript
pnpm run build

# Deploy para AWS S3 (requer configuração .env)
pnpm run deploy
```

### Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

**Métricas Boss** - [metricasboss.com.br](https://metricasboss.com.br)

---

Desenvolvido com ❤️ pela equipe Métricas Boss