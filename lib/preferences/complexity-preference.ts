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
const listeners = new Set<() => void>();

export function subscribeComplexityPreference(listener: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === COMPLEXITY_PREFERENCE_KEY) listener();
  };

  listeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function readComplexityPreference(
  storage: Pick<Storage, "getItem">,
): ComplexityLevel | null {
  try {
    const value = storage.getItem(COMPLEXITY_PREFERENCE_KEY);
    return value && complexityLevels.has(value as ComplexityLevel)
      ? (value as ComplexityLevel)
      : null;
  } catch {
    return null;
  }
}

export function writeComplexityPreference(
  storage: Pick<Storage, "setItem">,
  value: ComplexityLevel,
) {
  try {
    storage.setItem(COMPLEXITY_PREFERENCE_KEY, value);
    listeners.forEach((listener) => listener());
  } catch {
    // Preference persistence must never block the comparison experience.
  }
}
