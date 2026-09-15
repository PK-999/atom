import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { IncidentViewer } from "@/features/incidents/IncidentViewer";

export const metadata: Metadata = {
  title: "Nuclear Incidents & FAQs | ATOM",
  description:
    "Evidence-first technical post-mortems of Chernobyl, Fukushima, Three Mile Island, and Kyshtym. Inspect empirical radiological releases, health statistics, and engineering safety transformations.",
};

export default function IncidentsPage() {
  return (
    <AppShell>
      <IncidentViewer />
    </AppShell>
  );
}
