"use client";

import { ExplanationDetails } from "@/components/education/Explanation";
import Link from "next/link";
import type { DisplayMode } from "./comparison-types";
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
  hasEvidence?: boolean;
  metricId: string;
  metricName: string;
  displayMode: DisplayMode;
}

export function getInterpretation(
  metricId: string,
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
  if (record?.explanation) {
    return {
      found: true,
      text: [record.explanation.summary, ...record.explanation.body].join(" "),
      limitations: record.limitations,
      systemBoundary: record.systemBoundary,
    };
  }
  return {
    found: false,
    text: `Reviewed explanation for ${metricName ?? metricId} is not yet available. Showing evidence metrics directly without unverified editorial interpretation.`,
  };
}

export function ComparisonInterpretation({
  hasEvidence = true,
  metricId,
  metricName,
  displayMode,
}: ComparisonInterpretationProps) {
  const result = hasEvidence
    ? getInterpretation(metricId, displayMode, metricName)
    : {
        found: false,
        text: "Reviewed comparison evidence is not available for this selection. ATOM is checking the exact sources, methods, and reuse permissions before publishing values. Missing evidence is not zero, and does not establish a ranking.",
        limitations: undefined,
        systemBoundary: undefined,
      };

  return (
    <aside className={styles.interpretation} aria-labelledby="meaning-title">
      <p className={styles.eyebrow}>What this means</p>
      <h2 id="meaning-title" className={styles.srOnly}>
        Interpretation
      </h2>
      <p aria-live="polite">{result.text}</p>
      {result.systemBoundary && (
        <ExplanationDetails
          details={[
            {
              id: "boundary",
              title: "What is counted?",
              body: result.systemBoundary,
            },
          ]}
        />
      )}
      {result.limitations && (
        <p className={styles.limitations}>
          <strong>Limitations:</strong> {result.limitations}
        </p>
      )}
      <Link href="/methodology">Read how ATOM reviews evidence</Link>
    </aside>
  );
}
