import { describe, expect, it } from "vitest";
import {
  CANONICAL_FACILITIES,
  listFacilities,
  getFacilityById,
  filterFacilities,
  validateFacilityIntegrity,
} from "./facility-model";
import type { Facility } from "./schemas";

describe("Facility Model & Directory Integrity (R16-G)", () => {
  it("loads canonical global facilities catalog with IAEA PRIS sources", () => {
    const facilities = listFacilities();
    expect(facilities.length).toBeGreaterThanOrEqual(8);

    const kudankulam = getFacilityById("kudankulam");
    expect(kudankulam).not.toBeNull();
    expect(kudankulam?.countryCode).toBe("IN");
    expect(kudankulam?.source?.publisher).toContain("IAEA");

    const olkiluoto = getFacilityById("olkiluoto");
    expect(olkiluoto).not.toBeNull();
    expect(olkiluoto?.countryName).toBe("Finland");
  });

  it("verifies referential integrity across all canonical facilities", () => {
    for (const fac of CANONICAL_FACILITIES) {
      const integrity = validateFacilityIntegrity(fac);
      expect(integrity.valid).toBe(true);
      expect(integrity.errors).toEqual([]);
    }
  });

  it("filters facilities accurately by country code", () => {
    const inFacilities = filterFacilities(CANONICAL_FACILITIES, {
      country: "IN",
    });
    expect(inFacilities.length).toBe(2);
    expect(inFacilities.every((f) => f.countryCode === "IN")).toBe(true);

    const fiFacilities = filterFacilities(CANONICAL_FACILITIES, {
      country: "FI",
    });
    expect(fiFacilities.length).toBe(1);
    expect(fiFacilities[0].id).toBe("olkiluoto");
  });

  it("filters facilities accurately by status", () => {
    const shutdownFacilities = filterFacilities(CANONICAL_FACILITIES, {
      status: "shutdown",
    });
    expect(shutdownFacilities.length).toBeGreaterThanOrEqual(2);
    expect(
      shutdownFacilities.some(
        (f) => f.id === "chernobyl" || f.id === "fukushima-daiichi",
      ),
    ).toBe(true);
  });

  it("filters facilities by active year historically", () => {
    // In 1980, Kudankulam was not commercial yet; Olkiluoto was commercial
    const facs1980 = filterFacilities(CANONICAL_FACILITIES, { year: 1980 });
    expect(facs1980.some((f) => f.id === "olkiluoto")).toBe(true);
    expect(facs1980.some((f) => f.id === "kudankulam")).toBe(false);

    // In 2024, Kudankulam is operating
    const facs2024 = filterFacilities(CANONICAL_FACILITIES, { year: 2024 });
    expect(facs2024.some((f) => f.id === "kudankulam")).toBe(true);
  });

  it("safely handles unknown facility ID lookup returning null", () => {
    expect(getFacilityById("non-existent-facility")).toBeNull();
  });

  it("rejects invalid facility data with inverted shutdown years or out-of-bounds coordinates", () => {
    const invalidFacility: Facility = {
      id: "broken-fac",
      name: "Broken Facility",
      countryCode: "US",
      countryName: "United States",
      coordinates: { latitude: 120, longitude: 0 }, // invalid latitude > 90
      status: "operating",
      reactorCount: 1,
      totalCapacityMw: 1000,
      units: [
        {
          id: "u-1",
          name: "Unit 1",
          unitNumber: 1,
          reactorType: "PWR",
          status: "shutdown",
          capacityMWe: 1000,
          capacityBasis: "net",
          commercialYear: 2010,
          shutdownYear: 2000, // shutdown before commercial!
        },
      ],
    };

    const integrity = validateFacilityIntegrity(invalidFacility);
    expect(integrity.valid).toBe(false);
    expect(
      integrity.errors.some((e) => e.includes("Latitude out of range")),
    ).toBe(true);
    expect(integrity.errors.some((e) => e.includes("shutdown year"))).toBe(
      true,
    );
  });
});
