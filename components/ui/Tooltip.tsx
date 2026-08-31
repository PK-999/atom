"use client";

import { Question } from "@phosphor-icons/react/Question";
import { useId, useState } from "react";

import styles from "./ui.module.css";

interface TooltipProps {
  content: string;
  label: string;
}

export function Tooltip({ content, label }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className={styles.tooltip}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        type="button"
      >
        <Question aria-hidden size={18} />
      </button>
      {open ? (
        <span id={id} role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  );
}
