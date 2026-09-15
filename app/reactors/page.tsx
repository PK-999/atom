import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listReactorSystems } from "@/lib/reactor/reactor-model";
import { getFleetStats } from "@/lib/reactor/fleet-model";
import styles from "./ReactorsPage.module.css";

export const metadata: Metadata = {
  title: "Nuclear Reactor Explorer | ATOM",
  description:
    "Explore interactive engineering schematics of commercial nuclear reactor architectures: Pressurized Water Reactors (PWR), Boiling Water Reactors (BWR), and Heavy Water Reactors (PHWR/CANDU).",
};

export default function ReactorsPage() {
  const systems = listReactorSystems();
  const fleetStats = getFleetStats();

  return (
    <AppShell>
      <div className={styles.container}>
        {/* Global Fleet Map Hero Card */}
        <section className={styles.heroCard}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <span>🌍</span> Worldwide Nuclear Fleet
            </div>
            <h2 className={styles.heroTitle}>
              Interactive Global Reactor Map & Directory
            </h2>
            <p className={styles.heroDescription}>
              Explore {fleetStats.totalFacilities} major nuclear stations
              worldwide across {fleetStats.countriesCount} countries (
              {Math.round(fleetStats.totalCapacityMWe / 1000)} GWe total net
              capacity). Inspect operating status, reactor models, coordinates,
              age, and individual unit-by-unit lifecycles grounded in IAEA PRIS
              data.
            </p>
          </div>

          <div>
            <Link href="/globe" className={styles.heroCta}>
              <span>Open Global Fleet Map</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Commercial Reactor Architectures Section */}
        <header className={styles.header}>
          <div className={styles.headerBadge}>
            Engineering Schematics & Systems
          </div>
          <h1 className={styles.headerTitle}>
            Commercial Reactor Architectures
          </h1>
          <p className={styles.headerDescription}>
            Different reactor designs make distinct engineering trade-offs
            regarding coolant pressurization, neutron moderation, fuel
            enrichment, and thermodynamic cycles. Explore interactive schematics
            with component roles, fluid circuits, and operating parameters.
          </p>
        </header>

        <div className={styles.architectureGrid}>
          {systems.map((system) => (
            <article key={system.id} className={styles.architectureCard}>
              <div>
                <div className={styles.cardBadge}>
                  {system.type} Architecture
                </div>

                <h2 className={styles.cardTitle}>
                  <Link
                    href={`/reactors/${system.id}`}
                    className={styles.cardLink}
                  >
                    {system.name}
                  </Link>
                </h2>

                <p className={styles.cardSummary}>{system.summary}</p>

                <div className={styles.cardStats}>
                  <div>
                    <strong className={styles.cardStatsHighlight}>
                      Components:
                    </strong>{" "}
                    {system.components.length} parts modeled
                  </div>
                  <div>
                    <strong className={styles.cardStatsHighlight}>
                      Flow Loops:
                    </strong>{" "}
                    {system.flows.length} circuits
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href={`/reactors/${system.id}`}
                  className={styles.cardAction}
                >
                  Explore Interactive Schematic →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
