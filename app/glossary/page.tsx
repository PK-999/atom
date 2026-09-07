import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listGlossaryTerms } from "@/lib/education/catalog";

export const metadata: Metadata = {
  title: "Nuclear Energy Glossary",
  description:
    "Plain-language and rigorous scientific definitions for core atomic, nuclear engineering, and radiation terminology.",
};

export default function GlossaryPage() {
  const terms = [...listGlossaryTerms()].sort((a, b) =>
    a.term.localeCompare(b.term),
  );

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        <header style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Energy & Nuclear Glossary
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.125rem",
              maxWidth: "36rem",
            }}
          >
            Precise physical, engineering, and radiation definitions vetted
            against IAEA and nuclear physics standards.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))",
            gap: "1.25rem",
          }}
        >
          {terms.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#047857",
                      backgroundColor: "#d1fae5",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    marginBottom: "0.5rem",
                  }}
                >
                  <Link
                    href={`/glossary/${item.id}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {item.term}
                  </Link>
                </h2>
                <p
                  style={{
                    color: "#4b5563",
                    fontSize: "0.9375rem",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {item.definition}
                </p>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <Link
                  href={`/glossary/${item.id}`}
                  style={{
                    color: "#7c3aed",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Full definition & citations →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
