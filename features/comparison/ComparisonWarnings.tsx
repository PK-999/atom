"use client";

import { Warning } from "@phosphor-icons/react/Warning";
import styles from "./ComparisonLab.module.css";

interface ComparisonWarningsProps {
  warnings?: readonly string[];
}

export function ComparisonWarnings({ warnings }: ComparisonWarningsProps) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.warningBanner}
      role="region"
      aria-label="Comparison notices and caveats"
    >
      <div className={styles.warningIcon}>
        <Warning size={20} weight="fill" aria-hidden="true" />
      </div>
      <div className={styles.warningContent}>
        {warnings.length === 1 ? (
          <p className={styles.warningText}>{warnings[0]}</p>
        ) : (
          <ul className={styles.warningList}>
            {warnings.map((warning, index) => (
              <li key={index} className={styles.warningText}>
                {warning}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
