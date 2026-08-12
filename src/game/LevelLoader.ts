import type { Level } from "../data/types";

/**
 * Carrega configurações de níveis a partir de JSON
 */
export class LevelLoader {
  /**
   * Carrega um nível específico pelo ID
   */
  static async loadLevel(levelId: string): Promise<Level> {
    try {
      const response = await fetch(`/data/levels/${levelId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load level ${levelId}: ${response.statusText}`);
      }
      const data = await response.json() as Level;
      return data;
    } catch (error) {
      console.error(`Error loading level ${levelId}:`, error);
      throw error;
    }
  }

  /**
   * Carrega múltiplos níveis
   */
  static async loadLevels(levelIds: string[]): Promise<Level[]> {
    return Promise.all(levelIds.map((id) => this.loadLevel(id)));
  }

  /**
   * Lista de IDs dos níveis disponíveis no Mundo 1
   */
  static getWorld1Levels(): string[] {
    return ["level-1-1", "level-1-3", "level-1-4"];
  }
}
