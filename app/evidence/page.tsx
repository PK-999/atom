import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Evidence Directory",
  description:
    "Explore the datasets, sources, methodological baselines, and peer-reviewed studies backing ATOM.",
};

export default function EvidenceDirectoryPage() {
  return (
    <AppShell>
      <div
        style={{
          maxWidth: "54rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        <header
          style={{
            marginBottom: "2.5rem",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Evidence Directory
          </h1>
          <p
            style={{
              color: "var(--atom-text-secondary)",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Every quantitative claim in ATOM is backed by an inspectable
            scientific provenance chain, peer-reviewed literature, or
            authoritative international agency reports.
          </p>
        </header>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Evidence Policies & Ingestion Architecture
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 18rem), 1fr))",
              gap: "1.25rem",
            }}
          >
            <Link
              href="/methodology"
              style={{
                display: "block",
                padding: "1.5rem",
                backgroundColor: "var(--atom-surface-panel)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--atom-energy-nuclear)",
                }}
              >
                Methodology & Verification Gates →
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--atom-text-secondary)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Learn how ATOM enforces 8 quality gates, checksum verification,
                system boundary matching, and separate reviewer attributions.
              </p>
            </Link>

            <Link
              href="/compare"
              style={{
                display: "block",
                padding: "1.5rem",
                backgroundColor: "var(--atom-surface-panel)",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                textDecoration: "none",
                color: "inherit",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  color: "var(--atom-energy-nuclear)",
                }}
              >
                Comparison Lab V1 →
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--atom-text-secondary)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Inspect normalized representative values, empirical ranges, and
                canonical source citations across 34 electricity metrics.
              </p>
            </Link>
          </div>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Published Canonical Sources
          </h2>
          <ul
            style={{
              color: "var(--atom-text-secondary)",
              lineHeight: 1.8,
              paddingLeft: "1.25rem",
            }}
          >
            <li>
              <strong>IPCC (2014, 2022):</strong> Working Group III (Mitigation
              of Climate Change) lifecycle emissions, system boundaries, and
              land-use metrics.
            </li>
            <li>
              <strong>UNECE (2021):</strong> Life Cycle Assessment of
              Electricity Generation Options (carbon footprint, water usage,
              mineral requirements).
            </li>
            <li>
              <strong>
                Our World in Data (Markandya & Wilkinson, 2007; Sovacool et al.,
                2016):
              </strong>{" "}
              Death rates from accidents and air pollution per TWh of
              electricity.
            </li>
            <li>
              <strong>
                U.S. Energy Information Administration (EIA, 2023):
              </strong>{" "}
              Electric Power Monthly, typical capacity factors, heat rates, and
              operating generation assets.
            </li>
            <li>
              <strong>International Atomic Energy Agency (IAEA, PRIS):</strong>{" "}
              Power Reactor Information System, global reactor fleet statuses,
              and operational data.
            </li>
            <li>
              <strong>Lazard (2023/2024):</strong> Levelized Cost of Energy
              (LCOE) Version 16/17 benchmark ranges and capital expenditures.
            </li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
