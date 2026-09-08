import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listDebateTopics } from "@/lib/debate/debate-model";
import { getArgumentRelationship } from "@/lib/debate/schemas";

export const metadata: Metadata = {
  title: "Evidence Debates | ATOM",
  description:
    "Rigorous, multi-perspective examinations of contentious nuclear energy questions: waste, costs, and safety grounded in peer-reviewed evidence.",
};

export default function DebatesPage() {
  const topics = listDebateTopics();

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-block",
              background: "#e0f2fe",
              color: "#0369a1",
              fontSize: "0.875rem",
              fontWeight: 600,
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "0.75rem",
            }}
          >
            Evidence & Discourse
          </div>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              marginBottom: "0.75rem",
              color: "#0f172a",
            }}
          >
            Core Nuclear Debates
          </h1>
          <p
            style={{
              color: "#475569",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              maxWidth: "44rem",
            }}
          >
            Nuclear power involves genuine trade-offs across capital intensity,
            radiotoxic waste isolation, accident risk profiles, and system-level
            decarbonization reliability. ATOM analyzes these debates using
            peer-reviewed empirical evidence, attributable consensus, and
            explicit uncertainties.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(20rem, 1fr))",
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
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      lineHeight: 1.35,
                      marginBottom: "0.75rem",
                      color: "#0f172a",
                    }}
                  >
                    <Link
                      href={`/debates/${topic.id}`}
                      style={{
                        color: "#0f172a",
                        textDecoration: "none",
                      }}
                    >
                      {topic.question}
                    </Link>
                  </h2>
                  <p
                    style={{
                      color: "#475569",
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
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {supporting} Supporting
                    </span>
                    <span
                      style={{
                        background: "#fef3c7",
                        color: "#b45309",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                      }}
                    >
                      {disputing} Disputing
                    </span>
                    <span
                      style={{
                        background: "#e0e7ff",
                        color: "#4338ca",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
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
                      color: "#0284c7",
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
      </div>
    </AppShell>
  );
}
