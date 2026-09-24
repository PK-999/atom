import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { GlobeViewer } from "@/features/globe/GlobeViewer";
import { listFleetAsFacilities } from "@/lib/reactor/fleet-model";

export const metadata: Metadata = {
  title: "Nuclear Facilities Globe & Directory | ATOM",
  description:
    "Explore worldwide commercial nuclear power plants with unit-level lifecycle history, IAEA PRIS operating data, and geospatial coordinates.",
};

interface GlobePageProps {
  searchParams?: Promise<{
    facility?: string;
  }>;
}

async function GlobeContent({ searchParams }: GlobePageProps) {
  const params = await searchParams;
  const facilities = listFleetAsFacilities();
  const initialFacilityId = params?.facility;

  return (
    <GlobeViewer
      facilities={facilities}
      initialFacilityId={initialFacilityId}
    />
  );
}

export default function GlobePage(props: GlobePageProps) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div style={{ padding: "3rem 0" }}>
            <p style={{ color: "var(--atom-text-muted)" }}>
              Loading nuclear facilities directory...
            </p>
          </div>
        }
      >
        <GlobeContent searchParams={props.searchParams} />
      </Suspense>
    </AppShell>
  );
}
