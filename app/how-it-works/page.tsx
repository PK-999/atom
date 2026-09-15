import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { HowItWorksViewer } from "./HowItWorksViewer";

export const metadata: Metadata = {
  title: "How Nuclear Energy Works | ATOM",
  description:
    "An interactive step-by-step walkthrough of nuclear physics, atomic binding energy, induced fission, chain-reaction criticality, and electricity generation.",
};

export default function HowItWorksPage() {
  return (
    <AppShell>
      <HowItWorksViewer />
    </AppShell>
  );
}
