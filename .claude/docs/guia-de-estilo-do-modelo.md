# Guia de Estilo do Modelo

Este guia de estilo foi criado para ajudar você a tomar decisões sobre como preparar modelos para a [Galeria de modelos da comunidade](https://support.google.com/tagmanager/answer/9454109?hl=pt-br). Ele tem como base os [princípios de escrita do Material Design do Google](https://material.io/design/communication/writing.html#principles).

## Princípios de Escrita

- Ser breve
- Escrever de forma simples e direta
- Falar com os usuários de forma clara
- Comunicar detalhes essenciais
- Escrever para todos os níveis de leitura
- Ser acessível: escreva para pessoas, não robôs

Siga essas diretrizes para ajudar os usuários a entender como usar seu modelo e garantir que todos os modelos tenham uma aparência consistente.

## Informações

Essas diretrizes são aplicáveis aos itens encontrados na guia **Informações** do editor de modelos.

### Nome

O nome do modelo é exibido em toda a interface do usuário do Gerenciador de tags e na Galeria de modelos da comunidade. Ele aparece na parte superior da página de detalhes de um modelo e também quando os modelos são listados.

**Diretrizes:**

- Use o nome da empresa/organização e o nome funcional do modelo: `Nome do modelo da Nome da empresa`
- Utilize letras maiúsculas no título
- Use termos que descrevem a funcionalidade
- Evite utilizar a palavra "Oficial" no nome dos modelos, a menos que você tenha autorização da organização relevante para fazer isso

**Exemplos:**
- Tag de avaliação de conversão da MinhaEmpresa
- Variável de ID da campanha da MinhaEmpresa

### Descrição

A descrição do modelo aparece nas páginas de detalhes como um breve resumo da funcionalidade do modelo.

**Diretrizes:**

- Use frases claras e concisas para descrever a finalidade de um modelo
- Defina com clareza como o modelo beneficia o usuário. Por exemplo: "O modelo Criador de públicos-alvo de Example.com ajuda você a criar novas listas de público-alvo com base nos visitantes do site"
- Evite usar jargões
- Inclua links para informações, documentação e suporte adicionais

### Ícone

O ícone do seu modelo é representado por uma miniatura quando exibido no Gerenciador de tags e na Galeria de modelos da comunidade.

**Requisitos:**

- Use imagens no formato PNG, JPEG ou GIF
- A imagem precisa ser quadrada, com pelo menos 48 x 48 pixels, e no máximo 96 x 96 pixels
- O arquivo precisa ter menos que 50 KB
- Evite usar logotipos oficiais da empresa, a menos que você tenha autorização da organização relevante para fazer isso

## Campos

Use a guia **Campos** do editor de modelos para adicionar elementos de formas, como entrada de texto, caixas de seleção etc.

### Nome do Parâmetro

Esse é o nome do campo que aparece no editor de modelos, não para o usuário. Os nomes precisam descrever os tipos de dado usados. Edite os nomes de parâmetros como `lowerCamelCase`.

**Exemplos:**
- `userName`
- `customerID`
- `shoppingCartValue`

### Etiquetas de Campo

As etiquetas de campo incluem campos de nome de exibição, texto da caixa de seleção e itens relacionados.

**Diretrizes:**

- Use letra maiúscula apenas na primeira palavra
- Quanto mais curto, melhor
- Utilize descrições
- Use palavras comuns

### Texto de Ajuda

Esse texto apresenta um conteúdo informativo e é exibido como uma dica para ajudar o usuário a inserir um valor válido no campo do modelo. Se possível, dê um exemplo e descreva como o campo é utilizado ou qual é o efeito ao inserir determinados valores.

**Diretrizes:**

- Use letra maiúscula apenas na primeira palavra
- Escreva de modo conciso, mas acessível. É aceitável utilizar abreviações e escrever na segunda pessoa (você)
- É possível usar formatação HTML básica. Exemplos: `<strong>`, `<em>`

## Tipos de Campo Compatíveis

| Tipo | Descrição |
|------|-----------|
| **Entrada de texto** | Entrada de texto. O valor de um parâmetro desse tipo no modelo será uma string que pode se referir a variáveis. O widget de entrada de texto renderizado no Gerenciador de tags pode ser um campo de texto de linha única ou uma entrada de várias linhas. |
| **Menu suspenso** | Um menu suspenso em que apenas um item pode ser selecionado como o valor do parâmetro do modelo. Organize os itens em ordem alfabética, a menos que haja um bom motivo para não fazer isso. |
| **Caixa de seleção** | Entrada da caixa de seleção. O valor de um parâmetro desse tipo no modelo será booleano: "true" para selecionado, "false" para não selecionado. |
| **Botão de opção** | Entrada de opção. Um parâmetro desse tipo no modelo apresenta uma lista de opções no Gerenciador de tags. O usuário só pode escolher uma como o valor do parâmetro do modelo. |
| **Tabela simples** | Uma entrada de tabela simples. É possível editar todas as células da tabela no local, e elas podem ser de dois tipos: uma entrada de texto ou um menu suspenso. O valor de um parâmetro desse tipo no modelo é uma matriz de objetos: cada objeto codifica uma linha, cada chave no objeto precisa ser um dos nomes de coluna, e cada valor no objeto é o valor da célula correspondente. |

---

**Fonte**: [Google Tag Manager Templates - Guia de estilo do modelo](https://developers.google.com/tag-platform/tag-manager/templates/style?hl=pt-br)

Licença: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
