import type { Metadata } from "next";

import { ComparisonLab } from "@/features/comparison/ComparisonLab";
import { parseComparisonUrl } from "@/features/comparison/comparison-url";
import { fetchComparisonData } from "@/features/comparison/comparison-api";

export const metadata: Metadata = {
  title: "Energy Comparison Lab",
  description:
    "Compare electricity technologies while keeping the evidence behind every number within reach.",
};

export default async function ComparisonPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const state = parseComparisonUrl(params);
  const comparison = await fetchComparisonData(state);

  return <ComparisonLab comparison={comparison} initialState={state} />;
}
