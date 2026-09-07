import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getGlossaryTerm, listGlossaryTerms } from "@/lib/education/catalog";

interface GlossaryTermPageProps {
  params: Promise<{ term: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return listGlossaryTerms().map((term) => ({
    term: term.id,
  }));
}

export async function generateMetadata({
  params,
}: GlossaryTermPageProps): Promise<Metadata> {
  const { term: id } = await params;
  const term = getGlossaryTerm(id);

  if (!term) {
    return {
      title: "Term Not Found",
    };
  }

  return {
    title: `${term.term} — Energy Glossary`,
    description: term.definition,
  };
}

export default async function GlossaryTermPage({
  params,
}: GlossaryTermPageProps) {
  const { term: id } = await params;
  const item = getGlossaryTerm(id);

  if (!item) {
    notFound();
  }

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1.5rem",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link
            href="/glossary"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Glossary
          </Link>
          <span>/</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>{item.term}</span>
        </nav>

        <article>
          <header
            style={{
              marginBottom: "2rem",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "1.5rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "#047857",
                backgroundColor: "#d1fae5",
                padding: "0.25rem 0.625rem",
                borderRadius: "9999px",
                marginBottom: "0.75rem",
              }}
            >
              {item.category}
            </span>
            <h1
              style={{
                fontSize: "2.25rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              {item.term}
            </h1>
          </header>

          <section
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "1.75rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                marginBottom: "0.75rem",
                color: "#111827",
              }}
            >
              Definition
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.75,
                color: "#374151",
                margin: 0,
              }}
            >
              {item.definition}
            </p>
          </section>

          <section
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "#334155",
              }}
            >
              Authoritative Reference
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Standardized in accordance with the International Atomic Energy
              Agency (IAEA) Safety Glossary and IUPAC Compendium of Chemical
              Terminology.
            </p>
          </section>

          <div>
            <Link
              href="/glossary"
              style={{
                color: "#7c3aed",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              ← Back to All Glossary Terms
            </Link>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
