import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { EvidenceRecordPage } from "@/features/evidence/EvidenceRecordPage";
import { getPublicEvidenceRecord } from "@/lib/evidence/public-records";

interface SourcePageProps {
  params: Promise<{ sourceId: string }>;
}

export async function generateMetadata({
  params,
}: SourcePageProps): Promise<Metadata> {
  const { sourceId } = await params;
  const record = getPublicEvidenceRecord("source", sourceId);
  return {
    title: record
      ? `${record.title} — ATOM Evidence`
      : "Evidence unavailable — ATOM",
  };
}

export default async function EvidenceSourcePage({ params }: SourcePageProps) {
  const { sourceId } = await params;
  return (
    <AppShell>
      <EvidenceRecordPage
        kind="source"
        id={sourceId}
        record={getPublicEvidenceRecord("source", sourceId)}
      />
    </AppShell>
  );
}
