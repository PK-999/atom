import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { EvidenceRecordPage } from "@/features/evidence/EvidenceRecordPage";
import { getPublicEvidenceRecord } from "@/lib/evidence/public-records";

interface StudyPageProps {
  params: Promise<{ studyId: string }>;
}

export async function generateMetadata({
  params,
}: StudyPageProps): Promise<Metadata> {
  const { studyId } = await params;
  const record = getPublicEvidenceRecord("study", studyId);
  return {
    title: record
      ? `${record.title} — ATOM Evidence`
      : "Evidence unavailable — ATOM",
  };
}

export default async function EvidenceStudyPage({ params }: StudyPageProps) {
  const { studyId } = await params;
  return (
    <AppShell>
      <EvidenceRecordPage
        kind="study"
        id={studyId}
        record={getPublicEvidenceRecord("study", studyId)}
      />
    </AppShell>
  );
}
