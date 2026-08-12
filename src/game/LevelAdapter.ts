import type { Level, Card, RiverPosition, BridgePosition, DinoPosition } from "../data/types";
import { resolveBridgeGeometry } from "./SceneGeometry";

/**
 * Helper para renderizar uma fração no formato visual esperado por renderLevel
 * Nota: esta é uma cópia simplificada da função fraction() em main.ts
 * Idealmente deveria ser centralizada em um arquivo compartilhado
 */
function formatFraction(text: string): string {
  const [a, b] = text.split("/");
  return b === undefined
    ? `<span class="whole-number">${a}</span>`
    : `<span class="fraction"><b>${a}</b><i class="fraction-line"></i><b>${b}</b><em class="fraction-bar"><u style="width:${Math.min(100, (Number(a) / Number(b)) * 100)}%"></u></em></span>`;
}

/**
 * Mapeia dados de um nível JSON para estruturas internas esperadas por main.ts
 */
export class LevelAdapter {
  /**
   * Converte um nível JSON em um objeto de valores (cards) para renderização
   * Formato esperado: { cardId: cardDisplay, ... }
   * Cards de fração são renderizadas como HTML; operadores são retornados como string
   */
  static getLevelValues(level: Level): Record<string, string> {
    const values: Record<string, string> = {};
    for (const card of level.deck.cards) {
      // Se for fração (contém "/"), renderizar como HTML; senão retornar como string
      if (card.type === "fraction" && card.value?.includes("/")) {
        values[card.id] = formatFraction(card.value);
      } else {
        values[card.id] = card.display;
      }
    }
    return values;
  }

  /**
   * Extrai normalizado de posicionamento visual de um nível
   * Suporta tanto as novas props separadas quanto a antiga (cliffOffsetTop)
   */
  static getSceneLayout(level: Level) {
    const layout = level.sceneLayout;
    
    // Normalizar deslocamento dos cliffs: usar props separadas ou fallback para prop genérica
    const cliffLeftOffsetTop = layout.cliffLeftOffsetTop ?? layout.cliffOffsetTop ?? 0;
    const cliffRightOffsetTop = layout.cliffRightOffsetTop ?? layout.cliffOffsetTop ?? 0;
    
    // Normalizar posicionamento do river (usar gorge positions por padrão)
    const riverPosition: RiverPosition = {
      ...layout.river,
      left: layout.left ?? layout.river?.left ?? layout.gorgeLeft,
      right: layout.right ?? layout.river?.right ?? layout.gorgeRight,
    };

    return {
      gorgeLeft: layout.gorgeLeft,
      gorgeRight: layout.gorgeRight,
      cliffLeftOffsetTop,
      cliffRightOffsetTop,
      cliffLeftOffsetLeft: layout.cliffLeftOffsetLeft ?? 0,
      cliffRightOffsetRight: layout.cliffRightOffsetRight ?? 0,
      river: riverPosition,
      bridge: this.getBridgePosition(level),
      dinos: {
        tico: this.getDinoPosition(level, "tico"),
        luma: this.getDinoPosition(level, "luma"),
      },
      riverUrls: layout.riverUrls,
      cliffLeftUrl: layout.cliffLeftUrl,
      cliffRightUrl: layout.cliffRightUrl,
      backgroundUrl: layout.backgroundUrl,
    };
  }

  /**
   * Extrai apenas deslocamento do cliff esquerdo
   */
  static getCliffLeftOffsetTop(level: Level): number {
    const layout = level.sceneLayout;
    return layout.cliffLeftOffsetTop ?? layout.cliffOffsetTop ?? 0;
  }

  /**
   * Extrai apenas deslocamento do cliff direito
   */
  static getCliffRightOffsetTop(level: Level): number {
    const layout = level.sceneLayout;
    return layout.cliffRightOffsetTop ?? layout.cliffOffsetTop ?? 0;
  }

  /**
   * Extrai posicionamento do river
   */
  static getRiverPosition(level: Level): RiverPosition {
    const layout = level.sceneLayout;
    return {
      ...layout.river,
      left: layout.left ?? layout.river?.left ?? layout.gorgeLeft,
      right: layout.right ?? layout.river?.right ?? layout.gorgeRight,
    };
  }

  static getBridgePosition(level: Level): BridgePosition {
    const layout = level.sceneLayout;
    const geometry = resolveBridgeGeometry(layout);
    return { ...layout.bridge, ...geometry };
  }

  static getDinoPosition(level: Level, dino: "tico" | "luma"): DinoPosition {
    const configured = level.sceneLayout.dinos?.[dino];
    const defaults: DinoPosition = dino === "tico"
      ? { anchor: "leftCliff", x: 45, bottom: 25, widthPercent: 17, scale: 1 }
      : { anchor: "rightCliff", x: 35, bottom: 25, widthPercent: 17, scale: 1 };
    return { ...defaults, ...configured };
  }

  /**
   * Retorna instruções de um nível
   */
  static getInstruction(level: Level): string {
    return level.instruction;
  }

  /**
   * Retorna descrição de um nível
   */
  static getDescription(level: Level): string {
    return level.description;
  }

  /**
   * Retorna objetivo (fração alvo) de um nível
   */
  static getObjective(level: Level): string {
    return level.objective;
  }

  /**
   * Retorna padrão esperado para validação
   */
  static getValidationPattern(level: Level) {
    return level.validationPattern;
  }


  /**
   * Extrai apenas os IDs de cards do deck
   */
  static getDeckCardIds(level: Level): string[] {
    return level.deck.cards.map((card) => card.id);
  }

  /**
   * Extrai deslocamento vertical do rio
   */
  static getRiverOffsetTop(level: Level): number {
    return level.sceneLayout.riverOffsetTop ?? 0;
  }

  /**
   * Extrai largura da ponte
   */
  static getBridgeWidth(level: Level): number {
    const bridge = LevelAdapter.getBridgePosition(level);
    return (bridge.end ?? 0) - (bridge.start ?? 0);
  }

  /**
   * Extrai altura da ponte
   */
  static getBridgeHeight(level: Level): number {
    return LevelAdapter.getBridgePosition(level).height ?? 21;
  }
}
