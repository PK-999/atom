import Link from "next/link";

import type { PublicEvidenceRecord } from "@/lib/evidence/public-records";

import styles from "./EvidenceRecordPage.module.css";

const kindLabels = {
  source: "Source record",
  study: "Study record",
  dataset: "Dataset version",
} as const;

export function EvidenceRecordPage({
  kind,
  id,
  record,
}: {
  kind: PublicEvidenceRecord["kind"];
  id: string;
  record: PublicEvidenceRecord | null;
}) {
  if (!record) {
    return (
      <div className={styles.page}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/evidence">Evidence</Link>
          <span aria-hidden="true">/</span>
          <span>{id}</span>
        </nav>
        <div className={styles.notice} role="status">
          <h1>Evidence is not currently available</h1>
          <p>
            ATOM does not have a published, reusable {kind} record for “{id}”.
            Draft, restricted, withdrawn, and unreviewed records stay out of
            public result pages.
          </p>
          <Link href="/evidence">Return to the Evidence Directory →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/evidence">Evidence</Link>
        <span aria-hidden="true">/</span>
        <span>{kindLabels[record.kind]}</span>
        <span aria-hidden="true">/</span>
        <span>{record.id}</span>
      </nav>

      <header className={styles.header}>
        <span className={styles.eyebrow}>{kindLabels[record.kind]}</span>
        <h1 className={styles.title}>
          {record.kind === "source" || record.kind === "study"
            ? record.title
            : record.title}
        </h1>
        <p className={styles.lede}>
          Public metadata for the exact record used by an ATOM evidence release.
          Reviewer identities and restricted artifacts remain private.
        </p>
      </header>

      {record.kind === "source" ? (
        <>
          <div className={styles.grid}>
            <Meta label="Publisher" value={record.publisher} />
            <Meta label="Source tier" value={record.sourceTier} />
            <Meta label="Published" value={record.publishedAt} />
            <Meta label="Accessed" value={record.accessedAt} />
            <Meta label="Dataset version" value={record.datasetVersion} />
            <Meta label="Licence" value={record.license.name} />
          </div>
          <p className={styles.lede}>{record.conflictDisclosure}</p>
          <a
            className={styles.link}
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the primary source ↗
          </a>
        </>
      ) : record.kind === "study" ? (
        <>
          <div className={styles.grid}>
            <Meta
              label="Period"
              value={`${record.period.startYear}–${record.period.endYear}`}
            />
            <Meta label="Dataset version" value={record.datasetVersion} />
            <Meta label="System boundary" value={record.systemBoundary} />
          </div>
          <div className={styles.card}>
            <div className={styles.label}>Methodology</div>
            <p className={styles.value}>{record.methodology}</p>
          </div>
          <RecordLinks kind="source" ids={record.sourceIds} />
        </>
      ) : (
        <>
          <div className={styles.grid}>
            <Meta label="Version" value={record.version} />
            <Meta label="Last verified" value={record.lastVerifiedAt} />
            <Meta label="Status" value={record.status} />
            <Meta label="Licence" value={record.license.name} />
            <Meta label="Checksum" value={record.checksum} />
          </div>
          <RecordLinks kind="source" ids={record.sourceIds} />
          <RecordLinks kind="study" ids={record.studyIds} />
          <section className={styles.card} aria-labelledby="artifact-heading">
            <div id="artifact-heading" className={styles.label}>
              Artifact locators
            </div>
            <ul className={styles.list}>
              {record.artifacts.map((artifact) => (
                <li key={`${artifact.sourceId}-${artifact.sha256}`}>
                  {artifact.locator} · {artifact.sha256}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.label}>{label}</div>
      <p className={styles.value}>{value}</p>
    </div>
  );
}

function RecordLinks({
  kind,
  ids,
}: {
  kind: "source" | "study";
  ids: readonly string[];
}) {
  return (
    <section className={styles.card} aria-label={`Related ${kind} records`}>
      <div className={styles.label}>Related {kind} records</div>
      <ul className={styles.list}>
        {ids.map((id) => (
          <li key={id}>
            <Link href={`/evidence/${kind}s/${id}`}>{id}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
