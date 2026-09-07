import { expect, test } from "vitest";
import { GridScenarioSchema } from "./schemas";

test("GridScenarioSchema validates a valid scenario", () => {
  const scenario = {
    id: "mumbai-base",
    cityPopulation: 20000000,
    peakDemandMw: 4000,
    sources: [
      {
        id: "coal",
        name: "Coal",
        capacityMw: 3000,
        capacityFactor: 0.6,
        isDispatchable: true,
      },
      {
        id: "nuclear",
        name: "Nuclear",
        capacityMw: 1000,
        capacityFactor: 0.9,
        isDispatchable: true,
      },
      {
        id: "solar",
        name: "Solar PV",
        capacityMw: 2000,
        capacityFactor: 0.2,
        isDispatchable: false,
      },
    ],
  };

  const parsed = GridScenarioSchema.parse(scenario);
  expect(parsed.id).toBe("mumbai-base");
});
