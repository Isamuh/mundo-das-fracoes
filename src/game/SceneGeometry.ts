import type { BridgePosition } from "../data/types";

export type BridgeGeometry = {
  start: number;
  end: number;
  startHeight: number;
  endHeight: number;
  height: number;
};

/**
 * Resolve a geometria da ponte a partir das bordas visíveis das cliffs.
 * start/end são ajustes finos relativos às bordas, preservando o encaixe
 * automático quando a largura ou a posição das cliffs muda.
 */
export function resolveBridgeGeometry(input: {
  gorgeLeft: number;
  gorgeRight: number;
  cliffLeftOffsetLeft?: number;
  cliffRightOffsetRight?: number;
  bridge?: BridgePosition;
}): BridgeGeometry {
  const leftEdge = input.gorgeLeft + (input.cliffLeftOffsetLeft ?? 0);
  const rightEdge = 100 - input.gorgeRight - (input.cliffRightOffsetRight ?? 0);
  const start = Math.max(0, Math.min(99, leftEdge + (input.bridge?.start ?? 0)));
  const end = Math.max(start + 1, Math.min(100, rightEdge + (input.bridge?.end ?? 0)));
  const startHeight = input.bridge?.startHeight ?? input.bridge?.bottom ?? 35;
  const endHeight = input.bridge?.endHeight ?? startHeight;
  return { start, end, startHeight, endHeight, height: input.bridge?.height ?? 21 };
}
