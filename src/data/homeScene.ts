import type { HomeSceneLayout } from "./types";

/** Configuração da composição da tela inicial. Posições e larguras são porcentagens. */
export const homeScene: HomeSceneLayout = {
  backgroundUrl: "/assets/background/background.png",
  cliffs: {
    left: { x: -25, width: 55, bottom: 0, scale: 1 },
    right: { x: -25, width: 55, bottom: 0, scale: 1 },
  },
  bridge: { left: 24.5, right: 39, bottom: 180, height: 14, scale: 1 },
  dinos: {
    tico: { left: -3, bottom: 170, width: 100, scale: 1 },
    luma: { right: 17, bottom: 175, width: 100, scale: 1 },
  },
};
