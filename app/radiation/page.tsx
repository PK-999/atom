import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { DoseExplorer } from "@/features/radiation/DoseExplorer";

export const metadata: Metadata = {
  title: "Radiation Dose Explorer",
  description:
    "Explore and compare radiation doses across everyday activities, medical imaging, occupational standards, and acute thresholds on a verified logarithmic scale.",
};

export default function RadiationPage() {
  return (
    <AppShell>
      <DoseExplorer />
    </AppShell>
  );
}
