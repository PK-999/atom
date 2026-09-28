import type { ExplanationContent } from "@/lib/education/schemas";

export type InesLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IncidentTimelineStep {
  time: string;
  title: string;
  description: string;
}

export interface IncidentSource {
  title: string;
  organization: string;
  year: number;
  citation: string;
  url?: string;
}

export interface IncidentData {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  year: number;
  inesLevel: InesLevel;
  inesLabel: string;
  reactorType: string;
  reactorModel: string;
  summary: string;
  rootCause: string;
  radiologicalRelease: {
    totalActivityPBq: number | string;
    iodine131PBq?: number | string;
    cesium137PBq?: number | string;
    description: string;
  };
  healthImpacts: {
    immediateFatalities: number;
    radiationFatalitiesConfirmed: number;
    whoUnscearSummary: string;
    evacuationImpact: string;
  };
  keyEngineeringLessons: string[];
  timeline: IncidentTimelineStep[];
  explanation: ExplanationContent;
  sources: IncidentSource[];
}

export interface IncidentFaq {
  id: string;
  question: string;
  answer: ExplanationContent;
  category: "physics" | "health" | "engineering" | "environment";
  source: IncidentSource;
}

export const INCIDENTS_DATA: IncidentData[] = [
  {
    id: "chernobyl",
    name: "Chernobyl Disaster",
    location: "Pripyat, Ukrainian SSR",
    country: "Soviet Union (now Ukraine)",
    countryCode: "UA",
    year: 1986,
    inesLevel: 7,
    inesLabel: "Major Accident",
    reactorType: "RBMK-1000",
    reactorModel: "Graphite-Moderated, Water-Cooled Boiling Reactor",
    summary:
      "A flawed reactor design coupled with serious operator procedure violations during an unauthorized turbine rundown test triggered an uncontrollable prompt power surge, destroying Unit 4.",
    rootCause:
      "A high positive void coefficient of reactivity at low power and graphite displacers on control rod tips that injected positive reactivity upon emergency SCRAM (AZ-5), combined with operators disabling automated emergency safety systems.",
    radiologicalRelease: {
      totalActivityPBq: "~5,200 PBq (noble gases + volatile isotopes)",
      iodine131PBq: "~1,760 PBq",
      cesium137PBq: "~85 PBq",
      description:
        "The open-air burning graphite core lofted radioactive smoke high into the troposphere over 10 days, depositing fallout across Belarus, Ukraine, Russia, and northern Europe.",
    },
    healthImpacts: {
      immediateFatalities: 31,
      radiationFatalitiesConfirmed: 60,
      whoUnscearSummary:
        "UNSCEAR 2008 & 2018 confirmed 28 acute radiation sickness (ARS) deaths among first-responder firefighters and plant operators within weeks, plus ~6,000 operable thyroid cancers in youth exposed via contaminated milk (~15 fatal by 2005). No statistically discernible increases in general population leukemia or solid cancers were detected.",
      evacuationImpact:
        "Over 350,000 people were permanently relocated. Major societal health tolls included long-term depression, clinical anxiety, perceived helplessness, and medical over-interventions.",
    },
    keyEngineeringLessons: [
      "All RBMK reactors retrofitted with longer control rod displacers to prevent positive reactivity spikes during SCRAM.",
      "Fuel enrichment increased from 2.0% to 2.4% with fixed absorber rods installed, permanently guaranteeing a negative void coefficient.",
      "Automated SCRAM response time slashed from 18 seconds down to 2.5 seconds.",
      "Strict international nuclear safety culture and operational independence mandated worldwide via the IAEA.",
    ],
    timeline: [
      {
        time: "April 25, 01:06",
        title: "Test Preparation Begins",
        description:
          "Power reduction commenced at Unit 4 to test if a decelerating turbine generator could power emergency cooling pumps during an electrical blackout.",
      },
      {
        time: "April 25, 14:00",
        title: "ECCS Disconnected",
        description:
          "The Emergency Core Cooling System was deliberately isolated so it would not interfere with the electrical rundown test.",
      },
      {
        time: "April 26, 00:28",
        title: "Core Power Collapse",
        description:
          "Operator error dropped thermal power down to ~30 MWt (severe Xenon poisoning). To restore power, almost all control rods were manually extracted, violating the minimum allowable reserve.",
      },
      {
        time: "April 26, 01:23:04",
        title: "Test Initiated & Turbines Tripped",
        description:
          "Turbine steam valves closed. Coolant flow decreased, water began boiling into steam, and the positive void coefficient introduced rapid positive reactivity.",
      },
      {
        time: "April 26, 01:23:40",
        title: "Emergency SCRAM (AZ-5) Pressed",
        description:
          "Operators pressed AZ-5 to insert all rods. Graphite displacers entered the bottom of the core first, causing a catastrophic localized reactivity surge rather than shutdown.",
      },
      {
        time: "April 26, 01:23:45",
        title: "Dual Explosions",
        description:
          "Core power skyrocketed to over 30,000 MWt (10x rated power). Fuel shattered into coolant, creating a massive steam explosion that lifted the 1,000-ton reactor lid, followed by hydrogen detonation.",
      },
    ],
    sources: [
      {
        title: "The Chernobyl Accident: Updating of INSAG-1 (INSAG-7)",
        organization: "International Atomic Energy Agency (IAEA)",
        year: 1992,
        citation: "Safety Series No. 75-INSAG-7",
      },
      {
        title:
          "Sources and Effects of Ionizing Radiation (Volume II, Annex D: Chernobyl)",
        organization:
          "United Nations Scientific Committee on the Effects of Atomic Radiation (UNSCEAR)",
        year: 2008,
        citation: "UNSCEAR 2008 Report to the General Assembly",
      },
    ],
    explanation: {
      summary:
        "Design weaknesses and operating conditions led to a destructive power excursion.",
      body: [
        "The RBMK combined graphite moderation with water cooling. Steam formation and the control-rod design contributed to the accident; the consequences cannot be reduced to operator error alone.",
      ],
      details: [
        {
          id: "mechanism",
          title: "Reactivity and coolant",
          body: "A positive void coefficient means that steam formation can add reactivity under the relevant conditions. It is a property of the reactor and its state, not a universal feature of nuclear power.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "fukushima",
    name: "Fukushima Daiichi Accident",
    location: "Ōkuma and Futaba, Fukushima Prefecture",
    country: "Japan",
    countryCode: "JP",
    year: 2011,
    inesLevel: 7,
    inesLabel: "Major Accident",
    reactorType: "BWR-3 / BWR-4",
    reactorModel: "Boiling Water Reactor with Mark I Containment",
    summary:
      "A massive earthquake followed by an unprecedented 14-meter tsunami knocked out all AC and DC electrical power (Station Blackout), cutting off emergency core cooling and causing core meltdowns in three units.",
    rootCause:
      "Tsunami inundation exceeding the plant's 5.7-meter design seawall, causing total Station Blackout (SBO), flooding electrical switchgear and emergency diesel generators, resulting in loss of ultimate heat sink for decay heat removal.",
    radiologicalRelease: {
      totalActivityPBq: "~100–500 PBq (volatile fraction)",
      iodine131PBq: "~100–400 PBq",
      cesium137PBq: "~10–20 PBq",
      description:
        "Radioactive releases were approximately 10–15% of Chernobyl's total inventory. Crucially, prevailing offshore winds blew roughly 80% of airborne fallout directly eastward over the open Pacific Ocean.",
    },
    healthImpacts: {
      immediateFatalities: 0,
      radiationFatalitiesConfirmed: 1,
      whoUnscearSummary:
        "UNSCEAR (2013, 2020/2021) concluded that zero acute radiation sickness cases or radiation-induced deaths occurred among workers or the public. In 2018, Japan recognized one worker lung cancer compensation claim. Radiation doses to the general population were extremely low (lifetime effective doses under 10 mSv).",
      evacuationImpact:
        "Over 2,200 non-radiation evacuation-related deaths occurred, predominantly among elderly patients and nursing home residents relocated in harsh winter weather with disrupted critical medical care and severe psychological displacement stress.",
    },
    keyEngineeringLessons: [
      "Diverse backup power: Bunkered, waterproof mobile diesel generators and electrical battery banks stationed on elevated ground.",
      "Hardened Filtered Containment Venting Systems (FCVS) installed to relieve containment pressure while trapping 99.9% of radionuclides.",
      "Passive Autocatalytic Recombiners (PARs) mounted in reactor buildings to continuously consume hydrogen gas without electricity.",
      "Higher and reinforced seawalls with flood-proof watertight seals on reactor and auxiliary turbine buildings.",
    ],
    timeline: [
      {
        time: "March 11, 14:46",
        title: "M9.0 Tōhoku Earthquake",
        description:
          "Offshore megathrust earthquake struck. Units 1–3 automatically scrammed on seismic sensors; off-site grid power was severed, and emergency diesel generators started normally.",
      },
      {
        time: "March 11, 15:27–15:35",
        title: "Tsunami Waves Strike",
        description:
          "A series of 14–15 meter tsunami waves overtopped the 5.7m seawall, drowning 12 of 13 diesel generators, battery switchgear, and seawater cooling pumps (Station Blackout).",
      },
      {
        time: "March 11–12",
        title: "Unit 1 Core Dryout & Hydrogen Explosion",
        description:
          "Isolation condenser depleted. Fuel cladding overheated (>1200°C), triggering zirconium-steam reactions that produced hydrogen. At 15:36 on March 12, hydrogen exploded in the secondary containment.",
      },
      {
        time: "March 14, 11:01",
        title: "Unit 3 Hydrogen Explosion",
        description:
          "Loss of high-pressure coolant injection led to core melting in Unit 3 and a powerful hydrogen explosion in its upper reactor building.",
      },
      {
        time: "March 15, 06:14",
        title: "Unit 4 Reactor Building Blast",
        description:
          "Hydrogen backflowed from Unit 3 into the shutdown Unit 4 building via shared standby gas treatment ducting and ignited.",
      },
      {
        time: "Mid-April to December",
        title: "Cold Shutdown Achieved",
        description:
          "Alternative freshwater and seawater injection established; recirculating water treatment and cooling systems brought all cores to stable cold shutdown (<100°C) by December 2011.",
      },
    ],
    sources: [
      {
        title: "The Fukushima Daiichi Accident: Report by the Director General",
        organization: "International Atomic Energy Agency (IAEA)",
        year: 2015,
        citation: "IAEA Vienna Technical Report GC(59)/14",
      },
      {
        title:
          "Levels and Effects of Radiation Exposure Due to the 2011 Accident at the Fukushima Daiichi Nuclear Power Station",
        organization:
          "United Nations Scientific Committee on the Effects of Atomic Radiation (UNSCEAR)",
        year: 2021,
        citation: "UNSCEAR 2020/2021 Report (Annex B)",
      },
    ],
    explanation: {
      summary:
        "The earthquake and tsunami caused a prolonged loss of power and cooling.",
      body: [
        "The reactors shut down, but decay heat remained. Loss of adequate cooling led to severe fuel damage and hydrogen explosions.",
      ],
      details: [
        {
          id: "mechanism",
          title: "Heat after shutdown",
          body: "Radioactive decay continues after the chain reaction stops. Accident management must provide a way to remove that heat even when normal power and cooling are unavailable.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "three-mile-island",
    name: "Three Mile Island Unit 2",
    location: "Londonderry Township, Pennsylvania",
    country: "United States",
    countryCode: "US",
    year: 1979,
    inesLevel: 5,
    inesLabel: "Accident with Wider Consequences",
    reactorType: "PWR",
    reactorModel: "Babcock & Wilcox 2-Loop Pressurized Water Reactor",
    summary:
      "A pilot-operated relief valve stuck open following a minor pump trip. Inadequate control-room indicators and operator misconceptions led to core uncovery and partial meltdown, but containment held.",
    rootCause:
      "Mechanical valve failure compounded by flawed control board human-factors engineering (a light indicated current to the valve solenoid, not actual physical valve closure), causing operators to shut down emergency cooling pumps.",
    radiologicalRelease: {
      totalActivityPBq: "~480 PBq (predominantly inert noble gas Xenon-133)",
      iodine131PBq: "~0.00059 PBq (590 GBq)",
      cesium137PBq: "Undetectable outside containment",
      description:
        "The robust prestressed concrete containment building remained completely intact. Virtually all radioactive iodine was retained in the coolant water; only inert, non-bioaccumulating noble gases escaped through ventilation filters.",
    },
    healthImpacts: {
      immediateFatalities: 0,
      radiationFatalitiesConfirmed: 0,
      whoUnscearSummary:
        "More than a dozen independent epidemiological studies (including Columbia University, PA Dept of Health, and the NRC) verified zero deaths, zero injuries, and no detectable cancer increases among the 2 million residents within 50 miles. Average public dose was 0.014 mSv (less than a chest x-ray).",
      evacuationImpact:
        "Voluntary advisory for pregnant women and preschool children prompted panic and anxiety; economic loss and reputational shock to the American nuclear industry were profound.",
    },
    keyEngineeringLessons: [
      "Overhaul of human-factors control room design: unambiguous valve position indicators, alarm prioritization, and standardized layout.",
      "Establishment of the Institute of Nuclear Power Operations (INPO) for mandatory industry-wide operational benchmarking and peer inspection.",
      "Full-scope plant-specific replica simulators required for rigorous commercial reactor operator licensing.",
      "Proof of defense-in-depth: Even with 50% core melting, a robust concrete containment completely protected the surrounding community.",
    ],
    timeline: [
      {
        time: "March 28, 04:00:00",
        title: "Main Feedwater Pumps Trip",
        description:
          "A condensate polisher malfunction caused secondary feedwater pumps to trip, automatically tripping the turbine and steam generators.",
      },
      {
        time: "March 28, 04:00:03",
        title: "Relief Valve Opens (PORV)",
        description:
          "Primary system pressure rose; the Pilot-Operated Relief Valve opened as designed to vent excess steam pressure.",
      },
      {
        time: "March 28, 04:00:15",
        title: "PORV Sticks Open (LOCA)",
        description:
          "System pressure normalized, but the valve mechanically stuck open. The control board light showed the solenoid was unpowered, leading operators to believe the valve was shut.",
      },
      {
        time: "March 28, 04:05:00",
        title: "ECCS Throttled In Error",
        description:
          "High Pressure Injection pumps actuated automatically, but pressurizer water level was high (due to steam voids). Operators throttled cooling pumps fearing the pressurizer would go 'solid' (fill completely with water).",
      },
      {
        time: "March 28, 06:18",
        title: "Core Uncovered & Melting",
        description:
          "Top half of core became exposed; intense decay heat melted fuel cladding and pellet bundles (~45% of core melted). Finally, a relief block valve was closed, terminating coolant loss.",
      },
    ],
    sources: [
      {
        title:
          "Report of the President's Commission on the Accident at Three Mile Island (Kemeny Commission)",
        organization: "U.S. Government Printing Office",
        year: 1979,
        citation: "ISBN 0-935758-00-3",
      },
      {
        title:
          "Investigation into the March 28, 1979 Three Mile Island Accident by Office of Inspection and Enforcement",
        organization: "U.S. Nuclear Regulatory Commission (NRC)",
        year: 1979,
        citation: "NUREG-0600",
      },
    ],
    explanation: {
      summary:
        "Equipment failures and misleading indications contributed to a loss of coolant.",
      body: [
        "Operators did not have a clear picture of the reactor’s condition. A partial core meltdown followed, prompting changes to training, instrumentation and emergency response.",
      ],
      details: [
        {
          id: "mechanism",
          title: "Signals versus physical state",
          body: "An indication that a valve has received a command is different from confirmation that it has moved. Clear feedback and well-designed procedures matter during an emergency.",
        },
      ],
      citationIds: [],
    },
  },
  {
    id: "kyshtym",
    name: "Kyshtym Disaster (Mayak)",
    location: "Chelyabinsk Oblast, Russian SFSR",
    country: "Soviet Union (now Russia)",
    countryCode: "RU",
    year: 1957,
    inesLevel: 6,
    inesLabel: "Serious Accident",
    reactorType: "Military Plutonium Production Facility",
    reactorModel: "High-Level Liquid Waste Storage Facility",
    summary:
      "A cooling failure in a subterranean tank containing 80 tons of highly radioactive nitrate and acetate liquid waste caused an explosive chemical blast that contaminated a 300-kilometer territory.",
    rootCause:
      "Mechanical cooling system failure in an underground radioactive waste tank. Evaporation dried the mixture of sodium nitrate salts and organic acetates, causing an explosive chemical detonation (not a nuclear blast).",
    radiologicalRelease: {
      totalActivityPBq: "~74 PBq (total release)",
      cesium137PBq: "~1 PBq",
      description:
        "The blast formed the East Ural Radioactive Trace (EURT), a 300-km plume contaminated primarily by Strontium-90 and Cesium-137 across 20,000 square kilometers.",
    },
    healthImpacts: {
      immediateFatalities: 0,
      radiationFatalitiesConfirmed: 200,
      whoUnscearSummary:
        "No acute blast deaths occurred among civilians. Long-term health studies estimate between 200 and 1,000 cancer deaths among contaminated populations over decades due to chronic exposure and early secrecy. Over 10,000 residents were evacuated from 22 villages.",
      evacuationImpact:
        "The Soviet government kept the disaster strictly secret for over 30 years; affected residents were relocated with zero explanation, and farmland was permanently cordoned off.",
    },
    keyEngineeringLessons: [
      "Liquid high-level waste storage abandoned in favor of solid vitrification (encapsulation into borosilicate glass).",
      "Redundant, continuously monitored passive cooling circuits mandated for all high-level waste repositories.",
      "International reporting and mandatory notification protocols enacted under IAEA treaties.",
    ],
    timeline: [
      {
        time: "1956",
        title: "Cooling System Leak",
        description:
          "Cooling pipes in tank No. 14 began leaking and were switched off without proper repair or liquid monitoring.",
      },
      {
        time: "September 29, 1957, 16:20",
        title: "Chemical Explosion",
        description:
          "Dried sodium nitrate and acetate salts reached 350°C through radioactive decay self-heating, detonating with the force of ~70–100 tons of TNT.",
      },
      {
        time: "1957–1959",
        title: "Contamination & Evacuation",
        description:
          "Plume traveled northeast; 10,600 villagers evacuated and their houses bulldozed to contain radioactive dust.",
      },
    ],
    sources: [
      {
        title: "The Kyshtym Disaster: Environmental and Health Consequences",
        organization: "World Health Organization / IAEA",
        year: 1993,
        citation: "IAEA-TECDOC-683",
      },
    ],
    explanation: {
      summary:
        "A radioactive-waste tank suffered a cooling failure and chemical explosion.",
      body: [
        "The accident took place at a Soviet military nuclear site rather than a commercial electricity reactor. It illustrates the need to distinguish different nuclear facilities and accident mechanisms.",
      ],
      details: [
        {
          id: "mechanism",
          title: "Waste also needs heat management",
          body: "Some waste continues to generate decay heat. Storage design and monitoring must account for the inventory and its changing heat output.",
        },
      ],
      citationIds: [],
    },
  },
];

export const INCIDENT_FAQS: IncidentFaq[] = [
  {
    id: "faq-bomb-explosion",
    question:
      "Can any nuclear power station explode like a nuclear bomb or warhead?",
    category: "physics",
    answer: {
      summary:
        "A power-reactor accident is different from a nuclear-weapon detonation.",
      body: [
        "Steam pressure and chemical reactions can still cause destructive explosions and radioactive releases. The distinction describes the mechanism, not an absence of danger.",
      ],
      details: [],
      citationIds: [],
    },
    source: {
      title: "Fundamentals of Nuclear Reactor Safety",
      organization: "International Atomic Energy Agency",
      year: 2021,
      citation: "IAEA Training Course Series No. 67",
    },
  },
  {
    id: "faq-fukushima-deaths",
    question: "How many people died from radiation at Fukushima?",
    category: "health",
    answer: {
      summary:
        "Radiation effects and evacuation-related harm need separate accounting.",
      body: [
        "UNSCEAR’s 2020/2021 assessment found no documented health effects among residents directly attributable to accident radiation. That finding is not a claim that the disaster caused no harm; displacement and disruption had serious consequences.",
      ],
      details: [],
      citationIds: [],
    },
    source: {
      title: "UNSCEAR 2020/2021 Report, Annex B: Fukushima",
      organization:
        "United Nations Scientific Committee on the Effects of Atomic Radiation",
      year: 2021,
      citation: "UNSCEAR 2020/2021 Assessment",
    },
  },
  {
    id: "faq-chernobyl-modern",
    question:
      "Could a Chernobyl-style catastrophe happen in modern nuclear plants?",
    category: "engineering",
    answer: {
      summary:
        "Reactor designs differ, so accident mechanisms must be examined individually.",
      body: [
        "The RBMK’s control-rod and reactivity characteristics were central to Chernobyl. Other designs have different protections and vulnerabilities; none should be described as incapable of every severe accident.",
      ],
      details: [],
      citationIds: [],
    },
    source: {
      title: "Safety of Nuclear Power Plants: Design (SSR-2/1)",
      organization: "International Atomic Energy Agency (IAEA)",
      year: 2016,
      citation: "IAEA Safety Standards Series SSR-2/1 (Rev. 1)",
    },
  },
  {
    id: "faq-meltdown-explanation",
    question: "What actually happens during a nuclear 'meltdown'?",
    category: "physics",
    answer: {
      summary:
        "A meltdown is severe overheating that melts reactor fuel or associated materials.",
      body: [
        "Loss of adequate heat removal can damage fuel even after shutdown because radioactive decay continues to produce heat. Accident progression and containment performance depend on the plant and circumstances.",
      ],
      details: [],
      citationIds: [],
    },
    source: {
      title: "Severe Accident Management in Nuclear Power Plants",
      organization: "Nuclear Energy Agency (OECD-NEA)",
      year: 2019,
      citation: "NEA No. 7449",
    },
  },
  {
    id: "faq-chernobyl-wildlife",
    question:
      "Is the Chernobyl Exclusion Zone still a dead radioactive wasteland?",
    category: "environment",
    answer: {
      summary:
        "Wildlife presence does not establish that radiation is harmless.",
      body: [
        "Reduced human activity and radiation exposure can both influence an ecosystem. Population counts, individual health effects and variation in contamination answer different questions.",
      ],
      details: [],
      citationIds: [],
    },
    source: {
      title:
        "Long-term census data reveal abundant wildlife populations at Chernobyl",
      organization: "Current Biology",
      year: 2015,
      citation: "Deryabina et al., Curr. Biol. 25(19): R824-R826",
    },
  },
];
