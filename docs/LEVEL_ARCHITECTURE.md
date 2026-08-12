# Arquitetura de Níveis - Documentação

## Visão geral

A partir desta versão, os níveis do jogo são definidos como dados estruturados em JSON, permitindo:

- ✅ Reutilização de níveis sem recompilar o código
- ✅ Customização de posição, tamanho e assets dos cliffs, river, etc.
- ✅ Separação entre lógica de jogo (main.ts) e dados de nível
- ✅ Fácil adição de novos mundos e fases

## Estrutura de tipos

### `Level`
Define um nível completo:
```typescript
export interface Level {
  id: string;                  // ID único (ex: "level-1-1")
  number: number;              // Número da fase (1, 2, 3...)
  world: number;               // Mundo (1, 2, 3...)
  title: string;               // Nome da phase (ex: "Duas metades")
  description: string;         // Descrição
  instruction: string;         // Instrução ao jogar
  objective: string;           // Meta em formato de fração (ex: "1/1")
  deck: Deck;                  // Cartas disponíveis
  sceneLayout: SceneLayout;    // Configuração visual
  validationPattern: {...};    // Como validar a solução
}
```

### `SceneLayout`
Customiza elementos visuais do nível:
```typescript
export interface SceneLayout {
  gorgeLeft: number;           // Largura do cliff esquerdo em %
  gorgeRight: number;          // Largura do cliff direito em %
  cliffLeftOffsetTop?: number; // Deslocamento vertical do cliff esquerdo em px
  cliffRightOffsetTop?: number;// Deslocamento vertical do cliff direito em px
  cliffOffsetTop?: number;     // DEPRECATED: para ambos os cliffs (fallback)
  river?: RiverPosition;       // Posicionamento do river
  backgroundUrl: string;       // URL do background
  riverUrls: string[];         // URLs dos 4 frames do river
  cliffLeftUrl: string;        // URL do cliff esquerdo
  cliffRightUrl: string;       // URL do cliff direito
}
```

### `RiverPosition`
Define posição do rio:
```typescript
export interface RiverPosition {
  left: number;   // Posição esquerda como % da área visual
  right: number;  // Posição direita como % da área visual
  height?: number;// Altura em pixels (opcional, padrão 100%)
}
```

## Arquivos principais

### `src/data/types.ts`
Define tipos TypeScript para níveis. **Não alterar sem sincronizar JSONs.**

### `public/data/levels/*.json`
Instâncias reais de níveis. Cada arquivo segue o schema `Level`.

**Exemplo:** `public/data/levels/level-1-1.json`
```json
{
  "id": "level-1-1",
  "number": 1,
  "world": 1,
  "title": "Duas metades",
  "description": "Complete 1 inteiro para encontrar a Luma.",
  "instruction": "Fase um: Duas metades...",
  "objective": "1/1",
  "deck": {
    "cards": [
      { "id": "halfA", "type": "fraction", "display": "1/2", "value": "1/2" },
      { "id": "plus", "type": "operator", "display": "+", "value": "+" },
      ...
    ]
  },
  "sceneLayout": {
    "gorgeLeft": 37.5,
    "gorgeRight": 37.5,
    "cliffOffsetTop": 100,
    "backgroundUrl": "/assets/background/background.png",
    "riverUrls": [...],
    "cliffLeftUrl": "/assets/background/cliff_left.png",
    "cliffRightUrl": "/assets/background/cliff_right.png"
  },
  "validationPattern": {
    "expectedCardCount": 3,
    "requiredCards": ["halfA", "halfB", "plus"],
    "structure": ["fraction", "operator", "fraction"]
  }
}
```

### `src/game/LevelLoader.ts`
Carrega JSONs de níveis:
```typescript
// Carregar um nível
const level = await LevelLoader.loadLevel("level-1-1");

// Carregar vários níveis
const levels = await LevelLoader.loadLevels(["level-1-1", "level-1-3", "level-1-4"]);

// Listar níveis do Mundo 1
const world1Levels = LevelLoader.getWorld1Levels();
```

### `src/game/LevelAdapter.ts`
Adaptador que converte dados JSON em estrutura esperada pelo main.ts:
```typescript
const level = await LevelLoader.loadLevel("level-1-1");
const values = LevelAdapter.getLevelValues(level);
const layout = LevelAdapter.getSceneLayout(level);
const instruction = LevelAdapter.getInstruction(level);
```

## Como adicionar um novo nível

### 1. Criar arquivo JSON
Crie `public/data/levels/level-{world}-{number}.json`:
```bash
# Exemplo: Fase 1 do Mundo 2
public/data/levels/level-2-1.json
```

### 2. Preencher estrutura
Copie um nível existente e adapte:
- Altere `id`, `number`, `world`, `title`, `description`
- Customize `deck.cards` (quais cartas estão disponíveis)
- Customize `sceneLayout` (posição/tamanho dos cliffs, URLs dos assets)
- Customize `validationPattern` (como validar a solução correta)

### 3. Registrar no LevelLoader (opcional)
Se for parte do Mundo 1, adicione o ID a `getWorld1Levels()` em `src/game/LevelLoader.ts`.

### 4. Integrar ao main.ts
Próximo passo: refatorar funções como `renderLevel()` para usar `LevelAdapter.getLevelValues()` ao invés de hardcoding valores.

## Integração com main.ts (COMPLETA)

### Carregamento de níveis
- ✅ `startLevel()`, `startLevelTwo()`, `startLevelThree()` agora são `async` e carregam via `LevelLoader`
- ✅ `renderLevel()` usa `LevelAdapter.getLevelValues()` para extrair cartas do nível JSON
- ✅ Hierarquia de fallback: se `currentLevelData` existe, usar; senão usar hardcode anterior

### CSS Custom Properties dinâmicas
Cada nível customiza visualmente o mundo via CSS vars setadas inline em `<section class="world">`:

```css
--cliff-left-offset-top: 100px;    // Deslocamento do cliff esquerdo
--cliff-right-offset-top: 100px;   // Deslocamento do cliff direito
--river-left: 37.5%;               // Posição esquerda do river
--river-right: 37.5%;              // Posição direita do river
```

**Exemplo renderizado:**
```html
<section class="world" style="--cliff-left-offset-top:100px;--cliff-right-offset-top:100px;--river-left:37.5%;--river-right:37.5%">
```

### River animado
- A imagem do river muda a cada 25% de cobertura (4 frames)
- Frame é selecionado via `sceneAssets.riverUrls[Math.floor(coverage / 25)]`
- Assets vêm de `Level.sceneLayout.riverUrls`

## Próximos passos de refatoração (não executados)

1. **`assess()`**: Usar `LevelAdapter.getValidationPattern()` para validação dinâmica
2. **`home()`, `map()`**: Carregar lista de níveis do Mundo 1 via `LevelLoader.getWorld1Levels()`
3. **Múltiplos mundos**: Estender LevelLoader com getWorldNLevels() para cada mundo

## Customizações visuais por nível

Cada nível pode ter:

### Posicionamento dos cliffs
```json
"sceneLayout": {
  "gorgeLeft": 40,      // Cliff esquerdo ocupa 40% da largura
  "gorgeRight": 35,     // Cliff direito ocupa 35% da largura
  "cliffOffsetTop": 150 // Deslocado 150px de cima
}
```

### River animado
```json
"riverUrls": [
  "/assets/background/river_0.png",
  "/assets/background/river_1.png",
  "/assets/background/river_2.png",
  "/assets/background/river_3.png"
]
```

### Assets customizados por mundo
```json
"sceneLayout": {
  "backgroundUrl": "/assets/background/mundo2-bg.png",
  "cliffLeftUrl": "/assets/background/mundo2-cliff-left.png",
  "cliffRightUrl": "/assets/background/mundo2-cliff-right.png"
}
```

## Requisitos para novos níveis

Todos os JSONs devem passar validation em relação a `types.ts`:
```bash
npm run build
```

Se houver erro TypeScript, é porque o JSON não está conforme o schema.

## Referência: IDs de cartas padrão

Para facilitar reutilização, cartas comuns têm IDs consistentes:

### Frações
- `halfA`, `halfB`: 1/2 (Fase 1)
- `thirdA`, `thirdB`, `thirdC`: 1/3 (Fase 2)
- `quarter`: 1/4
- `fifth`: 1/5
- `threeQuarter`: 3/4 (Fase 3)

### Operadores
- `plus`, `plusA`, `plusB`: (+)
- `minus`: (−)
- `multiply`: (×) [futuro]
- `divide`: (÷) [futuro]

## Exemplo: Criar Mundo 2, Fase 1

```json
{
  "id": "level-2-1",
  "number": 1,
  "world": 2,
  "title": "Frações equivalentes",
  "description": "Descubra que 1/2 = 2/4 = 3/6.",
  "instruction": "Mundo 2, Fase 1: Frações equivalentes...",
  "objective": "equivalência",
  "deck": {
    "cards": [
      { "id": "half", "type": "fraction", "display": "1/2", "value": "1/2" },
      { "id": "quarter_pair", "type": "fraction", "display": "2/4", "value": "2/4" },
      { "id": "sixth_triple", "type": "fraction", "display": "3/6", "value": "3/6" }
    ]
  },
  "sceneLayout": {
    "gorgeLeft": 35,
    "gorgeRight": 35,
    "cliffOffsetTop": 100,
    "backgroundUrl": "/assets/background/mundo2-bg.png",
    "riverUrls": ["/assets/background/mundo2-river_0.png", ...],
    "cliffLeftUrl": "/assets/background/mundo2-cliff-left.png",
    "cliffRightUrl": "/assets/background/mundo2-cliff-right.png"
  },
  "validationPattern": {
    "expectedCardCount": 3,
    "structure": ["fraction", "equals", "fraction", "equals", "fraction"]
  }
}
```

---

### Regulagem visual por fase (referência anterior)

O intervalo da ponte pode ser ajustado com `sceneLayout.bridge`. `start` e `end`
definem onde a ponte começa e termina, em porcentagem da largura da cena. O
preenchimento continua sendo calculado pela resposta do jogador.

O rio aceita `left`/`right` para posição, `top`/`bottom` para deslocamento,
`width`/`height` para tamanho e `scale` para escala. Exemplo:

```json
"river": {
  "left": 34,
  "right": 34,
  "top": 0,
  "bottom": 0,
  "width": 32,
  "height": 100,
  "scale": 1.05
},
"bridge": {
  "start": 34,
  "end": 66,
  "bottom": 35,
  "height": 24
}
```

### Cliffs, ponte e dinossauros

`cliffLeftOffsetLeft` e `cliffRightOffsetRight` deslocam horizontalmente as
cliffs em porcentagem. A ponte ignora `start`/`end` antigos e calcula seu vão
automaticamente entre as bordas internas das cliffs.

Cada dinossauro pode receber `left`, `right`, `top`, `bottom`, `width`, `height`
e `scale`:

```json
"dinos": {
  "tico": { "left": 16.8, "bottom": 32, "width": 76, "scale": 1 },
  "luma": { "right": 16.8, "bottom": 32, "width": 76, "scale": 1 }
}
```

### Geometria escalável (Mundo 2 e posteriores)

O vão da ponte é calculado pelas bordas internas das cliffs. `bridge.start` e
`bridge.end` são ajustes finos em porcentagem relativos a essas bordas: use `0`
para encaixe direto, valores positivos para mover à direita e negativos para a
esquerda. Para penhascos em alturas diferentes, use `startHeight` e `endHeight`
(porcentagens medidas a partir da base). A ponte é recalculada quando a cena
muda de tamanho.

O preenchimento é proporcional ao objetivo matemático do nível; por exemplo,
um objetivo `"3/2"` permite representar uma ponte de um inteiro e meio.

Personagens devem usar `anchor`, `x` e `widthPercent`. Esses valores são
relativos à caixa da cliff, garantindo que sprite e etiqueta diminuam junto
com a arte da cena.

```json
"bridge": { "start": 0, "end": 0, "startHeight": 35, "endHeight": 45, "height": 21 },
"dinos": {
  "tico": { "anchor": "leftCliff", "x": 45, "bottom": 25, "widthPercent": 17, "scale": 1 },
  "luma": { "anchor": "rightCliff", "x": 35, "bottom": 25, "widthPercent": 17, "scale": 1 }
}
```

## Troubleshooting

### ❌ Build falha com erro de tipo
**Causa:** JSON não passa validação TypeScript  
**Solução:** Verifique schema em `src/data/types.ts`

### ❌ Arquivo JSON não é carregado
**Causa:** Caminho incorreto em `LevelLoader.loadLevel()`  
**Solução:** Verifique se arquivo está em `public/data/levels/{id}.json`

### ❌ Valores das cartas não aparecem
**Causa:** Campo `display` vazio no JSON  
**Solução:** Adicione `display` para cada card (ex: `"1/2"`, `"+"`)
