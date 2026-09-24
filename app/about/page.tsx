import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "About ATOM | Evidence-First Nuclear Literacy",
  description:
    "ATOM is an evidence-first interactive energy-literacy platform centered on nuclear energy and the wider electricity system.",
};

export default function AboutPage() {
  return (
    <AppShell>
      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
          color: "var(--atom-text-primary)",
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
              background: "rgba(56, 189, 248, 0.15)",
              color: "var(--atom-accent)",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              marginBottom: "0.85rem",
            }}
          >
            Mission & Architecture
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "0.75rem",
              color: "var(--atom-text-primary)",
            }}
          >
            About ATOM
          </h1>
          <p
            style={{
              color: "var(--atom-text-secondary)",
              fontSize: "1.15rem",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            An evidence-first interactive platform dedicated to public energy
            literacy, scientific transparency, and rigorous empirical
            comparisons.
          </p>
        </header>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--atom-text-primary)",
            }}
          >
            Our Mission & Scientific Stance
          </h2>
          <p
            style={{
              color: "var(--atom-text-secondary)",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
              fontSize: "1.05rem",
            }}
          >
            ATOM exists to help people understand energy, risk, radiation,
            electricity systems, and nuclear power well enough to form their own
            informed opinions.
          </p>

          <div
            style={{
              padding: "1.5rem",
              backgroundColor: "rgba(124, 58, 237, 0.15)",
              borderLeft: "4px solid #a855f7",
              borderRadius: "0 12px 12px 0",
              margin: "1.75rem 0",
              borderTop: "1px solid rgba(168, 85, 247, 0.25)",
              borderRight: "1px solid rgba(168, 85, 247, 0.25)",
              borderBottom: "1px solid rgba(168, 85, 247, 0.25)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                color: "var(--atom-text-primary)",
                fontSize: "1.1rem",
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              &ldquo;ATOM should never ask users to trust ATOM. ATOM should give
              users enough information to verify ATOM.&rdquo;
            </p>
          </div>

          <p
            style={{
              color: "var(--atom-text-secondary)",
              lineHeight: 1.75,
              fontSize: "1.05rem",
            }}
          >
            ATOM is not a nuclear advocacy site. The platform presents evidence
            that strongly favors nuclear power on dimensions such as lifecycle
            greenhouse gas emissions, capacity factors, and minimal land
            footprint, as well as evidence that disfavors it on dimensions such
            as construction duration, high upfront capital intensity, and
            complex waste governance.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--atom-text-primary)",
            }}
          >
            Editorial & Evidence Standards
          </h2>
          <ul
            style={{
              color: "var(--atom-text-secondary)",
              lineHeight: 1.8,
              paddingLeft: "1.5rem",
              fontSize: "1rem",
            }}
          >
            <li>
              <strong style={{ color: "var(--atom-text-primary)" }}>
                No invented values:
              </strong>{" "}
              Every quantitative claim must be traceable to peer-reviewed
              literature or authoritative international scientific agencies
              (UNSCEAR, IPCC, IAEA, IEA, UNECE, WHO, NREL).
            </li>
            <li>
              <strong style={{ color: "var(--atom-text-primary)" }}>
                Honest missing data:
              </strong>{" "}
              Missing observations or incompatible methodologies are never
              silently hidden or set to zero.
            </li>
            <li>
              <strong style={{ color: "var(--atom-text-primary)" }}>
                Adaptive complexity:
              </strong>{" "}
              Presentation complexity changes depth from Beginner to Geeky, but
              never alters the underlying scientific evidence.
            </li>
            <li>
              <strong style={{ color: "var(--atom-text-primary)" }}>
                Separation of concerns:
              </strong>{" "}
              Scientific logic, units, and physics models remain strictly
              separated from presentational rendering.
            </li>
          </ul>
        </section>

        <section
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "1rem",
              color: "var(--atom-text-primary)",
            }}
          >
            Explore the Platform
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/sources"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.25rem",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "8px",
                color: "var(--atom-accent)",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              <span>Scientific Sources & Bibliography →</span>
            </Link>
            <Link
              href="/methodology"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.25rem",
                background: "rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "8px",
                color: "var(--atom-energy-nuclear)",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              <span>Evidence Policy & Methodology →</span>
            </Link>
            <Link
              href="/compare"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.6rem 1.25rem",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "8px",
                color: "var(--atom-positive)",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.95rem",
              }}
            >
              <span>Comparison Lab →</span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
