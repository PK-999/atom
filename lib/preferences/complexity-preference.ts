export type ComplexityLevel =
  "kid" | "simple" | "curious" | "technical" | "expert";

export const COMPLEXITY_PREFERENCE_KEY =
  "atom:preferences:v1:complexity" as const;
const COMPLEXITY_PREFERENCE_EVENT = "atom:complexity-preference-change";

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

  function readStoredPreference(): ComplexityLevel | null {
    try {
      return parseComplexityLevel(
        window.localStorage.getItem(COMPLEXITY_PREFERENCE_KEY),
      );
    } catch {
      // The in-memory preference remains authoritative when storage is blocked.
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
        if (event.key !== COMPLEXITY_PREFERENCE_KEY) return;
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

      if (!hydrated) {
        const previous = current;
        hydrated = true;
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
