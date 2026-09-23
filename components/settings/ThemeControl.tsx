"use client";

import { Moon } from "@phosphor-icons/react/Moon";
import { Monitor } from "@phosphor-icons/react/Monitor";
import { Sun } from "@phosphor-icons/react/Sun";
import { useSyncExternalStore } from "react";

import {
  themePreferenceStore,
  type ThemeMode,
} from "@/lib/preferences/theme-preference";

import styles from "./ThemeControl.module.css";

const options: ReadonlyArray<{
  value: ThemeMode;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
  { value: "system", label: "System theme", Icon: Monitor },
];

export function ThemeControl() {
  const store = themePreferenceStore;
  const mode = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );

  return (
    <div aria-label="Theme" className={styles.control} role="group">
      {options.map(({ value, label, Icon }) => (
        <button
          aria-label={label}
          aria-pressed={mode === value}
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
