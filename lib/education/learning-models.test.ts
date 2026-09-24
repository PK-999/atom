import { expect, it } from "vitest";
import { energyFromPower, atomIdentity } from "./learning-models";
it("keeps power distinct from energy and rejects invalid inputs", () => {
  expect(energyFromPower(2, 3)).toBe(6);
  expect(energyFromPower(0, 3)).toBe(0);
  expect(energyFromPower(-1, 3)).toBeNull();
  expect(energyFromPower(Infinity, 3)).toBeNull();
});
it("uses protons for identity, protons plus neutrons for mass, and makes no stability claim", () => {
  expect(atomIdentity(92, 143)).toEqual({
    name: "Uranium",
    massNumber: 235,
    electrons: 92,
  });
  expect(atomIdentity(92, 146)?.name).toBe("Uranium");
  expect(atomIdentity(1.5, 1)).toBeNull();
});
