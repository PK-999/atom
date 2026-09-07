"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Flask } from "@phosphor-icons/react/Flask";
import { Info } from "@phosphor-icons/react/Info";
import { X } from "@phosphor-icons/react/X";

import type { PreviewComparison, PreviewObservation } from "./comparison-types";
import styles from "./ComparisonLab.module.css";

interface EvidenceDialogProps {
  observation: PreviewObservation | null;
  comparison: PreviewComparison;
  displayLabel?: string;
  triggerLabel: string;
  appearance?: "primary" | "secondary" | "inline";
  kind?: "passport" | "challenge";
  disabled?: boolean;
}

export function EvidenceDialog({
  observation,
  comparison,
  displayLabel,
  triggerLabel,
  appearance = "secondary",
  kind = "passport",
  disabled = false,
}: EvidenceDialogProps) {
  const isPrimary = appearance === "primary";
  const isInline = appearance === "inline";
  const isChallenge = kind === "challenge";
  const isValue = Boolean(displayLabel);

  if (!observation || disabled) {
    return (
      <button
        aria-label={triggerLabel}
        className={
          isPrimary
            ? styles.primaryAction
            : isValue
              ? styles.valueEvidence
              : isInline
                ? styles.inlineEvidence
                : styles.secondaryAction
        }
        disabled
        style={{ opacity: 0.6, cursor: "not-allowed" }}
        type="button"
      >
        {displayLabel ? (
          <strong>{displayLabel}</strong>
        ) : (
          <span>{triggerLabel}</span>
        )}
      </button>
    );
  }

  const isReviewed = observation.evidenceStatus === "reviewed";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          aria-label={isInline || isValue ? triggerLabel : undefined}
          className={
            isValue
              ? styles.valueEvidence
              : isInline
                ? styles.inlineEvidence
                : isPrimary
                  ? styles.primaryAction
                  : styles.secondaryAction
          }
          data-chart-value={isValue ? true : undefined}
          type="button"
        >
          {displayLabel ? null : isPrimary ? (
            <Flask aria-hidden size={22} />
          ) : (
            <Info aria-hidden size={20} />
          )}
          {displayLabel ? (
            <strong>{displayLabel}</strong>
          ) : (
            <span className={isInline ? styles.srOnly : undefined}>
              {triggerLabel}
            </span>
          )}
          {isPrimary ? <ArrowRight aria-hidden size={19} /> : null}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.dialogOverlay} />
        <Dialog.Content className={styles.dialogContent}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>
                {isChallenge
                  ? isReviewed
                    ? "Challenge published record"
                    : "Challenge preview"
                  : isReviewed
                    ? "Data passport"
                    : "Data passport preview"}
              </p>
              <Dialog.Title className={styles.dialogTitle}>
                {isChallenge ? "Challenge this number" : "Why this number?"}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close evidence"
                className={styles.iconButton}
                type="button"
              >
                <X aria-hidden size={22} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className={styles.dialogDescription}>
            {isChallenge
              ? isReviewed
                ? `Submit a challenge or alternative evidence review for ${observation.technologyName}.`
                : `The challenge workflow will open after evidence review for ${observation.technologyName}. Until then, no correction can be submitted against an unpublished preview value.`
              : isReviewed
                ? "This passport exposes the verified scientific provenance, methodology, and system boundary behind the displayed value."
                : "This passport shows the fields ATOM will expose after scientific and editorial review."}
          </Dialog.Description>
          <dl className={styles.passportGrid}>
            <div>
              <dt>Technology</dt>
              <dd>{observation.technologyName}</dd>
            </div>
            <div>
              <dt>Representative value</dt>
              <dd>
                {observation.typicalValue} {comparison.unit}
              </dd>
            </div>
            <div>
              <dt>Geography</dt>
              <dd>{comparison.geography}</dd>
            </div>
            <div>
              <dt>Publication status</dt>
              <dd>{isReviewed ? "Published evidence" : "Not yet published"}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>
                {observation.source?.name ??
                  (isReviewed
                    ? "IPCC AR5 WGIII Annex III"
                    : "Evidence review pending")}
              </dd>
            </div>
            <div>
              <dt>Method and system boundary</dt>
              <dd>
                {observation.methodology ??
                  (isReviewed
                    ? "Harmonized lifecycle assessment synthesis"
                    : "Not available in this interface preview")}
              </dd>
            </div>
            <div>
              <dt>Dataset version</dt>
              <dd>
                {observation.datasetVersionId ??
                  (isReviewed ? "ipcc-ar5-v1" : "Preview draft")}
              </dd>
            </div>
            <div>
              <dt>Uncertainty / Range</dt>
              <dd>
                {observation.range
                  ? `${observation.range.min} – ${observation.range.max} ${comparison.unit} (${observation.range.semantics})`
                  : (observation.uncertainty ??
                    (isReviewed
                      ? "Harmonized distribution across literature"
                      : "Review pending"))}
              </dd>
            </div>
          </dl>
          <div className={styles.dialogNotice}>
            <Info aria-hidden size={20} />
            <p>
              {isReviewed
                ? "This observation has completed editorial, scientific, and licensing review."
                : "Do not cite these preview values. The published Lab will link every quantitative claim to inspectable evidence."}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ComparisonEvidenceActionsProps {
  observation: PreviewObservation | null;
  comparison: PreviewComparison;
}

export function ComparisonEvidenceActions({
  observation,
  comparison,
}: ComparisonEvidenceActionsProps) {
  const isReviewed = observation?.evidenceStatus === "reviewed";

  return (
    <section className={styles.actions} aria-label="Evidence actions">
      <EvidenceDialog
        appearance="primary"
        comparison={comparison}
        observation={observation}
        triggerLabel="Explore the evidence"
        disabled={!observation}
      />
      <EvidenceDialog
        comparison={comparison}
        kind="challenge"
        observation={observation}
        triggerLabel="Challenge this number"
        disabled={!observation}
      />
      <div className={styles.evidenceStatus} role="status">
        <Info aria-hidden size={18} />
        <span>
          {isReviewed ? "Published evidence" : "Evidence review pending"}
        </span>
      </div>
    </section>
  );
}
