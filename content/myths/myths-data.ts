import type { ExplanationContent } from "@/lib/education/schemas";

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
  explanation: ExplanationContent;
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
      "A power reactor and a nuclear weapon have different designs and purposes.",
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
    explanation: {
      summary:
        "A power reactor and a nuclear weapon have different designs and purposes.",
      body: [
        "A reactor accident can still involve destructive steam or chemical explosions. Distinguishing those mechanisms from a weapon detonation does not make reactor accidents harmless.",
      ],
      details: [
        {
          id: "context",
          title: "Accident mechanisms",
          body: "Heat, pressure and chemical reactions can damage fuel and structures. Safety analysis examines these processes and possible radioactive releases.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "nuclear-waste-unsolved",
    claim:
      "Nuclear waste has no solution and will remain lethal for millions of years.",
    verdict: "Context Dependent",
    category: "waste",
    quickReality:
      "Used fuel has management options, alongside long-term responsibilities.",
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
    explanation: {
      summary:
        "Used fuel has management options, alongside long-term responsibilities.",
      body: [
        "Cooling pools, dry storage and geological disposal serve different purposes. Reprocessing can recover usable material but also leaves waste that needs management.",
      ],
      details: [
        {
          id: "context",
          title: "Why the time horizon matters",
          body: "Spent fuel contains a mixture of isotopes. Its heat and radioactivity change over time; there is no single date at which every waste stream becomes harmless.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "living-near-plant-radiation",
    claim:
      "Living near a nuclear power plant exposes you to dangerous radiation doses.",
    verdict: "False",
    category: "radiation",
    quickReality:
      "Exposure depends on the dose and the pathway, not simply distance from a plant.",
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
    explanation: {
      summary:
        "Exposure depends on the dose and the pathway, not simply distance from a plant.",
      body: [
        "Environmental monitoring and assessments are needed to evaluate a particular site. A banana analogy cannot establish the health risk of an exposure.",
      ],
      details: [
        {
          id: "context",
          title: "Comparing doses",
          body: "Compare the same dose quantity and exposure period. Natural background, medical exposures, routine releases and accidents require different context.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "lifecycle-carbon-emissions",
    claim:
      "Nuclear power produces huge amounts of hidden carbon emissions during mining and construction.",
    verdict: "False",
    category: "environment",
    quickReality:
      "Nuclear electricity has lifecycle emissions, even though its reactors do not burn fossil fuel.",
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
    explanation: {
      summary:
        "Nuclear electricity has lifecycle emissions, even though its reactors do not burn fossil fuel.",
      body: [
        "Mining, fuel preparation, construction and decommissioning must be included when comparing climate impacts.",
      ],
      details: [
        {
          id: "context",
          title: "Check the comparison boundary",
          body: "A full lifecycle assessment differs from an operational-emissions estimate. Check geography, technology, date and the source’s method before drawing a ranking.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "historical-casualties-safety",
    claim: "Nuclear energy is the most dangerous way to generate electricity.",
    verdict: "False",
    category: "safety",
    quickReality:
      "Safety comparisons need both scale and a clear definition of harm.",
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
    explanation: {
      summary:
        "Safety comparisons need both scale and a clear definition of harm.",
      body: [
        "Deaths per unit of electricity are one measure. Air pollution, occupational harm, accidents and modeled long-term effects can be counted differently.",
      ],
      details: [
        {
          id: "context",
          title: "Beyond a single number",
          body: "Displacement, disrupted care and psychological harm deserve attention alongside fatalities. A low historical rate does not imply zero future risk.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "renewables-make-nuclear-obsolete",
    claim:
      "Solar and wind are so cheap that nuclear power is completely obsolete.",
    verdict: "Nuanced",
    category: "economics",
    quickReality:
      "Wind, solar and nuclear serve different roles within an electricity system.",
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
    explanation: {
      summary:
        "Wind, solar and nuclear serve different roles within an electricity system.",
      body: [
        "A project’s generation cost does not by itself show the cost of meeting demand throughout the year. Consider transmission, flexibility, storage and available firm supply.",
      ],
      details: [
        {
          id: "context",
          title: "Which cost is being compared?",
          body: "Levelized generation cost, system cost and a consumer tariff are distinct. A useful comparison states the place, period, financing and required service.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "weapons-proliferation-link",
    claim:
      "Every civilian nuclear power plant can easily be converted to produce nuclear weapons.",
    verdict: "Context Dependent",
    category: "proliferation",
    quickReality:
      "Civilian nuclear technology requires safeguards and oversight.",
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
    explanation: {
      summary: "Civilian nuclear technology requires safeguards and oversight.",
      body: [
        "A power plant is not a ready-made weapon. Some materials and fuel-cycle technologies nevertheless create proliferation concerns that deserve scrutiny.",
      ],
      details: [
        {
          id: "context",
          title: "What safeguards address",
          body: "Material accounting, inspections and institutional controls aim to detect diversion. Technical and political risks differ across programmes and facilities.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "speed-and-cost-to-build",
    claim:
      "Nuclear power plants take 15 to 20 years to build and are always financial disasters.",
    verdict: "Nuanced",
    category: "economics",
    quickReality: "Construction outcomes vary widely between projects.",
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
    explanation: {
      summary: "Construction outcomes vary widely between projects.",
      body: [
        "Design maturity, repeat construction, financing, regulation and supply chains affect both cost and schedule. Neither a universal success story nor a universal failure story describes every project.",
      ],
      details: [
        {
          id: "context",
          title: "Compare matching timelines",
          body: "Separate planning and licensing from physical construction. State currency year, financing assumptions and what counts as project completion.",
        },
      ],
      citationIds: [],
    },
  },
];
