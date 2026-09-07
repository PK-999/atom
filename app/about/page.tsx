import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "About ATOM",
  description:
    "ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and the wider electricity system.",
};

export default function AboutPage() {
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
            About ATOM
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            An evidence-first interactive platform dedicated to public energy
            literacy, scientific transparency, and rigorous comparisons.
          </p>
        </header>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Our Mission & Stance
          </h2>
          <p
            style={{ color: "#374151", lineHeight: 1.7, marginBottom: "1rem" }}
          >
            ATOM exists to help people understand energy, risk, radiation,
            electricity systems, and nuclear power well enough to form their own
            opinion.
          </p>
          <div
            style={{
              padding: "1.25rem",
              backgroundColor: "#f5f3ff",
              borderLeft: "4px solid #7c3aed",
              borderRadius: "0 0.5rem 0.5rem 0",
              margin: "1.5rem 0",
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                color: "#5b21b6",
                fontStyle: "italic",
              }}
            >
              ATOM should never ask users to trust ATOM. ATOM should give users
              enough information to verify ATOM.
            </p>
          </div>
          <p style={{ color: "#374151", lineHeight: 1.7 }}>
            ATOM is not a nuclear advocacy site. The platform presents evidence
            that strongly favors nuclear power on dimensions such as lifecycle
            greenhouse gas emissions and land footprint, as well as evidence
            that disfavors it on dimensions such as construction duration,
            capital intensity, and complex waste governance.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Editorial & Verification Standards
          </h2>
          <ul
            style={{
              color: "#374151",
              lineHeight: 1.7,
              paddingLeft: "1.25rem",
            }}
          >
            <li>
              <strong>No invented values:</strong> Every quantitative claim must
              be traceable to peer-reviewed literature or authoritative
              international agencies (IAEA, IEA, IPCC, UNECE, EIA, NREL).
            </li>
            <li>
              <strong>Honest missing data:</strong> Missing observations or
              incompatible methodologies are never silently hidden or set to
              zero.
            </li>
            <li>
              <strong>Separation of concerns:</strong> Scientific logic and
              calculations remain strictly separated from presentational
              rendering.
            </li>
          </ul>
        </section>

        <section
          style={{ paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Learn More
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/methodology"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Evidence Policy & Methodology →
            </Link>
            <Link
              href="/corrections"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Corrections Log →
            </Link>
            <Link
              href="/accessibility"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Accessibility Statement →
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
