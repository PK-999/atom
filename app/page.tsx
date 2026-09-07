import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listTopics, listPublishedLessons } from "@/lib/education/catalog";

export const metadata: Metadata = {
  title: "ATOM — Understand energy through evidence",
  description:
    "An evidence-first interactive energy-literacy platform centered on nuclear energy and the wider electricity system.",
};

export default function HomePage() {
  const topics = listTopics().filter((t) => t.status === "published");
  const lessons = listPublishedLessons();

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "3rem 1.5rem 6rem",
        }}
      >
        {/* Hero Section */}
        <section style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#7c3aed",
              marginBottom: "1rem",
            }}
          >
            Evidence-First Energy Literacy
          </p>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
              color: "#111827",
            }}
          >
            ATOM
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#4b5563",
              maxWidth: "40rem",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            Understand energy systems, their trade-offs, and the evidence behind
            important quantitative claims.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/learn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.875rem 1.75rem",
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                borderRadius: "0.5rem",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(124, 58, 237, 0.25)",
              }}
            >
              Start the Curriculum →
            </Link>
            <Link
              href="/compare"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.875rem 1.75rem",
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                color: "#111827",
                borderRadius: "0.5rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Open the Comparison Lab
            </Link>
            <Link
              href="/methodology"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.875rem 1.25rem",
                color: "#4b5563",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Read the evidence policy
            </Link>
          </div>

          <p
            role="status"
            style={{
              fontSize: "0.8125rem",
              color: "#6b7280",
              maxWidth: "32rem",
              margin: "0 auto",
            }}
          >
            Digital Science Museum direction selected. All quantitative claims
            are backed by immutable, peer-reviewed data records.
          </p>
        </section>

        {/* Three Core Questions Section */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Three Questions That Shape the Energy Debate
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "1.75rem",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  🌍
                </span>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  How much land and fuel does clean power really need?
                </h3>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  Compare the physical spatial footprint, mineral requirements,
                  and fuel mass differences between nuclear fission, solar PV,
                  wind, and fossil fuels.
                </p>
              </div>
              <div style={{ marginTop: "1.25rem" }}>
                <Link
                  href="/learn/energy"
                  style={{
                    color: "#7c3aed",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Explore Fuel Density →
                </Link>
              </div>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "1.75rem",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  🛡️
                </span>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  What are the empirical health and accident risks?
                </h3>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  Inspect historical mortality data per terawatt-hour,
                  defense-in-depth barrier engineering, and international
                  radiation safety thresholds.
                </p>
              </div>
              <div style={{ marginTop: "1.25rem" }}>
                <Link
                  href="/learn/safety"
                  style={{
                    color: "#7c3aed",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Inspect Safety Barriers →
                </Link>
              </div>
            </div>

            <div
              style={{
                padding: "1.5rem",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "1.75rem",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  ⚡
                </span>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  How do zero-carbon technologies build a reliable grid?
                </h3>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  Examine capacity factors, dispatchability, seasonality, and
                  grid inertia to understand how steady power pairs with
                  variable renewables.
                </p>
              </div>
              <div style={{ marginTop: "1.25rem" }}>
                <Link
                  href="/learn/electricity-generation"
                  style={{
                    color: "#7c3aed",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  Examine Grid Reliability →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Exhibit: Comparison Lab */}
        <section
          style={{
            marginBottom: "4rem",
            padding: "2.5rem",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#7c3aed",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                  display: "inline-block",
                }}
              >
                Flagship Interactive Tool
              </span>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  margin: "0 0 0.5rem 0",
                }}
              >
                Energy Comparison Lab V1
              </h2>
              <p
                style={{
                  color: "#4b5563",
                  maxWidth: "34rem",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Benchmark nuclear against solar, wind, hydro, coal, and gas
                across 34 standardized metrics spanning environmental impact,
                economics, reliability, and human safety.
              </p>
            </div>
            <Link
              href="/compare"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                borderRadius: "0.5rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Launch Comparison Lab →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "1rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #f3f4f6",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#7c3aed",
                }}
              >
                34
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Standardized Metrics
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#7c3aed",
                }}
              >
                6
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Major Categories
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#7c3aed",
                }}
              >
                9
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Power Generation Techs
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#7c3aed",
                }}
              >
                5
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Explanation Levels
              </div>
            </div>
          </div>
        </section>

        {/* Topics Catalog */}
        <section style={{ marginBottom: "4rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
                Curriculum Areas
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  margin: "0.25rem 0 0 0",
                  fontSize: "0.9375rem",
                }}
              >
                {lessons.length} published interactive lessons across{" "}
                {topics.length} core themes.
              </p>
            </div>
            <Link
              href="/topics"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              View All Topics →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
              gap: "1.25rem",
            }}
          >
            {topics.map((t) => (
              <Link
                key={t.id}
                href={`/topics/${t.slug}`}
                style={{
                  display: "block",
                  padding: "1.25rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  color: "inherit",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#6d28d9",
                    marginBottom: "0.5rem",
                  }}
                >
                  Topic {t.order}
                </div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  {t.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {t.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Search Callout */}
        <section
          style={{
            textAlign: "center",
            padding: "2.5rem 1.5rem",
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Looking for a specific concept or metric?
          </h2>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.9375rem",
              marginBottom: "1.25rem",
            }}
          >
            Search across our entire catalog of published lessons, glossary
            definitions, and empirical metrics.
          </p>
          <Link
            href="/search"
            style={{
              display: "inline-block",
              padding: "0.625rem 1.25rem",
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              borderRadius: "0.375rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Open Search Directory
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
