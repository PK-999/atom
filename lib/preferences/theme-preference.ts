export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<ThemeMode, "system">;

export const THEME_PREFERENCE_KEY = "atom:preferences:v1:theme" as const;
const THEME_PREFERENCE_EVENT = "atom:theme-preference-change";
const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function parseThemeMode(value: string | null): ThemeMode | null {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : null;
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode !== "system") return mode;
  return typeof window.matchMedia === "function" &&
    window.matchMedia(DARK_MEDIA_QUERY).matches
    ? "dark"
    : "light";
}

export function createThemePreferenceStore() {
  let current: ThemeMode = "system";
  let resolved: ResolvedTheme = "light";
  let hydrated = false;
  const listeners = new Set<() => void>();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  function apply(mode: ThemeMode) {
    resolved = resolveTheme(mode);
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }

  function readStored(): ThemeMode {
    try {
      return (
        parseThemeMode(window.localStorage.getItem(THEME_PREFERENCE_KEY)) ??
        "system"
      );
    } catch {
      return "system";
    }
  }

  return {
    getServerSnapshot: (): ThemeMode => "system",
    getResolvedServerSnapshot: (): ResolvedTheme => "light",
    getSnapshot: () => current,
    getResolvedSnapshot: () => resolved,
    set(mode: ThemeMode) {
      current = mode;
      apply(mode);
      notify();

      try {
        window.localStorage.setItem(THEME_PREFERENCE_KEY, mode);
      } catch {
        // Theme persistence is best-effort and never blocks the control.
      }

      window.dispatchEvent(
        new CustomEvent<ThemeMode>(THEME_PREFERENCE_EVENT, { detail: mode }),
      );
    },
    subscribe(listener: () => void) {
      const media =
        typeof window.matchMedia === "function"
          ? window.matchMedia(DARK_MEDIA_QUERY)
          : null;
      const handleSystemChange = () => {
        if (current === "system") {
          apply(current);
          notify();
        }
      };
      const handleStorage = (event: StorageEvent) => {
        if (event.key !== THEME_PREFERENCE_KEY) return;
        current = parseThemeMode(event.newValue) ?? "system";
        apply(current);
        notify();
      };
      const handlePreferenceChange = (event: Event) => {
        const detail = (event as CustomEvent<unknown>).detail;
        const next = parseThemeMode(typeof detail === "string" ? detail : null);
        if (!next || next === current) return;
        current = next;
        apply(current);
        notify();
      };

      listeners.add(listener);
      media?.addEventListener("change", handleSystemChange);
      window.addEventListener("storage", handleStorage);
      window.addEventListener(THEME_PREFERENCE_EVENT, handlePreferenceChange);

      if (!hydrated) {
        const previous = current;
        hydrated = true;
        current = readStored();
        apply(current);
        if (current !== previous) queueMicrotask(notify);
      }

      return () => {
        listeners.delete(listener);
        media?.removeEventListener("change", handleSystemChange);
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(
          THEME_PREFERENCE_EVENT,
          handlePreferenceChange,
        );
      };
    },
  };
}
