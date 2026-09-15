import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { ExploreHub } from "./ExploreHub";

export const metadata: Metadata = {
  title: "Explore Hub | ATOM",
  description:
    "Explore interactive educational pathways across nuclear physics, reactor engineering, historical incidents, myth busting, grid balance, and evidence comparisons.",
};

export default function ExplorePage() {
  return (
    <AppShell>
      <ExploreHub />
    </AppShell>
  );
}
