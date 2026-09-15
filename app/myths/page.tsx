import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { MythViewer } from "./MythViewer";

export const metadata: Metadata = {
  title: "Nuclear Myth Busting | ATOM",
  description:
    "Fact-checking common claims about nuclear explosions, radioactive waste, radiation doses, casualties, and grid integration against peer-reviewed science.",
};

export default function MythsPage() {
  return (
    <AppShell>
      <MythViewer />
    </AppShell>
  );
}
