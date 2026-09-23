import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AskAtom } from "@/features/ask/AskAtom";

export const metadata: Metadata = {
  title: "Ask ATOM — Evidence-Grounded Nuclear Q&A | ATOM",
  description:
    "Ask direct questions about nuclear energy, carbon intensity, safety statistics, radiation doses, waste storage, and India's closed fuel cycle, grounded in peer-reviewed scientific literature.",
};

export default function AskPage() {
  return (
    <AppShell>
      <AskAtom />
    </AppShell>
  );
}
