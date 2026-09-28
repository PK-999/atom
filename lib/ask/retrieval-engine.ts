import type { ExplanationContent } from "@/lib/education/schemas";
import {
  type AskQuery,
  type AskResponse,
  type AskCitation,
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
  explanation: ExplanationContent;
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
    explanation: {
      summary:
        "Used nuclear fuel needs cooling, shielding and long-term management.",
      body: [
        "Pools initially cool spent fuel; suitable fuel can later move to dry storage. Geological disposal and reprocessing address different parts of waste management. Reprocessing still leaves wastes requiring management.",
      ],
      citationIds: ["iaea-waste-2022"],
    },

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
    explanation: {
      summary: "Compare emissions across the full electricity lifecycle.",
      body: [
        "Nuclear reactors do not burn fossil fuel to produce heat, but fuel preparation, construction and other lifecycle activities create emissions. A numerical comparison needs matching boundaries and reviewed source records.",
      ],
      citationIds: ["ipcc-2014", "unece-2021"],
    },

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
    explanation: {
      summary: "Safety has several dimensions of harm.",
      body: [
        "Deaths per unit of electricity put generation in context, but estimates depend on which accidents, pollution effects and modeled outcomes are counted. Displacement and non-fatal harm also matter.",
      ],
      citationIds: ["ourworldindata-safety", "unscear-2020"],
    },

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
    explanation: {
      summary:
        "Radiation comparisons need a dose quantity, exposure period and context.",
      body: [
        "Natural background, medical exposures and releases from facilities are different situations. A banana analogy cannot establish the health risk from another source; compare like quantities and inspect the assumptions.",
      ],
      citationIds: ["unscear-2020"],
    },

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
    explanation: {
      summary: "Land comparisons depend on the area being counted.",
      body: [
        "A station’s direct footprint differs from its wider site, spacing between generators and land used in the supply chain. Shared land uses further complicate comparisons.",
      ],
      citationIds: ["unece-2021"],
    },

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
    explanation: {
      summary:
        "India’s nuclear programme connects reactor development with its fuel resources.",
      body: [
        "The programme associated with Homi Bhabha links heavy-water reactors, fast breeders and prospective thorium use. Ambitions, construction and operating achievements are different states; check dated official records for the current position.",
      ],
      citationIds: ["dae-bhabha-program"],
    },

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

  // Check 1: Prompt injection defense
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return AskResponseSchema.parse({
        queryId: validatedQuery.id,
        state: "insufficient-evidence",
        prompt: sanitizeText(prompt),
        explanation: {
          summary: INSUFFICIENT_EVIDENCE_ANSWER,
          body: [],
          citationIds: [],
        },
        citations: [],
        evidenceIds: [],

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
        explanation: {
          summary: INSUFFICIENT_EVIDENCE_ANSWER,
          body: [],
          citationIds: [],
        },
        citations: [],
        evidenceIds: [],

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
      explanation: {
        summary: INSUFFICIENT_EVIDENCE_ANSWER,
        body: [],
        citationIds: [],
      },
      citations: [],
      evidenceIds: [],

      limitations: [
        "No matching peer-reviewed evidence was found in the published catalog for this specific query.",
      ],
    });
  }

  const citations: AskCitation[] = bestEntry.citationIds
    .map((cid) => COMMON_CITATIONS[cid])
    .filter((c): c is AskCitation => Boolean(c));

  return AskResponseSchema.parse({
    queryId: validatedQuery.id,
    state: "answered",
    prompt: sanitizeText(prompt),
    explanation: bestEntry.explanation,
    citations,
    evidenceIds: bestEntry.evidenceIds,

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
