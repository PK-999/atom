import {
  ReactorSystemSchema,
  type ReactorSystem,
  type ReactorComponent,
  type ReactorFlow,
  type ReactorCitation,
} from "./schemas";

export interface ReactorModelValidationResult {
  valid: boolean;
  errors: string[];
}

export const PWR_SYSTEM_DATA: ReactorSystem = {
  id: "pwr",
  slug: "pwr",
  type: "PWR",
  name: "Pressurized Water Reactor (PWR)",
  summary:
    "The world's most prevalent nuclear reactor design. Water in the primary cooling circuit is kept under extreme pressure (15.5 MPa) so it cannot boil, transferring heat to a secondary steam loop.",
  conceptDescription:
    "A two-loop indirect Rankine cycle where high-pressure water extracts fission heat from the core and transfers it via a steam generator to a separate lower-pressure water loop that turns a turbine.",
  deployedExamples: [
    "Westinghouse AP1000",
    "Framatome EPR",
    "Rosatom VVER-1200",
    "KEPCO APR1400",
  ],
  operatingContext:
    "Primary coolant operates at ~155 atmospheres and ~325°C. Secondary steam operates at ~65 atmospheres and ~280°C. Complete physical separation prevents radioactive coolant from contacting the turbine.",
  citations: [
    {
      id: "cit-nrc-pwr-basics",
      title: "Pressurized Water Reactor Systems",
      publisher: "US Nuclear Regulatory Commission",
      year: 2020,
      url: "https://www.nrc.gov/reactors/pwrs.html",
      locator: "NUREG-1350, Section 4: Reactor Designs",
    },
    {
      id: "cit-iaea-pwr-status",
      title: "Status of Advanced Light Water Cooled Reactor Designs",
      publisher: "International Atomic Energy Agency",
      year: 2020,
      url: "https://www.iaea.org/publications/14717/status-of-advanced-light-water-cooled-reactor-designs",
      locator: "IAEA-TECDOC-1900, Chapter 2",
    },
  ],
  components: [
    {
      id: "pwr-vessel",
      name: "Reactor Pressure Vessel (RPV)",
      type: "vessel",
      role: "Houses the reactor core and sustains intense coolant pressure",
      description:
        "A thick forged carbon-steel vessel (approx. 20-25 cm thick wall) with an internal stainless-steel cladding that encases the core and contains high-pressure water at 15.5 MPa.",
      simplerExplanation:
        "A gigantic, super-strong steel container that holds the fuel and hot water under intense pressure without breaking.",
      deeperExplanation:
        "Fabricated from low-alloy manganese-molybdenum-nickel steel (e.g. SA-508) to withstand neutron embrittlement, thermal transients, and 17 MPa design pressure over a 60-80 year design life.",
      connectedFlowIds: ["pwr-primary-hot", "pwr-primary-cold"],
      diagramCoords: { x: 100, y: 150, width: 90, height: 160 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
    {
      id: "pwr-fuel",
      name: "Nuclear Fuel Assemblies",
      type: "fuel",
      role: "Generates heat via controlled uranium-235 nuclear fission",
      description:
        "Sintered ceramic uranium dioxide (UO2) pellets, enriched to 3-5% U-235, sealed within corrosion-resistant zirconium alloy (zircaloy) fuel rods arranged in square lattice bundles.",
      simplerExplanation:
        "Small ceramic fuel pellets packed inside metal tubes that release massive amounts of heat when atomic nuclei split.",
      deeperExplanation:
        "Standard 17x17 array containing ~264 fuel rods. Fission energy is transferred across the helium gap and zircaloy cladding to the surrounding forced-circulation water coolant.",
      connectedFlowIds: ["pwr-primary-hot"],
      diagramCoords: { x: 115, y: 200, width: 60, height: 80 },
      citationIds: ["cit-nrc-pwr-basics", "cit-iaea-pwr-status"],
    },
    {
      id: "pwr-control-rods",
      name: "Control Rod Clusters",
      type: "control-rod",
      role: "Regulates reactor power and provides emergency shutdown (SCRAM)",
      description:
        "Neutron-absorbing material (such as silver-indium-cadmium or boron carbide) inserted into the core from the top to capture thermal neutrons and throttle or halt fission.",
      simplerExplanation:
        "Neutron sponges that drop into the fuel to slow down or immediately shut off the atomic reaction in seconds.",
      deeperExplanation:
        "Gravity-assisted failsafe release mechanisms ensure rapid negative reactivity insertion (SCRAM) within 2-3 seconds upon loss of electrical power to magnetic clutches.",
      connectedFlowIds: [],
      diagramCoords: { x: 120, y: 110, width: 50, height: 35 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
    {
      id: "pwr-pressurizer",
      name: "Pressurizer",
      type: "pressurizer",
      role: "Maintains primary coolant system pressure to prevent boiling",
      description:
        "A vertical cylindrical pressure vessel with electric immersion heaters and water spray nozzles that keeps primary water pressurized at ~15.5 MPa (155 atmospheres).",
      simplerExplanation:
        "Like an electronic pressure cooker regulator that keeps water from turning into bubbles even when it's hotter than 300°C.",
      deeperExplanation:
        "Maintains saturated steam-water equilibrium. If pressure drops, electric heaters boil water to increase steam volume; if pressure spikes, cold-leg spray condenses steam to lower pressure.",
      connectedFlowIds: ["pwr-primary-hot"],
      diagramCoords: { x: 215, y: 80, width: 45, height: 110 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
    {
      id: "pwr-steam-gen",
      name: "Steam Generator",
      type: "steam-generator",
      role: "Transfers primary heat to secondary water to produce clean steam",
      description:
        "A tall heat exchanger containing thousands of inverted U-tubes. Hot primary water flows inside the tubes, boiling secondary water outside the tubes into dry saturated steam.",
      simplerExplanation:
        "A heat exchanger where super-hot radioactive water gives its heat to clean water without the two liquids ever mixing.",
      deeperExplanation:
        "Features thousands of Inconel (alloy 690) tubes that act as the principal barrier between the active primary loop and the inactive secondary turbine system, generating steam at ~6.5 MPa.",
      connectedFlowIds: [
        "pwr-primary-hot",
        "pwr-primary-cold",
        "pwr-secondary-steam",
        "pwr-secondary-condensate",
      ],
      diagramCoords: { x: 280, y: 120, width: 80, height: 180 },
      citationIds: ["cit-nrc-pwr-basics", "cit-iaea-pwr-status"],
    },
    {
      id: "pwr-coolant-pump",
      name: "Reactor Coolant Pump (RCP)",
      type: "pump",
      role: "Circulates high-pressure water through the core and steam generator",
      description:
        "High-inertia vertical centrifugal pump designed to pump tens of thousands of gallons per minute of pressurized water through the primary circuit.",
      simplerExplanation:
        "A heavy-duty pump that pushes massive amounts of water around the core loop constantly.",
      deeperExplanation:
        "Fitted with heavy flywheels that provide coast-down flow inertia during a station blackout, ensuring natural circulation transition without core dryout.",
      connectedFlowIds: ["pwr-primary-cold"],
      diagramCoords: { x: 220, y: 260, width: 50, height: 50 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
    {
      id: "pwr-turbine",
      name: "Steam Turbine & Generator",
      type: "turbine",
      role: "Converts thermal steam energy into mechanical rotation and electricity",
      description:
        "Multi-stage high-pressure and low-pressure steam turbines driving a 3000/3600 RPM synchronous electric generator connected to the high-voltage transmission grid.",
      simplerExplanation:
        "Giant spinning blades pushed by high-pressure steam that spin a magnet to generate electricity for homes and cities.",
      deeperExplanation:
        "Expansion of saturated steam through impulse and reaction blading with intermediate moisture separators and reheaters (MSR) to prevent blade erosion.",
      connectedFlowIds: ["pwr-secondary-steam", "pwr-secondary-condensate"],
      diagramCoords: { x: 440, y: 130, width: 120, height: 70 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
    {
      id: "pwr-condenser",
      name: "Surface Condenser",
      type: "condenser",
      role: "Condenses low-pressure exhaust steam back into liquid water",
      description:
        "A shell-and-tube heat exchanger maintained under high vacuum beneath the turbine. Cold tertiary water flows through tubes to condense exhaust steam.",
      simplerExplanation:
        "Cools the spent steam back into liquid water so it can be pumped back to the steam generator to be used again.",
      deeperExplanation:
        "Operates under vacuum (~5-10 kPa) to maximize thermodynamic Carnot cycle efficiency, returning condensate to the secondary feedwater preheaters.",
      connectedFlowIds: ["pwr-secondary-condensate", "pwr-tertiary-cooling"],
      diagramCoords: { x: 450, y: 240, width: 100, height: 60 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
    {
      id: "pwr-containment",
      name: "Containment Structure",
      type: "containment",
      role: "Hermetic radiation and missile impact barrier encasing primary system",
      description:
        "A pre-stressed post-tensioned reinforced concrete dome lined with leak-tight carbon steel, engineered to withstand aircraft impact, seismic earthquakes, and peak internal design pressure.",
      simplerExplanation:
        "A massive dome of concrete and steel built like a fortress to stop radiation and resist external impacts.",
      deeperExplanation:
        "Designed to contain the full thermal energy and steam inventory of a design-basis Loss-of-Coolant Accident (LOCA) at ~0.4 to 0.5 MPa without releasing radioactivity to the environment.",
      connectedFlowIds: [],
      diagramCoords: { x: 50, y: 40, width: 330, height: 310 },
      citationIds: ["cit-nrc-pwr-basics", "cit-iaea-pwr-status"],
    },
    {
      id: "pwr-cooling-tower",
      name: "Cooling Tower / Heat Sink",
      type: "cooling-tower",
      role: "Rejects residual low-temperature waste heat to the atmosphere or body of water",
      description:
        "A natural-draft hyperbolic reinforced concrete cooling tower that evaporates a tiny fraction of cooling water into the air, visible as pure water vapor.",
      simplerExplanation:
        "The iconic curved tower that lets harmless warm water vapor evaporate into the air.",
      deeperExplanation:
        "Rejects the ~65% of thermodynamic heat not converted into electricity. The white plume emitted is pure condensed water vapor, never radioactive gas.",
      connectedFlowIds: ["pwr-tertiary-cooling"],
      diagramCoords: { x: 620, y: 150, width: 85, height: 150 },
      citationIds: ["cit-nrc-pwr-basics"],
    },
  ],
  flows: [
    {
      id: "pwr-primary-hot",
      name: "Primary Hot Leg",
      fromComponentId: "pwr-vessel",
      toComponentId: "pwr-steam-gen",
      loop: "primary",
      fluid: "Subcooled borated light water",
      operatingTemp: "325°C",
      operatingPressure: "15.5 MPa (155 bar)",
    },
    {
      id: "pwr-primary-cold",
      name: "Primary Cold Leg",
      fromComponentId: "pwr-steam-gen",
      toComponentId: "pwr-vessel",
      loop: "primary",
      fluid: "Subcooled borated light water",
      operatingTemp: "290°C",
      operatingPressure: "15.5 MPa (155 bar)",
    },
    {
      id: "pwr-secondary-steam",
      name: "Secondary Steam Line",
      fromComponentId: "pwr-steam-gen",
      toComponentId: "pwr-turbine",
      loop: "secondary",
      fluid: "Dry saturated steam",
      operatingTemp: "280°C",
      operatingPressure: "6.5 MPa (65 bar)",
    },
    {
      id: "pwr-secondary-condensate",
      name: "Secondary Condensate Return",
      fromComponentId: "pwr-condenser",
      toComponentId: "pwr-steam-gen",
      loop: "secondary",
      fluid: "Purified demineralized feedwater",
      operatingTemp: "40°C - 220°C",
      operatingPressure: "7.0 MPa",
    },
    {
      id: "pwr-tertiary-cooling",
      name: "Tertiary Condenser Cooling Loop",
      fromComponentId: "pwr-condenser",
      toComponentId: "pwr-cooling-tower",
      loop: "tertiary-cooling",
      fluid: "River, lake, ocean, or evaporative tower water",
      operatingTemp: "20°C - 35°C",
      operatingPressure: "Atmospheric (0.1 MPa)",
    },
  ],
};

export const BWR_SYSTEM_DATA: ReactorSystem = {
  id: "bwr",
  slug: "bwr",
  type: "BWR",
  name: "Boiling Water Reactor (BWR)",
  summary:
    "A direct-cycle reactor where water boils directly inside the reactor core, producing steam that drives the turbine without needing a separate steam generator.",
  conceptDescription:
    "Direct Rankine cycle operating at ~7.0 MPa. Steam separators and dryers located inside the reactor vessel head ensure only dry steam leaves for the turbine.",
  deployedExamples: ["GE Hitachi ABWR", "BWRX-300 SMR", "Toshiba ESBWR"],
  operatingContext:
    "Operates at lower pressure (7 MPa vs 15.5 MPa in PWRs) which reduces vessel wall thickness requirements. Because primary steam directly enters the turbine, turbine buildings require radiation shielding during operation.",
  citations: [
    {
      id: "cit-nrc-bwr-basics",
      title: "Boiling Water Reactor Systems",
      publisher: "US Nuclear Regulatory Commission",
      year: 2020,
      url: "https://www.nrc.gov/reactors/bwrs.html",
      locator: "NUREG-1350, Section 4",
    },
  ],
  components: [
    {
      id: "bwr-vessel",
      name: "BWR Reactor Pressure Vessel",
      type: "vessel",
      role: "Contains the core and directly generates saturated steam at 7.0 MPa",
      description:
        "Large vertical pressure vessel with steam dryers and moisture separators in the upper dome, allowing water to boil directly around the core.",
      simplerExplanation:
        "A giant boiler pot that creates steam right inside the vessel directly from the nuclear fuel.",
      deeperExplanation:
        "Internal steam separators swirl two-phase mixture using centrifugal forces; moisture dryers reduce moisture content below 0.1% before steam exit.",
      connectedFlowIds: ["bwr-steam-line", "bwr-feedwater"],
      diagramCoords: { x: 120, y: 130, width: 100, height: 200 },
      citationIds: ["cit-nrc-bwr-basics"],
    },
    {
      id: "bwr-fuel",
      name: "BWR Fuel Bundles",
      type: "fuel",
      role: "Fission heat source with channel boxes directing two-phase flow",
      description:
        "Low-enriched uranium dioxide rods encased in zircaloy channels that maintain defined coolant flow channels between fuel assemblies.",
      simplerExplanation:
        "Nuclear fuel rods enclosed in metal boxes that boil water directly as it flows past them.",
      deeperExplanation:
        "Channel boxes prevent cross-flow between adjacent assemblies and provide guiding channels for bottom-entry cruciform control rods.",
      connectedFlowIds: ["bwr-steam-line"],
      diagramCoords: { x: 140, y: 220, width: 60, height: 80 },
      citationIds: ["cit-nrc-bwr-basics"],
    },
    {
      id: "bwr-control-rods",
      name: "Bottom-Entry Control Rods",
      type: "control-rod",
      role: "Cruciform control blades inserted from the bottom of the vessel",
      description:
        "Because the top of a BWR vessel is filled with steam dryers, control rods are hydraulically pushed up into the core from below.",
      simplerExplanation:
        "Control rods that push up from underneath the reactor because the top is full of steam machinery.",
      deeperExplanation:
        "Hydraulic control rod drive mechanisms (CRDMs) provide fast insertion against gravity using high-pressure accumulator nitrogen gas.",
      connectedFlowIds: [],
      diagramCoords: { x: 145, y: 310, width: 50, height: 35 },
      citationIds: ["cit-nrc-bwr-basics"],
    },
    {
      id: "bwr-turbine",
      name: "Direct Steam Turbine",
      type: "turbine",
      role: "Spun directly by primary steam from the reactor core",
      description:
        "Turbine receiving steam directly from the reactor pressure vessel, housed in a shielded turbine building.",
      simplerExplanation:
        "Turbine driven directly by steam made in the reactor.",
      deeperExplanation:
        "Carries Nitrogen-16 activity (7-second half-life) during operation; radiation decays away completely within minutes of plant shutdown.",
      connectedFlowIds: ["bwr-steam-line", "bwr-feedwater"],
      diagramCoords: { x: 380, y: 150, width: 120, height: 70 },
      citationIds: ["cit-nrc-bwr-basics"],
    },
    {
      id: "bwr-condenser",
      name: "Main Condenser & Feedwater",
      type: "condenser",
      role: "Condenses turbine exhaust steam and pumps it back to the reactor core",
      description:
        "Vacuum condenser that liquifies steam and returns demineralized water via high-pressure feedwater pumps.",
      simplerExplanation:
        "Turns steam back into clean water to be pumped right back into the reactor pot.",
      deeperExplanation:
        "Full-flow condensate polishing demineralizers maintain strict water chemistry to minimize activation and deposition inside the core.",
      connectedFlowIds: ["bwr-feedwater"],
      diagramCoords: { x: 390, y: 260, width: 100, height: 60 },
      citationIds: ["cit-nrc-bwr-basics"],
    },
  ],
  flows: [
    {
      id: "bwr-steam-line",
      name: "Direct Reactor Steam Line",
      fromComponentId: "bwr-vessel",
      toComponentId: "bwr-turbine",
      loop: "primary",
      fluid: "Dry saturated steam",
      operatingTemp: "285°C",
      operatingPressure: "7.0 MPa (70 bar)",
    },
    {
      id: "bwr-feedwater",
      name: "Feedwater Return",
      fromComponentId: "bwr-condenser",
      toComponentId: "bwr-vessel",
      loop: "primary",
      fluid: "Demineralized liquid water",
      operatingTemp: "215°C",
      operatingPressure: "7.5 MPa",
    },
  ],
};

export const PHWR_SYSTEM_DATA: ReactorSystem = {
  id: "phwr",
  slug: "phwr",
  type: "PHWR",
  name: "Pressurized Heavy Water Reactor (PHWR / CANDU)",
  summary:
    "Uses heavy water (deuterium oxide, D2O) as both moderator and coolant. Operates on natural unenriched uranium, features horizontal pressure tubes, and refuels on-power without shutting down.",
  conceptDescription:
    "A low-pressure calandria tank containing low-temperature heavy water moderator penetrates hundreds of high-pressure zircaloy fuel tubes containing natural uranium.",
  deployedExamples: [
    "CANDU 6",
    "Indian 700 MWe PHWR (Kakrapur 3 & 4)",
    "Embalse (Argentina)",
    "Qinshan III (China)",
  ],
  operatingContext:
    "High neutron economy of heavy water enables operation using natural uranium (0.7% U-235), avoiding isotopic enrichment facilities. Bidirectional on-power refueling enables continuous 90%+ capacity factors.",
  citations: [
    {
      id: "cit-iaea-phwr-status",
      title: "Heavy Water Reactors: Status and Projected Development",
      publisher: "International Atomic Energy Agency",
      year: 2021,
      url: "https://www.iaea.org/publications/6438/heavy-water-reactors-status-and-projected-development",
      locator: "Technical Reports Series No. 407",
    },
  ],
  components: [
    {
      id: "phwr-calandria",
      name: "Horizontal Calandria Vessel",
      type: "calandria",
      role: "Contains heavy water moderator at near-atmospheric pressure and low temperature",
      description:
        "Large cylindrical stainless steel tank pierced horizontally by hundreds of calandria tubes through which pressure tubes pass.",
      simplerExplanation:
        "A large tank filled with heavy water at normal room pressure that slows neutrons down efficiently.",
      deeperExplanation:
        "Maintains D2O moderator at ~70°C and 0.1 MPa, completely insulated from the hot pressurized coolant by an insulating gas annulus.",
      connectedFlowIds: ["phwr-primary-hot", "phwr-primary-cold"],
      diagramCoords: { x: 120, y: 150, width: 140, height: 160 },
      citationIds: ["cit-iaea-phwr-status"],
    },
    {
      id: "phwr-fuel",
      name: "Natural Uranium Fuel Bundles",
      type: "fuel",
      role: "Short fuel bundles containing natural (unenriched 0.7% U-235) uranium",
      description:
        "Half-meter-long circular bundles of zircaloy tubes filled with natural UO2, designed for robotic on-power loading and shuffling.",
      simplerExplanation:
        "Short cylinders of natural uranium that can be changed while the reactor is running at full power.",
      deeperExplanation:
        "Enables domestic nuclear power without uranium enrichment infrastructure; high burnup is achieved by bi-directional shuffling.",
      connectedFlowIds: ["phwr-primary-hot"],
      diagramCoords: { x: 140, y: 210, width: 100, height: 40 },
      citationIds: ["cit-iaea-phwr-status"],
    },
    {
      id: "phwr-steam-gen",
      name: "Steam Generators (PHWR)",
      type: "steam-generator",
      role: "Transfers heat from pressurized heavy water to ordinary light water steam loop",
      description:
        "Vertical inverted U-tube heat exchangers that generate light water steam for the turbine.",
      simplerExplanation:
        "Separates the expensive heavy water from the normal water that spins the generator turbine.",
      deeperExplanation:
        "Heavy water remains entirely confined to the primary loop; secondary loop uses standard light water Rankine cycle.",
      connectedFlowIds: [
        "phwr-primary-hot",
        "phwr-primary-cold",
        "phwr-secondary-steam",
      ],
      diagramCoords: { x: 300, y: 120, width: 70, height: 170 },
      citationIds: ["cit-iaea-phwr-status"],
    },
    {
      id: "phwr-turbine",
      name: "Light Water Steam Turbine",
      type: "turbine",
      role: "Generates electricity using conventional steam",
      description:
        "Standard multi-stage turbine running on saturated steam produced by the secondary side of the steam generators.",
      simplerExplanation:
        "Standard power plant turbine driven by regular clean steam.",
      deeperExplanation:
        "Completely non-radioactive secondary steam driving a high-capacity electric generator.",
      connectedFlowIds: ["phwr-secondary-steam"],
      diagramCoords: { x: 440, y: 140, width: 110, height: 70 },
      citationIds: ["cit-iaea-phwr-status"],
    },
  ],
  flows: [
    {
      id: "phwr-primary-hot",
      name: "Primary Heavy Water Hot Leg",
      fromComponentId: "phwr-calandria",
      toComponentId: "phwr-steam-gen",
      loop: "primary",
      fluid: "Pressurized Heavy Water (D2O)",
      operatingTemp: "310°C",
      operatingPressure: "10.0 MPa (100 bar)",
    },
    {
      id: "phwr-primary-cold",
      name: "Primary Heavy Water Cold Leg",
      fromComponentId: "phwr-steam-gen",
      toComponentId: "phwr-calandria",
      loop: "primary",
      fluid: "Pressurized Heavy Water (D2O)",
      operatingTemp: "265°C",
      operatingPressure: "10.0 MPa (100 bar)",
    },
    {
      id: "phwr-secondary-steam",
      name: "Secondary Light Water Steam",
      fromComponentId: "phwr-steam-gen",
      toComponentId: "phwr-turbine",
      loop: "secondary",
      fluid: "Ordinary steam (H2O)",
      operatingTemp: "250°C",
      operatingPressure: "4.5 MPa",
    },
  ],
};

const ALL_SYSTEMS: readonly ReactorSystem[] = [
  PWR_SYSTEM_DATA,
  BWR_SYSTEM_DATA,
  PHWR_SYSTEM_DATA,
];

// Validate all static reactor systems at startup
ALL_SYSTEMS.forEach((system) => {
  const parsed = ReactorSystemSchema.parse(system);
  const integrity = validateReactorSystemIntegrity(parsed);
  if (!integrity.valid) {
    throw new Error(
      `Reactor system ${system.id} failed integrity: ${integrity.errors.join("; ")}`,
    );
  }
});

export function validateReactorSystemIntegrity(
  system: ReactorSystem,
): ReactorModelValidationResult {
  const errors: string[] = [];
  const compIds = new Set<string>();
  const flowIds = new Set<string>();
  const citationIds = new Set<string>(system.citations.map((c) => c.id));

  for (const comp of system.components) {
    if (compIds.has(comp.id)) {
      errors.push(
        `Duplicate component ID: "${comp.id}" in system "${system.id}"`,
      );
    }
    compIds.add(comp.id);

    // Validate citations
    for (const cId of comp.citationIds) {
      if (!citationIds.has(cId)) {
        errors.push(
          `Component "${comp.id}" references unknown citation ID "${cId}"`,
        );
      }
    }
  }

  for (const flow of system.flows) {
    if (flowIds.has(flow.id)) {
      errors.push(`Duplicate flow ID: "${flow.id}" in system "${system.id}"`);
    }
    flowIds.add(flow.id);

    // Validate connection endpoints (no orphan connections)
    if (!compIds.has(flow.fromComponentId)) {
      errors.push(
        `Flow "${flow.id}" has orphan fromComponentId: "${flow.fromComponentId}"`,
      );
    }
    if (!compIds.has(flow.toComponentId)) {
      errors.push(
        `Flow "${flow.id}" has orphan toComponentId: "${flow.toComponentId}"`,
      );
    }
  }

  // Validate that component connectedFlowIds actually exist
  for (const comp of system.components) {
    for (const fId of comp.connectedFlowIds) {
      if (!flowIds.has(fId)) {
        errors.push(
          `Component "${comp.id}" references non-existent flow ID "${fId}"`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function listReactorSystems(): readonly ReactorSystem[] {
  return ALL_SYSTEMS;
}

export function getReactorSystem(idOrSlug: string): ReactorSystem | null {
  const normalized = idOrSlug.toLowerCase();
  return (
    ALL_SYSTEMS.find(
      (s) =>
        s.id.toLowerCase() === normalized ||
        s.slug?.toLowerCase() === normalized ||
        s.type.toLowerCase() === normalized,
    ) ?? null
  );
}

export function getConnectedFlows(
  system: ReactorSystem,
  componentId: string,
): readonly ReactorFlow[] {
  return system.flows.filter(
    (f) => f.fromComponentId === componentId || f.toComponentId === componentId,
  );
}

/**
 * Resolves safe selection state: returns component ID if valid, null otherwise.
 */
export function selectPart(
  system: ReactorSystem,
  partId: string | null,
): string | null {
  if (!partId) return null;
  const found = system.components.some((c) => c.id === partId);
  return found ? partId : null;
}

export function resolveComponentCitations(
  system: ReactorSystem,
  component: ReactorComponent,
): readonly ReactorCitation[] {
  return component.citationIds
    .map((cId) => system.citations.find((c) => c.id === cId))
    .filter((c): c is ReactorCitation => c !== undefined);
}
