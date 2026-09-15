import type { ComplexityLevel } from "@/lib/preferences/complexity-preference";

export type MythCategory =
  | "safety"
  | "waste"
  | "radiation"
  | "environment"
  | "economics"
  | "proliferation";

export interface MythItem {
  id: string;
  claim: string;
  verdict: "False" | "Nuanced" | "Context Dependent" | "Debunked";
  category: MythCategory;
  quickReality: string;
  explanations: Record<ComplexityLevel, string>;
  evidenceSources: {
    title: string;
    organization: string;
    year: number;
    citation: string;
  }[];
}

export const MYTHS_DATA: MythItem[] = [
  {
    id: "reactor-bomb-explosion",
    claim: "A nuclear reactor can explode like an atomic bomb.",
    verdict: "False",
    category: "safety",
    quickReality:
      "Commercial reactor fuel is physically incapable of a nuclear detonation because its uranium enrichment is far too low.",
    explanations: {
      beginner:
        "No matter what goes wrong, a nuclear power plant can NEVER explode like a nuclear bomb! Bombs require super-concentrated weapons-grade uranium (over 90%). Reactor fuel only has about 3% to 5% uranium-235. It is like trying to make a fire out of wet firewood — the physics simply will not let an explosive nuclear blast happen.",
      explorer:
        "A nuclear detonation requires rapid supercritical assembly of highly enriched fissile material (>90% U-235 or Pu-239) into a dense sphere within microseconds. Commercial reactors use low-enriched uranium (3–5% U-235) mixed with U-238, ceramic binders, and water coolant. Even in severe accidents like Chernobyl, explosions were non-nuclear steam and chemical hydrogen blasts, not nuclear yield detonations.",
      curious:
        "The physics of nuclear weapons versus reactors are fundamentally distinct. Nuclear weapons require high-density prompt-supercritical configurations with fast neutrons and zero moderation. In commercial reactors, fuel is dispersed in a large lattice; any overheating introduces negative reactivity through Doppler broadening in U-238 and coolant density loss (negative void coefficient in light water reactors), which naturally terminates the chain reaction.",
      "deep-dive":
        "Commercial LWR fuel utilizes 3.0–4.95% enriched UO₂ pellets. The neutron capture-to-fission ratio of fertile U-238 prevents prompt supercriticality in a thermal spectrum without active moderation. Chernobyl was an RBMK graphite-moderated reactor with a positive void coefficient at low power, which produced an uncontrolled prompt power spike resulting in steam overpressurization and zirconium-water reaction hydrogen ignition (chemical explosion), with zero nuclear weapon-style detonation yield.",
      geeky:
        "Bethe-Tait disassembly kinetics confirm that explosive disassembly cannot occur in thermal LWR fuel. Prompt neutron generation time Λ ≈ 20–50 μs in thermal reactors versus Λ ≈ 10 ns in fast metal weapon assemblies. Even in hypothetical prompt critical transients (ρ > $1.00), fuel Doppler feedback (∂ρ/∂T_fuel ≈ -2 to -4 pcm/°C) terminates reactivity insertion orders of magnitude before containment design failure limits.",
    },
    evidenceSources: [
      {
        title: "Nuclear Power Plant Safety Fundamentals",
        organization: "International Atomic Energy Agency (IAEA)",
        year: 2021,
        citation: "IAEA Safety Standards Series No. SSR-2/1 (Rev. 1)",
      },
      {
        title:
          "Reactor Safety Study: An Assessment of Accident Risks in U.S. Commercial Nuclear Power Plants",
        organization: "U.S. Nuclear Regulatory Commission (NRC)",
        year: 1975,
        citation: "WASH-1400 (NUREG-75/014)",
      },
    ],
  },
  {
    id: "nuclear-waste-unsolved",
    claim:
      "Nuclear waste has no solution and will remain lethal for millions of years.",
    verdict: "Context Dependent",
    category: "waste",
    quickReality:
      "96% of used nuclear fuel is reusable uranium and plutonium. The high-level fission products return to natural background ore radiotoxicity in ~300 to 1,000 years, and deep geological repositories like Onkalo are operational.",
    explanations: {
      beginner:
        "Used nuclear fuel is completely solid, not a glowing green slime! All the nuclear waste ever made in America in 60 years would fit on a single football field stacked just 10 yards high. It is locked in heavy concrete-and-steel canisters, and countries like Finland have built deep underground vaults inside 2-billion-year-old bedrock to store it safely forever.",
      explorer:
        "Nuclear energy is the only major energy source that contains and accounts for 100% of its waste. Over 95% of spent fuel is still usable uranium that can be recycled in advanced reactors. The remaining highly radioactive fission products decay rapidly; their radiotoxicity drops by 99% within 40 years of cooling in water pools, and drops below the natural uranium ore from which it was mined within about 1,000 years.",
      curious:
        "High-level radioactive waste (HLW) represents only ~3% of total nuclear waste volume, yet accounts for 95% of radioactivity. The primary technical solution is deep geological disposal: Finland's Onkalo repository places vitrified waste inside double-walled copper canisters embedded in bentonite clay 450 meters down in stable crystalline granite bedrock, engineered to remain isolated over ice ages without human maintenance.",
      "deep-dive":
        "The radiotoxic inventory of spent nuclear fuel (SNF) is dominated initially by short-lived fission products (Cs-137, Sr-90 with ~30-year half-lives). After ~300 years, fission product activity decreases by a factor of 1,000, leaving minor actinides (Np-237, Am-241, Cm-244) and residual plutonium. Closed fuel cycles (such as France's La Hague PUREX reprocessing) separate 96% of uranium and plutonium for MOX fuel fabrication, reducing the required geological isolation timeframe from ~300,000 years to <10,000 years.",
      geeky:
        "Radiotoxicity index curves indicate ingestion toxicity of untreated light-water reactor SNF (at 45 GWd/tU burnup) reaches parity with natural uranium ore baseline (the radiotoxic equivalent of the parent ore body) at approximately 200,000 years. If actinide partitioning and transmutation (P&T) in fast breeder reactors is applied, transuranic inventory decays below baseline in ~300–500 years, completely eliminating multi-millennial radiotoxicity burdens.",
    },
    evidenceSources: [
      {
        title: "Deep Geological Repositories for High-Level Radioactive Waste",
        organization: "OECD Nuclear Energy Agency (NEA)",
        year: 2020,
        citation: "NEA No. 7515",
      },
      {
        title:
          "Safety Case for the Disposal of Spent Nuclear Fuel at Olkiluoto",
        organization: "Posiva Oy (Finland)",
        year: 2022,
        citation: "Posiva Report 2021-01",
      },
    ],
  },
  {
    id: "living-near-plant-radiation",
    claim:
      "Living near a nuclear power plant exposes you to dangerous radiation doses.",
    verdict: "False",
    category: "radiation",
    quickReality:
      "Living next to a nuclear plant adds less than 0.0001 mSv/year — thousands of times less than eating a banana or flying on an airplane.",
    explanations: {
      beginner:
        "Living next door to a nuclear plant gives you less radiation than eating a banana! Natural bananas contain potassium, which has a tiny bit of natural radiation. In fact, sleeping next to another human being gives you more radiation than living by a nuclear reactor for an entire year.",
      explorer:
        "All humans live in a sea of natural background radiation from outer space, rocks, and soil (averaging ~2.4 to 3.0 mSv every year). A person standing outside the fence of a nuclear plant 24 hours a day receives less than 0.001 mSv per year. A cross-country airplane flight gives you 40 times more radiation due to thinner cosmic atmospheric shielding.",
      curious:
        "Strict regulatory boundary limits (10 CFR 50 Appendix I in the US) cap public radiation exposure from commercial reactors at 0.05 mSv/year, though actual measured emissions average ~0.0001 mSv/year. Intriguingly, operating coal plants release more radioactive fly ash (containing trace thorium and uranium) into the public biosphere per gigawatt-hour than a sealed nuclear power plant.",
      "deep-dive":
        "The average global background radiation dose is ~2.4 mSv/year, with high natural background areas like Ramsar (Iran) and Kerala (India) exceeding 10–25 mSv/year with no observed elevation in cancer incidence. Commercial nuclear effluents are restricted to noble gases (Xe-133, Kr-85) and trace tritium (H-3), resulting in fence-line effective dose equivalents under 0.001 mSv/year — 0.04% of average natural background.",
      geeky:
        "UNSCEAR 2020 Report on Sources and Effects of Ionizing Radiation estimates the global collective effective dose from the nuclear fuel cycle at 0.0002 mSv per person-year, compared to 0.005 mSv from coal-fired power production fly-ash discharges (due to Ra-226, Ra-228, Th-232, and U-238 decay series release in non-scrubbed ash aerosols).",
    },
    evidenceSources: [
      {
        title: "Sources, Effects and Risks of Ionizing Radiation",
        organization:
          "United Nations Scientific Committee on the Effects of Atomic Radiation (UNSCEAR)",
        year: 2020,
        citation: "UNSCEAR 2020/2021 Report, Volume I",
      },
      {
        title: "Radiation Dose from Nuclear Power Generation",
        organization: "U.S. Environmental Protection Agency (EPA)",
        year: 2023,
        citation: "EPA 402-B-23-001",
      },
    ],
  },
  {
    id: "lifecycle-carbon-emissions",
    claim:
      "Nuclear power produces huge amounts of hidden carbon emissions during mining and construction.",
    verdict: "False",
    category: "environment",
    quickReality:
      "Comprehensive cradle-to-grave lifecycle analyses show nuclear emits 5–12 g CO₂e/kWh — identical to wind and lower than solar.",
    explanations: {
      beginner:
        "Nuclear power does not burn anything, so it does not release any smoke or greenhouse gases while generating electricity. Even when scientists count building the concrete walls and mining the uranium, nuclear power is just as clean as wind energy and even cleaner than solar panels!",
      explorer:
        "Scientists study 'cradle-to-grave' lifecycle emissions, measuring mining, concrete manufacturing, power plant construction, 40–60 years of operation, and decommissioning. IPCC and UNECE studies calculate nuclear's lifecycle emissions at ~12 grams of CO₂ equivalent per kilowatt-hour, compared to 11 g for wind, 27–48 g for rooftop solar, 490 g for gas, and 820 g for coal.",
      curious:
        "The United Nations Economic Commission for Europe (UNECE 2021) conducted the most comprehensive full lifecycle assessment of electricity generation technologies to date. Nuclear exhibited the lowest lifecycle greenhouse gas emissions of any technology (5.1 to 6.4 g CO₂e/kWh for Gen III PWRs), alongside the lowest mineral/metal consumption and lowest lifecycle land footprint.",
      "deep-dive":
        "ISO 14040/14044 lifecycle assessments (LCA) account for uranium milling (acid/alkali leaching), centrifuge isotope enrichment (using current grid carbon intensity), plant civil engineering (steel/concrete embodied carbon), refuelings over 60-year operational lifetimes at >90% capacity factor, and decommissioning/repository packaging. Because gas centrifuge enrichment requires ~50 kWh/SWU compared to obsolete gaseous diffusion (~2500 kWh/SWU), upstream fuel cycle carbon footprint has dropped over 90% since 2000.",
      geeky:
        "Harmonized IPCC Fifth Assessment Report (AR5 WGIII Chapter 7) meta-analysis across 124 reviewed LCAs reported median lifecycle values: Nuclear = 12 g CO₂e/kWh (IQR: 8–22); Wind offshore = 12; Wind onshore = 11; Hydro = 24; Solar PV utility = 48; Natural gas combined-cycle = 490; Pulverized coal = 820. Upstream uranium ore grade sensitivity: even drops to low-grade 0.01% U3O8 ore maintain nuclear lifecycle emissions under 25 g CO₂e/kWh.",
    },
    evidenceSources: [
      {
        title: "Life Cycle Assessment of Electricity Generation Options",
        organization: "United Nations Economic Commission for Europe (UNECE)",
        year: 2021,
        citation: "UNECE Publication ECE/ENERGY/139",
      },
      {
        title: "Climate Change 2014: Mitigation of Climate Change (IPCC AR5)",
        organization: "Intergovernmental Panel on Climate Change (IPCC)",
        year: 2014,
        citation: "IPCC AR5 WGIII Chapter 7: Energy Systems",
      },
    ],
  },
  {
    id: "historical-casualties-safety",
    claim: "Nuclear energy is the most dangerous way to generate electricity.",
    verdict: "False",
    category: "safety",
    quickReality:
      "Per unit of electricity generated, nuclear is empirically one of the safest energy sources in human history, alongside solar and wind.",
    explanations: {
      beginner:
        "Nuclear power is actually one of the safest ways we have ever invented to make electricity! Fossil fuels like coal and oil cause millions of deaths every single year from lung sickness caused by dirty air pollution. Nuclear plants produce clean electricity without dirty soot, saving millions of lives.",
      explorer:
        "When public health researchers calculate deaths per unit of electricity (including mining accidents, construction falls, plant accidents, and air pollution), coal causes ~24.6 deaths per terawatt-hour, oil causes ~18.4, gas causes ~2.8, while nuclear causes ~0.03 deaths per terawatt-hour (virtually identical to modern wind and solar).",
      curious:
        "Major public health studies published in The Lancet and by Our World in Data demonstrate that fossil fuel air pollution (particulate matter PM2.5, nitrogen oxides, and sulfur dioxide) kills an estimated 5 to 8 million people globally every single year. Nuclear power generation has prevented an estimated 1.8 million air pollution-related premature deaths between 1971 and 2009 by displacing coal combustion (Kharecha & Hansen, 2013).",
      "deep-dive":
        "Even when incorporating the complete UNSCEAR Chernobyl casualty projections (~4,000 probabilistic fatal radiation-induced solid cancer deaths over 50 years across exposed populations) and zero acute radiation casualties from Fukushima Daiichi, nuclear mortality rates remain under 0.07 deaths/TWh globally. By contrast, rooftop solar exhibits ~0.02–0.04 deaths/TWh predominantly from occupational construction falls, and hydro exhibits rare but catastrophic dam break risks (e.g. Banqiao Dam, 1975).",
      geeky:
        "Markandya & Wilkinson (The Lancet 2007) multi-technology epidemiological risk synthesis: Total deaths per TWh generated in the European Union (occupational + public + air pollution): Coal = 24.5; Lignite = 32.6; Oil = 18.4; Gas = 2.82; Nuclear = 0.052; Wind = 0.020. Nuclear mortality risk is two to three orders of magnitude lower than hydrocarbons due to continuous particulate emissions avoidance.",
    },
    evidenceSources: [
      {
        title: "Electricity Generation and Health",
        organization: "The Lancet (Markandya & Wilkinson)",
        year: 2007,
        citation: "The Lancet, Vol. 370, Issue 9591, pp. 979-990",
      },
      {
        title:
          "Prevented Mortality and Greenhouse Gas Emissions from Historical and Projected Nuclear Power",
        organization: "Environmental Science & Technology (Kharecha & Hansen)",
        year: 2013,
        citation: "Environ. Sci. Technol. 2013, 47, 9, 4889–4895",
      },
    ],
  },
  {
    id: "renewables-make-nuclear-obsolete",
    claim:
      "Solar and wind are so cheap that nuclear power is completely obsolete.",
    verdict: "Nuanced",
    category: "economics",
    quickReality:
      "Solar and wind provide low-cost energy when available, but nuclear provides 90%+ firm clean baseload, lowering the total system-level cost of deep grid decarbonization.",
    explanations: {
      beginner:
        "Solar panels and wind turbines are wonderful when the sun shines and the wind blows! But what happens on a freezing, calm winter night? Nuclear power runs 24 hours a day, 7 days a week, rain or shine. Having both working together makes the cleanest and most dependable power grid.",
      explorer:
        "Comparing the cost of a solar panel directly to a nuclear plant is misleading because solar and wind only generate electricity 20% to 35% of the year. To power a modern hospital, data center, or city 100% with weather-dependent renewables, you must build 3–4x extra capacity, massive high-voltage transmission lines, and days of multi-gigawatt battery storage. Nuclear provides high-capacity firm power that cuts those extra grid integration costs.",
      curious:
        "Energy economists distinguish between Levelized Cost of Energy (LCOE) and Total System Levelized Cost. As renewable penetration exceeds 60–70% of a grid, the marginal integration cost escalates exponentially due to seasonal overgeneration curtailment and expensive multi-day long-duration energy storage (LDES). Deep decarbonization studies (e.g. MIT Energy Initiative, Princeton Net-Zero America) demonstrate that including clean firm generation like nuclear lowers total electricity costs by 20% to 40%.",
      "deep-dive":
        "Capacity factor for nuclear is 92.5% in the US (EIA data), compared to 24.8% for utility PV and 35.3% for onshore wind. A 1,000 MWe nuclear plant generates ~8,100 GWh annually, requiring ~1 km² of land. Producing the same reliable annual energy via solar requires ~3,000–4,000 MWe nameplate capacity and ~100–150 km² of land area, plus backup capacity to mitigate Dunkelflaute (prolonged cloudy, windless weather events).",
      geeky:
        "Sepulveda et al. (Nature Energy 2018) modeled power system capacity expansion across 1,000+ cost scenarios. At zero-carbon electricity targets ($0/tCO₂ vs $0/MWh emissions target), system electricity costs increased by 11% to 110% when firm low-carbon generation (nuclear) was excluded, because battery storage capital costs scale with duration rather than power rating, leading to massive overbuilding and asset stranding under variable weather regimes.",
    },
    evidenceSources: [
      {
        title:
          "The Role of Firm Low-Carbon Electricity Resources in Deep Decarbonization of Power Generation",
        organization:
          "Nature Energy (Sepulveda, Jenkins, de Sisternes, Lester)",
        year: 2018,
        citation: "Nature Energy, Vol. 3, pp. 992–1004",
      },
      {
        title: "The Future of Nuclear Energy in a Carbon-Constrained World",
        organization: "MIT Energy Initiative (MITEI)",
        year: 2018,
        citation: "MIT Energy Initiative Study",
      },
    ],
  },
  {
    id: "weapons-proliferation-link",
    claim:
      "Every civilian nuclear power plant can easily be converted to produce nuclear weapons.",
    verdict: "Context Dependent",
    category: "proliferation",
    quickReality:
      "Commercial light-water reactor fuel builds up Pu-240 which ruins weapon detonation. International Atomic Energy Agency (IAEA) continuous inspections prevent diversion.",
    explanations: {
      beginner:
        "Nuclear power plants and nuclear bombs are not the same thing! Commercial reactors use fuel that produces the wrong kind of plutonium for weapons. International inspectors with cameras, digital seals, and satellite sensors monitor every gram of nuclear fuel around the world to ensure it stays in civilian power plants.",
      explorer:
        "Nuclear weapons require nearly pure fissile isotopes (U-235 >90% or Pu-239 >93%). Commercial light-water reactors keep fuel inside the core for 3 to 5 years, which causes plutonium-240 to build up. Pu-240 has a high spontaneous fission rate that causes premature detonation ('fizzle') in a weapon design, making commercial spent fuel extremely unsuitable and dangerous for bomb-making.",
      curious:
        "The primary proliferation risks exist in the fuel cycle endpoints — enrichment facilities (which could hypothetically be reconfigured to enrich uranium beyond 20% toward 90%) and chemical reprocessing plants (which separate plutonium). Under the Treaty on the Non-Proliferation of Nuclear Weapons (NPT), the IAEA maintains Comprehensive Safeguards Agreements, verifying mass-balance continuity and environmental sampling in real time.",
      "deep-dive":
        "Reactor-grade plutonium (R-Pu) generated at typical LWR burnup (~45 GWd/tU) contains ~24% Pu-240, ~10% Pu-241, and ~2% Pu-238. Pu-238 generates intense decay heat (~560 W/kg), while Pu-240's spontaneous fission neutron rate (~10⁶ n/s/kg) causes severe pre-initiation and yield degradation in implosion weapons. While the US DOE demonstrated in 1962 that an explosive device could be constructed with non-weapons-grade plutonium, the engineering hurdles, high radiation dose, and thermal degradation make commercial fuel cycle diversion impractical under IAEA physical accounting safeguards.",
      geeky:
        "IAEA safeguards criteria require Detection Time corresponding to Significant Quantities (SQ = 8 kg Pu or 25 kg U-235). Safeguards techniques incorporate unannounced site inspections, unattended continuous monitoring (UCM), containment seals with unique optical fiber signatures, and destructive/non-destructive assay (NDA) gamma spectroscopy, maintaining 100% material accountancy across declared commercial fleets.",
    },
    evidenceSources: [
      {
        title: "IAEA Safeguards: Serving Nuclear Non-Proliferation",
        organization: "International Atomic Energy Agency (IAEA)",
        year: 2022,
        citation: "IAEA Safeguards Bulletin 2022",
      },
      {
        title: "Management of Separated Plutonium: The Technical Options",
        organization: "OECD Nuclear Energy Agency (NEA)",
        year: 1997,
        citation: "NEA No. 3439",
      },
    ],
  },
  {
    id: "speed-and-cost-to-build",
    claim:
      "Nuclear power plants take 15 to 20 years to build and are always financial disasters.",
    verdict: "Nuanced",
    category: "economics",
    quickReality:
      "Western First-Of-A-Kind projects suffered severe delays, but standard multi-unit serial builds historically and currently average 5 to 7 years with stable LCOE.",
    explanations: {
      beginner:
        "While some recent projects in Europe and America took a long time because builders were testing brand-new designs, countries with experienced building teams (like South Korea and Japan) routinely build reactors in just 5 to 6 years!",
      explorer:
        "Construction time depends heavily on experience and standardization. The global median construction time for all 440+ operating reactors is ~7 years. In the 1980s, France built 56 reactors in 15 years, and South Korea built the Barakah plant in the UAE on a predictable multi-unit construction schedule.",
      curious:
        "The economic challenge of nuclear energy in deregulated Western markets is capital intensity: up to 70–80% of Levelized Cost of Electricity (LCOE) is upfront capital and financing interest (Overnight Capital Cost + Weighted Average Cost of Capital). Where countries maintain standardized designs, regulatory predictability, and serial multi-unit builds, construction durations average 60 to 80 months with highly competitive electricity costs.",
      "deep-dive":
        "Analysis of IAEA Power Reactor Information System (PRIS) construction database indicates: median construction duration for 1970–2020 builds was 84 months (7.0 years). Regional divergence: East Asian builds (APR-1400, Hualong One, VVER-1200) median is 62–74 months; Western Gen III+ FOAK prototypes (Vogtle 3&4, Olkiluoto 3, Flamanville 3) suffered from lost domestic supply chains, incomplete engineering drawings at ground-break, and bespoke regulatory changes.",
      geeky:
        "Lovering, Yip, & Nordhaus (Energy Policy 2016) analyzed historical reactor cost curves across the US, France, Japan, South Korea, West Germany, Canada, and India. While US/German costs escalated due to shifting regulatory backfitting and bespoke licensing, France and South Korea demonstrated stable or declining capital costs under multi-unit fleet standardization, establishing that nuclear cost trends are driven by institutional procurement structure rather than intrinsic physical limits.",
    },
    evidenceSources: [
      {
        title: "Historical Construction Costs of Global Nuclear Power Reactors",
        organization: "Energy Policy (Lovering, Yip, Nordhaus)",
        year: 2016,
        citation: "Energy Policy, Vol. 91, pp. 371-382",
      },
      {
        title: "Projected Costs of Generating Electricity 2020 Edition",
        organization: "IEA & OECD Nuclear Energy Agency (IEA/NEA)",
        year: 2020,
        citation: "IEA/NEA Report No. 7414",
      },
    ],
  },
];
