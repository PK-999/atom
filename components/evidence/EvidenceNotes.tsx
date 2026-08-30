import { Info } from "@phosphor-icons/react/Info";
import type { ReactNode } from "react";

import styles from "./evidence.module.css";

function EvidenceNote({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <aside className={styles.note}>
      <Info aria-hidden size={19} />
      <div>
        <strong>{label}</strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}

export function ConfidenceNote({ children }: { children: ReactNode }) {
  return <EvidenceNote label="Uncertainty note">{children}</EvidenceNote>;
}

export function MethodologySummary({ children }: { children: ReactNode }) {
  return <EvidenceNote label="Methodology summary">{children}</EvidenceNote>;
}
