import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Evidence Methodology & Governance | ATOM",
  description:
    "How ATOM selects, normalizes, inspects, and verifies empirical energy and radiation data.",
};

export default function MethodologyPage() {
  return (
    <AppShell>
      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
          color: "#f8fafc",
        }}
      >
        <header
          style={{
            marginBottom: "2.5rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "1.75rem",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(168, 85, 247, 0.15)",
              color: "#c084fc",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              marginBottom: "0.85rem",
            }}
          >
            Evidence Governance
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "0.75rem",
              color: "#f8fafc",
            }}
          >
            How ATOM Handles Evidence
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "1.15rem",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Scientific calculations, system boundaries, uncertainty reporting,
            and unit conversions follow strict separation from UI presentation.
          </p>
        </header>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "#f8fafc",
            }}
          >
            Core Evidence Pipeline
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              color: "#38bdf8",
              overflowX: "auto",
            }}
          >
            <span>Primary Sources</span>
            <span>→</span>
            <span>Schema Validation</span>
            <span>→</span>
            <span>Unit Normalization</span>
            <span>→</span>
            <span>Metric Engine</span>
            <span>→</span>
            <span>UI Presentation</span>
          </div>

          <p
            style={{ color: "#cbd5e1", lineHeight: 1.75, fontSize: "1.05rem" }}
          >
            Every major quantitative claim in ATOM records:
          </p>
          <ul
            style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: "1.5rem" }}
          >
            <li>
              <strong>Metric and Unit:</strong> e.g., gCO₂eq/kWh, µSv, MW net,
              km²/TWh.
            </li>
            <li>
              <strong>System Boundary:</strong> Cradle-to-grave lifecycle
              accounting where applicable.
            </li>
            <li>
              <strong>Period & Geography:</strong> Vintage year and regional
              market context.
            </li>
            <li>
              <strong>Primary Source & Citation:</strong> Direct report
              identifier, organization, and DOI.
            </li>
            <li>
              <strong>Uncertainty & Ranges:</strong> Displayed honestly rather
              than masked as a false single point.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "#f8fafc",
            }}
          >
            Zero-Hallucination Policy
          </h2>
          <p
            style={{ color: "#cbd5e1", lineHeight: 1.75, fontSize: "1.05rem" }}
          >
            Where empirical data is unavailable or methodologies are not
            directly comparable, ATOM refuses to invent numbers or substitute
            zeroes. Missing data states are displayed with an honest explanation
            of what is known and what remains uncertain.
          </p>
        </section>

        <section
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Link
            href="/sources"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              borderRadius: "10px",
              color: "#ffffff",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 16px rgba(2, 132, 199, 0.35)",
            }}
          >
            <span>Browse Scientific Bibliography & DOIs</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
