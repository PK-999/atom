import { describe, expect, it } from "vitest";
import {
  listGlobalFleet,
  getFleetFacilityById,
  filterGlobalFleet,
  getFleetStats,
  GLOBAL_FLEET,
} from "./fleet-model";

describe("Global Reactor Fleet Model", () => {
  it("loads and validates all global fleet facilities", () => {
    const fleet = listGlobalFleet();
    expect(fleet.length).toBe(173);

    // Every facility has required attributes
    for (const fac of fleet) {
      expect(fac.id).toBeTruthy();
      expect(fac.name).toBeTruthy();
      expect(fac.country).toBeTruthy();
      expect(fac.countryCode).toHaveLength(2);
      expect(fac.latitude).toBeGreaterThanOrEqual(-90);
      expect(fac.latitude).toBeLessThanOrEqual(90);
      expect(fac.longitude).toBeGreaterThanOrEqual(-180);
      expect(fac.longitude).toBeLessThanOrEqual(180);
      expect(fac.totalCapacityMWe).toBeGreaterThan(0);
      expect(fac.units.length).toBeGreaterThan(0);
      expect(fac.iaeaPrisId).toBeTruthy();
    }
  });

  it("retrieves specific facility by ID case-insensitively", () => {
    const kashiwazaki = getFleetFacilityById("kashiwazaki-kariwa");
    expect(kashiwazaki).not.toBeNull();
    expect(kashiwazaki?.country).toBe("Japan");
    expect(kashiwazaki?.totalCapacityMWe).toBe(7965);

    const barakah = getFleetFacilityById("BARAKAH");
    expect(barakah).not.toBeNull();
    expect(barakah?.countryCode).toBe("AE");

    expect(getFleetFacilityById("unknown-nonexistent-site")).toBeNull();
  });

  it("calculates fleet aggregate statistics correctly", () => {
    const stats = getFleetStats();
    expect(stats.totalFacilities).toBe(173);
    expect(stats.totalUnits).toBeGreaterThan(100);
    expect(stats.totalCapacityMWe).toBeGreaterThan(100000); // > 100 GWe
    expect(stats.countriesCount).toBeGreaterThanOrEqual(15);
    expect(stats.operatingCount).toBeGreaterThan(50);
  });

  it("filters fleet by region and country code", () => {
    const northAmerica = filterGlobalFleet(GLOBAL_FLEET, {
      region: "North America",
    });
    expect(northAmerica.length).toBeGreaterThan(0);
    expect(northAmerica.every((f) => f.region === "North America")).toBe(true);

    const france = filterGlobalFleet(GLOBAL_FLEET, { countryCode: "FR" });
    expect(france.length).toBeGreaterThanOrEqual(3);
    expect(france.every((f) => f.countryCode === "FR")).toBe(true);
  });

  it("filters fleet by primary reactor type", () => {
    const vverReactors = filterGlobalFleet(GLOBAL_FLEET, {
      primaryReactorType: "VVER",
    });
    expect(vverReactors.length).toBeGreaterThan(0);
    expect(
      vverReactors.some(
        (f) =>
          f.id === "kudankulam" ||
          f.id === "tianwan" ||
          f.id === "zaporizhzhia",
      ),
    ).toBe(true);

    const bwrReactors = filterGlobalFleet(GLOBAL_FLEET, {
      primaryReactorType: "BWR",
    });
    expect(bwrReactors.length).toBeGreaterThan(0);
  });

  it("searches fleet by text query across name, operator, and country", () => {
    const searchKudankulam = filterGlobalFleet(GLOBAL_FLEET, {
      searchQuery: "kudankulam",
    });
    expect(searchKudankulam.length).toBe(1);
    expect(searchKudankulam[0].id).toBe("kudankulam");

    const searchEdf = filterGlobalFleet(GLOBAL_FLEET, { searchQuery: "EDF" });
    expect(searchEdf.length).toBeGreaterThanOrEqual(3);

    const searchHualong = filterGlobalFleet(GLOBAL_FLEET, {
      searchQuery: "Hualong",
    });
    expect(searchHualong.length).toBeGreaterThanOrEqual(1);
    expect(searchHualong[0].id).toBe("fuqing");
  });
});
