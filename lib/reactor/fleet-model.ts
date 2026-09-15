import { z } from "zod";
import rawFleet from "@/data/reactors/global-fleet.json";

export const FleetUnitSchema = z
  .object({
    unitName: z.string().min(1),
    type: z.string().min(1),
    netMWe: z.number().nonnegative(),
    status: z.enum([
      "operating",
      "under-construction",
      "shutdown",
      "decommissioned",
    ]),
    commercialYear: z.number().int().optional(),
    shutdownYear: z.number().int().optional(),
  })
  .strict();

export const FleetFacilitySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    country: z.string().min(1),
    countryCode: z.string().length(2).toUpperCase(),
    region: z.string().min(1),
    city: z.string().optional(),
    stateProvince: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    status: z.enum([
      "operating",
      "under-construction",
      "shutdown",
      "decommissioned",
      "mixed",
    ]),
    totalCapacityMWe: z.number().nonnegative(),
    reactorCount: z.number().int().positive(),
    primaryReactorType: z.string().min(1),
    firstCommercialYear: z.number().int(),
    operator: z.string().min(1),
    units: z.array(FleetUnitSchema),
    iaeaPrisId: z.string().min(1),
    age: z.number().int(),
  })
  .strict();

export type FleetUnit = z.infer<typeof FleetUnitSchema>;
export type FleetFacility = z.infer<typeof FleetFacilitySchema>;

export interface FleetFilters {
  region?: string;
  countryCode?: string;
  status?: string;
  primaryReactorType?: string;
  searchQuery?: string;
}

export interface FleetStats {
  totalFacilities: number;
  totalUnits: number;
  totalCapacityMWe: number;
  countriesCount: number;
  operatingCount: number;
  underConstructionCount: number;
  shutdownCount: number;
}

// Validate dataset at load time
export const GLOBAL_FLEET: readonly FleetFacility[] = Object.freeze(
  z.array(FleetFacilitySchema).parse(rawFleet),
);

export function listGlobalFleet(): readonly FleetFacility[] {
  return GLOBAL_FLEET;
}

export function getFleetFacilityById(id: string): FleetFacility | null {
  const normalized = id.toLowerCase().trim();
  return GLOBAL_FLEET.find((f) => f.id.toLowerCase() === normalized) ?? null;
}

export function filterGlobalFleet(
  facilities: readonly FleetFacility[],
  filters: FleetFilters,
): readonly FleetFacility[] {
  return facilities.filter((fac) => {
    // Region
    if (filters.region && filters.region !== "all") {
      if (fac.region.toLowerCase() !== filters.region.toLowerCase()) {
        return false;
      }
    }

    // Country Code
    if (filters.countryCode && filters.countryCode !== "all") {
      if (fac.countryCode.toLowerCase() !== filters.countryCode.toLowerCase()) {
        return false;
      }
    }

    // Status
    if (filters.status && filters.status !== "all") {
      if (filters.status === "operating") {
        if (
          fac.status !== "operating" &&
          !fac.units.some((u) => u.status === "operating")
        ) {
          return false;
        }
      } else if (filters.status === "under-construction") {
        if (
          fac.status !== "under-construction" &&
          !fac.units.some((u) => u.status === "under-construction")
        ) {
          return false;
        }
      } else if (
        filters.status === "shutdown" ||
        filters.status === "decommissioned"
      ) {
        if (
          fac.status !== "shutdown" &&
          fac.status !== "decommissioned" &&
          !fac.units.some(
            (u) => u.status === "shutdown" || u.status === "decommissioned",
          )
        ) {
          return false;
        }
      } else if (fac.status !== filters.status) {
        return false;
      }
    }

    // Primary reactor type (PWR, BWR, PHWR, VVER, etc.)
    if (filters.primaryReactorType && filters.primaryReactorType !== "all") {
      const pType = filters.primaryReactorType.toLowerCase();
      const matchesFac = fac.primaryReactorType.toLowerCase().includes(pType);
      const matchesUnit = fac.units.some((u) =>
        u.type.toLowerCase().includes(pType),
      );
      if (!matchesFac && !matchesUnit) return false;
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = fac.name.toLowerCase().includes(q);
      const matchCountry = fac.country.toLowerCase().includes(q);
      const matchOperator = fac.operator.toLowerCase().includes(q);
      const matchType = fac.primaryReactorType.toLowerCase().includes(q);
      const matchId = fac.id.toLowerCase().includes(q);
      const matchUnit = fac.units.some(
        (u) =>
          u.unitName.toLowerCase().includes(q) ||
          u.type.toLowerCase().includes(q),
      );
      if (
        !matchName &&
        !matchCountry &&
        !matchOperator &&
        !matchType &&
        !matchId &&
        !matchUnit
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getFleetStats(
  facilities: readonly FleetFacility[] = GLOBAL_FLEET,
): FleetStats {
  const uniqueCountries = new Set<string>();
  let totalUnits = 0;
  let totalCapacityMWe = 0;
  let operatingCount = 0;
  let underConstructionCount = 0;
  let shutdownCount = 0;

  for (const fac of facilities) {
    uniqueCountries.add(fac.countryCode);
    totalCapacityMWe += fac.totalCapacityMWe;
    for (const unit of fac.units) {
      totalUnits++;
      if (unit.status === "operating") operatingCount++;
      else if (unit.status === "under-construction") underConstructionCount++;
      else if (unit.status === "shutdown" || unit.status === "decommissioned")
        shutdownCount++;
    }
  }

  return {
    totalFacilities: facilities.length,
    totalUnits,
    totalCapacityMWe,
    countriesCount: uniqueCountries.size,
    operatingCount,
    underConstructionCount,
    shutdownCount,
  };
}

export function fleetToFacility(fleet: FleetFacility) {
  return {
    id: fleet.id,
    name: fleet.name,
    countryCode: fleet.countryCode,
    countryName: fleet.country,
    city: fleet.city,
    stateProvince: fleet.stateProvince,
    coordinates: { latitude: fleet.latitude, longitude: fleet.longitude },
    status: fleet.status,
    reactorCount: fleet.reactorCount,
    totalCapacityMw: fleet.totalCapacityMWe,
    source: {
      id: `iaea-pris-${fleet.countryCode.toLowerCase()}-${fleet.id}`,
      title: `IAEA PRIS: ${fleet.name}`,
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx",
    },
    units: fleet.units.map((u, idx) => ({
      id: `${fleet.id}-${idx + 1}`,
      name: u.unitName,
      unitNumber: idx + 1,
      reactorType: u.type,
      status: u.status,
      capacityMWe: u.netMWe,
      capacityBasis: "net" as const,
      commercialYear: u.commercialYear,
      shutdownYear: u.shutdownYear,
    })),
  };
}

export function listFleetAsFacilities() {
  return GLOBAL_FLEET.map(fleetToFacility);
}
