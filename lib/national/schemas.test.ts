import { expect, test } from "vitest";
import { NationalProfileSchema } from "./schemas";

test("NationalProfileSchema validates a valid national profile", () => {
  const profile = {
    id: "india",
    countryName: "India",
    energyMix: [
      { source: "Coal", percentage: 70 },
      { source: "Nuclear", percentage: 3 },
      { source: "Renewables", percentage: 27 },
    ],
    domesticPolicy:
      "India's three-stage nuclear power programme aims to utilize thorium reserves.",
    reactorFleetSummary: "Mix of PHWRs and imported VVERs.",
  };

  const parsed = NationalProfileSchema.parse(profile);
  expect(parsed.id).toBe("india");
});
