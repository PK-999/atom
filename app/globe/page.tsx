import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { GlobeViewer } from "@/features/globe/GlobeViewer";
import { listFacilities } from "@/lib/globe/facility-model";

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
  const facilities = listFacilities();
  const initialFacilityId = params?.facility;

  return (
    <div
      style={{
        maxWidth: "68rem",
        margin: "0 auto",
        padding: "1.5rem 1.5rem 6rem",
      }}
    >
      <GlobeViewer
        facilities={facilities}
        initialFacilityId={initialFacilityId}
      />
    </div>
  );
}

export default function GlobePage(props: GlobePageProps) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div
            style={{
              maxWidth: "68rem",
              margin: "0 auto",
              padding: "3rem 1.5rem",
            }}
          >
            <p style={{ color: "#64748b" }}>
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
