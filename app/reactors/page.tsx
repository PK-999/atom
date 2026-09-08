import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listReactorSystems } from "@/lib/reactor/reactor-model";

export const metadata: Metadata = {
  title: "Nuclear Reactor Explorer | ATOM",
  description:
    "Explore interactive engineering schematics of commercial nuclear reactor architectures: Pressurized Water Reactors (PWR), Boiling Water Reactors (BWR), and Heavy Water Reactors (PHWR/CANDU).",
};

export default function ReactorsPage() {
  const systems = listReactorSystems();

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "#e0f2fe",
              color: "#0369a1",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "0.75rem",
            }}
          >
            Engineering Schematics & Systems
          </div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "0.75rem",
              color: "#0f172a",
            }}
          >
            Commercial Reactor Architectures
          </h1>
          <p
            style={{
              color: "#475569",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              maxWidth: "46rem",
            }}
          >
            Different reactor designs make distinct engineering trade-offs
            regarding coolant pressurization, neutron moderation, fuel
            enrichment, and thermodynamic cycles. Explore interactive schematics
            with component roles, fluid circuits, and operating parameters.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {systems.map((system) => (
            <article
              key={system.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-block",
                    background: "#f1f5f9",
                    color: "#475569",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    marginBottom: "0.75rem",
                  }}
                >
                  {system.type} Architecture
                </div>

                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    lineHeight: 1.35,
                    marginBottom: "0.75rem",
                    color: "#0f172a",
                  }}
                >
                  <Link
                    href={`/reactors/${system.id}`}
                    style={{
                      color: "#0f172a",
                      textDecoration: "none",
                    }}
                  >
                    {system.name}
                  </Link>
                </h2>

                <p
                  style={{
                    color: "#475569",
                    fontSize: "0.95rem",
                    lineHeight: 1.55,
                    marginBottom: "1.25rem",
                  }}
                >
                  {system.summary}
                </p>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div>
                    <strong>Components:</strong> {system.components.length}{" "}
                    parts modeled
                  </div>
                  <div>
                    <strong>Flow Loops:</strong> {system.flows.length} circuits
                  </div>
                </div>
              </div>

              <div>
                <Link
                  href={`/reactors/${system.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#0284c7",
                    textDecoration: "none",
                  }}
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
