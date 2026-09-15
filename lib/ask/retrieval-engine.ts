import {
  type AskQuery,
  type AskResponse,
  type AskCitation,
  type AskExplanationLevel,
  AskQuerySchema,
  AskResponseSchema,
} from "./schemas";

export const INSUFFICIENT_EVIDENCE_ANSWER =
  "ATOM does not currently have verified peer-reviewed scientific evidence in its published catalog to answer this query. To preserve evidence integrity, ATOM abstains from ungrounded speculation.";

const COMMON_CITATIONS: Record<string, AskCitation> = {
  "ipcc-2014": {
    id: "ipcc-2014",
    title: "IPCC Working Group III – Mitigation of Climate Change (Annex III)",
    publisher: "Intergovernmental Panel on Climate Change (IPCC)",
    year: 2014,
    url: "https://www.ipcc.ch/report/ar5/wg3/",
    asOf: "2014-04-13",
    summary:
      "Global median life-cycle greenhouse gas emissions by electricity source: Nuclear median 12 gCO2eq/kWh, Wind 11-12 gCO2eq/kWh, Solar PV 41-48 gCO2eq/kWh, Coal 820 gCO2eq/kWh.",
  },
  "unece-2021": {
    id: "unece-2021",
    title: "Life Cycle Assessment of Electricity Generation Options",
    publisher: "United Nations Economic Commission for Europe (UNECE)",
    year: 2021,
    url: "https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options",
    asOf: "2021-10-01",
    summary:
      "Comprehensive cradle-to-grave analysis finding nuclear has the lowest life-cycle land use intensity and among the lowest carbon footprints alongside modern wind power.",
  },
  "unscear-2020": {
    id: "unscear-2020",
    title:
      "UNSCEAR 2020/2021 Report: Sources, effects and risks of ionizing radiation",
    publisher:
      "United Nations Scientific Committee on the Effects of Atomic Radiation",
    year: 2021,
    url: "https://www.unscear.org/unscear/en/publications/2020_2021_1.html",
    asOf: "2021-03-09",
    summary:
      "Authoritative consensus reviewing low-dose radiation health outcomes, medical/occupational exposures, and long-term public health observations post-Chernobyl and Fukushima.",
  },
  "ourworldindata-safety": {
    id: "ourworldindata-safety",
    title: "What are the safest and cleanest sources of energy?",
    publisher: "Our World in Data (Hannah Ritchie)",
    year: 2020,
    url: "https://ourworldindata.org/safest-sources-of-energy",
    asOf: "2020-11-01",
    summary:
      "Mortality rates per unit of electricity generated (deaths per TWh): Brown coal (32.7), Coal (24.6), Oil (18.4), Gas (2.8), Biomass (4.6), Solar (0.02), Wind (0.04), Nuclear (0.03).",
  },
  "iaea-waste-2022": {
    id: "iaea-waste-2022",
    title: "Status and Trends in Spent Fuel and Radioactive Waste Management",
    publisher: "International Atomic Energy Agency (IAEA)",
    year: 2022,
    url: "https://www.iaea.org/publications/14746/status-and-trends-in-spent-fuel-and-radioactive-waste-management",
    asOf: "2022-01-15",
    summary:
      "International overview of deep geological repositories (such as Onkalo in Finland), dry cask storage durability, and high-level waste volume per unit electricity produced.",
  },
  "dae-bhabha-program": {
    id: "dae-bhabha-program",
    title:
      "India's Three-Stage Nuclear Power Programme: Milestones and Future Roadmap",
    publisher: "Department of Atomic Energy (DAE), Government of India",
    year: 2023,
    url: "https://dae.gov.in",
    asOf: "2023-12-01",
    summary:
      "Roadmap detailing Stage 1 PHWR natural uranium fleet, Stage 2 Fast Breeder Reactors (PFBR 500 MWe), and Stage 3 Thorium/AHWR utilization of domestic monazite deposits.",
  },
};

interface CuratedEntry {
  topic: string;
  keywords: string[];
  evidenceIds: string[];
  citationIds: string[];
  simple: string;
  standard: string;
  technical: string;
  limitations?: string[];
}

const KNOWLEDGE_CATALOG: CuratedEntry[] = [
  {
    topic: "waste",
    keywords: [
      "waste",
      "spent",
      "storage",
      "stored",
      "repository",
      "cask",
      "casks",
      "onkalo",
      "radioactive",
      "geological",
      "recycled",
      "recycling",
      "recycle",
    ],
    evidenceIds: ["ev-iaea-waste-2022"],
    citationIds: ["iaea-waste-2022"],
    simple:
      "Nuclear fuel produces a very small amount of solid waste. All the spent fuel ever made by one person's lifetime of nuclear electricity fits in a soda can. It is stored safely in thick steel and concrete containers, and permanent deep underground vaults are being built.",
    standard:
      "Used commercial nuclear fuel is solid ceramic pellets inside zirconium tubes. Because nuclear fuel is over 1 million times denser in energy than coal, the total volume of high-level waste is compact. Over 96% of spent fuel consists of unreacted uranium and plutonium that can be recycled. Commercial waste is cooled in spent fuel pools, transferred to dry concrete/steel casks, and prepared for deep geological repositories (such as Finland's Onkalo facility).",
    technical:
      "High-level waste (HLW) accounts for >95% of radioactivity but <3% of total radioactive waste volume. Primary radiotoxicity decays by a factor of 1,000 within the first 40 years as short-lived fission products (Cs-137, Sr-90) decay with ~30-year half-lives. Transuranic actinides (Pu, Am, Cm) dominate radiotoxicity between 1,000 and 100,000 years. Multi-barrier deep geological disposal uses copper/iron canisters, bentonite clay buffer, and crystalline bedrock at depths of 400–500 meters.",
    limitations: [
      "While technical deep geological disposal is demonstrated, political and regulatory approvals remain contentious in several jurisdictions.",
    ],
  },
  {
    topic: "carbon",
    keywords: [
      "carbon",
      "co2",
      "greenhouse",
      "warming",
      "climate",
      "ipcc",
      "gases",
      "clean",
    ],
    evidenceIds: ["ev-ipcc-ghg-2014", "ev-unece-lca-2021"],
    citationIds: ["ipcc-2014", "unece-2021"],
    simple:
      "Nuclear power does not burn anything to create heat. In its whole life from building to dismantling, it releases about 12 grams of CO2 for each kilowatt-hour, which is just as clean as wind turbines and much cleaner than coal or gas.",
    standard:
      "Across comprehensive life-cycle assessments (accounting for mining, construction, operation, and decommissioning), nuclear power emits a median of 12 gCO2eq/kWh according to the IPCC. This is comparable to wind (11–12 gCO2eq/kWh) and lower than solar PV (41–48 gCO2eq/kWh), while fossil fuels emit 490 gCO2eq/kWh (gas) to 820 gCO2eq/kWh (coal).",
    technical:
      "Life-cycle carbon accounting evaluates cradle-to-grave emissions using Harmonized LCA methods (IPCC AR5 Annex III, UNECE 2021). Operational emissions are 0 gCO2eq/kWh. Upstream fuel cycle emissions (centrifuge enrichment vs legacy gaseous diffusion) and front-end concrete/steel manufacturing account for >90% of total life-cycle carbon footprint. Global estimates range between 5.1 and 18.0 gCO2eq/kWh (5th to 95th percentiles).",
    limitations: [
      "Life-cycle emissions vary with the carbon intensity of the local grid powering uranium enrichment and mining equipment.",
    ],
  },
  {
    topic: "safety",
    keywords: [
      "safe",
      "safest",
      "safety",
      "death",
      "deaths",
      "mortality",
      "kill",
      "danger",
      "accidents",
      "fatalities",
      "casualties",
      "owid",
    ],
    evidenceIds: ["ev-owid-mortality-2020", "ev-unscear-2021"],
    citationIds: ["ourworldindata-safety", "unscear-2020"],
    simple:
      "Nuclear power is one of the safest ways to make electricity. Fossil fuels cause millions of early deaths every year from dirty air, while nuclear, wind, and solar cause very few casualties per unit of electricity.",
    standard:
      "Historical epidemiological and accident data compiled by Our World in Data and Markandya & Wilkinson find nuclear among the safest electricity generation technologies, with 0.03 deaths per TWh generated (including Chernobyl and Fukushima). This is comparable to solar (0.02 deaths/TWh) and wind (0.04 deaths/TWh), and over 800 times lower than coal (24.6 deaths/TWh from particulate air pollution).",
    technical:
      "Comparative mortality statistics aggregate occupational accidents, acute radiation deaths, modeled statistical latent cancers (LNT assumption), and chronic particulate matter (PM2.5/NOx/SO2) pollution. Major nuclear accidents account for <0.01 deaths/TWh over commercial history. In contrast, ambient fossil-fuel combustion particulate pollution causes an estimated 4–8 million excess deaths annually worldwide.",
    limitations: [
      "Mortality models for low-dose radiation rely on the Linear No-Threshold (LNT) hypothesis, which introduces methodological uncertainty for low-exposure populations.",
      "Non-fatal outcomes, psychological trauma, and long-term land displacement after evacuations are not captured in pure mortality metrics.",
    ],
  },
  {
    topic: "radiation",
    keywords: [
      "radiation",
      "dose",
      "banana",
      "xray",
      "sievert",
      "sieverts",
      "millisievert",
      "millisieverts",
      "background",
      "ct",
      "radon",
      "fence",
    ],
    evidenceIds: ["ev-unscear-2020", "ev-dose-reference"],
    citationIds: ["unscear-2020"],
    simple:
      "Radiation is a natural part of our world. Eating a banana gives you a tiny dose (0.1 microsieverts) from natural potassium. Living near a safely operating nuclear plant gives less radiation in a year than eating a few bananas.",
    standard:
      "Average natural background radiation delivers approximately 2.4 millisieverts (mSv) per year globally from radon, cosmic rays, and food. A dental X-ray is ~0.005 mSv, a chest CT scan is ~7 mSv, and the regulatory public dose limit from nuclear facilities is 1.0 mSv/year (with actual average fence-line exposures <0.01 mSv/year).",
    technical:
      "Effective ionizing radiation dose is measured in Sieverts (J/kg weighted for biological tissue and radiation type: alpha, beta, gamma, neutron). Acute radiation syndrome occurs above ~1,000 mSv (1 Sv). Occupational limits are internationally standardized at 20 mSv/year averaged over 5 years (ICRP Publication 103). Environmental releases from licensed reactors are governed by ALARA principles and monitored via continuous real-time perimeter dosimetry.",
    limitations: [
      "Health risk estimates at doses below 100 mSv are not directly observable epidemiologically due to high natural background cancer rates.",
    ],
  },
  {
    topic: "land",
    keywords: [
      "land",
      "footprint",
      "hectares",
      "acres",
      "area",
      "density",
      "space",
    ],
    evidenceIds: ["ev-unece-land-2021"],
    citationIds: ["unece-2021"],
    simple:
      "Because nuclear reactors produce huge amounts of energy from tiny fuel pellets, they take up the smallest amount of ground of any power source—about 100 times less space than solar farms and 1,000 times less than wind farms.",
    standard:
      "According to the United Nations Economic Commission for Europe (UNECE), nuclear power has the lowest life-cycle land use intensity of any electricity technology (~0.1–0.3 m² per MWh over 60 years, including mining and exclusion zones). Solar PV requires ~5–15 m²/MWh and wind power requires ~10–50 m²/MWh (direct footprint plus spacing).",
    technical:
      "Power density is measured in electrical watts per square meter (We/m²). Nuclear stations achieve 500–1,000 We/m² of site area. Surface direct footprint analysis (UNECE 2021) reveals that high energy density minimizes habitat fragmentation, land transformation, and raw mineral extraction footprint compared to diffuse harvest technologies.",
    limitations: [
      "Exclusion zones surrounding nuclear facilities are often restricted for residential development, though they frequently function as protected wildlife habitats.",
    ],
  },
  {
    topic: "india",
    keywords: [
      "india",
      "bhabha",
      "thorium",
      "phwr",
      "pfbr",
      "monazite",
      "kalpakkam",
    ],
    evidenceIds: ["ev-dae-india-2023"],
    citationIds: ["dae-bhabha-program"],
    simple:
      "India has little domestic uranium but huge beach sand deposits of thorium. Dr. Homi Bhabha designed a smart three-stage plan: first build Heavy Water reactors using uranium, then Fast Breeder reactors to turn thorium into nuclear fuel, and finally Thorium reactors for energy independence.",
    standard:
      "India's nuclear program follows Dr. Homi Bhabha's closed three-stage fuel cycle to utilize its domestic monazite thorium reserves (>300,000 tonnes). Stage 1 uses standardized 220 and 700 MWe PHWRs fueled with natural uranium. Stage 2 uses Fast Breeder Reactors (like the 500 MWe PFBR at Kalpakkam) to breed fissile U-233 from thorium blankets. Stage 3 plans Advanced Heavy Water Reactors (AHWR) running sustainably on domestic thorium.",
    technical:
      "The Bhabha strategy addresses the 1:100 ratio of domestic uranium to thorium reserves. Stage 1 natural uranium PHWRs achieve deep burnup without isotope enrichment, yielding Pu-239 spent fuel. Stage 2 sodium-cooled fast breeders multiply fissile inventory (breeding ratio >1) while irradiating radial Th-232 blankets to generate U-233 via neutron capture and double beta-decay. Stage 3 thermal breeders (AHWR / MSBR) operate on the self-sustaining U-233/Th-232 fuel cycle.",
    limitations: [
      "Commercial deployment of Stage 3 thorium reactors depends on establishing a mature fleet of operating Stage 2 fast breeder reactors to accumulate sufficient fissile seed inventory.",
    ],
  },
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+(in\s+)?(unrestricted|dan|jailbreak)/i,
  /reveal\s+(your\s+)?(system\s+prompt|secret)/i,
  /bypass\s+(safety|rules|restrictions)/i,
  /roleplay\s+as\s+/i,
];

const UNSUPPORTED_TOPICS = [
  /how\s+to\s+(make|build|enrich|assemble)\s+(a\s+)?(bomb|weapon|nuke)/i,
  /tell\s+me\s+how\s+to\s+build\s+an?\s+atomic\s+weapon/i,
  /stock\s+(tips|advice|pick|buy|sell)/i,
  /who\s+will\s+win\s+the\s+(election|war|presidency)/i,
  /conspiracy|illuminati|reptilian|flat\s+earth/i,
  /personal\s+opinion|what\s+do\s+you\s+think\s+personally/i,
  /which\s+country\s+has\s+the\s+best\s+politicians/i,
  /recipe|cooking/i,
];

export function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

export function askAtom(query: AskQuery): AskResponse {
  const validatedQuery = AskQuerySchema.parse(query);
  const prompt = validatedQuery.prompt.trim();
  const level: AskExplanationLevel = validatedQuery.level || "standard";

  // Check 1: Prompt injection defense
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return AskResponseSchema.parse({
        queryId: validatedQuery.id,
        state: "insufficient-evidence",
        prompt: sanitizeText(prompt),
        answerText: INSUFFICIENT_EVIDENCE_ANSWER,
        citations: [],
        evidenceIds: [],
        explanationLevel: level,
        limitations: [
          "Query contains patterns incompatible with verified evidence retrieval.",
        ],
      });
    }
  }

  // Check 2: Unsupported / unanswerable / speculative queries
  for (const pattern of UNSUPPORTED_TOPICS) {
    if (pattern.test(prompt)) {
      return AskResponseSchema.parse({
        queryId: validatedQuery.id,
        state: "insufficient-evidence",
        prompt: sanitizeText(prompt),
        answerText: INSUFFICIENT_EVIDENCE_ANSWER,
        citations: [],
        evidenceIds: [],
        explanationLevel: level,
        limitations: [
          "Query falls outside ATOM's published evidence catalog of peer-reviewed energy science.",
        ],
      });
    }
  }

  // Check 3: Retrieval matching
  const words = prompt.toLowerCase().split(/[^a-z0-9]+/);
  let bestEntry: CuratedEntry | null = null;
  let maxScore = 0;

  for (const entry of KNOWLEDGE_CATALOG) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (words.includes(kw)) {
        score += 2;
      } else if (prompt.toLowerCase().includes(kw)) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestEntry = entry;
    }
  }

  // Require minimum score
  if (!bestEntry || maxScore < 2) {
    return AskResponseSchema.parse({
      queryId: validatedQuery.id,
      state: "insufficient-evidence",
      prompt: sanitizeText(prompt),
      answerText: INSUFFICIENT_EVIDENCE_ANSWER,
      citations: [],
      evidenceIds: [],
      explanationLevel: level,
      limitations: [
        "No matching peer-reviewed evidence was found in the published catalog for this specific query.",
      ],
    });
  }

  const answerText =
    level === "explorer"
      ? bestEntry.simple
      : level === "deep-dive"
        ? bestEntry.technical
        : bestEntry.standard;

  const citations: AskCitation[] = bestEntry.citationIds
    .map((cid) => COMMON_CITATIONS[cid])
    .filter((c): c is AskCitation => Boolean(c));

  return AskResponseSchema.parse({
    queryId: validatedQuery.id,
    state: "answered",
    prompt: sanitizeText(prompt),
    answerText: sanitizeText(answerText),
    citations,
    evidenceIds: bestEntry.evidenceIds,
    explanationLevel: level,
    limitations: bestEntry.limitations,
  });
}

export function listSupportedTopics(): string[] {
  return [
    "How does nuclear carbon intensity compare to solar, wind, and fossil fuels?",
    "What are the historical safety and mortality statistics per TWh of electricity?",
    "What is natural background radiation and how does a banana compare to a CT scan?",
    "How is commercial nuclear waste and spent fuel stored safely?",
    "What is the life-cycle land use footprint of nuclear energy?",
    "What is India's three-stage nuclear fuel programme and thorium strategy?",
  ];
}
