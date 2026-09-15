"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  createComplexityPreferenceStore,
  COMPLEXITY_LABELS,
  COMPLEXITY_LEVELS,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";

const SHORT_LABELS: Record<ComplexityLevel, string> = {
  beginner: "1",
  explorer: "2",
  curious: "3",
  "deep-dive": "4",
  geeky: "5",
};

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
  return (
    <div className="flex items-center gap-3">
      <span className="atom-caption font-semibold uppercase tracking-wider">
        Complexity
      </span>
      <div aria-label="Complexity level" className="flex gap-1" role="group">
        {COMPLEXITY_LEVELS.map((level) => (
          <button
            aria-label={COMPLEXITY_LABELS[level]}
            aria-pressed={value === level}
            className={`
              relative min-w-[44px] min-h-[44px] px-3 py-1.5 text-xs font-bold rounded-full
              flex items-center justify-center
              transition-all duration-150
              ${
                value === level
                  ? "bg-[var(--atom-accent)] text-[var(--atom-text-inverse)]"
                  : "text-[var(--atom-text-muted)] hover:text-[var(--atom-text-primary)] hover:bg-[var(--atom-accent-soft)]"
              }
            `}
            key={level}
            onClick={() => onChange(level)}
            title={COMPLEXITY_LABELS[level]}
            type="button"
          >
            {SHORT_LABELS[level]}
          </button>
        ))}
      </div>
      <strong className="text-sm text-[var(--atom-text-primary)]">
        {COMPLEXITY_LABELS[value]}
      </strong>
    </div>
  );
}
