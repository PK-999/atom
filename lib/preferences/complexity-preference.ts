export type ComplexityLevel =
  "beginner" | "explorer" | "curious" | "deep-dive" | "geeky";

export const COMPLEXITY_LEVELS: readonly ComplexityLevel[] = [
  "beginner",
  "explorer",
  "curious",
  "deep-dive",
  "geeky",
];

export const COMPLEXITY_LABELS: Record<ComplexityLevel, string> = {
  beginner: "Beginner",
  explorer: "Explorer",
  curious: "Curious",
  "deep-dive": "Deep-Dive",
  geeky: "Geeky",
};

export const COMPLEXITY_DESCRIPTIONS: Record<ComplexityLevel, string> = {
  beginner: "Simple language, fun analogies, no jargon",
  explorer: "Clear explanations with basic scientific terms",
  curious: "Full context, trade-offs, and methodology",
  "deep-dive": "Technical detail, equations, engineering context",
  geeky: "Research-grade depth, raw data, uncertainty analysis",
};

export const COMPLEXITY_PREFERENCE_KEY =
  "atom:preferences:v2:complexity" as const;
const COMPLEXITY_PREFERENCE_EVENT = "atom:complexity-preference-change";

const LEGACY_KEY = "atom:preferences:v1:complexity" as const;
const LEGACY_MAP: Record<string, ComplexityLevel> = {
  kid: "beginner",
  simple: "explorer",
  curious: "curious",
  technical: "deep-dive",
  expert: "geeky",
};

const complexityLevels = new Set<ComplexityLevel>(COMPLEXITY_LEVELS);

function parseComplexityLevel(value: string | null): ComplexityLevel | null {
  if (!value) return null;
  if (complexityLevels.has(value as ComplexityLevel))
    return value as ComplexityLevel;
  // Migrate old v1 values
  if (value in LEGACY_MAP) return LEGACY_MAP[value]!;
  return null;
}

export function createComplexityPreferenceStore(fallback: ComplexityLevel) {
  let current = fallback;
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function readStoredPreference(): ComplexityLevel | null {
    try {
      // Try new key first, fall back to legacy
      const stored =
        window.localStorage.getItem(COMPLEXITY_PREFERENCE_KEY) ??
        window.localStorage.getItem(LEGACY_KEY);
      return parseComplexityLevel(stored);
    } catch {
      return null;
    }
  }

  function readUrlPreference(): ComplexityLevel | null {
    return parseComplexityLevel(
      new URLSearchParams(window.location.search).get("level"),
    );
  }

  function readActivePreference(): ComplexityLevel {
    return readUrlPreference() ?? readStoredPreference() ?? fallback;
  }

  function updateUrlPreference(level: ComplexityLevel) {
    const url = new URL(window.location.href);
    url.searchParams.set("level", level);
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  return {
    getServerSnapshot: () => fallback,
    getSnapshot: () => current,
    set(level: ComplexityLevel) {
      current = level;
      notify();

      try {
        window.localStorage.setItem(COMPLEXITY_PREFERENCE_KEY, level);
        // Clean up legacy key
        window.localStorage.removeItem(LEGACY_KEY);
      } catch {
        // Preference persistence is best-effort and never blocks interaction.
      }

      updateUrlPreference(level);

      window.dispatchEvent(
        new CustomEvent<ComplexityLevel>(COMPLEXITY_PREFERENCE_EVENT, {
          detail: level,
        }),
      );
    },
    subscribe(listener: () => void) {
      const handleStorage = (event: StorageEvent) => {
        if (event.key !== COMPLEXITY_PREFERENCE_KEY && event.key !== LEGACY_KEY)
          return;
        if (readUrlPreference()) return;
        current = parseComplexityLevel(event.newValue) ?? fallback;
        notify();
      };
      const handlePreferenceChange = (event: Event) => {
        const detail = (event as CustomEvent<unknown>).detail;
        const next = parseComplexityLevel(
          typeof detail === "string" ? detail : null,
        );
        if (!next || next === current) return;
        current = next;
        notify();
      };
      const handlePopState = () => {
        const next = readActivePreference();
        if (next === current) return;
        current = next;
        notify();
      };

      listeners.add(listener);
      window.addEventListener("storage", handleStorage);
      window.addEventListener("popstate", handlePopState);
      window.addEventListener(
        COMPLEXITY_PREFERENCE_EVENT,
        handlePreferenceChange,
      );

      if (listeners.size === 1) {
        const previous = current;
        current = readActivePreference();
        if (current !== previous) queueMicrotask(notify);
      }

      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener(
          COMPLEXITY_PREFERENCE_EVENT,
          handlePreferenceChange,
        );
      };
    },
  };
}
