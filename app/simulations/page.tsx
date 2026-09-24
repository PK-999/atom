import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SimulationsHubClient } from "./SimulationsHubClient";

export const metadata: Metadata = {
  title: "Interactive Nuclear & Energy Simulators | ATOM",
  description:
    "Explore four interactive nuclear physics and energy engineering simulators: annual electricity balance, uranium-235 fission chain reactions, radioisotope half-life decay, and commercial reactor core control with emergency SCRAM.",
};

export default function SimulationsPage() {
  return (
    <AppShell>
      <SimulationsHubClient />
    </AppShell>
  );
}
