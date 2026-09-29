import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { EvidenceRecordPage } from "@/features/evidence/EvidenceRecordPage";
import { getPublicEvidenceRecord } from "@/lib/evidence/public-records";

interface DatasetPageProps {
  params: Promise<{ datasetVersionId: string }>;
}

export async function generateMetadata({
  params,
}: DatasetPageProps): Promise<Metadata> {
  const { datasetVersionId } = await params;
  const record = getPublicEvidenceRecord("dataset", datasetVersionId);
  return {
    title: record
      ? `${record.title} — ATOM Evidence`
      : "Evidence unavailable — ATOM",
  };
}

export default async function EvidenceDatasetPage({
  params,
}: DatasetPageProps) {
  const { datasetVersionId } = await params;
  return (
    <AppShell>
      <EvidenceRecordPage
        kind="dataset"
        id={datasetVersionId}
        record={getPublicEvidenceRecord("dataset", datasetVersionId)}
      />
    </AppShell>
  );
}
