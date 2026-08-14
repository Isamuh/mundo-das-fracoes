/** Tipo de card/carta na fase */
export type CardType = "fraction" | "operator" | "special";

/** Especificação de uma carta disponível em uma fase */
export interface Card {
  id: string;
  type: CardType;
  display: string; // conteúdo visual/simbólico (ex. "1/2", "+", "−")
  value?: string; // valor matemático para frações (ex. "1/2")
}

/** Especificação de um deck (conjunto de cartas disponíveis) */
export interface Deck {
  cards: Card[];
}

/** Posicionamento do river */
export interface RiverPosition {
  /** Posição esquerda como % da área visual */
  left: number;
  /** Posição direita como % da área visual */
  right: number;
  /** Altura em pixels (opcional, padrão 100%) */
  height?: number;
  top?: number;
  bottom?: number;
  width?: number;
  scale?: number;
}

/** Configuração visual dos elementos da cena (cliff, river, etc.) */
export interface BridgePosition {
  /** Ajuste do início da ponte relativo à borda da cliff esquerda, em % */
  start?: number;
  /** Ajuste do fim da ponte relativo à borda da cliff direita, em % */
  end?: number;
  bottom?: number;
  height?: number;
  /** Altura do encaixe esquerdo, em % a partir da base da cena */
  startHeight?: number;
  /** Altura do encaixe direito, em % a partir da base da cena */
  endHeight?: number;
}

/** Configuração visual individual de um dinossauro */
export interface DinoPosition {
  /** Vincula o personagem à caixa escalável de uma cliff. */
  anchor?: "leftCliff" | "rightCliff" | "scene";
  /** Posição horizontal dentro da âncora, em % */
  x?: number;
  /** Largura relativa à âncora, em % */
  widthPercent?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
  scale?: number;
}

export interface HomeSceneLayout {
  backgroundUrl: string;
  cliffs: {
    left: { x: number; width: number; bottom?: number; scale?: number };
    right: { x: number; width: number; bottom?: number; scale?: number };
  };
  bridge: { left: number; right: number; bottom: number; height: number; scale?: number };
  dinos: {
    tico: { left: number; bottom: number; width: number; scale?: number };
    luma: { right: number; bottom: number; width: number; scale?: number };
  };
}

export interface SceneLayout {
  /** Margens horizontais do rio (atalho compatível no nível da cena) */
  left?: number;
  right?: number;
  /** Largura do cliff esquerdo como % da área visual */
  gorgeLeft: number;
  /** Largura do cliff direito como % da área visual */
  gorgeRight: number;
  /** Deslocamento vertical do cliff esquerdo em pixels */
  cliffLeftOffsetTop?: number;
  /** Deslocamento vertical do cliff direito em pixels */
  cliffRightOffsetTop?: number;
  /** Deslocamento horizontal das cliffs, em % da largura da cena */
  cliffLeftOffsetLeft?: number;
  cliffRightOffsetRight?: number;
  /** DEPRECATED: use cliffLeftOffsetTop/cliffRightOffsetTop */
  cliffOffsetTop?: number;
  riverOffsetTop?: number;
  bridgeWidth?: number;
  bridgeHeight?: number;
  bridge?: BridgePosition;
  dinos?: {
    tico?: DinoPosition;
    luma?: DinoPosition;
  };
  /** Posicionamento do river */
  river?: RiverPosition;
  /** URL do background */
  backgroundUrl: string;
  /** URLs dos assets do river (4 frames de animação) */
  riverUrls: string[];
  /** URL do cliff esquerdo */
  cliffLeftUrl: string;
  /** URL do cliff direito */
  cliffRightUrl: string;
}

/** Padrão de validação de uma solução (estrutura de cards corretos) */
export interface ValidationPattern {
  /** Número esperado de cards */
  expectedCardCount: number;
  /** IDs de cards que devem aparecer (ordem não importa) */
  requiredCards?: string[];
  /** Estrutura esperada (ex. "fraction + fraction - fraction") */
  structure?: string[];
}

/** Especificação de uma fase/nível */
export interface Level {
  id: string;
  number: number;
  world: number;
  title: string;
  description: string;
  /** Instrução exibida durante o nível */
  instruction: string;
  /** Instrução alternativa para o modo difícil */
  instructionHard?: string;
  /** Objetivo da fase em formato de fração (ex. "1/1") */
  objective: string;
  /** Cards disponíveis nesta fase */
  deck: Deck;
  /** Cards alternativos para o modo difícil (nível ensino médio) */
  hardDeck?: Deck;
  /** Definição da cena visual */
  sceneLayout: SceneLayout;
  /** Validação: qual é o padrão esperado da solução (estrutura de cards corretos) */
  validationPattern: ValidationPattern;
  /** Padrão de validação da solução no modo difícil */
  validationPatternHard?: ValidationPattern;
}

/** Mundo (agrupamento de fases) */
export interface World {
  id: string;
  number: number;
  title: string;
  description: string;
  levels: Level[];
}
