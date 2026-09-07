import { expect, test } from "vitest";
import { FacilitySchema } from "./schemas";

test("FacilitySchema validates a valid facility", () => {
  const facility = {
    id: "kudankulam",
    name: "Kudankulam Nuclear Power Plant",
    countryCode: "IN",
    coordinates: {
      latitude: 8.169,
      longitude: 77.712,
    },
    status: "operating",
    reactorCount: 2,
    totalCapacityMw: 2000,
  };

  const parsed = FacilitySchema.parse(facility);
  expect(parsed.id).toBe("kudankulam");
});
