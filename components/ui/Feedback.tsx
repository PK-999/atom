import type { ReactNode } from "react";

import styles from "./ui.module.css";

export function Skeleton({ label }: { label: string }) {
  return (
    <div aria-label={label} className={styles.skeleton} role="status">
      <span className={styles.srOnly}>{label}</span>
      <span aria-hidden />
      <span aria-hidden />
      <span aria-hidden />
    </div>
  );
}

interface StatePanelProps {
  action?: ReactNode;
  message: string;
  title: string;
  tone: "empty" | "missing" | "mismatch" | "stale" | "error" | "success";
}

export function StatePanel({ action, message, title, tone }: StatePanelProps) {
  return (
    <section className={styles.statePanel} data-tone={tone} role="status">
      <p className={styles.stateTone}>{tone}</p>
      <h3>{title}</h3>
      <p>{message}</p>
      {action ? <div className={styles.stateAction}>{action}</div> : null}
    </section>
  );
}
