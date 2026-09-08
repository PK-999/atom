import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ReactorExplorer } from "@/features/reactor/ReactorExplorer";
import {
  getReactorSystem,
  listReactorSystems,
} from "@/lib/reactor/reactor-model";

interface ReactorConceptPageProps {
  params: Promise<{
    concept: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const systems = listReactorSystems();
  return systems.map((s) => ({
    concept: s.id,
  }));
}

export async function generateMetadata({
  params,
}: ReactorConceptPageProps): Promise<Metadata> {
  const { concept } = await params;
  const system = getReactorSystem(concept);
  if (!system) {
    return {
      title: "Reactor Architecture Not Found | ATOM",
    };
  }

  return {
    title: `${system.name} Schematic | ATOM Reactor Explorer`,
    description: system.summary,
  };
}

export default async function ReactorConceptPage({
  params,
}: ReactorConceptPageProps) {
  const { concept } = await params;
  const system = getReactorSystem(concept);

  if (!system) {
    notFound();
  }

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "68rem",
          margin: "0 auto",
          padding: "1.5rem 1.5rem 6rem",
        }}
      >
        <nav
          aria-label="Breadcrumbs"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "#64748b",
            marginBottom: "1.5rem",
          }}
        >
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link
            href="/reactors"
            style={{ color: "#64748b", textDecoration: "none" }}
          >
            Reactors
          </Link>
          <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: 500 }}>
            {system.type}
          </span>
        </nav>

        <ReactorExplorer system={system} />
      </div>
    </AppShell>
  );
}
