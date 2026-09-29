import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { SimulationsHubClient } from "./SimulationsHubClient";

export const metadata: Metadata = {
  title: "Interactive Nuclear & Energy Simulators | ATOM",
  description:
    "Explore six interactive nuclear physics and energy systems experiments: fission, atoms, fuel, radioactive decay, reactor controls, and annual grid balance.",
};

interface SimulationsPageProps {
  searchParams: Promise<{ experiment?: string }>;
}

export default async function SimulationsPage({
  searchParams,
}: SimulationsPageProps) {
  const { experiment } = await searchParams;
  return (
    <AppShell>
      <SimulationsHubClient initialExperiment={experiment} />
    </AppShell>
  );
}
