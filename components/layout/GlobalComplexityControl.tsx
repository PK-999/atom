"use client";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LABELS,
  COMPLEXITY_LEVELS,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";
import styles from "./GlobalComplexityControl.module.css";
export function GlobalComplexityControl() {
  const [level, setLevel] = useComplexityPreference("curious");
  return (
    <label className={styles.depthControl}>
      <span className={styles.depthLabel}>Depth</span>
      <select
        aria-label="Reading depth"
        value={level}
        onChange={(event) => setLevel(event.target.value as ComplexityLevel)}
      >
        {COMPLEXITY_LEVELS.map((value, index) => (
          <option key={value} value={value}>
            {index + 1}. {COMPLEXITY_LABELS[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
