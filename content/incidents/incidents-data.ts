import type { ComplexityLevel } from "@/lib/preferences/complexity-preference";

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
  explanations: Record<ComplexityLevel, string>;
  sources: IncidentSource[];
}

export interface IncidentFaq {
  id: string;
  question: string;
  answer: Record<ComplexityLevel, string>;
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
    explanations: {
      beginner:
        "At Chernobyl in 1986, an older Soviet reactor exploded during an experiment. The reactor had two huge design flaws: boiling bubbles made it speed up instead of slow down, and the brakes (control rods) had graphite tips that briefly accelerated the engine before stopping it. When operators hit the emergency button, the reactor spiked and blew off its roof. Today's modern reactors are designed completely differently and physically cannot repeat this accident.",
      explorer:
        "Chernobyl happened on April 26, 1986, in Ukraine. Operators were testing whether a spinning turbine could power backup pumps. To keep the test going, they turned off automated safety alarms and pulled out almost every control rod. The Soviet RBMK design used graphite blocks to slow down neutrons and water to cool it. When water boiled into steam, the reactor surged in power (positive void coefficient). When the scram button was pressed, graphite rod tips entered first, spiking reactivity and triggering steam and hydrogen explosions.",
      curious:
        "The Chernobyl disaster was caused by a fatal convergence of flawed RBMK reactor physics and severe operational breaches. Unlike Western light-water reactors, the RBMK had a positive void coefficient at low power. Light water acted primarily as a neutron absorber rather than moderator (graphite provided moderation). When boiling created steam voids, neutron absorption dropped while moderation continued, multiplying reactivity. When operators pressed SCRAM (AZ-5), the graphite displacers at the tips of the boron rods displaced water at the bottom of the core, inserting positive reactivity and triggering prompt criticality.",
      "deep-dive":
        "The RBMK-1000 was a thermal channel-type reactor using graphite moderation and boiling light-water coolant. In April 1986, operating with an Operating Reactivity Margin (ORM) of only 6–8 equivalent rods (legal minimum was 30), the reactor was heavily Xenon-135 poisoned. Tripping the main coolant pumps increased boiling in fuel channels. Due to a void coefficient of +4.5 to +5.0 pcm/% void, reactivity climbed rapidly. Actuation of the EPS-5 emergency system drove 200+ absorber rods downward; their 4.5-meter graphite displacers displaced water in the bottom 1.25 meters of the core, causing a localized power spike that ruptured fuel pins and initiated a supercritical steam explosion.",
      geeky:
        "Kinetics: Post-accident reconstitutions (INSAG-7) established that effective delayed neutron fraction β_eff had dropped to ~0.005 due to high burnup and low core reserves. Positive scram effect injected Δρ > +$1.00 into lower core segments within 2.5 seconds of AZ-5 insertion. Doppler feedback from UO₂ fuel (negative) was insufficient to counteract the massive void coefficient (+0.047 Δk/k per 100% void) before peak thermal flux exceeded 30 GWt (1000% nominal). Fuel dispersal into pressurized water caused rapid thermodynamic detonation (p > 20 MPa), destroying core geometry and igniting 1,700 metric tons of incandescent graphite.",
    },
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
    explanations: {
      beginner:
        "In 2011, Japan suffered an enormous earthquake followed by a giant 45-foot tsunami wave. The wave drowned the backup electric generators at the Fukushima nuclear plant. Even though the reactors had turned off automatically in seconds, nuclear fuel continues to stay hot for days after shutdown (decay heat). Without power for water pumps, the water boiled away, fuel melted, and trapped hydrogen gas caused building roofs to explode. Nobody died from radiation, but moving over 150,000 people caused great hardship.",
      explorer:
        "Fukushima Daiichi showed what happens when all electricity is lost for days (Station Blackout). The earthquake cut the grid, but the tsunami overtopped the seawall and drowned the backup diesel generators located in the basements. Without power to circulate cooling water, the residual decay heat inside Units 1, 2, and 3 boiled off coolant. When the fuel rods uncovered, zirconium metal reacted with steam at high heat to create hydrogen gas, which collected in the upper buildings and ignited. Radiation was released, but timely evacuations prevented any acute radiation injuries.",
      curious:
        "Fukushima was fundamentally a station blackout and loss of ultimate heat sink event. Although control rods successfully stopped the fission chain reaction within seconds of the earthquake, radioactive fission products continued generating decay heat (~6% of thermal power initially, dropping to ~1% after a day). Because emergency diesels and 125V DC batteries were submerged, operators lost instrumentation and pump actuation. As core water levels dropped below fuel height, exothermic zirconium cladding oxidation began (Zr + 2H₂O → ZrO₂ + 2H₂ + 586 kJ/mol), generating immense quantities of hydrogen that accumulated in the reactor service floors and detonated.",
      "deep-dive":
        "The Fukushima Daiichi accident involved three concurrent meltdowns in General Electric BWR-3 (Unit 1) and BWR-4 (Units 2/3) designs with Mark I drywell/torus containments. Total Station Blackout disabled the Isolation Condenser (IC) in Unit 1 and the Reactor Core Isolation Cooling (RCIC) turbine systems in Units 2 and 3 after battery exhaustion. Core uncovery progressed to cladding rupture at ~900°C, rapid autocatalytic oxidation at ~1,200°C, and corium relocation to the lower reactor pressure vessel heads. Primary containment pressure exceeded design basis (427 kPa), leaking hydrogen through top-head drywell flange seals into the secondary containment superstructure.",
      geeky:
        "Severe accident forensics: Zircaloy-steam kinetic rate constants (Urbanic-Heidrick) produced ~1,000 kg of H₂ per unit. Containment venting was delayed by loss of pneumatic valve actuator pressure and high radiation fields. Flange elastomeric seals degraded under combined thermal-hydraulic stress (T > 250°C, p > 0.8 MPa), permitting flammable H₂-air mixtures (4–75% vol) to gather in refueling bays. Deflagration-to-detonation transitions occurred at Units 1 and 3. Aerosol release fractions were mitigated by water scrubbers in suppression pools, limiting Cs-137 release to 13–15 PBq compared to 85 PBq at Chernobyl.",
    },
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
    explanations: {
      beginner:
        "At Three Mile Island in Pennsylvania (1979), a relief valve got stuck open like a leaky faucet. A confusing indicator light in the control room fooled operators into thinking the valve was closed, so they turned off the emergency water pumps. Half the nuclear fuel melted inside its thick steel pot, but the gigantic concrete dome surrounding the reactor did its job and kept almost all radiation locked inside. Nobody was hurt, and the average neighbor received less extra radiation than getting a dental x-ray.",
      explorer:
        "Three Mile Island was the most serious commercial nuclear accident in US history, yet it caused zero casualties. A valve stuck open, leaking coolant water. Control room dials showed that the electrical signal to close the valve had been sent, but didn't verify the valve's physical position. Thinking the reactor had too much water, operators throttled back emergency injection. About 45% of the core melted. However, the steel reactor vessel and thick concrete containment building held, preventing significant radioactive release to the public.",
      curious:
        "TMI-2 was a small-break loss-of-coolant accident (SBLOCA) exacerbated by human-machine interface (HMI) failures. When the Pilot-Operated Relief Valve stuck open, coolant flashed into steam. Pressurizer level indicators indicated rising water because steam bubbles in the reactor vessel were pushing coolant upward into the pressurizer. Operators followed procedures written for solid water conditions and manually throttled emergency coolant injection, starving the core. The crucial takeaway was the validation of defense-in-depth containment engineering.",
      "deep-dive":
        "The accident began with condensate polisher maintenance failure tripping main feedwater. The PORV opened at 15.5 MPa and failed to reseat. Reactor coolant escaped into the containment sump through the reactor coolant drain tank. The control panel indicated solenoid de-energization, not acoustic stem position. Operators misinterpreted pressurizer level as an indicator of core inventory; subcooling margin was lost, and core boiling produced vapor voids that unseated core geometry. Temperatures exceeded 2,200°C, causing ~62 tons of core material to melt into a corium pool.",
      geeky:
        "TMI-2 post-accident defueling (NUREG-0600, Kemeny Commission) confirmed 45% (62 tonnes) of the core liquefied. The lower head survived without breach because a crust layer formed between molten corium and vessel steel, allowing decay heat dissipation via ambient cooling water. Total off-site airborne release was 480 PBq of noble gases and only 590 GBq of I-131 (retention factor > 99.999% in aqueous phase). Average whole-body dose to surrounding population within 16 km was 0.014 mSv (maximum individual dose 1.0 mSv), proving passive defense-in-depth safety margins.",
    },
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
    explanations: {
      beginner:
        "In 1957 at a secret Soviet military factory called Mayak, a cooling tank holding nuclear waste broke down. The liquid dried out, and chemical fertilizers in the waste got so hot that they exploded like dynamite. It blew radioactive dust across the countryside. It was kept secret for thirty years. Today, nuclear waste is stored as solid glass or dry steel canisters where this cannot happen.",
      explorer:
        "The Kyshtym disaster in 1957 occurred at a Soviet military plutonium production facility, not a civilian power plant. A failure in the cooling system of an underground tank containing radioactive liquid waste caused the tank to boil dry. The mixture of sodium nitrate and organic compounds chemically exploded with the force of 70 to 100 tons of TNT, spreading fallout across the Ural mountains.",
      curious:
        "Kyshtym (Mayak-57) was an industrial chemical explosion of high-level liquid nuclear reprocessing waste. Nitrate salts and organic acetates formed a pyrotechnic mixture that auto-ignited when self-heating reached 350°C due to radiolytic decay. The 160-ton concrete lid was blown off. The accident prompted the entire global industry to transition high-level waste management from liquid storage to solid vitrification and passive dry storage.",
      "deep-dive":
        "Tank 14 contained 70–80 metric tons of high-level liquid waste from the Bismuth Phosphate plutonium separation process. High concentrations of sodium nitrate (oxidizer) and sodium acetate (reducing agent) self-heated after cooling failure (temperatures exceeded 350°C). Detonation energy of ~70–100 tons TNT equivalent pulverized ~20 PBq of radionuclides into an aerosol column rising 1 km, creating the East Ural Radioactive Trace (EURT).",
      geeky:
        "Mayak radiochemistry analysis: The radionuclide inventory was dominated by Ce-144/Pr-144 (66%), Zr-95/Nb-95 (25%), and long-lived Sr-90 (5.4%, ~4 PBq). Unlike civilian reactors, no volatile I-131 was present due to lengthy pre-reprocessing fuel cooling times. Long-term biological dosimetry of EURT cohort showed cumulative bone marrow doses reaching up to 1.5 Gy among riverside populations before late evacuation.",
    },
    sources: [
      {
        title: "The Kyshtym Disaster: Environmental and Health Consequences",
        organization: "World Health Organization / IAEA",
        year: 1993,
        citation: "IAEA-TECDOC-683",
      },
    ],
  },
];

export const INCIDENT_FAQS: IncidentFaq[] = [
  {
    id: "faq-bomb-explosion",
    question:
      "Can any nuclear power station explode like a nuclear bomb or warhead?",
    category: "physics",
    answer: {
      beginner:
        "No, never. Nuclear bombs require weapon-grade fuel that is over 90% enriched. Civilian power plants use fuel that is only 3% to 5% enriched. It is physically impossible for a reactor to produce a nuclear mushroom blast, just as it is impossible to make beer explode like dynamite.",
      explorer:
        "Commercial reactors physically cannot detonate like nuclear bombs. A weapon requires assembling a dense mass of >90% pure U-235 or Pu-239 within microseconds using high-precision explosives. Power reactors use 3–5% enriched fuel in ceramic pellets surrounded by water. Explosions at Chernobyl and Fukushima were non-nuclear steam and hydrogen chemical blasts.",
      curious:
        "The physics of nuclear weapons and commercial reactors are mutually incompatible. Weapons require fast neutrons, highly enriched fissile material (HEU >90%), and rapid supercritical assembly before thermal expansion halts the reaction. In power reactors, low enrichment (3–5%), negative fuel Doppler temperature coefficients, and physical geometry immediately terminate the chain reaction long before explosive energy densities can develop.",
      "deep-dive":
        "Reactor kinetics prevent nuclear explosive yields. Prompt neutron lifetime in thermal reactors is Λ ≈ 20–50 μs, compared to Λ ≈ 10 ns in weapon cores. Fuel Doppler broadening in fertile U-238 (∂ρ/∂T < 0) introduces powerful negative reactivity within milliseconds of any temperature transient. Any sudden power increase causes instantaneous thermal disassembly, terminating fission before weapon-scale mechanical work is possible.",
      geeky:
        "Bethe-Tait reactor disassembly theory demonstrates that core disassembly pressures in thermal LWRs remain orders of magnitude below weapon yields. Even under hypothetical prompt supercritical conditions (ρ > $1.00), Doppler negative reactivity insertion terminates power excursions within ~15 ms. Peak energy densities in severe accidents reach ~300 J/g (fuel pellet fragmentation limit), compared to >10⁷ J/g required for hydrodynamic nuclear explosive detonations.",
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
      beginner:
        "Zero people died from radiation at Fukushima. However, the hurried evacuation of over 150,000 residents tragically caused over 2,200 deaths among frail elderly people and hospital patients due to hypothermia, disrupted healthcare, and stress.",
      explorer:
        "The United Nations (UNSCEAR) confirmed that zero deaths or acute radiation sickness cases were caused by radiation exposure from Fukushima. One worker's family received compensation in 2018 for lung cancer. In contrast, over 2,200 vulnerable people died from the physical stress and medical disruption of the emergency evacuation itself.",
      curious:
        "According to extensive global health studies by UNSCEAR, WHO, and the IAEA, no members of the general public or plant workers suffered acute radiation illness or death from Fukushima fallout. Timely evacuation and food controls prevented significant internal exposure. However, the chaotic evacuation of nursing homes and ICU patients during freezing winter weather resulted in approximately 2,200 non-radiological fatalities.",
      "deep-dive":
        "UNSCEAR 2013 and 2020/2021 reports concluded that public thyroid doses were low (median <15 mSv) and lifetime effective doses were <10 mSv for most evacuees. Consequently, no statistically detectable increase in cancer incidence, birth defects, or genetic abnormalities is expected. Evacuation-related mortality (Shinsai Kanren-shi) was officially recognized for ~2,200 individuals, demonstrating that evacuation policies must balance radiological risk against relocation trauma.",
      geeky:
        "Dosimetric reconstructions: Average public whole-body dose in Fukushima prefecture during year 1 was 1.0–2.5 mSv (comparable to natural background radiation variation). Worker doses: out of ~25,000 monitored workers, only 174 received >100 mSv (threshold for observable epidemiological risk elevation). The 2020 UNSCEAR update re-affirmed that excess relative risk (ERR) for solid cancers across the population is effectively undetectable against Japan's baseline 30% lifetime cancer rate.",
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
      beginner:
        "No. Modern reactors are built completely differently. They have a natural safety feature where if they overheat or form steam bubbles, the reaction automatically slows down on its own. They also have massive steel-and-concrete containment domes that keep all radiation inside even during the worst meltdowns.",
      explorer:
        "A Chernobyl-type accident is physically impossible in modern light-water reactors (PWRs, BWRs) and modern CANDUs. First, modern reactors have negative void coefficients—meaning boiling water naturally stops the reaction. Second, modern reactors have massive, airtight reinforced-concrete containment structures (Chernobyl had only an industrial roof). Third, control rod tips cannot trigger power surges.",
      curious:
        "The Chernobyl disaster was specific to the RBMK's unstable physics at low power. Modern reactors operate with negative temperature and void coefficients of reactivity (increasing steam voids reduces moderation and shuts down the fission reaction). Furthermore, Gen III+ reactors incorporate passive safety systems that cool the core using gravity, convection, and evaporation for 72+ hours without human action or AC power.",
      "deep-dive":
        "Light-water reactors (PWRs and BWRs) use water as both coolant and moderator. If water boils into steam, neutron moderation decreases, causing thermal neutron flux to drop and immediately inserting negative reactivity. The RBMK decoupled coolant (water) from moderator (graphite), creating a net positive void coefficient. Modern designs also feature post-TMI and post-Fukushima enhancements: core catchers, passive containment cooling, and double-walled pre-stressed concrete containments rated for commercial aircraft impacts.",
      geeky:
        "Reactivity feedback parameters: Modern PWRs operate with moderator temperature coefficient MTC ≈ -10 to -50 pcm/°C and fuel Doppler coefficient DTC ≈ -2.5 to -3.5 pcm/°C throughout the operating fuel cycle. In contrast, Chernobyl's unretrofitted RBMK had a void coefficient of +4.7 pcm/% void. Modern Gen III/III+ reactors (EPR, AP1000, VVER-1200) enforce core damage frequencies (CDF) < 10⁻⁶ per reactor-year, backed by core melt retention vessels (core catchers) to prevent basement penetration.",
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
      beginner:
        "A meltdown means the uranium fuel inside the reactor got so hot without cooling water that the metal rods melted into a lava-like mixture called corium. The danger is that this hot lava could damage the tank. Modern plants have 'core catchers' underneath that catch and cool this lava so it stays safely trapped.",
      explorer:
        "When a reactor shuts down, the radioactive fission products still produce 'decay heat' (about 1% of full power after a day). If all cooling water is lost, this heat cannot escape. Over hours, the ceramic fuel and metal tubes melt together into a glowing lava called corium. Meltdowns happened at TMI, Chernobyl, and Fukushima. At TMI, the containment caught everything; at Fukushima, it damaged buildings; in new plants, special basements trap the corium.",
      curious:
        "A meltdown is a thermal-hydraulic failure where decay heat exceeds heat removal capacity after reactor shutdown. When water levels drop below the active fuel zone, the Zircaloy cladding heats above 1,200°C, reacting with steam to generate hydrogen. Above 2,000°C, the fuel assemblies melt into a molten slurry called corium. Containment buildings, cooling sumps, and core catchers are engineered to cool this molten mass and prevent it from breaching the foundation.",
      "deep-dive":
        "Decay heat follows the Way-Wigner approximation: P(t) ≈ 0.065 · P₀ · [t⁻⁰·² - (t + t₀)⁻⁰·²]. Even after immediate fission cessation, residual decay of short-lived isotopes (I-131, Cs-137, Ba-140) generates significant heat. In a severe accident, fuel uncovery leads to eutectic interactions between Zircaloy, stainless steel control rods, and UO₂ fuel pellets, forming liquid corium at ~2,500–2,800°C. Modern reactors incorporate dedicated ex-vessel core retention structures (core catchers) with sacrificial concrete and passive flood valves to spread and cool corium indefinitely.",
      geeky:
        "Severe accident phenomenological phases: 1) Core degradation: eutectic liquation of Ag-In-Cd control rods at ~1,400 K, followed by Zr-UO₂ dissolution at ~2,100 K. 2) Lower plenum relocation: molten corium collects on the lower RPV head. 3) Debris bed coolability: without cooling, vessel failure occurs via creep rupture (Larson-Miller parameter). 4) Molten Corium-Concrete Interaction (MCCI): corium releases non-condensable gases (CO, CO₂, H₂) as it erodes concrete, mitigated in modern designs by high-zirconia sacrificial concrete linings and top-flooding water basins.",
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
      beginner:
        "Surprisingly, no! While localized spots remain too radioactive for humans to live in safely, the absence of human hunting, farming, and traffic has turned the Chernobyl exclusion zone into Europe's largest wildlife sanctuary. Wolves, brown bears, lynx, and wild horses are thriving there in large numbers.",
      explorer:
        "Contrary to common belief, the 1,000-square-mile Chernobyl Exclusion Zone is not a barren wasteland. In the decades since 350,000 people left, nature made a remarkable recovery. Population counts of gray wolves, wild boars, roe deer, and endangered Przewalski's horses are higher inside the zone than in surrounding non-radioactive reserves. The absence of human disruption outweighs the biological impacts of radiation for wildlife.",
      curious:
        "Scientific field studies published in Current Biology and by the Chernobyl Exclusion Zone Environmental Assessment confirm that the zone has evolved into a thriving biodiversity haven. While individual animals in hot spots show cellular mutations, cataracts, or lower life spans, wildlife populations as a whole are abundant and stable. Ecological data demonstrates that human activities (urbanization, agriculture, forestry) exert a far more damaging pressure on large mammal ecosystems than chronic low-to-moderate radiation.",
      "deep-dive":
        "Extensive camera-trap surveys (Deryabina et al., 2015; Webster et al., 2016) show no evidence of long-term population-level suppression of large mammals in the Polissia State Radioecological Reserve. Cesium-137 (half-life 30.17 years) and Strontium-90 (half-life 28.8 years) have decayed through more than one half-life, migrating into mineral soil horizons. While radio-sensitivity varies across species (rodents and swallows exhibit increased somatic mutations and reduced fertility in micro-habitats exceeding 100 μGy/h), macro-ecological recovery remains robust.",
      geeky:
        "Biogeochemical cycling in the CEZ: Radionuclide inventories in the upper 10 cm of podzolic soils have attenuated significantly, with Cs-137 fixed in illite clays (low bioavailability). Chronic ambient dose rates in the majority of the 2,600 km² zone range from 0.5 to 5.0 μSv/h (compared to peak 1986 levels of >1,000 μSv/h). Adaptive DNA repair mechanisms, antioxidant upregulation, and lack of anthropogenic habitat fragmentation have enabled thriving apex predator density (wolf density is ~7x higher than in neighboring unpopulated national parks).",
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
