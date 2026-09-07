import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Corrections & Errata Log",
  description:
    "Public changelog and audit log of empirical corrections, data updates, and methodology refinements on ATOM.",
};

export default function CorrectionsPage() {
  const corrections = [
    {
      date: "2026-09-07",
      scope: "Comparison Lab (R02/R03/R09)",
      description:
        "Standardized unit conversion for lifecycle greenhouse gas emissions and land use metrics. Corrected thermal efficiency comparisons to bar solar and wind from non-thermal heat-engine metrics.",
      citation: "ADR 0001 & Multi-Category Metric Catalog v1",
    },
    {
      date: "2026-09-01",
      scope: "Curriculum Catalog (R10/R11)",
      description:
        "Updated energy density figures to distinguish chemical molecular combustion (~4 eV) from nuclear strong force binding yield (~200 MeV per fission event).",
      citation: "IAEA Nuclear Energy Series",
    },
  ];

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "52rem",
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
            Corrections & Errata Log
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Scientific integrity requires open error handling. Every correction,
            methodology update, or source adjustment is recorded here.
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
            Our Correction Policy
          </h2>
          <p
            style={{ color: "#374151", lineHeight: 1.7, marginBottom: "1rem" }}
          >
            When an error, misattributed citation, or mathematical discrepancy
            is identified:
          </p>
          <ol
            style={{
              color: "#374151",
              lineHeight: 1.7,
              paddingLeft: "1.25rem",
            }}
          >
            <li>
              We do not silently alter data in place without an immutable
              version record.
            </li>
            <li>
              We release a versioned dataset or catalog update with an explicit
              changelog note.
            </li>
            <li>
              We publish an entry in this public log citing the exact
              discrepancy, root cause, and authoritative source resolution.
            </li>
          </ol>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Recent Corrections
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {corrections.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "#6b7280",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#7c3aed" }}>
                    {item.scope}
                  </span>
                  <span>{item.date}</span>
                </div>
                <p
                  style={{
                    color: "#1f2937",
                    fontSize: "0.9375rem",
                    lineHeight: 1.6,
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.description}
                </p>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  <strong>Reference Basis:</strong> {item.citation}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          <Link
            href="/methodology"
            style={{
              color: "#7c3aed",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            ← View Evidence Policy & Verification Gates
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
