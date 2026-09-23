import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { GridSimulator } from "@/features/simulator/GridSimulator";

export const metadata: Metadata = {
  title: "Annual Grid Learning Simulator | ATOM",
  description:
    "Interactive annual electricity grid simulation tool. Calculate energy coverage, surplus, and shortfall across nuclear, solar, wind, and hydro, and explore why annual energy balance does not equate to hourly real-time reliability.",
};

export default function GridPage() {
  return (
    <AppShell>
      <GridSimulator />
    </AppShell>
  );
}
