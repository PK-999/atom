import { FacilitySchema, type Facility, type FacilityStatus } from "./schemas";

export interface FacilityFilters {
  country?: string;
  status?: FacilityStatus | "all";
  year?: number;
  searchQuery?: string;
}

export interface FacilityModelValidationResult {
  valid: boolean;
  errors: string[];
}

export const CANONICAL_FACILITIES: readonly Facility[] = [
  {
    id: "kudankulam",
    name: "Kudankulam Nuclear Power Plant",
    countryCode: "IN",
    countryName: "India",
    coordinates: { latitude: 8.169, longitude: 77.712 },
    status: "mixed",
    reactorCount: 4,
    totalCapacityMw: 3834,
    source: {
      id: "iaea-pris-in-kudankulam",
      title: "IAEA Power Reactor Information System: Kudankulam",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=855",
    },
    units: [
      {
        id: "kudankulam-1",
        name: "Kudankulam 1",
        unitNumber: 1,
        reactorType: "VVER-1000",
        status: "operating",
        capacityMWe: 917,
        capacityBasis: "net",
        commercialYear: 2014,
      },
      {
        id: "kudankulam-2",
        name: "Kudankulam 2",
        unitNumber: 2,
        reactorType: "VVER-1000",
        status: "operating",
        capacityMWe: 917,
        capacityBasis: "net",
        commercialYear: 2017,
      },
      {
        id: "kudankulam-3",
        name: "Kudankulam 3",
        unitNumber: 3,
        reactorType: "VVER-1000",
        status: "under-construction",
        capacityMWe: 1000,
        capacityBasis: "net",
        commercialYear: 2027,
      },
      {
        id: "kudankulam-4",
        name: "Kudankulam 4",
        unitNumber: 4,
        reactorType: "VVER-1000",
        status: "under-construction",
        capacityMWe: 1000,
        capacityBasis: "net",
        commercialYear: 2028,
      },
    ],
  },
  {
    id: "kakrapar",
    name: "Kakrapar Atomic Power Station",
    countryCode: "IN",
    countryName: "India",
    coordinates: { latitude: 21.237, longitude: 73.35 },
    status: "operating",
    reactorCount: 4,
    totalCapacityMw: 1664,
    source: {
      id: "iaea-pris-in-kakrapar",
      title: "IAEA Power Reactor Information System: Kakrapar",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=311",
    },
    units: [
      {
        id: "kakrapar-1",
        name: "Kakrapar 1",
        unitNumber: 1,
        reactorType: "IPHWR-220",
        status: "operating",
        capacityMWe: 202,
        capacityBasis: "net",
        commercialYear: 1993,
      },
      {
        id: "kakrapar-2",
        name: "Kakrapar 2",
        unitNumber: 2,
        reactorType: "IPHWR-220",
        status: "operating",
        capacityMWe: 202,
        capacityBasis: "net",
        commercialYear: 1995,
      },
      {
        id: "kakrapar-3",
        name: "Kakrapar 3",
        unitNumber: 3,
        reactorType: "IPHWR-700",
        status: "operating",
        capacityMWe: 630,
        capacityBasis: "net",
        commercialYear: 2023,
      },
      {
        id: "kakrapar-4",
        name: "Kakrapar 4",
        unitNumber: 4,
        reactorType: "IPHWR-700",
        status: "operating",
        capacityMWe: 630,
        capacityBasis: "net",
        commercialYear: 2024,
      },
    ],
  },
  {
    id: "olkiluoto",
    name: "Olkiluoto Nuclear Power Plant",
    countryCode: "FI",
    countryName: "Finland",
    coordinates: { latitude: 61.237, longitude: 21.442 },
    status: "operating",
    reactorCount: 3,
    totalCapacityMw: 3380,
    source: {
      id: "iaea-pris-fi-olkiluoto",
      title: "IAEA Power Reactor Information System: Olkiluoto",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=152",
    },
    units: [
      {
        id: "olkiluoto-1",
        name: "Olkiluoto 1",
        unitNumber: 1,
        reactorType: "BWR",
        status: "operating",
        capacityMWe: 890,
        capacityBasis: "net",
        commercialYear: 1979,
      },
      {
        id: "olkiluoto-2",
        name: "Olkiluoto 2",
        unitNumber: 2,
        reactorType: "BWR",
        status: "operating",
        capacityMWe: 890,
        capacityBasis: "net",
        commercialYear: 1982,
      },
      {
        id: "olkiluoto-3",
        name: "Olkiluoto 3",
        unitNumber: 3,
        reactorType: "EPR",
        status: "operating",
        capacityMWe: 1600,
        capacityBasis: "net",
        commercialYear: 2023,
      },
    ],
  },
  {
    id: "barakah",
    name: "Barakah Nuclear Energy Plant",
    countryCode: "AE",
    countryName: "United Arab Emirates",
    coordinates: { latitude: 23.971, longitude: 52.235 },
    status: "operating",
    reactorCount: 4,
    totalCapacityMw: 5380,
    source: {
      id: "iaea-pris-ae-barakah",
      title: "IAEA Power Reactor Information System: Barakah",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=985",
    },
    units: [
      {
        id: "barakah-1",
        name: "Barakah 1",
        unitNumber: 1,
        reactorType: "APR-1400",
        status: "operating",
        capacityMWe: 1345,
        capacityBasis: "net",
        commercialYear: 2021,
      },
      {
        id: "barakah-2",
        name: "Barakah 2",
        unitNumber: 2,
        reactorType: "APR-1400",
        status: "operating",
        capacityMWe: 1345,
        capacityBasis: "net",
        commercialYear: 2022,
      },
      {
        id: "barakah-3",
        name: "Barakah 3",
        unitNumber: 3,
        reactorType: "APR-1400",
        status: "operating",
        capacityMWe: 1345,
        capacityBasis: "net",
        commercialYear: 2023,
      },
      {
        id: "barakah-4",
        name: "Barakah 4",
        unitNumber: 4,
        reactorType: "APR-1400",
        status: "operating",
        capacityMWe: 1345,
        capacityBasis: "net",
        commercialYear: 2024,
      },
    ],
  },
  {
    id: "vogtle",
    name: "Alvin W. Vogtle Electric Generating Plant",
    countryCode: "US",
    countryName: "United States",
    coordinates: { latitude: 33.142, longitude: -81.763 },
    status: "operating",
    reactorCount: 4,
    totalCapacityMw: 4534,
    source: {
      id: "iaea-pris-us-vogtle",
      title: "IAEA Power Reactor Information System: Vogtle",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=669",
    },
    units: [
      {
        id: "vogtle-1",
        name: "Vogtle 1",
        unitNumber: 1,
        reactorType: "4-Loop PWR",
        status: "operating",
        capacityMWe: 1150,
        capacityBasis: "net",
        commercialYear: 1987,
      },
      {
        id: "vogtle-2",
        name: "Vogtle 2",
        unitNumber: 2,
        reactorType: "4-Loop PWR",
        status: "operating",
        capacityMWe: 1150,
        capacityBasis: "net",
        commercialYear: 1989,
      },
      {
        id: "vogtle-3",
        name: "Vogtle 3",
        unitNumber: 3,
        reactorType: "AP1000",
        status: "operating",
        capacityMWe: 1117,
        capacityBasis: "net",
        commercialYear: 2023,
      },
      {
        id: "vogtle-4",
        name: "Vogtle 4",
        unitNumber: 4,
        reactorType: "AP1000",
        status: "operating",
        capacityMWe: 1117,
        capacityBasis: "net",
        commercialYear: 2024,
      },
    ],
  },
  {
    id: "fukushima-daiichi",
    name: "Fukushima Daiichi Nuclear Power Station",
    countryCode: "JP",
    countryName: "Japan",
    coordinates: { latitude: 37.421, longitude: 141.033 },
    status: "decommissioned",
    reactorCount: 6,
    totalCapacityMw: 4546,
    source: {
      id: "iaea-pris-jp-fukushima",
      title: "IAEA Power Reactor Information System: Fukushima Daiichi",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=346",
    },
    units: [
      {
        id: "fukushima-1",
        name: "Fukushima Daiichi 1",
        unitNumber: 1,
        reactorType: "BWR-3",
        status: "decommissioned",
        capacityMWe: 439,
        capacityBasis: "net",
        commercialYear: 1971,
        shutdownYear: 2011,
      },
      {
        id: "fukushima-2",
        name: "Fukushima Daiichi 2",
        unitNumber: 2,
        reactorType: "BWR-4",
        status: "decommissioned",
        capacityMWe: 760,
        capacityBasis: "net",
        commercialYear: 1974,
        shutdownYear: 2011,
      },
    ],
  },
  {
    id: "chernobyl",
    name: "Chernobyl Nuclear Power Plant",
    countryCode: "UA",
    countryName: "Ukraine",
    coordinates: { latitude: 51.389, longitude: 30.099 },
    status: "shutdown",
    reactorCount: 4,
    totalCapacityMw: 3800,
    source: {
      id: "iaea-pris-ua-chernobyl",
      title: "IAEA Power Reactor Information System: Chernobyl",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=590",
    },
    units: [
      {
        id: "chernobyl-1",
        name: "Chernobyl 1",
        unitNumber: 1,
        reactorType: "RBMK-1000",
        status: "shutdown",
        capacityMWe: 925,
        capacityBasis: "net",
        commercialYear: 1978,
        shutdownYear: 1996,
      },
      {
        id: "chernobyl-4",
        name: "Chernobyl 4",
        unitNumber: 4,
        reactorType: "RBMK-1000",
        status: "decommissioned",
        capacityMWe: 925,
        capacityBasis: "net",
        commercialYear: 1984,
        shutdownYear: 1986,
      },
    ],
  },
  {
    id: "gravelines",
    name: "Gravelines Nuclear Power Station",
    countryCode: "FR",
    countryName: "France",
    coordinates: { latitude: 51.015, longitude: 2.136 },
    status: "operating",
    reactorCount: 6,
    totalCapacityMw: 5460,
    source: {
      id: "iaea-pris-fr-gravelines",
      title: "IAEA Power Reactor Information System: Gravelines",
      publisher: "IAEA PRIS",
      asOf: "2026-01-01",
      url: "https://pris.iaea.org/PRIS/CountryStatistics/FacilityDetails.aspx?current=189",
    },
    units: [
      {
        id: "gravelines-1",
        name: "Gravelines 1",
        unitNumber: 1,
        reactorType: "CP1 PWR",
        status: "operating",
        capacityMWe: 910,
        capacityBasis: "net",
        commercialYear: 1980,
      },
      {
        id: "gravelines-2",
        name: "Gravelines 2",
        unitNumber: 2,
        reactorType: "CP1 PWR",
        status: "operating",
        capacityMWe: 910,
        capacityBasis: "net",
        commercialYear: 1980,
      },
    ],
  },
];

// Validate all facilities at module load time
CANONICAL_FACILITIES.forEach((fac) => {
  const parsed = FacilitySchema.parse(fac);
  const integrity = validateFacilityIntegrity(parsed);
  if (!integrity.valid) {
    throw new Error(
      `Facility "${fac.id}" failed integrity check: ${integrity.errors.join("; ")}`,
    );
  }
});

export function validateFacilityIntegrity(
  facility: Facility,
): FacilityModelValidationResult {
  const errors: string[] = [];

  // Validate latitude & longitude bounds
  if (
    facility.coordinates.latitude < -90 ||
    facility.coordinates.latitude > 90
  ) {
    errors.push(
      `Latitude out of range [-90, 90]: ${facility.coordinates.latitude}`,
    );
  }
  if (
    facility.coordinates.longitude < -180 ||
    facility.coordinates.longitude > 180
  ) {
    errors.push(
      `Longitude out of range [-180, 180]: ${facility.coordinates.longitude}`,
    );
  }

  // Validate unique unit numbers
  const unitNumbers = new Set<number>();
  for (const unit of facility.units) {
    if (unitNumbers.has(unit.unitNumber)) {
      errors.push(
        `Duplicate unit number ${unit.unitNumber} in facility "${facility.id}"`,
      );
    }
    unitNumbers.add(unit.unitNumber);

    // Validate commercial and shutdown years
    if (
      unit.commercialYear &&
      unit.shutdownYear &&
      unit.shutdownYear < unit.commercialYear
    ) {
      errors.push(
        `Unit "${unit.id}" shutdown year (${unit.shutdownYear}) precedes commercial year (${unit.commercialYear})`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function listFacilities(): readonly Facility[] {
  return CANONICAL_FACILITIES;
}

export function getFacilityById(id: string): Facility | null {
  const found = CANONICAL_FACILITIES.find(
    (f) => f.id.toLowerCase() === id.toLowerCase(),
  );
  return found ?? null;
}

export function filterFacilities(
  facilities: readonly Facility[],
  filters: FacilityFilters,
): readonly Facility[] {
  return facilities.filter((fac) => {
    // Country filter
    if (filters.country && filters.country !== "all") {
      if (fac.countryCode.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (filters.status === "operating") {
        const hasOperating =
          fac.status === "operating" ||
          fac.units.some((u) => u.status === "operating");
        if (!hasOperating) return false;
      } else if (filters.status === "under-construction") {
        const hasConstruction =
          fac.status === "under-construction" ||
          fac.units.some((u) => u.status === "under-construction");
        if (!hasConstruction) return false;
      } else if (
        filters.status === "shutdown" ||
        filters.status === "decommissioned"
      ) {
        const hasShutdown =
          fac.status === "shutdown" ||
          fac.status === "decommissioned" ||
          fac.units.some(
            (u) => u.status === "shutdown" || u.status === "decommissioned",
          );
        if (!hasShutdown) return false;
      }
    }

    // Year filter (historical active filter)
    if (filters.year) {
      const year = filters.year;
      const activeInYear = fac.units.some((u) => {
        const start = u.commercialYear ?? 1900;
        const end = u.shutdownYear ?? 2099;
        return year >= start && year <= end;
      });
      if (!activeInYear) return false;
    }

    // Text search query
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = fac.name.toLowerCase().includes(q);
      const matchCountry = fac.countryName.toLowerCase().includes(q);
      const matchReactor = fac.units.some((u) =>
        u.reactorType.toLowerCase().includes(q),
      );
      if (!matchName && !matchCountry && !matchReactor) return false;
    }

    return true;
  });
}
