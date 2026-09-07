import { expect, test } from "vitest";
import { ReactorSystemSchema } from "./schemas";

test("ReactorSystemSchema validates a valid reactor system", () => {
  const system = {
    id: "pwr-gen3",
    type: "PWR",
    name: "Pressurized Water Reactor (Gen III+)",
    summary: "The most common type of light water reactor.",
    components: [
      {
        id: "pwr-coolant",
        name: "Light Water",
        type: "coolant",
        description: "Water kept under high pressure so it does not boil.",
      },
      {
        id: "pwr-fuel",
        name: "Low-Enriched Uranium",
        type: "fuel",
        description: "Uranium dioxide pellets enclosed in zirconium alloy.",
      },
    ],
  };

  const parsed = ReactorSystemSchema.parse(system);
  expect(parsed.id).toBe("pwr-gen3");
});
