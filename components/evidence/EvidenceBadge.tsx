import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock";
import { Prohibit } from "@phosphor-icons/react/dist/ssr/Prohibit";
import { Question } from "@phosphor-icons/react/dist/ssr/Question";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";

import type { EvidenceStatus } from "./evidence-view-model";
import styles from "./evidence.module.css";

const labels: Record<EvidenceStatus, string> = {
  published: "Published evidence",
  unreviewed: "Evidence review pending",
  missing: "Comparable evidence missing",
  restricted: "Observation access restricted",
  stale: "Evidence verification stale",
  disputed: "Credible evidence is disputed",
};

export function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  const Icon =
    status === "published"
      ? CheckCircle
      : status === "restricted"
        ? Prohibit
        : status === "stale"
          ? Clock
          : status === "unreviewed"
            ? Question
            : Warning;

  return (
    <span className={styles.badge} data-status={status}>
      <Icon aria-hidden size={17} />
      {labels[status]}
    </span>
  );
}
