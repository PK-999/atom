import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";

import { DesignSystemPlayground } from "./DesignSystemPlayground";

export const metadata: Metadata = {
  title: "Component playground",
  description: "Internal verification surface for ATOM's shared design system.",
  robots: { follow: false, index: false },
};

export default function DesignSystemPage() {
  return (
    <AppShell>
      <DesignSystemPlayground />
    </AppShell>
  );
}
