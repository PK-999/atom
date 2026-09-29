import type { EvidenceSnapshot } from "./local-repository";
import { PUBLISHED_EVIDENCE_SNAPSHOT } from "./published-evidence";
import type { DatasetVersion, EvidenceProvenance } from "./release-provenance";

export type PublicEvidenceRecord =
  | {
      kind: "source";
      id: string;
      title: string;
      publisher: string;
      sourceTier: string;
      publishedAt: string;
      accessedAt: string;
      url: string;
      license: { id: string; name: string; redistribution: "allowed" };
      conflictDisclosure: string;
      datasetVersion: string;
    }
  | {
      kind: "study";
      id: string;
      title: string;
      methodology: string;
      systemBoundary: string;
      period: { startYear: number; endYear: number };
      sourceIds: readonly string[];
      datasetVersion: string;
    }
  | {
      kind: "dataset";
      id: string;
      title: string;
      version: string;
      checksum: string;
      lastVerifiedAt: string;
      status: DatasetVersion["status"];
      publishedAt: string | undefined;
      sourceIds: readonly string[];
      studyIds: readonly string[];
      license: { id: string; name: string; redistribution: "allowed" };
      artifacts: readonly {
        sourceId: string;
        url: string;
        locator: string;
        sha256: string;
      }[];
    };

function publicVersionFor(
  provenance: EvidenceProvenance,
  entityType: "source" | "study" | "dataset",
  entityId: string,
) {
  const publication = provenance.publications.find(
    (record) =>
      record.entityType === entityType &&
      record.entityId === entityId &&
      record.status === "published",
  );
  if (!publication) return null;
  const version = provenance.versions.find(
    (candidate) =>
      candidate.id === publication.datasetVersion &&
      candidate.status === "published" &&
      candidate.dataset.license.redistribution === "allowed",
  );
  return version ?? null;
}

function isPublicSource(provenance: EvidenceProvenance, sourceId: string) {
  const source = provenance.sources.find((record) => record.id === sourceId);
  return Boolean(
    source &&
      source.license.redistribution === "allowed" &&
      publicVersionFor(provenance, "source", sourceId),
  );
}

export function getPublicEvidenceRecord(
  kind: "source" | "study" | "dataset",
  id: string,
  snapshot: EvidenceSnapshot = PUBLISHED_EVIDENCE_SNAPSHOT,
): PublicEvidenceRecord | null {
  const provenance = snapshot.provenance;
  if (!provenance) return null;

  if (kind === "source") {
    const source = provenance.sources.find((record) => record.id === id);
    const version = publicVersionFor(provenance, kind, id);
    if (!source || !version || source.license.redistribution !== "allowed") {
      return null;
    }
    return {
      kind,
      id: source.id,
      title: source.title,
      publisher: source.publisher,
      sourceTier: source.sourceTier,
      publishedAt: source.publishedAt,
      accessedAt: source.accessedAt,
      url: source.url,
      license: {
        id: source.license.id,
        name: source.license.name,
        redistribution: "allowed",
      },
      conflictDisclosure: source.conflictDisclosure,
      datasetVersion: version.id,
    };
  }

  if (kind === "study") {
    const study = provenance.studies.find((record) => record.id === id);
    const version = publicVersionFor(provenance, kind, id);
    if (
      !study ||
      !version ||
      !study.sourceIds.every((sourceId) => isPublicSource(provenance, sourceId))
    ) {
      return null;
    }
    return {
      kind,
      id: study.id,
      title: study.title,
      methodology: study.methodology,
      systemBoundary: study.systemBoundary,
      period: study.period,
      sourceIds: study.sourceIds,
      datasetVersion: version.id,
    };
  }

  const version = provenance.versions.find(
    (candidate) => candidate.dataset.id === id,
  );
  const publicVersion = version ? publicVersionFor(provenance, kind, id) : null;
  if (
    !version ||
    !publicVersion ||
    version.dataset.license.redistribution !== "allowed" ||
    !version.dataset.sourceIds.every((sourceId) =>
      isPublicSource(provenance, sourceId),
    ) ||
    !version.dataset.studyIds.every(
      (studyId) =>
        provenance.studies.some((study) => study.id === studyId) &&
        publicVersionFor(provenance, "study", studyId) !== null,
    )
  ) {
    return null;
  }
  return {
    kind,
    id: version.dataset.id,
    title: version.dataset.title,
    version: version.dataset.version,
    checksum: version.dataset.checksum,
    lastVerifiedAt: version.dataset.lastVerifiedAt,
    status: version.status,
    publishedAt: version.publishedAt,
    sourceIds: version.dataset.sourceIds,
    studyIds: version.dataset.studyIds,
    license: {
      id: version.dataset.license.id,
      name: version.dataset.license.name,
      redistribution: "allowed",
    },
    artifacts: version.artifacts.map((artifact) => ({ ...artifact })),
  };
}
