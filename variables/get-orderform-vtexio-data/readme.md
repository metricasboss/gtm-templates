# Variável VTEX OrderForm para Google Tag Manager

## Visão Geral
Esta variável personalizada recupera o objeto orderForm da VTEX do localStorage. O orderForm contém itens do carrinho, informações de envio, descontos e totais - dados essenciais para implementações de rastreamento e personalizações em tempo real do checkout.

## Recursos
- Acesso direto aos dados do orderForm da VTEX sem depender de eventos da camada de dados
- Retorna o objeto orderForm completo para uso em suas tags e gatilhos do GTM
- Realiza parsing e validação de JSON
- Comportamento de fallback quando o orderForm não está disponível

## Instalação
1. No Google Tag Manager, navegue até **Modelos** na barra lateral esquerda
2. Clique em **Novo** na seção "Modelos de variável"
3. Copie e cole o código do template
4. Salve o modelo

## Uso
Após instalar o template:
1. Vá para **Variáveis** > **Variáveis definidas pelo usuário**
2. Clique em **Nova**
3. Selecione seu template personalizado na tela de Configuração de variável
4. Nomeie sua variável (ex: "VTEX OrderForm")
5. Salve a variável

Agora você pode referenciar os dados do orderForm em suas tags usando `{{VTEX OrderForm}}`.

## Casos de Uso Comuns
- Acessar itens do carrinho: `{{VTEX OrderForm}}.items`
- Obter o total do carrinho: `{{VTEX OrderForm}}.value`
- Verificar endereço de entrega: `{{VTEX OrderForm}}.shippingData`
- Validar promoções aplicadas: `{{VTEX OrderForm}}.marketingData`

## Permissões
Este template requer:
- `access_local_storage`: Para ler a chave "orderform" do localStorage
- `logging`: Para fins de depuração

## Observações
- Funciona com lojas VTEX IO que usam localStorage para dados do orderForm
- Requer configuração adequada da loja VTEX para salvar o orderForm no localStorage
- Trata tipos de dados JSON válidos e não-JSON

## Suporte
Para problemas, dúvidas ou contribuições, entre em contato com o autor do template.