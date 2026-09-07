import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listTopics, listPublishedLessons } from "@/lib/education/catalog";

export const metadata: Metadata = {
  title: "Educational Topics",
  description:
    "Explore structured thematic areas of energy literacy: physical fundamentals, nuclear technology, safety systems, and grid integration.",
};

export default function TopicsPage() {
  const topics = listTopics().filter((t) => t.status === "published");
  const lessons = listPublishedLessons();

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
            Curriculum Topics
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "1.125rem",
              maxWidth: "36rem",
            }}
          >
            ATOM organizes energy literacy into four sequential core areas,
            moving from fundamental physics to engineering, safety, and societal
            economics.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(24rem, 1fr))",
            gap: "1.5rem",
          }}
        >
          {topics.map((topic) => {
            const topicLessons = lessons.filter((l) => l.topicId === topic.id);
            return (
              <div
                key={topic.id}
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
                        color: "#6d28d9",
                        backgroundColor: "#ede9fe",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "9999px",
                      }}
                    >
                      Topic {topic.order}
                    </span>
                    <span style={{ fontSize: "0.8125rem", color: "#6b7280" }}>
                      {topicLessons.length}{" "}
                      {topicLessons.length === 1 ? "Lesson" : "Lessons"}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: "1.375rem",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Link
                      href={`/topics/${topic.slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {topic.title}
                    </Link>
                  </h2>
                  <p
                    style={{
                      color: "#4b5563",
                      fontSize: "0.9375rem",
                      lineHeight: 1.5,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {topic.description}
                  </p>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#6b7280",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Subtopics Covered
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.25rem",
                        fontSize: "0.875rem",
                        color: "#4b5563",
                        lineHeight: 1.6,
                      }}
                    >
                      {topic.subtopics.map((s) => (
                        <li key={s.id}>{s.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  style={{ paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}
                >
                  <Link
                    href={`/topics/${topic.slug}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "#7c3aed",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textDecoration: "none",
                    }}
                  >
                    View Topic Modules →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
