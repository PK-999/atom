import { expect, test } from "vitest";
import { RadiationScenarioSchema } from "./schemas";

test("RadiationScenarioSchema validates a valid reviewed scenario", () => {
  const scenario = {
    id: "chest-xray",
    title: "Chest X-Ray",
    category: "medical",
    quantity: "effective-dose",
    value: 0.1,
    unit: "mSv",
    doseMicroSv: 100,
    context: "Single diagnostic radiograph",
    description: "Typical effective dose from a single PA chest x-ray.",
    source: {
      name: "UNSCEAR",
      publicationYear: 2008,
      reportTitle: "Sources and Effects of Ionizing Radiation",
    },
    reviewStatus: "reviewed",
  };

  const parsed = RadiationScenarioSchema.parse(scenario);
  expect(parsed.id).toBe("chest-xray");
  expect(parsed.doseMicroSv).toBe(100);
});

test("RadiationScenarioSchema rejects negative or infinite values", () => {
  const badScenario = {
    id: "bad-dose",
    title: "Invalid Dose",
    category: "medical",
    quantity: "effective-dose",
    value: -5,
    unit: "mSv",
    doseMicroSv: -5000,
    context: "Invalid",
    description: "Negative dose",
    source: {
      name: "Test",
      publicationYear: 2020,
    },
    reviewStatus: "reviewed",
  };

  expect(() => RadiationScenarioSchema.parse(badScenario)).toThrow();
});
