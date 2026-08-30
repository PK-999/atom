import { OverlayPanel } from "@/components/ui/OverlayPanel";

import type { EvidenceViewModel } from "./evidence-view-model";
import styles from "./evidence.module.css";

export function ChallengeNumber({
  evidence,
  trigger,
}: {
  evidence: EvidenceViewModel;
  trigger: string;
}) {
  return (
    <OverlayPanel
      description="Compare the representative value, credible alternatives, and the reasons estimates differ."
      title="Challenge this number"
      trigger={trigger}
      variant="drawer"
    >
      <section className={styles.challengeSection}>
        <p className={styles.eyebrow}>Representative value</p>
        <h3>{evidence.value}</h3>
        <p>
          {evidence.representativeKind ??
            "Representative rule is not available — review required."}
        </p>
      </section>
      <section className={styles.challengeSection}>
        <h3>Alternative evidence</h3>
        {evidence.alternatives.length > 0 ? (
          <ul className={styles.alternativeList}>
            {evidence.alternatives.map((alternative) => (
              <li key={`${alternative.label}-${alternative.value}`}>
                <strong>{alternative.label}</strong>
                <span>{alternative.value}</span>
                <p>{alternative.difference}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviewed alternative evidence is available.</p>
        )}
      </section>
      <section className={styles.challengeSection}>
        <h3>Why values differ</h3>
        {evidence.differenceReasons.length > 0 ? (
          <ul>
            {evidence.differenceReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        ) : (
          <p>Difference analysis has not been reviewed.</p>
        )}
      </section>
      <section className={styles.challengeSection}>
        <h3>Known limitations</h3>
        <ul>
          {evidence.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>
    </OverlayPanel>
  );
}
