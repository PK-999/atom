"use client";

import Link from "next/link";
import type { ComplexityLevel, DisplayMode } from "./comparison-types";
import styles from "./ComparisonLab.module.css";

import { METRIC_CATALOG_EXPLANATIONS } from "@/content/metrics";

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

export function getInterpretation(
  metricId: string,
  level: ComplexityLevel,
  displayMode: DisplayMode = "typical",
  metricName?: string,
): {
  found: boolean;
  text: string;
  limitations?: string;
  systemBoundary?: string;
} {
  if (displayMode !== "typical") {
    return {
      found: false,
      text: UNAVAILABLE_EXPLANATIONS[displayMode],
    };
  }
  const record = METRIC_CATALOG_EXPLANATIONS[metricId];
  if (record?.explanations?.[level]) {
    return {
      found: true,
      text: record.explanations[level],
      limitations: record.limitations,
      systemBoundary: record.systemBoundary,
    };
  }
  return {
    found: false,
    text: `Reviewed explanation for ${metricName ?? metricId} is not yet available at the ${level} level. Showing evidence metrics directly without unverified editorial interpretation.`,
  };
}

export function ComparisonInterpretation({
  metricId,
  metricName,
  level,
  displayMode,
}: ComparisonInterpretationProps) {
  const result = getInterpretation(metricId, level, displayMode, metricName);

  return (
    <aside className={styles.interpretation} aria-labelledby="meaning-title">
      <p className={styles.eyebrow}>What this means</p>
      <h2 id="meaning-title" className={styles.srOnly}>
        Interpretation
      </h2>
      <p aria-live="polite">{result.text}</p>
      {result.limitations && (
        <p className="text-xs text-muted-foreground mt-2">
          <strong>Limitations:</strong> {result.limitations}
        </p>
      )}
      <Link href="/methodology">Read how ATOM reviews evidence</Link>
    </aside>
  );
}
