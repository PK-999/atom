"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  createComplexityPreferenceStore,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";

import styles from "./ComplexitySelector.module.css";

const complexityLevels: ReadonlyArray<{
  value: ComplexityLevel;
  short: string;
  label: string;
}> = [
  { value: "kid", short: "1", label: "Kid" },
  { value: "simple", short: "2", label: "Simple" },
  { value: "curious", short: "3", label: "Curious" },
  { value: "technical", short: "4", label: "Technical" },
  { value: "expert", short: "5", label: "Expert" },
];

interface ComplexitySelectorProps {
  value: ComplexityLevel;
  onChange: (level: ComplexityLevel) => void;
}

export function useComplexityPreference(
  fallback: ComplexityLevel,
): readonly [ComplexityLevel, (level: ComplexityLevel) => void] {
  const store = useMemo(
    () => createComplexityPreferenceStore(fallback),
    [fallback],
  );
  const level = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return [level, store.set] as const;
}

export function ComplexitySelector({
  value,
  onChange,
}: ComplexitySelectorProps) {
  const currentLabel = complexityLevels.find(
    (level) => level.value === value,
  )?.label;

  return (
    <div className={styles.complexity}>
      <span className={styles.controlLabel}>Complexity</span>
      <div aria-label="Complexity level" className={styles.levels} role="group">
        {complexityLevels.map((level) => (
          <button
            aria-label={level.label}
            aria-pressed={value === level.value}
            className={styles.levelButton}
            key={level.value}
            onClick={() => onChange(level.value)}
            title={level.label}
            type="button"
          >
            <span aria-hidden>{level.short}</span>
          </button>
        ))}
      </div>
      <strong>{currentLabel}</strong>
    </div>
  );
}
