import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { NationalProfile } from "@/features/national/NationalProfile";
import { getIndiaProfile } from "@/lib/national/national-model";

export const metadata: Metadata = {
  title: "India Nuclear & Energy Profile | ATOM",
  description:
    "Evidence-based analysis of India's electricity mix, installed capacity vs actual generation, commercial reactor fleet, and Homi Bhabha's closed three-stage thorium fuel cycle programme.",
};

export default function IndiaPage() {
  const profile = getIndiaProfile();

  return (
    <AppShell>
      <main id="main-content">
        <NationalProfile profile={profile} />
      </main>
    </AppShell>
  );
}
