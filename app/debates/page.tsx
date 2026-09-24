import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listDebateTopics } from "@/lib/debate/debate-model";
import { getArgumentRelationship } from "@/lib/debate/schemas";
import { AskAtom } from "@/features/ask/AskAtom";

export const metadata: Metadata = {
  title: "Evidence Debates & AI Hypothesis Testing | ATOM",
  description:
    "Rigorous examinations of contentious nuclear energy questions. Test your hypothesis against peer-reviewed literature and inspect structured arguments on waste, costs, and safety.",
};

export default function DebatesPage() {
  const topics = listDebateTopics();

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2rem 1rem 6rem",
          color: "var(--atom-text-primary)",
        }}
      >
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(168, 85, 247, 0.15)",
              color: "var(--atom-energy-nuclear)",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              marginBottom: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Evidence & Discourse
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "0.75rem",
              color: "var(--atom-text-primary)",
              background:
                "linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Core Nuclear Debates & Hypothesis Testing
          </h1>
          <p
            style={{
              color: "var(--atom-text-secondary)",
              fontSize: "1.1rem",
              lineHeight: 1.65,
              maxWidth: "50rem",
              margin: 0,
            }}
          >
            Nuclear power involves genuine trade-offs across capital intensity,
            radiotoxic waste isolation, accident risk profiles, and system-level
            decarbonization reliability. ATOM analyzes these debates using
            peer-reviewed empirical evidence, attributable consensus, and
            explicit uncertainties.
          </p>
        </header>

        {/* Interactive Debate Engine & Hypothesis Testing Assistant */}
        <section
          style={{ marginBottom: "4rem" }}
          aria-label="Interactive Debate and Hypothesis Testing Engine"
        >
          <AskAtom initialQuery="Can deep geological repositories safely store nuclear waste?" />
        </section>

        {/* Structured Topic Dossiers */}
        <section aria-label="Structured Debate Topic Dossiers">
          <div
            style={{
              marginBottom: "1.75rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--atom-text-primary)",
                margin: "0 0 0.5rem 0",
              }}
            >
              Structured Topic Dossiers
            </h2>
            <p
              style={{
                color: "var(--atom-text-secondary)",
                fontSize: "0.95rem",
                margin: 0,
              }}
            >
              Deep-dive examinations with verified claims, counterarguments, and
              attributable consensus statements.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
              gap: "1.5rem",
            }}
          >
            {topics.map((topic) => {
              const supporting = topic.arguments.filter(
                (a) => getArgumentRelationship(a) === "supporting",
              ).length;
              const disputing = topic.arguments.filter(
                (a) => getArgumentRelationship(a) === "disputing",
              ).length;
              const contextual = topic.arguments.filter(
                (a) => getArgumentRelationship(a) === "contextualizing",
              ).length;

              return (
                <article
                  key={topic.id}
                  style={{
                    background: "var(--atom-surface-elevated)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "14px",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        marginBottom: "0.75rem",
                        color: "var(--atom-text-primary)",
                      }}
                    >
                      <Link
                        href={`/debates/${topic.id}`}
                        style={{
                          color: "var(--atom-text-primary)",
                          textDecoration: "none",
                        }}
                      >
                        {topic.question}
                      </Link>
                    </h3>
                    <p
                      style={{
                        color: "var(--atom-text-secondary)",
                        fontSize: "0.95rem",
                        lineHeight: 1.55,
                        marginBottom: "1.25rem",
                      }}
                    >
                      {topic.summary}
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "1.25rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "var(--atom-positive)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                        }}
                      >
                        {supporting} Supporting
                      </span>
                      <span
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "var(--atom-negative)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                        }}
                      >
                        {disputing} Disputing
                      </span>
                      <span
                        style={{
                          background: "rgba(56, 189, 248, 0.15)",
                          color: "var(--atom-accent)",
                          border: "1px solid rgba(56, 189, 248, 0.3)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                        }}
                      >
                        {contextual} Contextual
                      </span>
                    </div>

                    <Link
                      href={`/debates/${topic.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "var(--atom-accent)",
                        textDecoration: "none",
                      }}
                    >
                      Explore Debate & Sources →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
