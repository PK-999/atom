import { expect, test } from "vitest";
import { RadiationScenarioSchema } from "./schemas";

test("RadiationScenarioSchema validates a valid scenario", () => {
  const scenario = {
    id: "chest-xray",
    title: "Chest X-Ray",
    quantity: "effective-dose",
    value: 0.1,
    unit: "mSv",
    description: "Typical effective dose from a single chest x-ray.",
  };

  const parsed = RadiationScenarioSchema.parse(scenario);
  expect(parsed.id).toBe("chest-xray");
});
