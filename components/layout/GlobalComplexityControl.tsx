"use client";

import Link from "next/link";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LABELS,
  COMPLEXITY_LEVELS,
} from "@/lib/preferences/complexity-preference";
import styles from "./GlobalComplexityControl.module.css";

export function GlobalComplexityControl() {
  const [level] = useComplexityPreference("curious");
  const levelNumber = COMPLEXITY_LEVELS.indexOf(level) + 1;

  return (
    <Link
      href="/#reading-depth"
      className={styles.depthControl}
      aria-label={`Current reading depth: Level ${levelNumber} ${COMPLEXITY_LABELS[level]}. Click to change complexity level.`}
      title="Current reading depth — click to change"
    >
      <span className={styles.depthBadge} aria-hidden="true">
        {levelNumber}
      </span>
      <span className={styles.depthLabel}>Depth:</span>
      <strong className={styles.depthName}>{COMPLEXITY_LABELS[level]}</strong>
      <span className={styles.depthChange} aria-hidden="true">
        ↺
      </span>
    </Link>
  );
}
