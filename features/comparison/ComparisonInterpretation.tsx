"use client";

import Link from "next/link";
import type { ComplexityLevel, DisplayMode } from "./comparison-types";
import styles from "./ComparisonLab.module.css";

const METRIC_EXPLANATIONS: Record<string, Record<ComplexityLevel, string>> = {
  "lifecycle-ghg": {
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
  "land-use": {
    kid: "Some power plants need huge amounts of land, while others make lots of clean electricity in a small space.",
    simple:
      "Solar and wind usually need more land area than nuclear or gas to generate the same amount of electricity over time.",
    curious:
      "Direct vs. indirect land footprints differ significantly across technologies, especially when mining and fuel supply chains are included.",
    technical:
      "Footprint metrics vary by capacity factor, spacing, and whether co-located land uses (e.g. agrivoltaics) are credited.",
    expert:
      "Spatial energy density calculations depend on lifecycle boundary definitions, operational life assumptions, and land occupation versus transformation categorization.",
  },
  "capacity-factor": {
    kid: "Some power plants can run all day and night, while others only work when the sun shines or the wind blows.",
    simple:
      "Capacity factor tells you how much electricity a plant actually produces compared to running at full power all the time.",
    curious:
      "Nuclear and geothermal maintain high capacity factors because they are designed for continuous baseline generation, unlike weather-dependent sources.",
    technical:
      "Annual capacity factors reflect dispatch economics, refueling outages, and weather intermittency rather than mechanical reliability alone.",
    expert:
      "Capacity factor metrics require clear distinction between nameplate availability and market curtailment under high renewable penetration.",
  },
  "water-withdrawal": {
    kid: "Power plants need water to cool down, just like sweating keeps you cool.",
    simple:
      "Thermal plants like nuclear, coal, and gas withdraw water for cooling, while wind and solar PV use almost none during operation.",
    curious:
      "Withdrawal measures total water taken in from a river or ocean, though most cooling water is returned safely after use.",
    technical:
      "Once-through cooling systems exhibit high withdrawal but low consumption, whereas cooling towers exhibit low withdrawal but higher evaporative loss.",
    expert:
      "Watershed-specific thermal discharge regulations and intake design dictate operational water stress impact more than nominal withdrawal volume.",
  },
};

const UNAVAILABLE_EXPLANATIONS: Record<
  Exclude<DisplayMode, "typical">,
  string
> = {
  range:
    "Reviewed range evidence is not available in this interface preview. ATOM will not infer a range from a representative value.",
  raw: "Source-level raw observations are not available in this interface preview. Published records will appear only where licensing permits.",
};

interface ComparisonInterpretationProps {
  metricId: string;
  metricName: string;
  level: ComplexityLevel;
  displayMode: DisplayMode;
}

export function ComparisonInterpretation({
  metricId,
  metricName,
  level,
  displayMode,
}: ComparisonInterpretationProps) {
  let explanation: string;

  if (displayMode !== "typical") {
    explanation = UNAVAILABLE_EXPLANATIONS[displayMode];
  } else {
    const metricSet = METRIC_EXPLANATIONS[metricId];
    if (metricSet && metricSet[level]) {
      explanation = metricSet[level];
    } else {
      explanation = `Reviewed explanation for ${metricName} is not yet available at the ${level} level. Showing evidence metrics directly without unverified editorial interpretation.`;
    }
  }

  return (
    <aside className={styles.interpretation} aria-labelledby="meaning-title">
      <p className={styles.eyebrow}>What this means</p>
      <h2 id="meaning-title" className={styles.srOnly}>
        Interpretation
      </h2>
      <p aria-live="polite">{explanation}</p>
      <Link href="/methodology">Read how ATOM reviews evidence</Link>
    </aside>
  );
}
