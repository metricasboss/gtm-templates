# EqualWeb Accessibility - Tag GTM

Template de tag do Google Tag Manager para injetar o widget de acessibilidade EqualWeb no seu site.

## 📋 Sobre o EqualWeb

[EqualWeb](https://www.equalweb.com/) é uma solução de acessibilidade digital que ajuda sites a se tornarem acessíveis para pessoas com deficiências, atendendo aos padrões WCAG, ADA, e outras diretrizes de acessibilidade.

### Recursos do Widget

- 🦻 Leitor de tela integrado
- 🔍 Ampliação de texto e zoom
- 🎨 Ajuste de contraste e cores
- ⌨️ Navegação por teclado
- 🌐 Suporte multilíngue
- 📱 Responsivo (mobile e desktop)
- ⚡ Configuração sem necessidade de alteração de código

## ⚙️ Configuração

### Campos Obrigatórios

#### Site Key
- **Descrição**: Chave única do seu site fornecida pela EqualWeb
- **Formato**: String alfanumérica (32 caracteres)
- **Exemplo**: `48064a4eaad095ceea7cd979ce5cd196`
- **Como obter**: Solicite ao suporte da EqualWeb ou encontre no painel administrativo

### Configurações Avançadas (Opcional)

#### Widget Position
- **Opções**: `Left` (Esquerda) ou `Right` (Direita)
- **Padrão**: `Left`
- **Descrição**: Define em qual lado da tela o widget será exibido

#### Menu Language
- **Opções**:
  - `PT` - Português
  - `EN` - English
  - `ES` - Español
- **Padrão**: `PT`
- **Descrição**: Idioma do menu de acessibilidade

#### Allow Drag Widget
- **Tipo**: Checkbox
- **Padrão**: ✅ Ativado
- **Descrição**: Permite que usuários arrastem o widget pela tela

#### Vertical Position
- **Formato**: Porcentagem ou pixels (ex: `80%`, `100px`)
- **Padrão**: `80%`
- **Descrição**: Posição vertical do botão na tela

#### Button Scale
- **Formato**: Número de 0.1 a 2.0
- **Padrão**: `0.5`
- **Descrição**: Escala do botão (0.5 = metade do tamanho original)

#### Main Color
- **Formato**: Código hexadecimal (ex: `#000000`)
- **Padrão**: `#000000` (preto)
- **Descrição**: Cor principal do botão

#### Secondary Color
- **Formato**: Código hexadecimal (ex: `#ffffff`)
- **Padrão**: `#ffffff` (branco)
- **Descrição**: Cor secundária do botão (ícone)

#### Icon Type
- **Opções**: `Type 1`, `Type 2`, `Type 3`
- **Padrão**: `Type 1`
- **Descrição**: Estilo visual do ícone de acessibilidade

#### Icon Shape
- **Opções**: `Circle` (Círculo) ou `Square` (Quadrado)
- **Padrão**: `Circle`
- **Descrição**: Forma do botão

#### Show Icon Outline
- **Tipo**: Checkbox
- **Padrão**: ❌ Desativado
- **Descrição**: Adiciona contorno ao redor do ícone

#### Outline Color
- **Formato**: Código hexadecimal (ex: `#ffffff`)
- **Padrão**: `#ffffff` (branco)
- **Disponível**: Apenas quando "Show Icon Outline" está ativado
- **Descrição**: Cor do contorno do ícone

### Rastreamento de Eventos

#### Enable Event Tracking
- **Tipo**: Checkbox
- **Padrão**: ✅ Ativado
- **Descrição**: Rastreia interações do usuário com recursos de acessibilidade e envia eventos para dataLayer
- **Recomendação**: Manter ativado para análise de uso e conformidade

#### Event Prefix
- **Formato**: String (alfanumérica, sem espaços)
- **Padrão**: `equalweb`
- **Disponível**: Apenas quando "Enable Event Tracking" está ativado
- **Descrição**: Prefixo adicionado aos nomes dos eventos
- **Exemplo**: Com prefixo `equalweb`, os eventos serão `equalweb_feature_changed`, `equalweb_initial_state`

#### Enable Debug Logs
- **Tipo**: Checkbox
- **Padrão**: ❌ Desativado
- **Descrição**: Ativa logs no console do navegador para debug

## 📈 Rastreamento de Eventos

### Como Funciona

Este template usa **interceptação de métodos** para rastrear todas as interações do usuário com o widget EqualWeb. Quando o script EqualWeb carrega, o nosso código de tracking intercepta os métodos do objeto `window.interdeal` e envia eventos para o dataLayer sempre que o usuário ativa ou desativa recursos de acessibilidade.

### Estrutura dos Eventos

Todos os eventos seguem esta estrutura padronizada:

```javascript
{
  event: 'accessibility_interaction',           // Nome do evento (configurável)
  accessibility_action: 'setTextReader',        // Método chamado
  accessibility_category: 'accessibility_reading', // Categoria do recurso
  accessibility_label: 'Leitor de Texto',       // Nome amigável
  accessibility_value: null,                    // Valor quando aplicável
  accessibility_state: 'activated',             // 'activated' ou 'deactivated'
  accessibility_method: 'setTextReader',        // Método original
  accessibility_timestamp: 1702649850123        // Timestamp Unix
}
```

### Eventos Rastreados

#### 🎯 Perfis de Acessibilidade (`accessibility_profile`)

Perfis otimizam múltiplos recursos de uma vez para necessidades específicas:

| Método | Label | Descrição |
|--------|-------|-----------|
| `setBlindness` | Cegueira | Perfil otimizado para cegos |
| `setMotorSkillsDisorders` | Problemas Motores | Perfil para deficiências motoras |
| `setColorBlindness` | Daltonismo | Perfil para daltônicos |
| `setVisuallyImpaired` | Baixa Visão | Perfil para baixa visão |
| `setEpilepsyProfile` | Epilepsia | Perfil seguro para epilepsia |
| `setAdhd` | TDAH | Perfil para TDAH |
| `setLearningAndReading` | Dificuldade Leitura | Perfil para dificuldades de leitura |
| `setElders` | Idosos | Perfil otimizado para idosos |
| `setDyslexia` | Dislexia | Perfil para disléxicos |
| `setWebsiteAdaCompliant` | Conformidade ADA | Modo de conformidade ADA |

**Exemplo de evento:**
```javascript
{
  event: 'accessibility_interaction',
  accessibility_action: 'setDyslexia',
  accessibility_category: 'accessibility_profile',
  accessibility_label: 'Dislexia',
  accessibility_state: 'activated',
  accessibility_timestamp: 1702649850123
}
```

#### 📖 Recursos de Leitura (`accessibility_reading`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `setTextReader` | Leitor de Texto | Lê o texto em voz alta |
| `setVoiceCommands` | Comandos de Voz | Controle por voz |
| `setReadGuide` | Guia de Leitura | Linha guia para leitura |
| `setDictionary` | Dicionário | Dicionário integrado |
| `setSummarize` | Resumir Conteúdo | Resume textos longos |
| `setReadableFont` | Fonte Legível | Fonte otimizada para leitura |

#### 👁️ Recursos Visuais (`accessibility_visual`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `setColorScheme` | Esquema de Cores | Muda esquema de cores (valores: `blackwhite`, `whiteblack`, `monochrome`, `highHue`, `lowHue`) |
| `setFontSize` | Tamanho Fonte | Ajusta tamanho da fonte |
| `setZoom` | Zoom | Amplia a página |
| `settextmagnifier` | Lupa de Texto | Lupa para texto específico |
| `setHighlight` | Destacar Links/Títulos | Destaca elementos importantes |
| `setAltText` | Texto Alternativo | Mostra textos alternativos |

**Exemplo com valor:**
```javascript
{
  event: 'accessibility_interaction',
  accessibility_action: 'setColorScheme',
  accessibility_category: 'accessibility_visual',
  accessibility_label: 'Esquema de Cores: Alto Contraste',
  accessibility_value: 'highHue',
  accessibility_state: 'activated',
  accessibility_timestamp: 1702649850123
}
```

#### 🖱️ Cursor e Foco (`accessibility_cursor`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `setBigCursor` | Cursor Grande | Aumenta tamanho do cursor |
| `setfocusMode` | Modo de Foco | Destaca elemento em foco |
| `setHighlightButtons` | Destacar Botões | Destaca todos os botões |
| `setEnlargeButtons` | Ampliar Botões | Aumenta tamanho dos botões |
| `setFlyingFocus` | Foco Visual | Indicador visual de foco |

#### ⌨️ Navegação (`accessibility_navigation`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `setVirtualKeyboard` | Teclado Virtual | Teclado na tela |
| `setNavigation` | Navegação Teclado | Navegação otimizada por teclado |
| `setPagemap` | Mapa da Página | Mapa de estrutura da página |
| `setShortcutMenu` | Atalhos | Menu de atalhos de teclado |

#### 🎬 Mídia (`accessibility_media`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `setMuteMedia` | Silenciar Mídia | Silencia vídeos e áudios |
| `setSubtitles` | Legendas | Ativa legendas em vídeos |

#### ⚠️ Segurança (`accessibility_safety`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `setEpilepsy` | Modo Epilepsia | Remove animações piscantes |

#### 📋 Controles do Menu (`accessibility_menu`)

| Método | Label | Descrição |
|--------|-------|-----------|
| `ShowMenu` | Abrir Menu | Abre o menu de acessibilidade |
| `CloseMenu` | Fechar Menu | Fecha o menu |
| `switchOff` | Desativar Tudo | Desativa todos os recursos |
| `expandMenu` | Expandir Menu | Expande o menu completo |
| `hideA11yButton` | Ocultar Botão | Oculta o botão de acessibilidade |

#### 🔧 Eventos do Sistema (`accessibility_system`)

| Evento | Label | Descrição |
|--------|-------|-----------|
| `widget_initialized` | EqualWeb Tracking Ativo | Widget inicializado com sucesso |
| `data_loaded` | Dados de acessibilidade carregados | Dados do usuário carregados |
| `menu_ready` | Menu de acessibilidade pronto | Menu construído e pronto |
| `button_click` | Abrir/Fechar Menu (botão) | Clique no botão de acessibilidade |
| `language_changed` | Idioma alterado | Usuário mudou o idioma do menu |

**Exemplo de evento de inicialização:**
```javascript
{
  event: 'accessibility_interaction',
  accessibility_action: 'widget_initialized',
  accessibility_category: 'accessibility_system',
  accessibility_label: 'EqualWeb Tracking Ativo',
  accessibility_version: '5.2.0',
  accessibility_sitekey: '48064a4eaad095ceea7cd979ce5cd196',
  accessibility_lang: 'PT',
  accessibility_position: 'left',
  accessibility_intercepted_methods: 45,
  accessibility_timestamp: 1702649850123
}
```

### Integração com Google Analytics 4

#### Configuração no GTM

1. **Criar variáveis de dataLayer** (opcional, para facilitar):

   Vá em **Variáveis → Nova → Variável da camada de dados**

   - Nome: `DLV - accessibility_action`
   - Nome da variável: `accessibility_action`

   Repita para criar as seguintes variáveis:
   - `DLV - accessibility_category` → `accessibility_category`
   - `DLV - accessibility_label` → `accessibility_label`
   - `DLV - accessibility_value` → `accessibility_value`
   - `DLV - accessibility_state` → `accessibility_state`

2. **Criar tag GA4 - Evento**:

   Vá em **Tags → Nova**

   - Tipo: **Google Analytics: Evento GA4**
   - Tag de configuração: `{{GA4 Config Tag}}`
   - Nome do evento: `accessibility_interaction`

   **Parâmetros do evento**:
   | Nome do Parâmetro | Valor |
   |-------------------|-------|
   | `action` | `{{DLV - accessibility_action}}` |
   | `category` | `{{DLV - accessibility_category}}` |
   | `label` | `{{DLV - accessibility_label}}` |
   | `value` | `{{DLV - accessibility_value}}` |
   | `state` | `{{DLV - accessibility_state}}` |

3. **Criar acionador**:

   Vá em **Acionadores → Novo**

   - Tipo: **Evento personalizado**
   - Nome do evento: `accessibility_interaction`
   - Ativar em: **Todos os eventos personalizados**

#### Análises no GA4

Com os eventos configurados, você poderá:

**1. Recursos Mais Utilizados**
- Relatório: **Eventos → accessibility_interaction**
- Dimensão secundária: **Parâmetro do evento: `label`**
- Métricas: Contagem de eventos
- Filtro: **Parâmetro: `state` = `activated`**

**2. Taxa de Adoção de Acessibilidade**
```
% usuários = (Usuários com evento accessibility_interaction / Total de usuários) × 100
```

**3. Análise por Categoria**
- Relatório: **Eventos → accessibility_interaction**
- Dimensão secundária: **Parâmetro do evento: `category`**
- Você verá: `accessibility_profile`, `accessibility_reading`, `accessibility_visual`, etc.

**4. Segmentação de Público**

Crie segmentos no GA4 baseados no parâmetro `action`:
- **Usuários com necessidades visuais**: Ativaram `setTextReader`, `setZoom`, `setColorScheme`
- **Usuários com perfis específicos**: Ativaram `setDyslexia`, `setAdhd`, `setEpilepsyProfile`
- **Power users**: Ativaram 5+ ações diferentes

**5. Análise de Jornada**
- **Exploração → Funil**: Compare jornadas de usuários que usam vs não usam acessibilidade
- **Exploração → Fluxo de Usuários**: Veja quais recursos são usados em sequência

### Testando o Rastreamento

#### 1. No Console do Navegador

1. Ative "Enable Debug Logs" na configuração da tag
2. Abra o Console (F12 → Console)
3. Aguarde o carregamento do widget
4. Você verá logs como:
   ```
   [EqualWeb] Iniciando tag EqualWeb...
   [EqualWeb] Widget config: {...}
   [EqualWeb] EqualWeb carregado com sucesso
   [EqualWeb Tracking] EqualWeb Tracking Script carregado
   [EqualWeb Tracking] EqualWeb detectado após X tentativas
   [EqualWeb Tracking] Método interceptado: setTextReader
   [EqualWeb Tracking] Método interceptado: setDyslexia
   ...
   [EqualWeb Tracking] Total de métodos interceptados: 45
   ```

5. Interaja com o widget EqualWeb (ative um recurso)
6. Você verá:
   ```
   [EqualWeb Tracking] Event pushed: {
     event: "accessibility_interaction",
     accessibility_action: "setTextReader",
     accessibility_category: "accessibility_reading",
     accessibility_label: "Leitor de Texto",
     accessibility_state: "activated",
     accessibility_timestamp: 1702649850123
   }
   ```

#### 2. Verificando dataLayer

No Console, digite:
```javascript
dataLayer
```

Procure por objetos como:
```javascript
{
  event: "accessibility_interaction",
  accessibility_action: "setTextReader",
  accessibility_category: "accessibility_reading",
  accessibility_label: "Leitor de Texto",
  accessibility_state: "activated",
  accessibility_method: "setTextReader",
  accessibility_timestamp: 1702649850123,
  "gtm.uniqueEventId": 123
}
```

#### 3. No Preview Mode do GTM

1. Ative o **Preview Mode** do GTM
2. Recarregue a página
3. Aguarde o widget carregar
4. No painel de debug do GTM, vá em **Data Layer**
5. Procure pelo evento `accessibility_interaction`
6. Clique no evento para ver todos os parâmetros
7. Interaja com recursos do EqualWeb e veja novos eventos aparecendo em tempo real
8. Verifique se todas as variáveis estão sendo populadas corretamente

### Casos de Uso

#### 1. Conformidade Legal (WCAG, LBI, ADA)

Use os eventos para documentar que seu site oferece recursos de acessibilidade e que os usuários estão utilizando-os. Isso pode ajudar em auditorias de conformidade.

**Exemplo de relatório:**
```
Total de sessões: 10.000
Sessões com uso de acessibilidade: 450 (4.5%)

Recursos mais utilizados:
- Leitor de Texto (setTextReader): 280 ativações
- Dislexia (setDyslexia): 145 ativações
- Zoom (setZoom): 98 ativações
- Alto Contraste (setColorScheme): 87 ativações

Perfis mais usados:
- Dislexia: 145 usuários
- Baixa Visão: 92 usuários
- Idosos: 67 usuários
```

**Benefícios para Conformidade:**
- ✅ Demonstra que recursos de acessibilidade estão disponíveis
- ✅ Prova que usuários estão usando os recursos
- ✅ Identifica quais necessidades são mais comuns no seu público
- ✅ Fornece dados concretos para relatórios de acessibilidade

#### 2. Otimização de UX

Analise quais recursos são mais usados para:
- **Melhorar a experiência**: Se muitos usuários ativam "Fonte Legível", considere melhorar a tipografia nativa do site
- **Priorizar desenvolvimento**: Recursos muito usados podem ser implementados nativamente no site
- **Identificar páginas críticas**: Veja em quais páginas mais usuários ativam recursos de acessibilidade
- **Detectar problemas**: Alto uso de "Alto Contraste" pode indicar problema com cores do site

**Exemplo de análise:**
```
Página /checkout:
- 15% dos usuários ativam recursos de acessibilidade
- 80% destes ativam "Destacar Botões"
→ Ação: Melhorar contraste e tamanho dos botões no checkout
```

#### 3. Análise de Retenção e Conversão

Compare métricas entre usuários que usam vs não usam acessibilidade:

| Métrica | Sem Acessibilidade | Com Acessibilidade | Diferença |
|---------|-------------------|-------------------|-----------|
| Taxa de rejeição | 45% | 38% | -7% ✅ |
| Tempo na página | 2:15 | 3:42 | +1:27 ✅ |
| Taxa de conversão | 2.1% | 3.8% | +1.7% ✅ |
| Páginas por sessão | 3.2 | 4.7 | +1.5 ✅ |

**Insights:**
- Usuários com acessibilidade habilitada tendem a ter **maior engajamento**
- Investir em acessibilidade pode **aumentar conversões**
- Sites acessíveis beneficiam **todos os usuários**, não apenas PcD

#### 4. Personalização da Experiência

Use os dados para criar experiências personalizadas:

```javascript
// Detectar se usuário usa leitor de tela
if (userActivated('setTextReader')) {
  // Simplificar navegação
  // Adicionar mais conteúdo descritivo
  // Priorizar conteúdo textual sobre visual
}

// Detectar perfil de dislexia
if (userActivated('setDyslexia')) {
  // Manter fonte legível por padrão nas próximas visitas
  // Simplificar layouts complexos
  // Usar mais espaçamento
}
```

#### 5. Segmentação de Marketing

Crie audiências no GA4 e use em campanhas:

- **Audiência "Usuários com necessidades visuais"**: Para promover produtos com boas descrições e alternativas textuais
- **Audiência "Usuários sêniores"**: Para campanhas com linguagem clara e fontes maiores
- **Audiência "Usuários power"**: Que usam 5+ recursos, podem ser early adopters de novas features de acessibilidade

## 📊 Como Usar

### 1. Obter Credenciais EqualWeb

1. Acesse o painel da [EqualWeb](https://www.equalweb.com/)
2. Obtenha sua **Site Key**
3. Guarde essa informação em local seguro

### 2. Hospedar o Script de Tracking

⚠️ **Importante**: Você precisa hospedar o arquivo `equal-web.js` em um CDN ou bucket S3

1. Navegue até `client/tags/equalweb/inject-script/`
2. Configure suas credenciais AWS no `.env`
3. Execute:
   ```bash
   pnpm install
   pnpm run build
   pnpm run deploy
   ```
4. Anote a URL do script hospedado (ex: `https://seu-bucket.s3.amazonaws.com/equal-web.js`)
5. Edite o arquivo `template.tpl` na linha 324 e substitua a URL

### 3. Criar Tag no GTM

1. Importe o template `template.tpl` no GTM:
   - Vá em **Templates → Novas tags → Importar**
   - Selecione o arquivo `template.tpl`
   - Clique em **Salvar**

2. Crie uma nova tag:
   - Vá em **Tags → Nova**
   - Selecione **EqualWeb Accessibility Widget + Tracking** (Métricas Boss)
   - Preencha o campo obrigatório: **Site Key**
   - Configure opcionalmente o visual, comportamento e tracking
   - Salve a tag

### 4. Configurar Acionador

**Recomendado**:
- Acionador: `All Pages` (Todas as páginas)
- Tipo: `Page View`

Isso garante que o widget esteja disponível em todo o site.

### 5. Testar

1. Ative o **Preview Mode** do GTM
2. Navegue pelo site
3. Abra o **Console do navegador** (F12)
4. Ative "Enable Debug Logs" na tag e recarregue
5. Verifique os logs:
   ```
   [EqualWeb] Iniciando tag EqualWeb...
   [EqualWeb] EqualWeb carregado com sucesso
   [EqualWeb Tracking] EqualWeb Tracking Script carregado
   [EqualWeb Tracking] Total de métodos interceptados: 45
   ```
6. Verifique se o widget EqualWeb aparece no canto da tela
7. Interaja com recursos de acessibilidade e veja eventos no dataLayer
8. Confirme que eventos aparecem no painel de debug do GTM

### 6. Publicar

Publique a versão do container após validar que tudo funciona.

## 🎨 Exemplos de Configuração

### Configuração Padrão (Minimalista)
```
Site Key: 48064a4eaad095ceea7cd979ce5cd196
Position: Left
Language: PT
Draggable: ✅
Vertical Position: 50%
Scale: 1
Main Color: #1876c9
Secondary Color: #ffffff
Icon: Type 1, Circle
Tracking: ✅ Todos habilitados
```

### Configuração Personalizada (Marca)
```
Site Key: sua-chave-aqui
Position: Right
Language: PT
Draggable: ✅
Vertical Position: 90%
Scale: 0.7
Main Color: #1E88E5 (azul da marca)
Secondary Color: #FFFFFF
Icon: Type 2, Circle
Outline: ✅
Outline Color: #FFFFFF
Tracking: ✅ Perfis, Features e Menu
Event Name: accessibility_interaction
```

### Configuração Discreta
```
Site Key: sua-chave-aqui
Position: Left
Language: PT
Draggable: ❌
Vertical Position: 95%
Scale: 0.4
Main Color: #757575 (cinza)
Secondary Color: #FFFFFF
Icon: Type 1, Circle (Padrão)
Outline: ❌
Tracking: ✅ Apenas Features e Menu
```

## 🔧 Troubleshooting

### Widget não aparece

**Possíveis causas**:
1. **Site Key incorreta**: Verifique se copiou a chave completa
2. **Bloqueador de ads**: Alguns adblockers bloqueiam scripts de terceiros
3. **GTM não disparou**: Verifique no Preview Mode se a tag disparou
4. **CSP (Content Security Policy)**: Seu site pode estar bloqueando scripts externos
5. **Script EqualWeb não carregou**: Problema de rede ou CDN da EqualWeb

**Solução**:
- Ative "Enable Debug Logs" e verifique erros no console
- Procure por `[EqualWeb] Falha ao carregar EqualWeb`
- Teste em modo anônimo (sem extensões)
- Verifique as permissões CSP do site
- Teste a URL do script EqualWeb diretamente no navegador: `https://cdn.equalweb.com/core/5.2.0/accessibility.js`

### Widget aparece mas tracking não funciona

**Possíveis causas**:
1. **Script de tracking não hospedado**: Você não fez o build/deploy do `equal-web.js`
2. **URL do tracking incorreta**: A URL na linha 324 do `template.tpl` está errada
3. **Permissões S3**: Bucket S3 não está público ou CORS não configurado
4. **Script não injetado**: Tag GTM não conseguiu injetar o script de tracking

**Solução**:
1. Verifique no console se aparece:
   ```
   [EqualWeb Tracking] EqualWeb Tracking Script carregado
   ```
2. Se não aparecer, o script não foi carregado. Verifique:
   - URL do script está correta no `template.tpl`?
   - Script está acessível publicamente?
   - CORS está configurado no S3?
3. Teste a URL do tracking diretamente no navegador
4. Verifique permissões S3 e política de bucket

### Eventos não aparecem no dataLayer

**Possíveis causas**:
1. **Tracking desabilitado**: Checkbox "Habilitar tracking" está desmarcado
2. **EqualWeb não inicializou**: Widget carregou mas `window.interdeal.a11y` não existe
3. **Métodos não interceptados**: Tracking carregou mas não encontrou métodos para interceptar

**Solução**:
1. Ative debug logs e procure por:
   ```
   [EqualWeb Tracking] Total de métodos interceptados: X
   ```
2. Se aparecer "0 métodos interceptados", o EqualWeb não inicializou corretamente
3. Se não aparecer essa mensagem, o script de tracking não está executando
4. Verifique se `window.interdeal` existe no console
5. Digite `window.interdeal.a11y` no console - deve retornar um objeto

### Widget está em posição errada

**Solução**:
- Ajuste "Vertical Position" (ex: de `50%` para `80%`)
- Mude "Widget Position" de Left para Right
- Ajuste "Button Scale" para alterar o tamanho (1 = normal, 0.5 = metade)

### Cores não aparecem corretamente

**Solução**:
- Verifique se os códigos hexadecimais estão corretos (formato: `#000000`)
- Teste cores de alto contraste (`#000000` e `#FFFFFF`)
- Limpe cache do navegador e recarregue a página
- Verifique se não há CSS do site sobrescrevendo as cores

### Eventos duplicados no dataLayer

**Possíveis causas**:
- Tag disparando múltiplas vezes
- Múltiplas instâncias do script de tracking

**Solução**:
- Verifique se tem apenas UM acionador na tag
- Confirme que `[EqualWeb Tracking] EqualWeb Tracking Script carregado` aparece apenas uma vez
- O script tem proteção contra execução duplicada (`window.__equalWebTrackingInitialized`)

## 🌐 Conformidade e Acessibilidade

O EqualWeb ajuda seu site a estar em conformidade com:

- ✅ **WCAG 2.1** (Web Content Accessibility Guidelines)
- ✅ **ADA** (Americans with Disabilities Act)
- ✅ **Section 508** (US Federal Accessibility Standards)
- ✅ **LBI** (Lei Brasileira de Inclusão nº 13.146/2015)
- ✅ **LGPD** (Lei Geral de Proteção de Dados)

### Recursos de Acessibilidade Inclusos

- 🦯 Compatibilidade com leitores de tela (NVDA, JAWS, VoiceOver)
- ⌨️ Navegação completa por teclado
- 🔍 Ajuste de zoom e tamanho de texto
- 🎨 Ajuste de contraste e saturação
- 🖱️ Cursor e mouse adaptados
- 📖 Descrições de imagens (Alt-Text)
- 🎯 Destaque de links e botões

## 📚 Recursos Adicionais

- [Documentação oficial EqualWeb](https://www.equalweb.com/documentation/)
- [Painel administrativo](https://access.equalweb.com/)
- [Suporte EqualWeb](https://www.equalweb.com/support/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🏷️ Tags

`accessibility`, `a11y`, `wcag`, `ada`, `equalweb`, `widget`, `inclusão`, `acessibilidade`

## 📝 Notas Importantes

1. **Segurança**: O Integrity Hash garante que o script não foi modificado
2. **Performance**: O script carrega de forma assíncrona (não bloqueia a página)
3. **LGPD/GDPR**: O EqualWeb processa dados de acordo com as leis de privacidade
4. **Custo**: EqualWeb é um serviço pago - verifique planos no site oficial
5. **Suporte**: Entre em contato com EqualWeb para questões técnicas específicas

## 🤝 Contribuição

Este template é mantido pela **Métricas Boss**. Para reportar bugs ou sugerir melhorias:

1. Abra uma issue no repositório
2. Descreva o problema ou sugestão
3. Inclua prints e exemplos quando possível

## 📊 Referência Rápida: Todos os Eventos

### Total: 45+ Eventos Rastreados

#### 🎯 Perfis (10 eventos)
`setBlindness`, `setMotorSkillsDisorders`, `setColorBlindness`, `setVisuallyImpaired`, `setEpilepsyProfile`, `setAdhd`, `setLearningAndReading`, `setElders`, `setDyslexia`, `setWebsiteAdaCompliant`

#### 📖 Leitura (6 eventos)
`setTextReader`, `setVoiceCommands`, `setReadGuide`, `setDictionary`, `setSummarize`, `setReadableFont`

#### 👁️ Visual (6 eventos)
`setColorScheme`, `setFontSize`, `setZoom`, `settextmagnifier`, `setHighlight`, `setAltText`

#### 🖱️ Cursor (5 eventos)
`setBigCursor`, `setfocusMode`, `setHighlightButtons`, `setEnlargeButtons`, `setFlyingFocus`

#### ⌨️ Navegação (4 eventos)
`setVirtualKeyboard`, `setNavigation`, `setPagemap`, `setShortcutMenu`

#### 🎬 Mídia (2 eventos)
`setMuteMedia`, `setSubtitles`

#### ⚠️ Segurança (1 evento)
`setEpilepsy`

#### 📋 Menu (5 eventos)
`ShowMenu`, `CloseMenu`, `switchOff`, `expandMenu`, `hideA11yButton`

#### 🔧 Sistema (5 eventos)
`widget_initialized`, `data_loaded`, `menu_ready`, `button_click`, `language_changed`

### Categorias para Análise

Ao analisar os dados no GA4, use estas categorias:

- `accessibility_profile` - Perfis de usuários (dislexia, baixa visão, etc.)
- `accessibility_reading` - Recursos de leitura e compreensão
- `accessibility_visual` - Ajustes visuais (cores, zoom, fontes)
- `accessibility_cursor` - Cursor e elementos interativos
- `accessibility_navigation` - Navegação por teclado e atalhos
- `accessibility_media` - Controles de mídia
- `accessibility_safety` - Segurança (epilepsia)
- `accessibility_menu` - Controles do menu
- `accessibility_system` - Eventos do sistema

---

**Desenvolvido por**: Métricas Boss
**Versão**: 2.0.0
**Última atualização**: 15/12/2024

**Changelog:**
- **v2.0.0** (15/12/2024): Reescrita completa do tracking usando interceptação de métodos; 45+ eventos mapeados; nova estrutura de eventos com `accessibility_*`
- **v1.1.0** (15/12/2024): Tentativa de implementação com Proxy (descontinuada)
- **v1.0.0** (14/11/2024): Versão inicial
