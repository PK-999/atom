import { describe, expect, it } from "vitest";
import { FacilitySchema, CoordinatesSchema } from "./schemas";

describe("Globe Schemas (R16-G)", () => {
  it("validates a facility with unit breakdowns and source attribution", () => {
    const facility = {
      id: "kudankulam",
      name: "Kudankulam Nuclear Power Plant",
      countryCode: "IN",
      countryName: "India",
      coordinates: {
        latitude: 8.169,
        longitude: 77.712,
      },
      status: "mixed",
      reactorCount: 2,
      totalCapacityMw: 2000,
      units: [
        {
          id: "kk-1",
          name: "Unit 1",
          unitNumber: 1,
          reactorType: "VVER-1000",
          status: "operating",
          capacityMWe: 917,
          capacityBasis: "net",
          commercialYear: 2014,
        },
      ],
      source: {
        id: "iaea-pris",
        title: "IAEA PRIS",
        publisher: "IAEA",
        asOf: "2026-01-01",
      },
    };

    const parsed = FacilitySchema.parse(facility);
    expect(parsed.id).toBe("kudankulam");
    expect(parsed.units).toHaveLength(1);
    expect(parsed.units[0].status).toBe("operating");
  });

  it("strictly enforces coordinate boundaries [-90..90, -180..180]", () => {
    expect(() =>
      CoordinatesSchema.parse({ latitude: 91, longitude: 0 }),
    ).toThrow();
    expect(() =>
      CoordinatesSchema.parse({ latitude: 0, longitude: 185 }),
    ).toThrow();
  });

  it("supports explicit unknown capacity (nullable capacityMWe)", () => {
    const unitWithUnknownCapacity = {
      id: "unit-unknown",
      name: "Experimental Unit",
      unitNumber: 1,
      reactorType: "Research",
      status: "shutdown",
      capacityMWe: null,
      capacityBasis: "net",
    };
    const parsed = FacilitySchema.parse({
      id: "fac-unknown",
      name: "Test Facility",
      countryCode: "US",
      countryName: "United States",
      coordinates: { latitude: 40.0, longitude: -80.0 },
      status: "shutdown",
      reactorCount: 1,
      totalCapacityMw: null,
      units: [unitWithUnknownCapacity],
    });
    expect(parsed.units[0].capacityMWe).toBeNull();
    expect(parsed.totalCapacityMw).toBeNull();
  });
});
