import type { ReactNode } from "react";

import styles from "./ui.module.css";

interface ChipProps {
  children: ReactNode;
  disabled?: boolean;
  onSelectedChange: (selected: boolean) => void;
  selected: boolean;
}

export function Chip({
  children,
  disabled = false,
  onSelectedChange,
  selected,
}: ChipProps) {
  return (
    <button
      aria-pressed={selected}
      className={styles.chip}
      disabled={disabled}
      onClick={() => onSelectedChange(!selected)}
      type="button"
    >
      {children}
    </button>
  );
}
