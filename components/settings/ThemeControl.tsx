"use client";

import { Moon } from "@phosphor-icons/react/Moon";
import { Sun } from "@phosphor-icons/react/Sun";
import { useMemo, useSyncExternalStore } from "react";

import {
  createThemePreferenceStore,
  type ThemeMode,
} from "@/lib/preferences/theme-preference";

import styles from "./ThemeControl.module.css";

const options: ReadonlyArray<{
  value: Exclude<ThemeMode, "system">;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
];

export function ThemeControl() {
  const store = useMemo(() => createThemePreferenceStore(), []);
  const mode = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  const activeMode =
    mode === "system"
      ? typeof document !== "undefined" &&
        document.documentElement.dataset.theme === "light"
        ? "light"
        : "dark"
      : mode;

  return (
    <div aria-label="Theme" className={styles.control} role="group">
      {options.map(({ value, label, Icon }) => (
        <button
          aria-label={label}
          aria-pressed={activeMode === value}
          key={value}
          onClick={() => store.set(value)}
          title={label}
          type="button"
        >
          <Icon aria-hidden size={17} />
        </button>
      ))}
    </div>
  );
}
