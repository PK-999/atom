"use client";

import { Question } from "@phosphor-icons/react/Question";
import { useEffect, useId, useRef, useState } from "react";

import styles from "./ui.module.css";

interface TooltipProps {
  content: string;
  label: string;
}

export function Tooltip({ content, label }: TooltipProps) {
  const [dismissed, setDismissed] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLSpanElement>(null);
  const open = !dismissed && (focused || hovered || pinned);

  useEffect(() => {
    if (!open) return;

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDismissed(true);
      setPinned(false);
    };
    document.addEventListener("keydown", dismissOnEscape);
    return () => document.removeEventListener("keydown", dismissOnEscape);
  }, [open]);

  useEffect(() => {
    if (!pinned) return;

    const dismissOutside = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setDismissed(true);
      setPinned(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [pinned]);

  return (
    <span
      className={styles.tooltip}
      onMouseEnter={() => {
        setDismissed(false);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      ref={rootRef}
    >
      <button
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          setDismissed(pinned);
          setPinned(!pinned);
        }}
        onBlur={() => {
          setFocused(false);
          setPinned(false);
        }}
        onFocus={() => {
          setDismissed(false);
          setFocused(true);
        }}
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
