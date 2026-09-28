import type { ExplanationContent } from "@/lib/education/schemas";

export interface MetricExplanationRecord {
  metricId: string;
  category:
    | "environment"
    | "reliability"
    | "economics"
    | "human-impact"
    | "security"
    | "technical";
  title: string;
  explanation: ExplanationContent;
  limitations: string;
  systemBoundary: string;
}

export const METRIC_CATALOG_EXPLANATIONS: Record<
  string,
  MetricExplanationRecord
> = {
  "lifecycle-ghg": {
    metricId: "lifecycle-ghg",
    category: "environment",
    title: "Lifecycle Greenhouse Gas Emissions",
    limitations:
      "Vintage and supply chain regionalization can cause 2-3x variance in reported lifecycle emissions.",
    systemBoundary:
      "Cradle-to-grave: mining, manufacturing, transport, construction, operation, decommissioning, and waste storage.",
    explanation: {
      summary: "Climate pollution across the electricity lifecycle.",
      body: [
        "Count emissions from fuel production, construction, operation and end-of-life work, then relate them to the electricity generated.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Cradle-to-grave: mining, manufacturing, transport, construction, operation, decommissioning, and waste storage.",
        },
      ],
      citationIds: [],
    },
  },
  "land-use": {
    metricId: "land-use",
    category: "environment",
    title: "Land Use Footprint",
    limitations:
      "Buffer zones between wind turbines are often co-utilized for agriculture, complicating direct comparisons.",
    systemBoundary:
      "Direct physical footprint plus dedicated access roads and upstream mining occupation per generated MWh.",
    explanation: {
      summary: "How much land does electricity generation use?",
      body: [
        "Directly occupied land, surrounding space and land used for fuel production are different boundaries. Check which a study includes.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Direct physical footprint plus dedicated access roads and upstream mining occupation per generated MWh.",
        },
      ],
      citationIds: [],
    },
  },
  "water-withdrawal": {
    metricId: "water-withdrawal",
    category: "environment",
    title: "Water Withdrawal Intensity",
    limitations:
      "Withdrawal does not indicate permanent loss; returned water is at higher temperature.",
    systemBoundary:
      "Operational cooling water volume intake per net MWh generated.",
    explanation: {
      summary: "Withdrawal is water taken from a source.",
      body: [
        "Some withdrawn water returns after use. Withdrawal and consumption answer different questions, and cooling design matters.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Operational cooling water volume intake per net MWh generated.",
        },
      ],
      citationIds: [],
    },
  },
  "water-consumption": {
    metricId: "water-consumption",
    category: "environment",
    title: "Water Consumption Intensity",
    limitations:
      "Varies substantially depending on ambient humidity, wet-bulb temperature, and cooling tower cycling.",
    systemBoundary:
      "Unreturned evaporative losses from plant cooling systems per net MWh generated.",
    explanation: {
      summary:
        "Consumption is water that is not returned to its original source.",
      body: [
        "Evaporation can consume water even when the cooling system reuses much of its circulating water. Local water availability matters.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Unreturned evaporative losses from plant cooling systems per net MWh generated.",
        },
      ],
      citationIds: [],
    },
  },
  "material-requirements": {
    metricId: "material-requirements",
    category: "environment",
    title: "Material Requirements",
    limitations:
      "End-of-life recycling and circularity rates are rapidly evolving and vary by jurisdiction.",
    systemBoundary:
      "Capital plant construction materials and major component replacements over operational lifetime.",
    explanation: {
      summary: "Power stations need materials to build and maintain them.",
      body: [
        "Compare materials over the electricity produced during a stated lifetime, including replacements where the study counts them.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Capital plant construction materials and major component replacements over operational lifetime.",
        },
      ],
      citationIds: [],
    },
  },
  "mining-intensity": {
    metricId: "mining-intensity",
    category: "environment",
    title: "Mining & Resource Extraction Intensity",
    limitations:
      "Stripping ratios and ore grades change over mine life and across global deposits.",
    systemBoundary:
      "Total rock and ore extraction required for plant construction minerals and lifetime fuel cycles.",
    explanation: {
      summary: "Fuel and construction materials both require extraction.",
      body: [
        "A comparison must state whether it counts ore, useful material, overburden or the energy and impacts of extraction.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Total rock and ore extraction required for plant construction minerals and lifetime fuel cycles.",
        },
      ],
      citationIds: [],
    },
  },
  "waste-volume": {
    metricId: "waste-volume",
    category: "environment",
    title: "Solid & Hazardous Waste Volume",
    limitations:
      "Comparing physical volume alone hides immense differences in toxicity, decay rates, and containment engineering.",
    systemBoundary:
      "Cumulative solid and hazardous waste generated across fuel cycle and decommissioning per MWh.",
    explanation: {
      summary: "Waste volume measures quantity, not danger.",
      body: [
        "Different waste streams need different handling. Compare their physical form, hazard and treatment alongside volume.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Cumulative solid and hazardous waste generated across fuel cycle and decommissioning per MWh.",
        },
      ],
      citationIds: [],
    },
  },
  "waste-persistence": {
    metricId: "waste-persistence",
    category: "environment",
    title: "Waste Hazard Persistence & Toxicity",
    limitations:
      "Categorical hazard persistence cannot be aggregated into a single scalar score without arbitrary weighting.",
    systemBoundary:
      "Timescale required for biological hazard to diminish to background geological baseline.",
    explanation: {
      summary:
        "Different wastes remain hazardous for different reasons and durations.",
      body: [
        "Radioactive decay, chemical toxicity, exposure pathways and containment all affect how waste should be managed.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Timescale required for biological hazard to diminish to background geological baseline.",
        },
      ],
      citationIds: [],
    },
  },
  "capacity-factor": {
    metricId: "capacity-factor",
    category: "reliability",
    title: "Capacity Factor",
    limitations:
      "Curtailed generation or economic dispatch can lower capacity factor even when a plant is fully available.",
    systemBoundary:
      "Annual gross generation divided by nameplate rating multiplied by 8,760 hours.",
    explanation: {
      summary:
        "Capacity factor compares actual generation with continuous output at rated power.",
      body: [
        "It combines the effects of downtime and changes in output over the selected period. It does not establish hourly grid reliability.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Annual gross generation divided by nameplate rating multiplied by 8,760 hours.",
        },
      ],
      citationIds: [],
    },
  },
  dispatchability: {
    metricId: "dispatchability",
    category: "reliability",
    title: "Dispatchability & Operational Control",
    limitations:
      "Nuclear plants can technically load-follow, but are generally operated baseload for economic reasons.",
    systemBoundary:
      "System operator control capability over plant output on sub-hourly to daily dispatch horizons.",
    explanation: {
      summary:
        "Dispatchability describes how output can respond to system needs.",
      body: [
        "Start time, ramp rate, minimum output and fuel or weather constraints all affect that response.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "System operator control capability over plant output on sub-hourly to daily dispatch horizons.",
        },
      ],
      citationIds: [],
    },
  },
  variability: {
    metricId: "variability",
    category: "reliability",
    title: "Output Variability & Predictability",
    limitations:
      "Short-term forecast errors create balancing reserves requirements that increase with penetration.",
    systemBoundary:
      "Temporal volatility of power output at plant and regional fleet aggregation.",
    explanation: {
      summary: "Electricity output can change over time.",
      body: [
        "The timescale and predictability of a change matter, as do correlations between generators and demand.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Temporal volatility of power output at plant and regional fleet aggregation.",
        },
      ],
      citationIds: [],
    },
  },
  "firm-capacity": {
    metricId: "firm-capacity",
    category: "reliability",
    title: "Firm Capacity & Capacity Credit",
    limitations:
      "ELCC is not a constant property of the generator; it changes based on the rest of the grid mix.",
    systemBoundary:
      "Contribution to maintaining standard loss-of-load probability targets during peak net load hours.",
    explanation: {
      summary: "Firm capacity concerns contribution when the system needs it.",
      body: [
        "Capacity credit depends on demand, other generators and the adequacy method; it is not the same as annual capacity factor.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Contribution to maintaining standard loss-of-load probability targets during peak net load hours.",
        },
      ],
      citationIds: [],
    },
  },
  "storage-dependence": {
    metricId: "storage-dependence",
    category: "reliability",
    title: "Storage Dependence for Multi-Day Reliability",
    limitations:
      "Model-dependent metric that relies on regional interconnects, demand response, and weather year datasets.",
    systemBoundary:
      "Total megawatt-hours of energy storage required per terawatt-hour of annual system consumption.",
    explanation: {
      summary: "Storage needs depend on the whole electricity system.",
      body: [
        "Demand, weather, transmission, flexible generation and the chosen reliability target all shape storage requirements.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Total megawatt-hours of energy storage required per terawatt-hour of annual system consumption.",
        },
      ],
      citationIds: [],
    },
  },
  "capital-cost": {
    metricId: "capital-cost",
    category: "economics",
    title: "Overnight Capital Expenditure (CAPEX)",
    limitations:
      "Financing costs during long construction periods can add 30-80% to overnight costs.",
    systemBoundary:
      "Direct equipment, civil engineering, construction, and engineering management costs to commercial operation.",
    explanation: {
      summary: "Capital cost covers building the asset.",
      body: [
        "An overnight estimate excludes the effect of taking time to build. Financing, overruns and local conditions affect the eventual project cost.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Direct equipment, civil engineering, construction, and engineering management costs to commercial operation.",
        },
      ],
      citationIds: [],
    },
  },
  "operating-cost": {
    metricId: "operating-cost",
    category: "economics",
    title: "Fixed & Variable Operating Costs (OPEX)",
    limitations:
      "Outage lengths and supply chain costs for specialized replacement parts can cause annual variations.",
    systemBoundary:
      "Annual non-fuel operational, maintenance, administrative, and compliance costs per unit of installed capacity.",
    explanation: {
      summary: "Running a plant creates both fixed and output-dependent costs.",
      body: [
        "Check whether maintenance, staffing, insurance and waste obligations are included before comparing estimates.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Annual non-fuel operational, maintenance, administrative, and compliance costs per unit of installed capacity.",
        },
      ],
      citationIds: [],
    },
  },
  "fuel-cost": {
    metricId: "fuel-cost",
    category: "economics",
    title: "Fuel Cost per MWh",
    limitations:
      "Fuel costs depend heavily on commodity market cycles and international transport infrastructure.",
    systemBoundary:
      "Direct procurement, processing, transportation, and waste escrow costs per generated MWh.",
    explanation: {
      summary:
        "Fuel cost relates purchased fuel and its preparation to electricity delivered.",
      body: [
        "Fuel prices, conversion efficiency and fuel-cycle services affect the result. A fuel price alone is not a delivered electricity cost.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Direct procurement, processing, transportation, and waste escrow costs per generated MWh.",
        },
      ],
      citationIds: [],
    },
  },
  lcoe: {
    metricId: "lcoe",
    category: "economics",
    title: "Levelized Cost of Electricity (LCOE)",
    limitations:
      "LCOE measures plant-level costs, NOT system-level consumer costs or the value of dispatchable generation.",
    systemBoundary:
      "Full lifecycle financial costs discounted over plant operating life divided by discounted lifetime generation.",
    explanation: {
      summary:
        "Levelized cost spreads lifetime costs over lifetime electricity.",
      body: [
        "LCOE depends on financing, construction, operating life and output assumptions. It is neither a retail tariff nor the cost of an entire electricity system.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Full lifecycle financial costs discounted over plant operating life divided by discounted lifetime generation.",
        },
      ],
      citationIds: [],
    },
  },
  "construction-duration": {
    metricId: "construction-duration",
    category: "economics",
    title: "Construction Duration & Project Lead Time",
    limitations:
      "Pre-construction permitting, environmental reviews, and grid connection queues can add years before construction starts.",
    systemBoundary:
      "First safety concrete pour to commercial operational acceptance.",
    explanation: {
      summary: "Project time depends on where the clock starts and stops.",
      body: [
        "Planning, licensing, site work, construction and commissioning may be counted separately. Compare matching definitions.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "First safety concrete pour to commercial operational acceptance.",
        },
      ],
      citationIds: [],
    },
  },
  "plant-lifetime": {
    metricId: "plant-lifetime",
    category: "economics",
    title: "Operating Lifetime & Asset Longevity",
    limitations:
      "Economic lifetime may be cut short by market rules or localized component failures.",
    systemBoundary:
      "Certified design operating life and proven commercial extension precedents.",
    explanation: {
      summary: "Operating life is how long an asset remains in service.",
      body: [
        "Design life, licence duration and actual operation differ. Refurbishment, regulation and economics can change the outcome.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Certified design operating life and proven commercial extension precedents.",
        },
      ],
      citationIds: [],
    },
  },
  "decommissioning-cost": {
    metricId: "decommissioning-cost",
    category: "economics",
    title: "Decommissioning & Site Remediation",
    limitations:
      "Final site restoration standards (unrestricted release vs brownfield re-industrialization) change cleanup costs.",
    systemBoundary:
      "Plant shutdown, chemical/radiological decontamination, structural demolition, and environmental site release.",
    explanation: {
      summary: "Decommissioning covers retirement and site work.",
      body: [
        "The estimate depends on the cleanup endpoint, waste management, timing and how future spending is discounted.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Plant shutdown, chemical/radiological decontamination, structural demolition, and environmental site release.",
        },
      ],
      citationIds: [],
    },
  },
  "financing-sensitivity": {
    metricId: "financing-sensitivity",
    category: "economics",
    title: "Financing Cost & WACC Sensitivity",
    limitations:
      "Country risk premiums and investor risk appetite vary widely between mature and emerging economies.",
    systemBoundary:
      "Sensitivity of levelized generation cost across discount rates from 3% to 10%.",
    explanation: {
      summary: "Financing changes the cost of long-lived projects.",
      body: [
        "Interest rates, construction delays and the timing of revenue can strongly affect costs paid over a project’s life.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Sensitivity of levelized generation cost across discount rates from 3% to 10%.",
        },
      ],
      citationIds: [],
    },
  },
  mortality: {
    metricId: "mortality",
    category: "human-impact",
    title: "Mortality Rate per TWh Generated",
    limitations:
      "Does not conflate localized disaster terror with statistical public health morbidity.",
    systemBoundary:
      "Cumulative premature fatalities from air pollution, occupational hazards, and accidents normalized to lifetime electricity generated.",
    explanation: {
      summary:
        "Deaths per unit of electricity put different scales of generation in context.",
      body: [
        "Results depend on which direct deaths and modeled health effects are counted. Non-fatal harm, displacement and uncertainty need separate attention.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Cumulative premature fatalities from air pollution, occupational hazards, and accidents normalized to lifetime electricity generated.",
        },
      ],
      citationIds: [],
    },
  },
  "air-pollution": {
    metricId: "air-pollution",
    category: "human-impact",
    title: "Harmful Air Pollution Emissions (PM2.5, SO2, NOx)",
    limitations:
      "Secondary particulate formation depends on atmospheric chemistry, weather inversion, and population density downwind.",
    systemBoundary:
      "Direct stack and operational combustion air pollutant emissions per MWh.",
    explanation: {
      summary: "Air pollution affects health beyond the plant boundary.",
      body: [
        "Emissions and health impacts are different measures. Location, atmospheric transport and population exposure influence the latter.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Direct stack and operational combustion air pollutant emissions per MWh.",
        },
      ],
      citationIds: [],
    },
  },
  "occupational-hazard": {
    metricId: "occupational-hazard",
    category: "human-impact",
    title: "Occupational Safety & Worker Injury Rates",
    limitations:
      "Under-reporting of injuries in informal mining operations in developing nations can bias comparison figures.",
    systemBoundary:
      "Direct occupational fatalities and lost-time injuries across mining, manufacturing, construction, and operation.",
    explanation: {
      summary:
        "Worker safety extends across construction, operation and fuel supply.",
      body: [
        "Comparable rates need matching definitions, reporting practices and denominators such as hours worked.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Direct occupational fatalities and lost-time injuries across mining, manufacturing, construction, and operation.",
        },
      ],
      citationIds: [],
    },
  },
  "accident-risk": {
    metricId: "accident-risk",
    category: "human-impact",
    title: "Severe Accident Risk & Historical Outcomes",
    limitations:
      "Low-probability, high-consequence events require probabilistic risk assessment rather than empirical actuarial averages alone.",
    systemBoundary:
      "Severe industrial accident history, probabilistic safety targets, and direct/indirect casualty records.",
    explanation: {
      summary:
        "Accident frequency and accident consequences are different dimensions.",
      body: [
        "Historical observations and modeled risks answer different questions. Rare severe events carry substantial uncertainty.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Severe industrial accident history, probabilistic safety targets, and direct/indirect casualty records.",
        },
      ],
      citationIds: [],
    },
  },
  displacement: {
    metricId: "displacement",
    category: "human-impact",
    title: "Community Displacement & Evacuation",
    limitations:
      "Distinguishes planned infrastructure resettlement from emergency post-accident evacuation.",
    systemBoundary:
      "Total verified population permanently displaced or involuntarily relocated due to energy operations or accidents.",
    explanation: {
      summary: "Energy projects and accidents can displace communities.",
      body: [
        "Relocation, disrupted care, livelihoods and mental health cannot be represented by a mortality statistic alone.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Total verified population permanently displaced or involuntarily relocated due to energy operations or accidents.",
        },
      ],
      citationIds: [],
    },
  },
  "fuel-energy-density": {
    metricId: "fuel-energy-density",
    category: "security",
    title: "Fuel Energy Density",
    limitations:
      "Specific energy depends on enrichment level and reactor neutron spectrum (thermal LWR vs fast breeder).",
    systemBoundary:
      "Chemical or nuclear energy content per kilogram of unprocessed or enriched fuel form.",
    explanation: {
      summary:
        "Energy density measures energy stored or obtained per quantity of fuel.",
      body: [
        "The result depends on the material, fuel preparation and whether the boundary ends at heat or delivered electricity.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Chemical or nuclear energy content per kilogram of unprocessed or enriched fuel form.",
        },
      ],
      citationIds: [],
    },
  },
  "stockpiling-potential": {
    metricId: "stockpiling-potential",
    category: "security",
    title: "On-Site Strategic Fuel Stockpiling",
    limitations:
      "Gas can be stored in underground salt caverns, but surface storage is limited to several days of peak demand.",
    systemBoundary:
      "Feasible on-site reserve capacity measured in months or years of continuous full-power generation.",
    explanation: {
      summary: "Stored fuel can buffer a disruption in supply.",
      body: [
        "Storage volume is only one constraint: shelf life, facilities, regulation and the rest of the fuel supply chain matter.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Feasible on-site reserve capacity measured in months or years of continuous full-power generation.",
        },
      ],
      citationIds: [],
    },
  },
  "import-dependence": {
    metricId: "import-dependence",
    category: "security",
    title: "Import Dependency & Fuel Vulnerability",
    limitations:
      "Solar and wind generate domestic power, but their manufacturing components are heavily concentrated abroad.",
    systemBoundary:
      "National reliance on foreign fuel extraction, processing, or continuous operational supplies.",
    explanation: {
      summary:
        "Import dependence describes reliance on supplies from elsewhere.",
      body: [
        "Separate fuel imports from equipment, processing services and critical components; diversity of suppliers also matters.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "National reliance on foreign fuel extraction, processing, or continuous operational supplies.",
        },
      ],
      citationIds: [],
    },
  },
  "supply-chain-concentration": {
    metricId: "supply-chain-concentration",
    category: "security",
    title: "Supply Chain & Critical Mineral Concentration",
    limitations:
      "Supply chain concentration can shift over 5-10 year capital investment cycles as new domestic manufacturing opens.",
    systemBoundary:
      "Market share of top producing countries for critical materials, refining, and key component manufacturing.",
    explanation: {
      summary: "A supply chain may depend on a small number of suppliers.",
      body: [
        "Mining, processing, manufacturing and transport can have different bottlenecks and geographic concentrations.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Market share of top producing countries for critical materials, refining, and key component manufacturing.",
        },
      ],
      citationIds: [],
    },
  },
  "power-density": {
    metricId: "power-density",
    category: "technical",
    title: "Power Density (Watts per Square Meter)",
    limitations:
      "Must not conflate instantaneous peak power density with annual capacity-factored average generation density.",
    systemBoundary:
      "Annual average electrical power output divided by total boundary site area in W/m².",
    explanation: {
      summary: "Power density relates power output to occupied area.",
      body: [
        "Check whether output is rated or time-averaged and whether area means the site, spacing or the full supply chain.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Annual average electrical power output divided by total boundary site area in W/m².",
        },
      ],
      citationIds: [],
    },
  },
  "thermal-efficiency": {
    metricId: "thermal-efficiency",
    category: "technical",
    title: "Thermal Conversion Efficiency",
    limitations:
      "Non-thermal technologies (solar PV, wind, hydro) do NOT have a thermal efficiency; assigning one is scientifically invalid.",
    systemBoundary:
      "Net electrical power output divided by gross thermal heat generated by reactor or boiler.",
    explanation: {
      summary:
        "Thermal efficiency compares electricity output with heat input.",
      body: [
        "Heat-engine temperature limits and real equipment losses affect the result. Net output also accounts for the plant’s own electricity use.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Net electrical power output divided by gross thermal heat generated by reactor or boiler.",
        },
      ],
      citationIds: [],
    },
  },
  "refueling-cycle": {
    metricId: "refueling-cycle",
    category: "technical",
    title: "Refueling Cycle & Outage Frequency",
    limitations:
      "Only applicable to reactors with batch refueling regimes; online refueling designs (CANDU, RBMK) operate continuously.",
    systemBoundary:
      "Operational duration between scheduled batch core refueling and maintenance outages.",
    explanation: {
      summary: "Refueling affects when a reactor is available to generate.",
      body: [
        "Some designs refuel during operation; others use planned outages. Maintenance and inspection can occur during the same outage.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Operational duration between scheduled batch core refueling and maintenance outages.",
        },
      ],
      citationIds: [],
    },
  },
  "typical-capacity": {
    metricId: "typical-capacity",
    category: "technical",
    title: "Typical Single-Unit Electric Capacity",
    limitations:
      "Nameplate rating does not equal actual generation; must be evaluated alongside capacity factor.",
    systemBoundary:
      "Net electrical output rating of a single generator, reactor, or turbine at standard design conditions.",
    explanation: {
      summary: "Unit capacity is rated power, not annual generation.",
      body: [
        "Gross and net ratings differ because equipment consumes some electricity. A station can contain multiple units.",
      ],
      details: [
        {
          id: "boundary",
          title: "What is counted?",
          body: "Net electrical output rating of a single generator, reactor, or turbine at standard design conditions.",
        },
      ],
      citationIds: [],
    },
  },
};
