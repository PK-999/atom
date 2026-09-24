import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { searchCatalog, type SearchDocumentType } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search Catalog",
  description:
    "Search educational lessons, topics, glossary definitions, and energy metrics across the ATOM knowledge base.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function getTypeBadge(type: SearchDocumentType): {
  label: string;
  color: string;
  bg: string;
} {
  switch (type) {
    case "lesson":
      return { label: "Lesson", color: "#6d28d9", bg: "#ede9fe" };
    case "topic":
      return { label: "Topic", color: "#0369a1", bg: "#e0f2fe" };
    case "glossary":
      return { label: "Glossary", color: "#047857", bg: "#d1fae5" };
    case "metric":
      return { label: "Metric", color: "#b45309", bg: "#fef3c7" };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const rawQuery = (q || "").slice(0, 200);
  const results = rawQuery.trim() ? searchCatalog(rawQuery) : [];

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "54rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        <header style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Search ATOM
          </h1>
          <p style={{ color: "var(--atom-text-muted)", fontSize: "1rem" }}>
            Find published lessons, topic overviews, glossary terms, and
            comparison metrics.
          </p>
        </header>

        {/* Server-rendered GET Search Form */}
        <form
          action="/search"
          method="GET"
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "2.5rem",
          }}
        >
          <input
            type="search"
            name="q"
            defaultValue={rawQuery}
            maxLength={200}
            placeholder="Search e.g. fission, energy density, capacity factor..."
            aria-label="Search inquiry"
            style={{
              flexGrow: 1,
              minWidth: 0,
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--atom-accent)",
              color: "var(--atom-text-inverse)",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        {/* Results or Guidance */}
        {rawQuery.trim() ? (
          <div>
            <div
              style={{
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                color: "var(--atom-text-muted)",
              }}
            >
              Found {results.length}{" "}
              {results.length === 1 ? "result" : "results"} for &ldquo;
              <strong style={{ color: "var(--atom-text-primary)" }}>
                {rawQuery}
              </strong>
              &rdquo;
            </div>

            {results.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {results.map((item) => {
                  const badge = getTypeBadge(item.type);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "1.25rem",
                        backgroundColor: "var(--atom-surface-elevated)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.75rem",
                        textDecoration: "none",
                        color: "inherit",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "0.125rem 0.5rem",
                            borderRadius: "9999px",
                            backgroundColor: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </span>
                        <h2
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: 700,
                            margin: 0,
                          }}
                        >
                          {item.title}
                        </h2>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--atom-text-secondary)",
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.summary}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: "2.5rem 1.5rem",
                  textAlign: "center",
                  backgroundColor: "var(--atom-surface-elevated)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--atom-text-primary)",
                    marginBottom: "0.5rem",
                  }}
                >
                  No published documents match your search.
                </p>
                <p
                  style={{
                    color: "var(--atom-text-muted)",
                    fontSize: "0.875rem",
                    margin: "0 auto 1.5rem",
                    maxWidth: "24rem",
                  }}
                >
                  Try broader terms such as <em>fission</em>, <em>waste</em>,{" "}
                  <em>emissions</em>, or <em>cost</em>.
                </p>
                <Link
                  href="/learn"
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    backgroundColor: "var(--atom-accent)",
                    color: "var(--atom-text-inverse)",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Browse Curriculum Catalog
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: "2rem",
              backgroundColor: "var(--atom-surface-elevated)",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
              }}
            >
              Suggested Searches
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[
                "energy",
                "fission",
                "reactor",
                "waste",
                "lifecycle-ghg",
                "land-use",
                "moderator",
                "half-life",
              ].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  style={{
                    padding: "0.375rem 0.75rem",
                    backgroundColor: "var(--atom-surface-elevated)",
                    border: "1px solid #d1d5db",
                    borderRadius: "9999px",
                    color: "var(--atom-text-secondary)",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
