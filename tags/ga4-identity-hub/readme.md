# Google Analytics 4 Identity Hub

Um template para Google Tag Manager que extrai os identificadores client_id e session_id do Google Analytics 4 e os disponibiliza no dataLayer para uso em integrações e análises avançadas.

## Por que usar este template?

Recentemente notamos que o formato do cookie de sessão do GA4 mudou. O cookie (com nome _ga_MEASUREMENT-ID) agora apresenta uma estrutura diferente: contém um caractere "s", não usa mais pontos "." como separadores, e passou a utilizar "$" como delimitadores.

Um exemplo do novo formato é:

```
GS2.1.s1746549903$o1$g0$t1746549917$j60$l0$h841189436
```

Esta mudança pode impactar significativamente implementações que processam manualmente o session_id do GA4 através de cookies.

Em vez de extrair identificadores diretamente dos cookies (uma abordagem frágil que pode quebrar quando formatos mudam), este template usa a API oficial do Google Analytics 4 (gtag) para obter client_id e session_id de forma robusta.

## Como funciona

O template:
1. Acessa a função `gtag` mesmo quando implementada via GTM
2. Obtém o client_id e session_id de forma assíncrona
3. Disponibiliza os identificadores no dataLayer com um evento nomeado ('identity')

## Instalação

### Importando o template

1. Baixe o arquivo .tpl deste repositório
2. No GTM, navegue até **Templates > Tag Templates**
3. Clique em **New**
4. Clique no menu (**⋮**) e selecione **Import**
5. Selecione o arquivo .tpl baixado

### Configurando a tag

1. No GTM, crie uma nova tag
2. Na seção "Custom", selecione "Google Analytics 4 Identity Hub"
3. Configure o ID do Fluxo de Dados GA4 (formato G-XXXXXXXXXX)
4. Configure o acionador (recomendamos "All Pages" ou após o consentimento)

## Como usar os IDs

Após a execução da tag, os seguintes valores estarão disponíveis no dataLayer:

- `client_id`: O identificador único do usuário
- `session_id`: O identificador da sessão atual

Para acessá-los, crie variáveis da camada de dados:

1. **GA4 Client ID**: Caminho da variável `client_id`
2. **GA4 Session ID**: Caminho da variável `session_id`

Além disso, crie um gatilho para o evento `identity` para acionar outras tags que dependem desses identificadores.

## Casos de uso

- Integrações com CRM
- Rastreamento Cross-Domain
- Personalização baseada em usuário
- Atribuição avançada
- Análises de jornada do cliente

## Benefícios

- **Imunidade a mudanças de formato**: Funciona mesmo quando o Google altera o formato interno dos cookies
- **Manutenção reduzida**: Não é necessário atualizar expressões regulares ou lógica de parsing
- **Confiabilidade**: Valores obtidos diretamente da fonte oficial
- **Compatibilidade futura**: Abordagem alinhada com as APIs suportadas pelo Google

## Permissões

O template requer as seguintes permissões:
- Acesso a variáveis globais (gtag e dataLayer)
- Registro de logs (somente em modo de depuração)

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias.

## Licença

Este projeto está licenciado sob os termos da licença Apache 2.0 - veja o arquivo LICENSE para mais detalhes.

---

Criado com ❤️ por [Métricas Boss](https://metricasboss.com.br)
