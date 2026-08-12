import { describe, expect, it } from "vitest";
import { resolveBridgeGeometry } from "../../src/game/SceneGeometry";

describe("resolveBridgeGeometry", () => {
  it("conecta a ponte às bordas internas das cliffs", () => {
    expect(resolveBridgeGeometry({ gorgeLeft: 37.5, gorgeRight: 35 })).toMatchObject({
      start: 37.5,
      end: 65,
    });
  });

  it("preserva ajustes finos de início e fim", () => {
    expect(resolveBridgeGeometry({
      gorgeLeft: 37.5,
      gorgeRight: 37.5,
      bridge: { start: 1.5, end: -2 },
    })).toMatchObject({ start: 39, end: 60.5 });
  });

  it("aceita alturas diferentes nos encaixes", () => {
    expect(resolveBridgeGeometry({
      gorgeLeft: 30,
      gorgeRight: 30,
      bridge: { startHeight: 25, endHeight: 45, height: 18 },
    })).toMatchObject({ startHeight: 25, endHeight: 45, height: 18 });
  });
});
