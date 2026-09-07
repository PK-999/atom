import type { ComplexityLevel } from "@/features/comparison/comparison-types";

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
  explanations: Record<ComplexityLevel, string>;
  limitations: string;
  systemBoundary: string;
}

export const METRIC_CATALOG_EXPLANATIONS: Record<
  string,
  MetricExplanationRecord
> = {
  // ====================
  // ENVIRONMENT (R08-E)
  // ====================
  "lifecycle-ghg": {
    metricId: "lifecycle-ghg",
    category: "environment",
    title: "Lifecycle Greenhouse Gas Emissions",
    explanations: {
      kid: "Some ways of making electricity release much more climate pollution than others, even after we count building them.",
      simple:
        "Fossil fuel estimates are much higher in this comparison. The way a study counts the full lifecycle still matters.",
      curious:
        "Fossil fuel estimates are much higher in this comparison. Lifecycle methods and system boundaries still matter.",
      technical:
        "The representative values differ substantially, but system boundaries, technology vintage, and upstream assumptions affect the comparison.",
      expert:
        "These interface values are not a published synthesis. Observation-level methods, distributions, boundaries, and transformations remain unavailable until evidence review.",
    },
    limitations:
      "Vintage and supply chain regionalization can cause 2-3x variance in reported lifecycle emissions.",
    systemBoundary:
      "Cradle-to-grave: mining, manufacturing, transport, construction, operation, decommissioning, and waste storage.",
  },
  "land-use": {
    metricId: "land-use",
    category: "environment",
    title: "Land Use Footprint",
    explanations: {
      kid: "Some power plants need huge fields, while others make lots of clean electricity in a small space.",
      simple:
        "Solar and wind usually need more physical land area than nuclear or gas to generate the same amount of electricity.",
      curious:
        "Direct plant footprint differs from indirect land impacts such as fuel mining, access roads, and spacing buffers.",
      technical:
        "Spatial footprints reflect nameplate power density multiplied by plant capacity factor over declared operating lifetime.",
      expert:
        "Distinguishes direct footprint (transformation) from total leased buffer (occupation); multi-use land (agrivoltaics) requires co-product allocation.",
    },
    limitations:
      "Buffer zones between wind turbines are often co-utilized for agriculture, complicating direct comparisons.",
    systemBoundary:
      "Direct physical footprint plus dedicated access roads and upstream mining occupation per generated MWh.",
  },
  "water-withdrawal": {
    metricId: "water-withdrawal",
    category: "environment",
    title: "Water Withdrawal Intensity",
    explanations: {
      kid: "Power plants take in water from rivers or oceans to stay cool while working.",
      simple:
        "Thermal power plants withdraw water for steam turbine cooling. Wind and solar panels use virtually no water during operation.",
      curious:
        "Withdrawal measures total water diverted from a natural source, but most cooling water is returned safely after cooling.",
      technical:
        "Once-through cooling withdraws large volumes with minimal evaporation; closed-loop wet cooling towers withdraw far less water.",
      expert:
        "Thermal discharge limits, seasonal intake temperatures, and impingement/entrainment mitigation dictate operational constraints.",
    },
    limitations:
      "Withdrawal does not indicate permanent loss; returned water is at higher temperature.",
    systemBoundary:
      "Operational cooling water volume intake per net MWh generated.",
  },
  "water-consumption": {
    metricId: "water-consumption",
    category: "environment",
    title: "Water Consumption Intensity",
    explanations: {
      kid: "Some power plants turn water into steam that floats away into the sky.",
      simple:
        "Water consumption measures water that evaporates into the atmosphere and is not returned to the local river or lake.",
      curious:
        "Cooling towers evaporate water to remove heat, which reduces withdrawal but increases net water consumed.",
      technical:
        "Evaporative losses in wet cooling towers average 1.5-2.5 m³/MWh, whereas once-through cooling consumes less than 0.4 m³/MWh.",
      expert:
        "Consumptive loss must be evaluated against local basin water stress indices (e.g. AWARE or WRI Aqueduct) rather than gross volume alone.",
    },
    limitations:
      "Varies substantially depending on ambient humidity, wet-bulb temperature, and cooling tower cycling.",
    systemBoundary:
      "Unreturned evaporative losses from plant cooling systems per net MWh generated.",
  },
  "material-requirements": {
    metricId: "material-requirements",
    category: "environment",
    title: "Material Requirements",
    explanations: {
      kid: "Building different power plants takes lots of concrete, steel, glass, and copper.",
      simple:
        "Renewables like solar and wind require more concrete, steel, and minerals per unit of electricity than high-density nuclear or gas plants.",
      curious:
        "Low energy density sources require more physical structures per megawatt-hour, increasing bulk materials per unit of lifetime energy.",
      technical:
        "Evaluates metric tons of steel, concrete, silicon, copper, and rare earths normalized to lifetime terawatt-hours produced.",
      expert:
        "Material intensity assessments depend heavily on assumed operational lifetime (e.g., 25–30y for solar/wind vs 60–80y for nuclear/hydro).",
    },
    limitations:
      "End-of-life recycling and circularity rates are rapidly evolving and vary by jurisdiction.",
    systemBoundary:
      "Capital plant construction materials and major component replacements over operational lifetime.",
  },
  "mining-intensity": {
    metricId: "mining-intensity",
    category: "environment",
    title: "Mining & Resource Extraction Intensity",
    explanations: {
      kid: "Making electricity requires digging rocks and minerals out of the ground.",
      simple:
        "All energy sources require mining—either continuously for fuel (coal, uranium, gas) or upfront for metals and batteries (solar, wind).",
      curious:
        "Fuel-intensive plants dig ore every day, while mineral-intensive renewables require large initial ore processing that generates decades of power.",
      technical:
        "Measures total earth moved (overburden plus run-of-mine ore) per cumulative unit of electrical output across the full lifecycle.",
      expert:
        "Ore grades (e.g. 0.1% to 20% U3O8 in uranium mining, 0.5% Cu in copper mining) dramatically alter the mass of tailings produced per MWh.",
    },
    limitations:
      "Stripping ratios and ore grades change over mine life and across global deposits.",
    systemBoundary:
      "Total rock and ore extraction required for plant construction minerals and lifetime fuel cycles.",
  },
  "waste-volume": {
    metricId: "waste-volume",
    category: "environment",
    title: "Solid & Hazardous Waste Volume",
    explanations: {
      kid: "Every power plant leaves behind some leftover materials when making energy.",
      simple:
        "Coal produces huge volumes of toxic ash. Nuclear produces tiny volumes of highly radioactive waste. Solar panels and wind blades create future scrap.",
      curious:
        "Nuclear fuel is extremely energy dense, so a lifetime of power creates a fuel pellet volume fitting in a soda can.",
      technical:
        "Distinguishes high-level vitrified radioactive waste, low-level operational waste, coal combustion residuals, and decommissioned blade/panel mass.",
      expert:
        "Volume metrics must distinguish unconditioned volume from packaged deep-geological repository disposal volume and hazardous chemical leachability.",
    },
    limitations:
      "Comparing physical volume alone hides immense differences in toxicity, decay rates, and containment engineering.",
    systemBoundary:
      "Cumulative solid and hazardous waste generated across fuel cycle and decommissioning per MWh.",
  },
  "waste-persistence": {
    metricId: "waste-persistence",
    category: "environment",
    title: "Waste Hazard Persistence & Toxicity",
    explanations: {
      kid: "Some leftovers stay dangerous for hundreds of years, while some chemicals stay dangerous forever.",
      simple:
        "Nuclear waste becomes safer over thousands of years as it decays, whereas heavy metal toxins like lead and arsenic remain toxic forever.",
      curious:
        "Radioactive decay means radiation levels drop over time. Chemical hazards from solar panel heavy metals or coal ash do not decay.",
      technical:
        "Fission products dominate radiotoxicity for the first 300 years; transuranic actinides dominate from 1,000 to 100,000 years until reaching natural ore radiotoxicity.",
      expert:
        "Radiological half-lives are deterministic physical laws, whereas environmental mobility depends on geochemical barriers, redox conditions, and engineered casks.",
    },
    limitations:
      "Categorical hazard persistence cannot be aggregated into a single scalar score without arbitrary weighting.",
    systemBoundary:
      "Timescale required for biological hazard to diminish to background geological baseline.",
  },

  // ====================
  // RELIABILITY (R08-R)
  // ====================
  "capacity-factor": {
    metricId: "capacity-factor",
    category: "reliability",
    title: "Capacity Factor",
    explanations: {
      kid: "Some power plants can run all day and night, while others only make power when the sun shines or the wind blows.",
      simple:
        "Capacity factor tells you how much electricity a plant actually produces compared to running at full power all the time.",
      curious:
        "Nuclear and geothermal maintain high capacity factors because they are designed for continuous baseline generation, unlike weather-dependent sources.",
      technical:
        "Annual capacity factors reflect dispatch economics, refueling outages, and weather intermittency rather than mechanical reliability alone.",
      expert:
        "Capacity factor metrics require clear distinction between nameplate availability and market curtailment under high renewable penetration.",
    },
    limitations:
      "Curtailed generation or economic dispatch can lower capacity factor even when a plant is fully available.",
    systemBoundary:
      "Annual gross generation divided by nameplate rating multiplied by 8,760 hours.",
  },
  dispatchability: {
    metricId: "dispatchability",
    category: "reliability",
    title: "Dispatchability & Operational Control",
    explanations: {
      kid: "Can grid operators turn this power plant on whenever homes and factories need electricity?",
      simple:
        "Dispatchable plants (nuclear, gas, hydro, batteries) can provide power on demand. Variable sources depend on the weather.",
      curious:
        "Grid operators need sources that can ramp up when demand spikes or when the wind stops blowing.",
      technical:
        "Categorized by start-up time (cold/warm/hot), minimum technical stable load (Pmin), and ramp rate (% of capacity per minute).",
      expert:
        "Evaluates governor response (primary frequency control), automatic generation control (secondary), and spinning/non-spinning contingency reserves.",
    },
    limitations:
      "Nuclear plants can technically load-follow, but are generally operated baseload for economic reasons.",
    systemBoundary:
      "System operator control capability over plant output on sub-hourly to daily dispatch horizons.",
  },
  variability: {
    metricId: "variability",
    category: "reliability",
    title: "Output Variability & Predictability",
    explanations: {
      kid: "The wind changes speed and clouds cover the sun, so clean energy output goes up and down.",
      simple:
        "Solar output follows the day-night cycle and weather. Wind varies across hours and seasons.",
      curious:
        "Predictable variability (like day and night) is easy to schedule, but sudden weather drops require fast-reacting backup power.",
      technical:
        "Characterized by coefficient of variation (standard deviation divided by mean) and maximum 1-hour/4-hour ramp events.",
      expert:
        "Geographic dispersion smooths wind variability across regional balancing authorities but cannot eliminate multi-day continental dunkelflaute.",
    },
    limitations:
      "Short-term forecast errors create balancing reserves requirements that increase with penetration.",
    systemBoundary:
      "Temporal volatility of power output at plant and regional fleet aggregation.",
  },
  "firm-capacity": {
    metricId: "firm-capacity",
    category: "reliability",
    title: "Firm Capacity & Capacity Credit",
    explanations: {
      kid: "How much power can we count on during the hottest or coldest days of the year?",
      simple:
        "Firm power plants can be guaranteed during peak demand. A 1000 MW wind farm might only provide 100 MW of firm capacity credit.",
      curious:
        "Capacity credit is the fraction of nameplate capacity that can reliably replace an equivalent conventional generator during peak risk hours.",
      technical:
        "Calculated using Effective Load Carrying Capability (ELCC), which evaluates the contribution to Loss of Load Expectation (LOLE < 0.1 days/year).",
      expert:
        "ELCC exhibits non-linear saturation: the capacity credit of additional solar or wind drops sharply as system penetration increases.",
    },
    limitations:
      "ELCC is not a constant property of the generator; it changes based on the rest of the grid mix.",
    systemBoundary:
      "Contribution to maintaining standard loss-of-load probability targets during peak net load hours.",
  },
  "storage-dependence": {
    metricId: "storage-dependence",
    category: "reliability",
    title: "Storage Dependence for Multi-Day Reliability",
    explanations: {
      kid: "If we use only the sun and wind, we need giant batteries to store power for calm, cloudy weeks.",
      simple:
        "Grids with high shares of weather-dependent power require energy storage or clean firm backup to keep lights on during winter lulls.",
      curious:
        "4-hour lithium batteries help with evening peaks, but multi-day calm spells require seasonal storage like hydrogen or firm generation.",
      technical:
        "Measures required storage duration (hours to weeks) and round-trip efficiency losses to achieve a 99.97% annual energy adequacy target.",
      expert:
        "System-level capital costs scale non-linearly with renewable penetration above 80% due to the low utilization of long-duration seasonal storage.",
    },
    limitations:
      "Model-dependent metric that relies on regional interconnects, demand response, and weather year datasets.",
    systemBoundary:
      "Total megawatt-hours of energy storage required per terawatt-hour of annual system consumption.",
  },

  // ====================
  // ECONOMICS (R08-C)
  // ====================
  "capital-cost": {
    metricId: "capital-cost",
    category: "economics",
    title: "Overnight Capital Expenditure (CAPEX)",
    explanations: {
      kid: "How much money does it take to buy the land, equipment, and build the entire power plant before it starts?",
      simple:
        "Building nuclear plants and big dams costs billions of dollars upfront. Solar and wind cost less upfront per site, but have shorter lifetimes.",
      curious:
        "Overnight capital cost represents what building the plant would cost if it could be completed overnight without interest on borrowed money.",
      technical:
        "Reported in $/kWe in constant currency years, excluding financing costs during construction (Interest During Construction / IDC).",
      expert:
        "Overnight CAPEX must be distinguished from all-in EPC contract costs, owner costs, grid interconnection fees, and first-of-a-kind (FOAK) premiums.",
    },
    limitations:
      "Financing costs during long construction periods can add 30-80% to overnight costs.",
    systemBoundary:
      "Direct equipment, civil engineering, construction, and engineering management costs to commercial operation.",
  },
  "operating-cost": {
    metricId: "operating-cost",
    category: "economics",
    title: "Fixed & Variable Operating Costs (OPEX)",
    explanations: {
      kid: "How much does it cost every year to pay the workers and keep the plant running smoothly?",
      simple:
        "Solar and wind have low operating costs because they have no moving fuel parts. Nuclear and thermal plants have higher staffing and maintenance costs.",
      curious:
        "Operating expenses include salaries, security, regulatory compliance, routine replacement parts, and planned maintenance shutdowns.",
      technical:
        "Separated into Fixed O&M ($/kW-yr, independent of generation) and Variable O&M ($/MWh, scaling with electrical output).",
      expert:
        "Nuclear fixed O&M is high due to specialized licensed staff, physical security mandates, and regulatory oversight, but variable O&M is low.",
    },
    limitations:
      "Outage lengths and supply chain costs for specialized replacement parts can cause annual variations.",
    systemBoundary:
      "Annual non-fuel operational, maintenance, administrative, and compliance costs per unit of installed capacity.",
  },
  "fuel-cost": {
    metricId: "fuel-cost",
    category: "economics",
    title: "Fuel Cost per MWh",
    explanations: {
      kid: "How much does the fuel cost to make each unit of electricity?",
      simple:
        "Wind and sunlight are free. Uranium fuel is a very small part of nuclear power cost. Gas and coal fuel prices swing unpredictably.",
      curious:
        "Because uranium is so energy dense, fuel represents only 15-20% of nuclear operating cost, compared to 60-80% for natural gas.",
      technical:
        "Nuclear fuel costs include mining, conversion, enrichment, fuel fabrication, and spent fuel management provisions (~$5-8/MWh).",
      expert:
        "Natural gas electricity prices are directly exposed to commodity spot volatility, while nuclear fuel contracts are negotiated 3-5 years in advance.",
    },
    limitations:
      "Fuel costs depend heavily on commodity market cycles and international transport infrastructure.",
    systemBoundary:
      "Direct procurement, processing, transportation, and waste escrow costs per generated MWh.",
  },
  lcoe: {
    metricId: "lcoe",
    category: "economics",
    title: "Levelized Cost of Electricity (LCOE)",
    explanations: {
      kid: "If you divide all the money spent on a plant over its whole life by all the power it ever makes, what is the price?",
      simple:
        "LCOE is a single average cost per megawatt-hour. Solar and wind have low LCOE, but LCOE doesn't include backup or transmission costs.",
      curious:
        "LCOE compares plant-level generation costs across technologies, but ignores the time-of-day value of electricity on the grid.",
      technical:
        "Calculated as net present value of all capital, fuel, O&M, and decommissioning costs divided by net present value of lifetime generation.",
      expert:
        "LCOE is highly sensitive to the weighted average cost of capital (WACC / discount rate): capital-heavy plants suffer under high interest rates.",
    },
    limitations:
      "LCOE measures plant-level costs, NOT system-level consumer costs or the value of dispatchable generation.",
    systemBoundary:
      "Full lifecycle financial costs discounted over plant operating life divided by discounted lifetime generation.",
  },
  "construction-duration": {
    metricId: "construction-duration",
    category: "economics",
    title: "Construction Duration & Project Lead Time",
    explanations: {
      kid: "How many years does it take from breaking ground until the power plant starts making electricity?",
      simple:
        "Solar farms can be built in a few months. Nuclear reactors and mega-dams take 6 to 10 years to build.",
      curious:
        "Long construction times increase financing costs, investor risk, and exposure to policy changes during the project.",
      technical:
        "Measured from first safety concrete pour (FSC) to first commercial electricity grid synchronization.",
      expert:
        "Standardized multi-unit fleet builds (e.g. South Korea, China) achieve 5–6 year construction times, while FOAK Western builds have suffered multi-year delays.",
    },
    limitations:
      "Pre-construction permitting, environmental reviews, and grid connection queues can add years before construction starts.",
    systemBoundary:
      "First safety concrete pour to commercial operational acceptance.",
  },
  "plant-lifetime": {
    metricId: "plant-lifetime",
    category: "economics",
    title: "Operating Lifetime & Asset Longevity",
    explanations: {
      kid: "How many years can the power plant keep working before it has to be retired?",
      simple:
        "Solar and wind farms are designed to last 25 to 30 years. Modern nuclear reactors and hydro dams are built to run for 60 to 80 years.",
      curious:
        "Longer-lived power plants produce clean electricity long after their initial construction loans are completely paid off.",
      technical:
        "Nuclear pressure vessels and dam structures are engineered for 60-80 years, requiring mid-life component refurbishments.",
      expert:
        "Subsequent license renewals (e.g. US NRC 80-year operation) provide high-value, low-marginal-cost clean electricity with zero new land footprint.",
    },
    limitations:
      "Economic lifetime may be cut short by market rules or localized component failures.",
    systemBoundary:
      "Certified design operating life and proven commercial extension precedents.",
  },
  "decommissioning-cost": {
    metricId: "decommissioning-cost",
    category: "economics",
    title: "Decommissioning & Site Remediation",
    explanations: {
      kid: "How much does it cost to safely tear down the plant and clean up the land when it gets retired?",
      simple:
        "Decommissioning cleans up the site so the land can be reused safely. Nuclear operators pay into a dedicated trust fund while generating power.",
      curious:
        "Dismantling thermal and nuclear plants involves environmental decontamination, waste containment, and restoration to greenfield or industrial standards.",
      technical:
        "Decommissioning trust funds (DTFs) collect a fraction of a cent per kilowatt-hour throughout operation to ensure full funding before closure.",
      expert:
        "Prompt dismantlement (DECON) versus deferred dismantlement (SAFSTOR) affects net present value of cleanup liability and worker dose exposure.",
    },
    limitations:
      "Final site restoration standards (unrestricted release vs brownfield re-industrialization) change cleanup costs.",
    systemBoundary:
      "Plant shutdown, chemical/radiological decontamination, structural demolition, and environmental site release.",
  },
  "financing-sensitivity": {
    metricId: "financing-sensitivity",
    category: "economics",
    title: "Financing Cost & WACC Sensitivity",
    explanations: {
      kid: "If bank interest rates go up, which power plants become much more expensive to build?",
      simple:
        "Plants with high upfront costs like nuclear, offshore wind, and hydro are very sensitive to interest rates. Gas plants care much more about fuel prices.",
      curious:
        "Because nuclear plants cost billions before making a single cent, a 3% increase in interest rates can double the lifetime electricity cost.",
      technical:
        "Measures the percentage change in LCOE per 100-basis-point increase in the Weighted Average Cost of Capital (WACC).",
      expert:
        "Regulated utility rate-basing or government Regulated Asset Base (RAB) financing reduces borrowing costs from commercial 8-10% to sovereign 3-4%.",
    },
    limitations:
      "Country risk premiums and investor risk appetite vary widely between mature and emerging economies.",
    systemBoundary:
      "Sensitivity of levelized generation cost across discount rates from 3% to 10%.",
  },

  // ====================
  // HUMAN IMPACT (R08-H)
  // ====================
  "mortality-rate": {
    metricId: "mortality-rate",
    category: "human-impact",
    title: "Mortality Rate per TWh Generated",
    explanations: {
      kid: "Which energy sources are safest for human health, and which ones cause harmful air pollution?",
      simple:
        "Nuclear, solar, and wind have the lowest death rates in history. Coal, oil, and gas cause millions of premature deaths from air pollution.",
      curious:
        "Historical data shows nuclear power is among the safest electricity sources per unit of power, comparable to wind and solar, even including accidents.",
      technical:
        "Aggregates premature deaths from chronic fine particulate air pollution (PM2.5), occupational accidents, and historical industrial disasters per TWh.",
      expert:
        "Peer-reviewed epidemiology (Markandya & Wilkinson, Our World in Data) separates direct traumatic fatalities from modeled statistical air-pollution mortality.",
    },
    limitations:
      "Does not conflate localized disaster terror with statistical public health morbidity.",
    systemBoundary:
      "Cumulative premature fatalities from air pollution, occupational hazards, and accidents normalized to lifetime electricity generated.",
  },
  "air-pollution": {
    metricId: "air-pollution",
    category: "human-impact",
    title: "Harmful Air Pollution Emissions (PM2.5, SO2, NOx)",
    explanations: {
      kid: "Burning fossil fuels releases dirty smoke that makes people sick, but clean power does not make smoke.",
      simple:
        "Nuclear, wind, hydro, and solar emit zero smoke or smog while generating electricity. Coal and gas release harmful particles into the air.",
      curious:
        "Combustion emissions (fine dust, sulfur dioxide, nitrogen oxides) cause asthma, cardiovascular disease, and lung cancer worldwide.",
      technical:
        "Measures kilograms of primary PM2.5, sulfur dioxide (SO2), and nitrogen oxides (NOx) emitted per megawatt-hour of electricity.",
      expert:
        "Air quality impact modeling applies concentration-response functions (CRFs) linking ambient particulate concentrations to attributable mortality.",
    },
    limitations:
      "Secondary particulate formation depends on atmospheric chemistry, weather inversion, and population density downwind.",
    systemBoundary:
      "Direct stack and operational combustion air pollutant emissions per MWh.",
  },
  "occupational-hazard": {
    metricId: "occupational-hazard",
    category: "human-impact",
    title: "Occupational Safety & Worker Injury Rates",
    explanations: {
      kid: "How safe is it for technicians, miners, and engineers to do their jobs at the power plant?",
      simple:
        "Rooftop solar installers and coal miners face higher injury risks than nuclear plant operators, who work in strictly monitored environments.",
      curious:
        "Workplace safety studies count falls from heights, electrical shocks, mining collapses, and industrial accidents across the full energy supply chain.",
      technical:
        "Standardized to Lost Time Injury Frequency Rate (LTIFR) and occupational fatalities per million worker-hours or per TWh.",
      expert:
        "Occupational risk is highest during mining (coal, silicon, rare earths) and manual rooftop installation rather than plant operation.",
    },
    limitations:
      "Under-reporting of injuries in informal mining operations in developing nations can bias comparison figures.",
    systemBoundary:
      "Direct occupational fatalities and lost-time injuries across mining, manufacturing, construction, and operation.",
  },
  "accident-risk": {
    metricId: "accident-risk",
    category: "human-impact",
    title: "Severe Accident Risk & Historical Outcomes",
    explanations: {
      kid: "What happens when something goes terribly wrong at a big power plant or dam?",
      simple:
        "Hydro dam collapses (like Banqiao in 1975) caused the deadliest energy accidents in history. Nuclear accidents have caused far fewer deaths than feared.",
      curious:
        "Chernobyl was the deadliest nuclear accident (~30 direct deaths, thousands of modeled thyroid cancers). Fukushima caused zero direct radiation deaths.",
      technical:
        "Evaluates core damage frequency (CDF < 10^-5/reactor-year for Gen III+) and large early release frequency (LERF) alongside historical dam failures.",
      expert:
        "Modern reactors feature passive cooling and core catchers preventing containment breach even under total station blackout, unlike early Gen II designs.",
    },
    limitations:
      "Low-probability, high-consequence events require probabilistic risk assessment rather than empirical actuarial averages alone.",
    systemBoundary:
      "Severe industrial accident history, probabilistic safety targets, and direct/indirect casualty records.",
  },
  displacement: {
    metricId: "displacement",
    category: "human-impact",
    title: "Community Displacement & Evacuation",
    explanations: {
      kid: "Do people have to pack up their homes and move away to build a reservoir or because of an accident?",
      simple:
        "Hydroelectric dams displace millions of people by flooding valleys. Severe nuclear accidents have forced emergency evacuations.",
      curious:
        "Over 1.2 million people were permanently displaced for China's Three Gorges Dam. Fukushima evacuated ~160,000, most of whom were allowed to return.",
      technical:
        "Measures permanent population displacement for site creation and temporary/permanent relocation person-years following severe industrial incidents.",
      expert:
        "Public health studies demonstrate that prolonged evacuation after Fukushima caused far more psychological and social harm than radiation exposure would have.",
    },
    limitations:
      "Distinguishes planned infrastructure resettlement from emergency post-accident evacuation.",
    systemBoundary:
      "Total verified population permanently displaced or involuntarily relocated due to energy operations or accidents.",
  },

  // ====================
  // SECURITY (R08-S)
  // ====================
  "fuel-energy-density": {
    metricId: "fuel-energy-density",
    category: "security",
    title: "Fuel Energy Density",
    explanations: {
      kid: "A single tiny uranium pellet makes as much electricity as three giant train cars of coal!",
      simple:
        "Uranium is millions of times more concentrated than coal, oil, or gas. One fingertip-sized pellet provides electricity for a whole household for months.",
      curious:
        "Because nuclear fuel is so dense, a reactor only needs fresh fuel once every 18 to 24 months, making power plants independent of weather and traffic.",
      technical:
        "Specific energy: natural uranium contains ~500,000 MJ/kg (thermal, once-through light water reactor), compared to 24 MJ/kg for bituminous coal.",
      expert:
        "Complete fission releases 200 MeV per atom (~8.2×10^7 MJ/kg), whereas chemical combustion releases ~4 eV per molecule (~30–50 MJ/kg).",
    },
    limitations:
      "Specific energy depends on enrichment level and reactor neutron spectrum (thermal LWR vs fast breeder).",
    systemBoundary:
      "Chemical or nuclear energy content per kilogram of unprocessed or enriched fuel form.",
  },
  "stockpiling-potential": {
    metricId: "stockpiling-potential",
    category: "security",
    title: "On-Site Strategic Fuel Stockpiling",
    explanations: {
      kid: "How easy is it to keep years of spare fuel stored safely at the power plant in case of an emergency?",
      simple:
        "A nuclear plant can store 2 to 5 years of fuel inside a small secure building. Gas plants depend on continuous pipeline deliveries.",
      curious:
        "If a pipeline freezes or an international shipping lane closes, gas plants shut down in days. Nuclear reactors keep running uninterrupted.",
      technical:
        "Evaluates the physical volume, cost, and shelf-life of on-site fuel reserves capable of sustaining full-power continuous generation.",
      expert:
        "Uranium oxide fuel assemblies exhibit zero degradation in storage; strategic national uranium stockpiles insulate economies from geopolitical embargoes.",
    },
    limitations:
      "Gas can be stored in underground salt caverns, but surface storage is limited to several days of peak demand.",
    systemBoundary:
      "Feasible on-site reserve capacity measured in months or years of continuous full-power generation.",
  },
  "import-dependence": {
    metricId: "import-dependence",
    category: "security",
    title: "Import Dependency & Fuel Vulnerability",
    explanations: {
      kid: "Does a country have to buy energy fuel from other nations, or can it make power at home?",
      simple:
        "Countries without domestic gas or oil can be cut off during wars. Domestic uranium, wind, and solar protect a nation's energy independence.",
      curious:
        "Import dependence measures the share of primary energy sourced from foreign nations, exposing electric grids to global supply disruptions.",
      technical:
        "Calculated as net energy imports divided by gross domestic primary energy consumption, disaggregated by trade partner concentration.",
      expert:
        "Nuclear fuel fabrication diversification (e.g. Westinghouse, Framatome, Kazatomprom) prevents single-supplier hold-ups even when importing enriched U.",
    },
    limitations:
      "Solar and wind generate domestic power, but their manufacturing components are heavily concentrated abroad.",
    systemBoundary:
      "National reliance on foreign fuel extraction, processing, or continuous operational supplies.",
  },
  "supply-chain-concentration": {
    metricId: "supply-chain-concentration",
    category: "security",
    title: "Supply Chain & Critical Mineral Concentration",
    explanations: {
      kid: "Are the special parts and metals to build the plant made all over the world, or does one country control them all?",
      simple:
        "A single country controls 70-80% of the world's solar silicon, battery processing, and rare earths, creating a new geopolitical bottleneck.",
      curious:
        "While wind and sunlight are everywhere, the supply chains to manufacture solar panels and wind turbines are heavily concentrated in China.",
      technical:
        "Quantified via the Herfindahl-Hirschman Index (HHI) for key supply chain stages: mining, refining, component fabrication, and final assembly.",
      expert:
        "Uranium extraction is geographically diverse (Kazakhstan, Canada, Australia, Namibia), but commercial conversion and enrichment capacity remain concentrated.",
    },
    limitations:
      "Supply chain concentration can shift over 5-10 year capital investment cycles as new domestic manufacturing opens.",
    systemBoundary:
      "Market share of top producing countries for critical materials, refining, and key component manufacturing.",
  },

  // ====================
  // TECHNICAL (R08-T)
  // ====================
  "power-density": {
    metricId: "power-density",
    category: "technical",
    title: "Power Density (Watts per Square Meter)",
    explanations: {
      kid: "How much electricity can we make inside a single square meter of space?",
      simple:
        "Nuclear power has huge power density—thousands of watts per square meter. Solar and wind produce only 2 to 20 watts per square meter.",
      curious:
        "Power density measures how compactly an energy technology converts space into electricity. High density leaves more nature undisturbed.",
      technical:
        "Expressed in W/m² (electrical output averaged over the year divided by total site area). Nuclear: ~1,000–2,000 W/m²; Solar: 5–20 W/m²; Wind: 2–4 W/m².",
      expert:
        "Thermal power density dictates thermal hydraulic design and safety heat removal, whereas spatial power density dictates environmental land transformation.",
    },
    limitations:
      "Must not conflate instantaneous peak power density with annual capacity-factored average generation density.",
    systemBoundary:
      "Annual average electrical power output divided by total boundary site area in W/m².",
  },
  "thermal-efficiency": {
    metricId: "thermal-efficiency",
    category: "technical",
    title: "Thermal Conversion Efficiency",
    explanations: {
      kid: "How much of the hot heat created by the plant actually turns into useful electricity?",
      simple:
        "Thermal plants turn heat into steam and electricity. Modern gas plants turn ~60% of heat into power; nuclear plants turn about 33-37% into power.",
      curious:
        "The laws of thermodynamics limit how much heat can turn into work. Non-thermal sources like solar PV and wind do not use steam cycles.",
      technical:
        "Calculated as Net Electrical Output divided by Thermal Heat Input. Combined-cycle gas achieves 60–62%; light water reactors achieve 33–36%.",
      expert:
        "Light water reactors operate at lower temperatures (~300°C) than modern supercritical coal or gas, limiting Carnot efficiency; advanced SMRs reach >40%.",
    },
    limitations:
      "Non-thermal technologies (solar PV, wind, hydro) do NOT have a thermal efficiency; assigning one is scientifically invalid.",
    systemBoundary:
      "Net electrical power output divided by gross thermal heat generated by reactor or boiler.",
  },
  "refueling-cycle": {
    metricId: "refueling-cycle",
    category: "technical",
    title: "Refueling Cycle & Outage Frequency",
    explanations: {
      kid: "How long can the reactor make electricity before workers need to stop and put in fresh fuel?",
      simple:
        "A nuclear reactor runs continuously for 18 to 24 months before shutting down for a few weeks to swap out a portion of its fuel.",
      curious:
        "During refueling outages, workers replace about one-third of the nuclear fuel assemblies and perform deep equipment maintenance.",
      technical:
        "Commercial light water reactors operate on 18-month or 24-month fuel cycles with typical outage durations of 20 to 35 days.",
      expert:
        "Advanced reactor designs (e.g. molten salt, pebble bed, fast breeders) or CANDU PHWRs can achieve continuous online refueling without shutdowns.",
    },
    limitations:
      "Only applicable to reactors with batch refueling regimes; online refueling designs (CANDU, RBMK) operate continuously.",
    systemBoundary:
      "Operational duration between scheduled batch core refueling and maintenance outages.",
  },
  "unit-capacity": {
    metricId: "unit-capacity",
    category: "technical",
    title: "Typical Single-Unit Electric Capacity",
    explanations: {
      kid: "How big is one single turbine, panel, or nuclear reactor?",
      simple:
        "A typical nuclear reactor makes 1,000 megawatts—enough for a million homes. A single modern wind turbine makes 3 to 15 megawatts.",
      curious:
        "Unit capacity dictates how many individual machines must be built and maintained to supply a major city or industrial grid.",
      technical:
        "Measures net electrical nameplate capacity of a single operational unit (MW(e)), distinct from total multi-unit facility capacity.",
      expert:
        "Small Modular Reactors (SMRs) deliberately trade individual unit capacity (50–300 MWe) for factory fabrication and modular scaling.",
    },
    limitations:
      "Nameplate rating does not equal actual generation; must be evaluated alongside capacity factor.",
    systemBoundary:
      "Net electrical output rating of a single generator, reactor, or turbine at standard design conditions.",
  },
};
