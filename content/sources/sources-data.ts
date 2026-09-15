export interface ScientificSource {
  id: string;
  title: string;
  organization: string;
  shortOrg: string;
  year: number;
  category:
    | "climate-emissions"
    | "radiation-health"
    | "reactor-safety"
    | "economics"
    | "global-fleet";
  citation: string;
  doiOrUrl: string;
  scope: string;
  usedInAtomFor: string[];
  peerReviewType:
    | "United Nations Scientific Consensus"
    | "Intergovernmental Agency Report"
    | "Peer-Reviewed Journal"
    | "Government Regulatory Inquiry";
}

export const SCIENTIFIC_SOURCES: ScientificSource[] = [
  {
    id: "unscear-2008-chernobyl",
    title:
      "Sources and Effects of Ionizing Radiation (Volume II, Annex D: Health effects due to radiation from the Chernobyl accident)",
    organization:
      "United Nations Scientific Committee on the Effects of Atomic Radiation",
    shortOrg: "UNSCEAR",
    year: 2008,
    category: "radiation-health",
    citation: "UNSCEAR 2008 Report to the UN General Assembly, Annex D",
    doiOrUrl: "https://www.unscear.org/unscear/en/publications/2008_2.html",
    scope:
      "Comprehensive epidemiological audit of 20+ years of clinical and biological fallout data from Chernobyl across Belarus, Ukraine, and Russia.",
    usedInAtomFor: [
      "Chernobyl incident health impacts (28 ARS fatalities + ~6,000 operable youth thyroid cancers)",
      "Absence of detectable leukemia or solid cancer increases in general exposed populations",
      "Myth debunking regarding generational mutations and fallout mortality",
    ],
    peerReviewType: "United Nations Scientific Consensus",
  },
  {
    id: "unscear-2020-fukushima",
    title:
      "Levels and Effects of Radiation Exposure Due to the 2011 Accident at the Fukushima Daiichi Nuclear Power Station",
    organization:
      "United Nations Scientific Committee on the Effects of Atomic Radiation",
    shortOrg: "UNSCEAR",
    year: 2021,
    category: "radiation-health",
    citation: "UNSCEAR 2020/2021 Report, Scientific Annex B",
    doiOrUrl:
      "https://www.unscear.org/unscear/en/publications/2020_2021_2.html",
    scope:
      "Decade-long global scientific evaluation of environmental releases, worker doses, public health registries, and thyroid screening in Fukushima.",
    usedInAtomFor: [
      "Fukushima health statistics (zero acute radiation deaths)",
      "Evacuation-induced mortality documentation (~2,200 non-radiation relocation deaths)",
      "Radiation Dose Explorer context (lifetime public dose <10 mSv)",
    ],
    peerReviewType: "United Nations Scientific Consensus",
  },
  {
    id: "ipcc-ar6-wg3-annex3",
    title:
      "IPCC Sixth Assessment Report: Mitigation of Climate Change (Annex III: Technology-specific cost and performance parameters)",
    organization: "Intergovernmental Panel on Climate Change",
    shortOrg: "IPCC",
    year: 2022,
    category: "climate-emissions",
    citation: "IPCC AR6 WGIII, Cambridge University Press, Annex III",
    doiOrUrl: "https://www.ipcc.ch/report/ar6/wg3/",
    scope:
      "Full lifecycle greenhouse gas emission intensity (gCO₂eq/kWh) distributions across all major generation technologies under harmonized boundary standards.",
    usedInAtomFor: [
      "Comparison Lab: Lifecycle emissions (nuclear median ~12 gCO₂eq/kWh vs solar ~48, wind ~11, gas ~490, coal ~820)",
      "Climate decarbonization learning modules",
    ],
    peerReviewType: "United Nations Scientific Consensus",
  },
  {
    id: "unece-lca-2021",
    title: "Life Cycle Assessment of Electricity Generation Options",
    organization: "United Nations Economic Commission for Europe",
    shortOrg: "UNECE",
    year: 2021,
    category: "climate-emissions",
    citation: "UNECE Environmental Footprint Report 2021",
    doiOrUrl:
      "https://unece.org/sed/documents/2021/10/reports/life-cycle-assessment-electricity-generation-options",
    scope:
      "Holistic multi-indicator environmental footprint (mineral extraction, freshwater ecotoxicity, human toxicity, land transformation) comparing nuclear, wind, PV, hydro, and fossil fuels.",
    usedInAtomFor: [
      "Comparison Lab: Land occupation footprint and material intensity per TWh",
      "Environmental impact tradeoffs",
    ],
    peerReviewType: "Intergovernmental Agency Report",
  },
  {
    id: "iaea-pris-database",
    title: "Power Reactor Information System (PRIS)",
    organization: "International Atomic Energy Agency",
    shortOrg: "IAEA",
    year: 2026,
    category: "global-fleet",
    citation: "IAEA PRIS Global Database, updated continually",
    doiOrUrl: "https://pris.iaea.org/PRIS/",
    scope:
      "Authoritative global repository of operational, design, capacity (gross/net MWe), and historical lifecycle status for all commercial power reactors worldwide.",
    usedInAtomFor: [
      "Global Reactor Fleet Explorer (28 canonical facilities, 100+ units)",
      "Reactor age, commercial online dates, and net electric capacities",
      "National nuclear fleet statistics",
    ],
    peerReviewType: "Intergovernmental Agency Report",
  },
  {
    id: "iaea-insag-7",
    title:
      "The Chernobyl Accident: Updating of INSAG-1 (Safety Series No. 75-INSAG-7)",
    organization:
      "International Atomic Energy Agency — International Nuclear Safety Advisory Group",
    shortOrg: "IAEA",
    year: 1992,
    category: "reactor-safety",
    citation: "IAEA INSAG-7 Report",
    doiOrUrl: "https://www-pub.iaea.org/MTCD/Publications/PDF/Pub913e_web.pdf",
    scope:
      "Definitive reactor physics forensics on the positive void coefficient, RBMK control rod displacer positive reactivity spike, and operator protocol violations.",
    usedInAtomFor: [
      "Chernobyl technical forensics and chronology in Incidents module",
      "Engineering lessons learned and RBMK retrofit documentation",
    ],
    peerReviewType: "Intergovernmental Agency Report",
  },
  {
    id: "iea-nea-projected-costs-2020",
    title: "Projected Costs of Generating Electricity (2020 Edition)",
    organization: "International Energy Agency & OECD Nuclear Energy Agency",
    shortOrg: "IEA / OECD-NEA",
    year: 2020,
    category: "economics",
    citation: "IEA/NEA Joint Report, OECD Publishing, Paris",
    doiOrUrl:
      "https://www.oecd-nea.org/jcms/pl_51110/projected-costs-of-generating-electricity-2020",
    scope:
      "Levelized Cost of Electricity (LCOE) and Value-Adjusted LCOE (VALCOE) across 243 plants in 24 countries at 3%, 7%, and 10% discount rates.",
    usedInAtomFor: [
      "Comparison Lab: Capital cost vs long-term operational extension economics",
      "Discount rate sensitivity analysis in electricity system modeling",
    ],
    peerReviewType: "Intergovernmental Agency Report",
  },
  {
    id: "kemeny-commission-1979",
    title:
      "Report of the President's Commission on the Accident at Three Mile Island",
    organization: "President's Commission (Kemeny Commission)",
    shortOrg: "U.S. Government / NRC",
    year: 1979,
    category: "reactor-safety",
    citation: "U.S. Government Printing Office, ISBN 0-935758-00-3",
    doiOrUrl:
      "https://www.threemileisland.org/virtual_museum/kemeny_commission.html",
    scope:
      "Independent investigation of the TMI-2 partial meltdown, human-machine interface breakdowns, operator actions, and public health impact.",
    usedInAtomFor: [
      "Three Mile Island forensics and timeline in Incidents module",
      "Establishment of INPO and control room human-factors reforms",
      "Verification of zero casualties and containment efficacy",
    ],
    peerReviewType: "Government Regulatory Inquiry",
  },
  {
    id: "who-chernobyl-health-2006",
    title:
      "Health Effects of the Chernobyl Accident and Special Health Care Programmes",
    organization: "World Health Organization",
    shortOrg: "WHO",
    year: 2006,
    category: "radiation-health",
    citation: "WHO Report of the UN Chernobyl Forum Health Expert Group",
    doiOrUrl: "https://www.who.int/publications/i/item/9241594178",
    scope:
      "Consensus assessment by 100+ medical epidemiologists on cancer, non-cancer diseases, and mental health trauma following Chernobyl.",
    usedInAtomFor: [
      "Psychological and mental health displacement findings",
      "Thyroid cancer survival rate documentation (~99% treatment success)",
    ],
    peerReviewType: "United Nations Scientific Consensus",
  },
  {
    id: "nrel-lca-harmonization",
    title:
      "Life Cycle Assessment Harmonization: Results for Wind, Solar PV, and Nuclear Power",
    organization: "National Renewable Energy Laboratory",
    shortOrg: "NREL",
    year: 2013,
    category: "climate-emissions",
    citation: "NREL Technical Report NREL/TP-6A20-57187",
    doiOrUrl: "https://www.nrel.gov/analysis/life-cycle-assessment.html",
    scope:
      "Methodological harmonization of hundreds of independent peer-reviewed lifecycle GHG analyses to eliminate contradictory system boundary assumptions.",
    usedInAtomFor: [
      "Harmonized emissions ranges across renewables and nuclear",
      "System boundary explanations in Evidence Policy",
    ],
    peerReviewType: "Government Regulatory Inquiry",
  },
  {
    id: "ncrp-report-160",
    title:
      "Ionizing Radiation Exposure of the Population of the United States (NCRP Report No. 160)",
    organization: "National Council on Radiation Protection and Measurements",
    shortOrg: "NCRP",
    year: 2009,
    category: "radiation-health",
    citation: "NCRP Report No. 160, Bethesda, MD",
    doiOrUrl: "https://ncrponline.org/publications/reports/ncrp-report-160/",
    scope:
      "Comprehensive inventory of medical, natural background, consumer, and occupational radiation sources contributing to annual per capita dose.",
    usedInAtomFor: [
      "Radiation Dose Explorer benchmarks (CT scans, X-rays, natural background)",
      "Banana equivalent dose (K-40 ingestion context)",
    ],
    peerReviewType: "Peer-Reviewed Journal",
  },
  {
    id: "deryabina-chernobyl-wildlife-2015",
    title:
      "Long-term census data reveal abundant wildlife populations at Chernobyl",
    organization: "Current Biology (Cell Press)",
    shortOrg: "Current Biology",
    year: 2015,
    category: "radiation-health",
    citation: "Deryabina et al., Current Biology 25(19): R824-R826",
    doiOrUrl: "https://doi.org/10.1016/j.cub.2015.08.017",
    scope:
      "Empirical helicopter and track census data documenting thriving large mammal populations (elk, roe deer, red deer, wild boar, and gray wolves) inside the Chernobyl Exclusion Zone.",
    usedInAtomFor: [
      "Incidents FAQ: Ecological status of Chernobyl Exclusion Zone",
      "Radiation vs. anthropogenic habitat fragmentation trade-off analysis",
    ],
    peerReviewType: "Peer-Reviewed Journal",
  },
];
