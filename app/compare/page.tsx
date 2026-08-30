import type { Metadata } from "next";

import { ComparisonLab } from "@/features/comparison/ComparisonLab";
import { previewComparison } from "@/features/comparison/preview-data";

export const metadata: Metadata = {
  title: "Energy Comparison Lab",
  description:
    "Compare electricity technologies while keeping the evidence behind every number within reach.",
};

export default function ComparisonPage() {
  return <ComparisonLab comparison={previewComparison} />;
}
