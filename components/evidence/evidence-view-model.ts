export type EvidenceStatus =
  | "published"
  | "unreviewed"
  | "missing"
  | "restricted"
  | "stale"
  | "disputed";

export interface EvidenceSourceViewModel {
  title: string;
  url?: string;
}

export interface AlternativeEvidenceViewModel {
  difference: string;
  label: string;
  value: string;
}

export interface EvidenceViewModel {
  alternatives: ReadonlyArray<AlternativeEvidenceViewModel>;
  differenceReasons: ReadonlyArray<string>;
  geography: string;
  lastVerified: string | null;
  limitations: ReadonlyArray<string>;
  method: string | null;
  metric: string;
  period: string | null;
  publicationVersion: string | null;
  range: string | null;
  representativeKind: string | null;
  source: EvidenceSourceViewModel | null;
  status: EvidenceStatus;
  systemBoundary: string | null;
  technology: string;
  transformation: string | null;
  uncertainty: string | null;
  unit: string;
  value: string;
}
