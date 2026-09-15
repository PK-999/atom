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

export const RBMK_SYSTEM_DATA: ReactorSystem = {
  id: "rbmk",
  slug: "rbmk",
  type: "RBMK",
  name: "Reaktor Bolshoy Moshchnosti Kanalny (RBMK)",
  summary:
    "A Soviet-era graphite-moderated, light-water-cooled reactor with individual vertical pressure tubes, capable of online refueling.",
  conceptDescription:
    "Water boils directly in hundreds of vertical pressure tubes surrounded by a massive graphite moderator block. The steam is separated in large overhead drums and sent to the turbine.",
  deployedExamples: ["Chernobyl", "Smolensk", "Kursk"],
  operatingContext:
    "Operates at ~7 MPa and 284°C. Infamous for the positive void coefficient instability that led to the Chernobyl disaster. Retrofitted post-1986 to increase safety margins.",
  citations: [],
  components: [
    {
      id: "rbmk-graphite-core",
      name: "Graphite Moderator Matrix",
      type: "graphite-core",
      role: "Slows down neutrons to sustain fission",
      description:
        "A massive cylindrical structure built from thousands of graphite blocks, honeycombed with vertical channels for fuel and control rods.",
      simplerExplanation:
        "A giant stack of carbon blocks that bounces neutrons around to keep the chain reaction going.",
      deeperExplanation:
        "Graphite absorbs very few neutrons, allowing the use of low-enriched uranium. However, it can burn if exposed to oxygen at high temperatures.",
      connectedFlowIds: ["rbmk-coolant-flow"],
      diagramCoords: { x: 100, y: 150, width: 90, height: 160 },
      citationIds: [],
    },
    {
      id: "rbmk-steam-drums",
      name: "Steam Separator Drums",
      type: "vessel",
      role: "Separates steam from water",
      description:
        "Large horizontal cylinders located above the core that separate the steam-water mixture emerging from the pressure tubes.",
      simplerExplanation:
        "Huge tanks that catch the boiling water and separate the dry steam to spin the turbine.",
      deeperExplanation:
        "The separated water is pumped back down to the core inlet, while the dry steam goes directly to the turbine (a direct cycle).",
      connectedFlowIds: ["rbmk-steam-flow"],
      diagramCoords: { x: 100, y: 50, width: 90, height: 40 },
      citationIds: [],
    },
    {
      id: "rbmk-control-rods",
      name: "Control Rods",
      type: "control-rod",
      role: "Regulates reactor power",
      description:
        "Boron carbide rods that move vertically through the graphite matrix. Originally featured graphite 'displacer' tips which caused a brief power spike when inserted.",
      simplerExplanation: "Rods that absorb neutrons to control the reaction.",
      deeperExplanation:
        "The flawed design of the displacer tips was a direct contributor to the Chernobyl accident. This flaw was corrected across the fleet.",
      connectedFlowIds: [],
      diagramCoords: { x: 120, y: 100, width: 50, height: 35 },
      citationIds: [],
    },
    {
      id: "rbmk-turbine",
      name: "Steam Turbine",
      type: "turbine",
      role: "Converts steam pressure to rotational energy",
      description:
        "Direct-cycle turbine driven by radioactive steam from the core.",
      simplerExplanation: "A giant fan spun by steam to make electricity.",
      deeperExplanation:
        "Because it is a direct cycle, the turbine hall must be shielded, as the steam contains short-lived radioactive isotopes.",
      connectedFlowIds: ["rbmk-steam-flow"],
      diagramCoords: { x: 300, y: 150, width: 80, height: 60 },
      citationIds: [],
    },
  ],
  flows: [
    {
      id: "rbmk-coolant-flow",
      name: "Coolant Flow",
      fromComponentId: "rbmk-graphite-core",
      toComponentId: "rbmk-steam-drums",
      loop: "primary",
      fluid: "Water/Steam Mixture",
      operatingTemp: "284°C",
      operatingPressure: "7 MPa",
    },
    {
      id: "rbmk-steam-flow",
      name: "Steam Flow",
      fromComponentId: "rbmk-steam-drums",
      toComponentId: "rbmk-turbine",
      loop: "primary",
      fluid: "Saturated Steam",
      operatingTemp: "284°C",
      operatingPressure: "6.5 MPa",
    },
  ],
};

export const FBR_SYSTEM_DATA: ReactorSystem = {
  id: "fbr",
  slug: "fbr",
  type: "Fast",
  name: "Sodium-Cooled Fast Reactor (SFR)",
  summary:
    "A reactor that uses unmoderated 'fast' neutrons and liquid sodium coolant, capable of breeding more fuel than it consumes.",
  conceptDescription:
    "Liquid sodium cools a dense core of highly enriched fuel without slowing down the neutrons. Heat is transferred to a secondary non-radioactive sodium loop, which then boils water.",
  deployedExamples: ["BN-800", "Superphénix", "Phénix"],
  operatingContext:
    "Operates at near atmospheric pressure due to sodium's high boiling point (~883°C). Core runs at ~550°C. Requires extremely pure sodium to prevent corrosion and violent reactions with water.",
  citations: [],
  components: [
    {
      id: "fbr-pool",
      name: "Primary Sodium Pool",
      type: "vessel",
      role: "Houses the core and primary coolant",
      description:
        "A large unpressurized vessel filled with liquid sodium. The core, primary pumps, and intermediate heat exchangers are entirely submerged within it.",
      simplerExplanation:
        "A giant swimming pool of molten metal that keeps the reactor cool without needing high pressure.",
      deeperExplanation:
        "The pool-type design provides massive thermal inertia, meaning the reactor can safely absorb decay heat for days without active cooling.",
      connectedFlowIds: ["fbr-primary-flow"],
      diagramCoords: { x: 100, y: 150, width: 120, height: 160 },
      citationIds: [],
    },
    {
      id: "fbr-ihx",
      name: "Intermediate Heat Exchanger (IHX)",
      type: "heat-exchanger",
      role: "Transfers heat to the secondary sodium loop",
      description:
        "Submerged inside the primary pool, it transfers heat from the radioactive primary sodium to the non-radioactive secondary sodium loop.",
      simplerExplanation:
        "A heat bridge that keeps the radioactive metal separate from the clean metal.",
      deeperExplanation:
        "Ensures that if the steam generator leaks water into the sodium, the resulting chemical explosion does not affect the radioactive primary core.",
      connectedFlowIds: ["fbr-primary-flow", "fbr-intermediate-flow"],
      diagramCoords: { x: 180, y: 150, width: 40, height: 100 },
      citationIds: [],
    },
    {
      id: "fbr-sg",
      name: "Sodium-Water Steam Generator",
      type: "steam-generator",
      role: "Boils water using intermediate sodium",
      description:
        "Transfers heat from the secondary sodium loop to a tertiary water loop, creating high-pressure steam for the turbine.",
      simplerExplanation: "A boiler where hot metal boils water into steam.",
      deeperExplanation:
        "Must be incredibly robust, as any leak between the sodium and water sides causes a violent exothermic reaction.",
      connectedFlowIds: ["fbr-intermediate-flow"],
      diagramCoords: { x: 260, y: 150, width: 60, height: 120 },
      citationIds: [],
    },
  ],
  flows: [
    {
      id: "fbr-primary-flow",
      name: "Primary Sodium Loop",
      fromComponentId: "fbr-pool",
      toComponentId: "fbr-ihx",
      loop: "primary",
      fluid: "Liquid Sodium (Radioactive)",
      operatingTemp: "550°C",
      operatingPressure: "0.1 MPa (Atmospheric)",
    },
    {
      id: "fbr-intermediate-flow",
      name: "Intermediate Sodium Loop",
      fromComponentId: "fbr-ihx",
      toComponentId: "fbr-sg",
      loop: "intermediate",
      fluid: "Liquid Sodium (Clean)",
      operatingTemp: "500°C",
      operatingPressure: "0.5 MPa",
    },
  ],
};

export const MSR_SYSTEM_DATA: ReactorSystem = {
  id: "msr",
  slug: "msr",
  type: "Molten-Salt",
  name: "Molten Salt Reactor (MSR)",
  summary:
    "An advanced reactor concept where the nuclear fuel is dissolved directly into a molten fluoride or chloride salt coolant.",
  conceptDescription:
    "There are no solid fuel rods. The fuel-salt fluid becomes critical only when it flows into a graphite moderator matrix. It then flows out to a heat exchanger.",
  deployedExamples: ["MSRE (Experimental)"],
  operatingContext:
    "Operates at very high temperatures (700°C+) at low pressure. Allows for online chemical processing to remove fission products and add fresh fuel.",
  citations: [],
  components: [
    {
      id: "msr-core",
      name: "Graphite Core (Critical Region)",
      type: "graphite-core",
      role: "Moderates neutrons to achieve criticality",
      description:
        "A vessel filled with graphite channels. The fuel-salt mixture only achieves criticality (sustains a chain reaction) while passing through this moderated region.",
      simplerExplanation:
        "The area where the flowing liquid fuel gets 'turned on' by the carbon blocks around it.",
      deeperExplanation:
        "Because the fuel is liquid and expands when heated, MSRs have an incredibly strong negative temperature coefficient, making them walk-away safe.",
      connectedFlowIds: ["msr-fuel-flow"],
      diagramCoords: { x: 100, y: 150, width: 90, height: 120 },
      citationIds: [],
    },
    {
      id: "msr-hx",
      name: "Primary Heat Exchanger",
      type: "heat-exchanger",
      role: "Transfers heat from fuel salt to clean salt",
      description:
        "Extracts heat from the highly radioactive primary fuel salt and transfers it to a secondary coolant salt loop.",
      simplerExplanation:
        "Takes the heat from the radioactive liquid and gives it to a clean liquid.",
      deeperExplanation:
        "Constructed of specialized alloys like Hastelloy-N to resist corrosion from the hot fluoride salts and fission products.",
      connectedFlowIds: ["msr-fuel-flow"],
      diagramCoords: { x: 200, y: 150, width: 50, height: 100 },
      citationIds: [],
    },
    {
      id: "msr-chem",
      name: "Chemical Processing Plant",
      type: "pump",
      role: "Filters and processes the fuel salt",
      description:
        "An adjacent loop that continuously bubbles noble gases out of the salt and filters out neutron-absorbing fission products (reactor poisons).",
      simplerExplanation:
        "A built-in filter that cleans the liquid fuel while the reactor is running.",
      deeperExplanation:
        "This eliminates the need to shut down the reactor for refueling. Fresh fissile or fertile material can be added dynamically.",
      connectedFlowIds: ["msr-fuel-flow"],
      diagramCoords: { x: 100, y: 280, width: 80, height: 60 },
      citationIds: [],
    },
  ],
  flows: [
    {
      id: "msr-fuel-flow",
      name: "Fuel Salt Loop",
      fromComponentId: "msr-core",
      toComponentId: "msr-hx",
      loop: "primary",
      fluid: "FLiBe Molten Salt + Uranium",
      operatingTemp: "700°C",
      operatingPressure: "0.1 MPa (Atmospheric)",
    },
  ],
};

export const SMR_SYSTEM_DATA: ReactorSystem = {
  id: "smr",
  slug: "smr",
  type: "SMR",
  name: "Small Modular Reactor (Integral PWR)",
  summary:
    "A compact Generation III+ modular reactor integrating the core, steam generators, and pressurizer into a single factory-built pressure vessel, using natural circulation and passive pool submersion.",
  conceptDescription:
    "Eliminates external primary piping to physically prevent large-break loss-of-coolant accidents (LOCAs). Modules are fabricated in factories and transported by rail/barge for scalable, underground installation.",
  deployedExamples: [
    "NuScale VOYGR (USA certified)",
    "Rolls-Royce SMR (UK)",
    "CNNC Linglong One / ACP100 (China)",
    "GE Hitachi BWRX-300",
  ],
  operatingContext:
    "Primary circuit operates at ~12.8 MPa and ~300°C via natural convection. The entire reactor module is submerged in an underground cooling pool capable of indefinite passive decay heat dissipation without AC power.",
  citations: [
    {
      id: "cit-iaea-smr-status",
      title: "Advances in Small Modular Reactor Technology Developments",
      publisher: "International Atomic Energy Agency",
      year: 2022,
      url: "https://www.iaea.org/publications/15177/advances-in-small-modular-reactor-technology-developments",
      locator: "IAEA Advanced SMR Booklet, 2022 Edition",
    },
    {
      id: "cit-nrc-nuscale",
      title: "NuScale Small Modular Reactor Design Certification",
      publisher: "US Nuclear Regulatory Commission",
      year: 2023,
      url: "https://www.nrc.gov/reactors/new-reactors/smr/licensing-activities/nuscale.html",
      locator: "Docket No. 52-048",
    },
  ],
  components: [
    {
      id: "smr-vessel",
      name: "Integral Reactor Pressure Vessel",
      type: "vessel",
      role: "Houses the nuclear core, helical-coil steam generators, and pressurizer in a single compact vessel",
      description:
        "High-strength forged steel pressure vessel (~20 m height, 2.7 m diameter) enclosing the entire primary coolant system, eliminating reactor coolant loop piping.",
      simplerExplanation:
        "An all-in-one steel pressure cylinder that contains the atomic fuel, steam boiler, and pressure regulator inside a single sealed unit.",
      deeperExplanation:
        "By packaging all primary systems inside one pressure envelope, large-break LOCAs are geometrically precluded. Natural circulation drives coolant flow without reactor coolant pumps.",
      connectedFlowIds: ["smr-primary-flow"],
      diagramCoords: { x: 120, y: 130, width: 90, height: 220 },
      citationIds: ["cit-iaea-smr-status", "cit-nrc-nuscale"],
    },
    {
      id: "smr-fuel",
      name: "SMR Low-Enriched Core",
      type: "fuel",
      role: "Generates fission heat at low power density for prolonged refueling intervals",
      description:
        "Standard uranium dioxide (UO2) fuel enriched up to 4.95% U-235 in a compact 17x17 lattice, configured for 24-month or longer operational cycles.",
      simplerExplanation:
        "A compact uranium fuel core operating at modest power output to maximize safety margins and run for years without refueling.",
      deeperExplanation:
        "Lower volumetric power density reduces peak cladding temperatures during transients and provides high thermal margins under natural convection flow.",
      connectedFlowIds: ["smr-primary-flow"],
      diagramCoords: { x: 135, y: 260, width: 60, height: 70 },
      citationIds: ["cit-iaea-smr-status"],
    },
    {
      id: "smr-control-rods",
      name: "Control Rod Drive Mechanisms (CRDM)",
      type: "control-rod",
      role: "Regulates core reactivity and provides failsafe gravity shutdown",
      description:
        "Top-mounted magnetic latch drive mechanisms holding neutron-absorbing control rod assemblies that drop by gravity into the core upon power cut.",
      simplerExplanation:
        "Safety rods suspended above the core that instantly fall into the fuel to halt the reaction if electricity is ever interrupted.",
      deeperExplanation:
        "Gravity insertion is assisted by hydraulic pressure differentials. Magnetic clutches release instantaneously on trip signals or blackout conditions.",
      connectedFlowIds: [],
      diagramCoords: { x: 140, y: 90, width: 50, height: 35 },
      citationIds: ["cit-nrc-nuscale"],
    },
    {
      id: "smr-sg",
      name: "Helical-Coil Steam Generator",
      type: "steam-generator",
      role: "Transfers primary heat to secondary feedwater to produce superheated steam",
      description:
        "Two independent helical-coil tube bundles wrapped around the upper riser section inside the vessel, through which secondary water flows and vaporizes.",
      simplerExplanation:
        "Spiral metal piping coiled inside the upper vessel where clean water turns into steam from the reactor's heat.",
      deeperExplanation:
        "Operates under once-through counter-flow thermodynamics producing dry superheated steam without requiring separate steam separators or dryers.",
      connectedFlowIds: ["smr-primary-flow", "smr-secondary-flow"],
      diagramCoords: { x: 130, y: 160, width: 70, height: 80 },
      citationIds: ["cit-iaea-smr-status", "cit-nrc-nuscale"],
    },
    {
      id: "smr-containment",
      name: "Submerged Steel Containment Vessel",
      type: "containment",
      role: "Provides high-pressure fission product barrier and passes heat to the cooling pool",
      description:
        "An evacuated, cylindrical high-pressure steel vessel surrounding the RPV, submerged in an underground water pool acting as an infinite heat sink.",
      simplerExplanation:
        "A heavy steel capsule sitting under water that captures any leaked steam and radiates heat directly into the giant pool.",
      deeperExplanation:
        "Under vacuum during normal operations to eliminate convective heat loss. Upon safety actuation, steam condenses against the containment wall directly into the pool.",
      connectedFlowIds: ["smr-passive-cooling"],
      diagramCoords: { x: 100, y: 80, width: 130, height: 290 },
      citationIds: ["cit-nrc-nuscale"],
    },
    {
      id: "smr-cooling-pool",
      name: "Passive Reactor Building Pool",
      type: "heat-exchanger",
      role: "Serves as the ultimate heat sink for indefinite passive cooling",
      description:
        "A large below-ground, seismically isolated water pool enclosing multiple module bays, absorbing decay heat via conduction through containment walls.",
      simplerExplanation:
        "A massive underground pool of water that keeps the reactor cool forever without any pumps, electricity, or operator action.",
      deeperExplanation:
        "Contains sufficient water volume to passively dissipate post-trip decay heat for over 30 days of unmitigated station blackout without boiling dry.",
      connectedFlowIds: ["smr-passive-cooling"],
      diagramCoords: { x: 80, y: 70, width: 170, height: 310 },
      citationIds: ["cit-iaea-smr-status"],
    },
    {
      id: "smr-turbine",
      name: "Modular Steam Turbine & Generator",
      type: "turbine",
      role: "Converts superheated steam enthalpy into electrical power",
      description:
        "A dedicated, skid-mounted compact steam turbine connected to a high-efficiency synchronous electrical generator.",
      simplerExplanation:
        "A spinning turbine that uses high-pressure steam from the reactor module to produce 50-77 megawatts of electricity.",
      deeperExplanation:
        "Operates on a standard Rankine steam cycle with air-cooled or water-cooled condenser return, optimized for fast ramp-rates to complement renewables.",
      connectedFlowIds: ["smr-secondary-flow"],
      diagramCoords: { x: 320, y: 160, width: 90, height: 60 },
      citationIds: ["cit-iaea-smr-status"],
    },
  ],
  flows: [
    {
      id: "smr-primary-flow",
      name: "Integral Primary Natural Circulation",
      fromComponentId: "smr-fuel",
      toComponentId: "smr-sg",
      loop: "primary",
      fluid: "Borated Light Water (Natural Circulation)",
      operatingTemp: "300°C (Core Outlet)",
      operatingPressure: "12.8 MPa",
    },
    {
      id: "smr-secondary-flow",
      name: "Superheated Secondary Steam Loop",
      fromComponentId: "smr-sg",
      toComponentId: "smr-turbine",
      loop: "secondary",
      fluid: "Dry Superheated Steam",
      operatingTemp: "285°C",
      operatingPressure: "3.4 MPa",
    },
    {
      id: "smr-passive-cooling",
      name: "Passive Containment Heat Dissipation",
      fromComponentId: "smr-containment",
      toComponentId: "smr-cooling-pool",
      loop: "tertiary-cooling",
      fluid: "Bulk Pool Water Conduction",
      operatingTemp: "40°C - 95°C",
      operatingPressure: "0.1 MPa (Atmospheric)",
    },
  ],
};

export const HTGR_SYSTEM_DATA: ReactorSystem = {
  id: "htgr",
  slug: "htgr",
  type: "HTGR",
  name: "High-Temperature Gas-Cooled Reactor (HTGR)",
  summary:
    "A Generation IV advanced reactor utilizing ceramic TRISO-coated particle fuel, chemically inert helium gas coolant, and a solid graphite moderator to deliver heat at 750°C-950°C with walk-away passive safety.",
  conceptDescription:
    "Operates at extreme temperatures capable of high-efficiency electricity generation and zero-carbon industrial process heat (hydrogen production, chemical synthesis). TRISO particles cannot melt below 1600°C, providing intrinsic meltdown immunity.",
  deployedExamples: [
    "HTR-PM (Shidao Bay, China - Commercial Operation)",
    "Fort St. Vrain (USA - Historic)",
    "AVR & THTR-300 (Germany - Historic)",
    "X-energy Xe-100 (Advanced SMR)",
  ],
  operatingContext:
    "Helium coolant operates at ~7.0 MPa and up to 750°C-950°C outlet temperature. Solid graphite moderator provides high thermal inertia, while an inherently negative temperature coefficient of reactivity throttles fission before damage can occur.",
  citations: [
    {
      id: "cit-iaea-htgr-status",
      title: "Advances in High Temperature Gas Cooled Reactor Technology",
      publisher: "International Atomic Energy Agency",
      year: 2020,
      url: "https://www.iaea.org/publications/13592/advances-in-high-temperature-gas-cooled-reactor-technology",
      locator: "IAEA-TECDOC-1936",
    },
    {
      id: "cit-doe-triso",
      title: "TRISO Particles: The Most Robust Nuclear Fuel on Earth",
      publisher: "US Department of Energy (Office of Nuclear Energy)",
      year: 2021,
      url: "https://www.energy.gov/ne/articles/triso-particles-most-robust-nuclear-fuel-earth",
      locator: "DOE Fact Sheet: Advanced Reactor Technologies",
    },
  ],
  components: [
    {
      id: "htgr-vessel",
      name: "Reactor Pressure Vessel",
      type: "vessel",
      role: "Contains the high-pressure helium gas coolant and graphite core structure",
      description:
        "Heavy forged alloy-steel vessel with external thermal insulation and internal metallic core-barrel, designed for 7 MPa helium service.",
      simplerExplanation:
        "A thick steel container engineered to hold high-pressure helium gas while keeping heat focused in the core.",
      deeperExplanation:
        "Maintained at lower temperatures (~300°C) via returning cold-leg helium flow sweeping the inner vessel walls, preventing high-temperature creep.",
      connectedFlowIds: ["htgr-helium-primary"],
      diagramCoords: { x: 100, y: 130, width: 110, height: 230 },
      citationIds: ["cit-iaea-htgr-status"],
    },
    {
      id: "htgr-core",
      name: "Solid Graphite Core Moderator",
      type: "graphite-core",
      role: "Moderates fast neutrons to thermal energies and provides massive thermal heat capacity",
      description:
        "High-purity nuclear-grade graphite blocks forming the core cavity and surrounding reflector, capable of absorbing decay heat for days without active cooling.",
      simplerExplanation:
        "A giant core made of carbon blocks that slows down atomic particles and absorbs enormous amounts of heat safely.",
      deeperExplanation:
        "Graphite maintains structural integrity above 2000°C, meaning the core cannot melt or lose geometry even during complete loss of helium coolant.",
      connectedFlowIds: ["htgr-helium-primary"],
      diagramCoords: { x: 115, y: 160, width: 80, height: 180 },
      citationIds: ["cit-iaea-htgr-status"],
    },
    {
      id: "htgr-fuel",
      name: "TRISO Particle Fuel Elements",
      type: "fuel",
      role: "Generates fission heat with ceramic micro-containment resistant to temperatures up to 1600°C",
      description:
        "Billiard-ball sized graphite pebbles (or prismatic hexagonal blocks) embedded with thousands of sub-millimeter TRISO particles coated in pyrolytic carbon and silicon carbide.",
      simplerExplanation:
        "Super-durable ceramic fuel spheres that seal radioactive waste inside microscopic containment shields that cannot melt.",
      deeperExplanation:
        "Each TRISO particle features a silicon carbide shell that retains 100% of radioactive fission products up to 1600°C—far above any possible accident temperature.",
      connectedFlowIds: ["htgr-helium-primary"],
      diagramCoords: { x: 125, y: 200, width: 60, height: 120 },
      citationIds: ["cit-iaea-htgr-status", "cit-doe-triso"],
    },
    {
      id: "htgr-control-rods",
      name: "Reflector Control & Shutdown Rods",
      type: "control-rod",
      role: "Regulates core neutron population and provides backup reactivity shutdown",
      description:
        "Boron carbide absorber rods located in channels within the side graphite reflector, operating outside the hottest fuel region.",
      simplerExplanation:
        "Neutron-absorbing control rods inserted into the outer graphite walls to start, adjust, or shut down the reactor.",
      deeperExplanation:
        "Due to the strongly negative Doppler temperature coefficient, HTGRs naturally shut themselves down when temperature rises, making control rods a secondary defense.",
      connectedFlowIds: [],
      diagramCoords: { x: 130, y: 90, width: 50, height: 35 },
      citationIds: ["cit-iaea-htgr-status"],
    },
    {
      id: "htgr-circulator",
      name: "Helium Gas Circulator",
      type: "pump",
      role: "Forces circulation of pressurized helium coolant through the core and steam generator",
      description:
        "High-reliability variable-speed electric blower with active magnetic bearings, mounted vertically above or below the steam generator.",
      simplerExplanation:
        "A high-tech gas fan that blows inert helium gas through the hot atomic core to carry heat away.",
      deeperExplanation:
        "Uses magnetic bearings to eliminate lubricating oil contamination inside the high-purity helium coolant loop.",
      connectedFlowIds: ["htgr-helium-primary"],
      diagramCoords: { x: 250, y: 290, width: 50, height: 45 },
      citationIds: ["cit-iaea-htgr-status"],
    },
    {
      id: "htgr-steam-gen",
      name: "Helical-Coil Steam Generator",
      type: "steam-generator",
      role: "Transfers 750°C helium heat to secondary water to produce high-temperature supercritical steam",
      description:
        "Counter-flow heat exchanger housed in a separate pressure vessel connected to the reactor vessel via a cross-duct, generating steam at 560°C.",
      simplerExplanation:
        "A heat transfer tower where hot helium gas boils clean water into high-pressure superheated steam.",
      deeperExplanation:
        "High steam temperatures (560°C at 13.5 MPa) match modern supercritical coal plants, achieving over 44% thermal-to-electric efficiency.",
      connectedFlowIds: ["htgr-helium-primary", "htgr-steam-secondary"],
      diagramCoords: { x: 240, y: 150, width: 70, height: 130 },
      citationIds: ["cit-iaea-htgr-status"],
    },
    {
      id: "htgr-turbine",
      name: "High-Efficiency Steam Turbine",
      type: "turbine",
      role: "Drives electrical generator using superheated steam with optional cogeneration take-off",
      description:
        "Multi-stage high-temperature turbine producing electricity with potential extraction of 500°C steam for industrial chemical processing.",
      simplerExplanation:
        "An advanced steam turbine generating electricity at record thermal efficiency or providing clean industrial heat.",
      deeperExplanation:
        "Dual-purpose cogeneration configuration: high-grade steam can be diverted to high-temperature steam electrolysis for zero-carbon hydrogen production.",
      connectedFlowIds: ["htgr-steam-secondary"],
      diagramCoords: { x: 360, y: 160, width: 90, height: 60 },
      citationIds: ["cit-iaea-htgr-status"],
    },
  ],
  flows: [
    {
      id: "htgr-helium-primary",
      name: "Primary Helium Gas Circuit",
      fromComponentId: "htgr-fuel",
      toComponentId: "htgr-steam-gen",
      loop: "primary",
      fluid: "Inert Helium Gas (7.0 MPa)",
      operatingTemp: "750°C Core Outlet / 250°C Inlet",
      operatingPressure: "7.0 MPa",
    },
    {
      id: "htgr-steam-secondary",
      name: "Superheated Secondary Steam Loop",
      fromComponentId: "htgr-steam-gen",
      toComponentId: "htgr-turbine",
      loop: "secondary",
      fluid: "Superheated Steam",
      operatingTemp: "560°C",
      operatingPressure: "13.5 MPa",
    },
  ],
};

const ALL_SYSTEMS: readonly ReactorSystem[] = [
  PWR_SYSTEM_DATA,
  BWR_SYSTEM_DATA,
  PHWR_SYSTEM_DATA,
  SMR_SYSTEM_DATA,
  HTGR_SYSTEM_DATA,
  RBMK_SYSTEM_DATA,
  FBR_SYSTEM_DATA,
  MSR_SYSTEM_DATA,
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
