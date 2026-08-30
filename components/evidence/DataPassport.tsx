import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut";

import { OverlayPanel } from "@/components/ui/OverlayPanel";

import { EvidenceBadge } from "./EvidenceBadge";
import type { EvidenceViewModel } from "./evidence-view-model";
import styles from "./evidence.module.css";

const unavailable = "Not available — review required";

function PassportField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value ?? unavailable}</dd>
    </div>
  );
}

export function DataPassport({
  evidence,
  trigger,
}: {
  evidence: EvidenceViewModel;
  trigger: string;
}) {
  return (
    <OverlayPanel
      description="Inspect the provenance and review status behind the displayed value."
      title="Why this number?"
      trigger={trigger}
      variant="drawer"
    >
      <EvidenceBadge status={evidence.status} />
      <dl className={styles.passportGrid}>
        <PassportField label="Metric" value={evidence.metric} />
        <PassportField label="Value" value={evidence.value} />
        <PassportField label="Unit" value={evidence.unit} />
        <PassportField label="Technology" value={evidence.technology} />
        <PassportField label="Geography" value={evidence.geography} />
        <PassportField label="Year or period" value={evidence.period} />
        <PassportField label="Source" value={evidence.source?.title ?? null} />
        <PassportField
          label="Publication or version"
          value={evidence.publicationVersion}
        />
        <PassportField label="Method" value={evidence.method} />
        <PassportField
          label="System boundary"
          value={evidence.systemBoundary}
        />
        <PassportField label="Range" value={evidence.range} />
        <PassportField
          label="Representative rule"
          value={evidence.representativeKind}
        />
        <PassportField label="Uncertainty" value={evidence.uncertainty} />
        <PassportField label="Last verified" value={evidence.lastVerified} />
        <PassportField
          label="Transformation"
          value={evidence.transformation}
        />
      </dl>
      {evidence.source?.url ? (
        <a
          className={styles.sourceAction}
          href={evidence.source.url}
          rel="noreferrer"
          target="_blank"
        >
          View source
          <ArrowSquareOut aria-hidden size={18} />
        </a>
      ) : (
        <p className={styles.unavailableAction}>
          Source access will appear only after review and licensing checks.
        </p>
      )}
    </OverlayPanel>
  );
}
