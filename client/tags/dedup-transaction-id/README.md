# Tag de Desduplicação de Eventos de Compra

![Logo Métricas Boss](https://i.imgur.com/YourLogoHere.png)

## Descrição

Esta tag personalizada do Google Tag Manager foi desenvolvida para evitar a duplicação de eventos de compra em plataformas de análise como o Google Analytics 4. A tag salva o ID da transação nos cookies do usuário, permitindo identificar e bloquear transações duplicadas.

## Problema Resolvido

Em muitos sites de e-commerce, os eventos de compra podem ser disparados mais de uma vez durante o processo de checkout, resultando em:

- Dados de receita inflados
- Contagem incorreta de transações
- Métricas de conversão imprecisas

Esta tag impede que isso aconteça, garantindo que cada transação seja contabilizada apenas uma vez.

## Como Funciona

1. A tag captura o ID da transação da camada de dados
2. Armazena este ID nos cookies do navegador
3. Pode ser usada como condição para bloquear eventos duplicados

## Instalação

### Método 1: Importar template

1. Faça o download do arquivo JSON da tag
2. Acesse o Google Tag Manager > Templates > Template Gallery > "Import"
3. Selecione o arquivo JSON baixado
4. Clique em "Save"

### Método 2: Galeria de templates (em breve)

1. Acesse o Google Tag Manager > Templates > Template Gallery
2. Pesquise por "Desduplicação evento de compra"
3. Clique em "Add to workspace"

## Configuração

A configuração da tag é simples e requer apenas a definição da propriedade da camada de dados que contém o ID da transação:

1. No GTM, acesse "Tags" > "New" > "Tag Configuration"
2. Selecione a tag "Desduplicação evento de compra"
3. No campo "Adicione a propriedade da camada de dados que recebe o id da transação", insira a variável que contém o ID (exemplo: `ecommerce.transaction_id` ou `transactionId`)
4. Se deixar em branco, a tag buscará automaticamente a propriedade padrão `transaction_id`

## Configuração do Acionador

Recomendamos configurar esta tag para ser acionada em eventos de compra:

1. Configure um acionador do tipo "Custom Event"
2. Defina o evento como `purchase` ou o nome do seu evento de compra
3. Associe este acionador à tag

## Uso com Google Analytics 4

Para evitar duplicatas no GA4, configure suas tags de GA4 para verificar se o ID da transação já existe:

1. Crie uma variável de cookie que lê o cookie `transaction_id`
2. Adicione uma condição ao acionador da sua tag de GA4 que verifica se o ID da transação atual é diferente do armazenado no cookie

## Criação de Variável JS Personalizada para Filtrar o Acionador

É necessário criar uma variável JavaScript personalizada para verificar se a transação é nova. Siga estes passos:

1. No GTM, acesse "Variables" > "New" > "User-Defined Variables"
2. Selecione o tipo "Custom JavaScript"
3. Nomeie a variável como "isNewTransaction"
4. Insira o seguinte código:

```javascript
function() {
  return {{transaction_id}} != {{transaction_id_cookie}}
}
```

5. Clique em "Save"

Nota: É necessário ter previamente criado as variáveis:
- `transaction_id`: Variável da camada de dados que captura o ID atual da transação
- `transaction_id_cookie`: Variável de cookie que recupera o ID da transação armazenado

## Exemplo de Bloqueio de Duplicatas

Use a variável `isNewTransaction` criada anteriormente como condição em um acionador personalizado:

```javascript
// Configuração do acionador
Trigger Type: Custom Event
Event Name: purchase
This trigger fires on: Some Custom Events
Condition: {{isNewTransaction}} equals true
```

Alternativamente, você pode usar uma condição mais detalhada:

```javascript
// Exemplo de condição em um acionador personalizado
function() {
  var storedTransactionId = {{Cookie - transaction_id}};
  var currentTransactionId = {{DLV - ecommerce.transaction_id}};
  
  return !storedTransactionId || storedTransactionId !== currentTransactionId;
}
```

## Suporte

Para suporte ou dúvidas, entre em contato com nossa equipe através dos seguintes canais:

- Email: suporte@metricasboss.com.br
- Site: https://www.metricasboss.com.br

## Licença

Este template é licenciado sob os termos de serviço da Galeria de Templates da Comunidade do Google Tag Manager.

© 2025 Métricas Boss. Todos os direitos reservados.