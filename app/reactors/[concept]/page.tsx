import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ReactorExplorer } from "@/features/reactor/ReactorExplorer";
import {
  getReactorSystem,
  listReactorSystems,
} from "@/lib/reactor/reactor-model";

import styles from "../ReactorsPage.module.css";

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
      <div className={styles.conceptContainer}>
        <nav aria-label="Breadcrumbs" className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/reactors" className={styles.breadcrumbLink}>
            Reactors
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{system.type}</span>
        </nav>

        <ReactorExplorer system={system} />
      </div>
    </AppShell>
  );
}
