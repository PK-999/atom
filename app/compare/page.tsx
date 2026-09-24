import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { ComparisonLab } from "@/features/comparison/ComparisonLab";
import { parseComparisonState } from "@/features/comparison/comparison-url";
import { fetchComparisonData } from "@/features/comparison/comparison-api";

export const metadata: Metadata = {
  title: "Energy Comparison Lab | ATOM",
  description:
    "Compare electricity technologies while keeping the evidence behind every number within reach.",
};

export default async function ComparisonPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const notices: string[] = [];
  const state = parseComparisonState(params, undefined, {
    onWarning: (warning) => notices.push(warning.message),
  });
  const comparison = await fetchComparisonData(state);
  comparison.warnings = [...notices, ...(comparison.warnings ?? [])];

  return (
    <AppShell>
      <ComparisonLab comparison={comparison} initialState={state} />
    </AppShell>
  );
}
