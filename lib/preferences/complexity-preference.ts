import type { ComplexityLevel } from "@/features/comparison/comparison-types";

export const COMPLEXITY_PREFERENCE_KEY =
  "atom:preferences:v1:complexity" as const;

const complexityLevels = new Set<ComplexityLevel>([
  "kid",
  "simple",
  "curious",
  "technical",
  "expert",
]);

function parseComplexityLevel(value: string | null): ComplexityLevel | null {
  return value && complexityLevels.has(value as ComplexityLevel)
    ? (value as ComplexityLevel)
    : null;
}

export function createComplexityPreferenceStore(fallback: ComplexityLevel) {
  let current = fallback;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function readStoredPreference() {
    try {
      const stored = parseComplexityLevel(
        window.localStorage.getItem(COMPLEXITY_PREFERENCE_KEY),
      );
      if (stored) current = stored;
    } catch {
      // The in-memory preference remains authoritative when storage is blocked.
    }
  }

  return {
    getServerSnapshot: () => fallback,
    getSnapshot: () => current,
    set(level: ComplexityLevel) {
      current = level;
      notify();

      try {
        window.localStorage.setItem(COMPLEXITY_PREFERENCE_KEY, level);
      } catch {
        // Preference persistence is best-effort and never blocks interaction.
      }
    },
    subscribe(listener: () => void) {
      const handleStorage = (event: StorageEvent) => {
        if (event.key !== COMPLEXITY_PREFERENCE_KEY) return;
        current = parseComplexityLevel(event.newValue) ?? fallback;
        notify();
      };

      listeners.add(listener);
      window.addEventListener("storage", handleStorage);

      if (!hydrated) {
        const previous = current;
        hydrated = true;
        readStoredPreference();
        if (current !== previous) queueMicrotask(notify);
      }

      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorage);
      };
    },
  };
}
