import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./ui.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "quiet";
}

export function Button({
  children,
  className,
  disabled,
  loading = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={[styles.button, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      type="button"
      {...props}
    >
      {loading ? <span aria-hidden className={styles.busyMark} /> : null}
      {children}
    </button>
  );
}
