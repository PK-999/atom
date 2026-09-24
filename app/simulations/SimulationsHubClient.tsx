"use client";
import { Activity, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import styles from "./SimulationsHub.module.css";
const Grid = dynamic(() =>
  import("@/features/simulator/GridSimulator").then((m) => m.GridSimulator),
);
const Fission = dynamic(() =>
  import("@/features/exhibits/FissionExhibit").then((m) => m.FissionExhibit),
);
const Decay = dynamic(() =>
  import("@/features/simulator/DecaySimulator").then((m) => m.DecaySimulator),
);
const Reactor = dynamic(() =>
  import("@/features/simulator/ReactorControlSimulator").then(
    (m) => m.ReactorControlSimulator,
  ),
);
const Atom = dynamic(() =>
  import("@/features/exhibits/AtomFuelExhibits").then((m) => m.AtomExhibit),
);
const Fuel = dynamic(() =>
  import("@/features/exhibits/AtomFuelExhibits").then((m) => m.FuelExhibit),
);
const tabs = [
  { id: "grid", label: "Annual Grid Balance" },
  { id: "fission", label: "Fission" },
  { id: "atom", label: "Inside the Atom" },
  { id: "fuel", label: "Fuel Assembly" },
  { id: "decay", label: "Radioactive Decay" },
  { id: "reactor", label: "Reactor Controls" },
] as const;
type Tab = (typeof tabs)[number]["id"];
export function SimulationsHubClient() {
  const [active, setActive] = useState<Tab>("grid");
  const [visited, setVisited] = useState<Tab[]>(["grid"]);
  const select = (id: Tab) => {
    setActive(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };
  return (
    <div className={styles.pageContainer}>
      <header className={styles.heroHeader}>
        <span className={styles.badge}>The hands-on collection</span>
        <h1 className={styles.pageTitle}>Nuclear & Energy Simulations</h1>
        <p className={styles.pageSubtitle}>
          Look inside an atom, follow a fission, or build an annual energy mix.
          Try a prediction, change one thing, and explore what happens.
        </p>
      </header>
      <div
        className={styles.tabsBar}
        role="tablist"
        aria-label="Select Simulation Tool"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`simulation-tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls={`simulation-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={`${styles.tabButton} ${active === tab.id ? styles.tabButtonActive : ""}`}
            onClick={() => select(tab.id)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % tabs.length
                  : event.key === "ArrowLeft"
                    ? (index + tabs.length - 1) % tabs.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? tabs.length - 1
                        : null;
              if (next === null) return;
              event.preventDefault();
              select(tabs[next].id);
              document
                .getElementById(`simulation-tab-${tabs[next].id}`)
                ?.focus();
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <Activity key={tab.id} mode={active === tab.id ? "visible" : "hidden"}>
          <section
            id={`simulation-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`simulation-tab-${tab.id}`}
            tabIndex={0}
            className={styles.tabPanel}
          >
            {visited.includes(tab.id) &&
              (tab.id === "grid" ? (
                <Grid embedded />
              ) : tab.id === "fission" ? (
                <Fission />
              ) : tab.id === "atom" ? (
                <Atom />
              ) : tab.id === "fuel" ? (
                <Fuel />
              ) : tab.id === "decay" ? (
                <Decay />
              ) : (
                <Reactor />
              ))}
          </section>
        </Activity>
      ))}
      <div className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>Keep exploring</h2>
        <div className={styles.relatedGrid}>
          {[
            { href: "/learn", label: "Find a learning path" },
            { href: "/reactors", label: "Explore reactor designs" },
            { href: "/radiation", label: "Understand radiation" },
            { href: "/compare", label: "Compare energy sources" },
          ].map((item) => (
            <Link
              className={styles.relatedCard}
              key={item.href}
              href={item.href}
            >
              {item.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
