import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  getTopic,
  listTopics,
  listPublishedLessons,
} from "@/lib/education/catalog";

interface TopicPageProps {
  params: Promise<{ topic: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return listTopics()
    .filter((t) => t.status === "published")
    .map((topic) => ({
      topic: topic.slug,
    }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopic(slug);

  if (!topic || topic.status !== "published") {
    return {
      title: "Topic Not Found",
    };
  }

  return {
    title: `${topic.title} — ATOM Topic`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);

  if (!topic || topic.status !== "published") {
    notFound();
  }

  const topicLessons = listPublishedLessons().filter(
    (l) => l.topicId === topic.id,
  );

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "54rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        {/* Breadcrumb Navigation */}
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
            href="/topics"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Topics
          </Link>
          <span>/</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>
            {topic.title}
          </span>
        </nav>

        <header
          style={{
            marginBottom: "2.5rem",
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
              color: "#6d28d9",
              backgroundColor: "#ede9fe",
              padding: "0.25rem 0.625rem",
              borderRadius: "9999px",
              marginBottom: "0.75rem",
            }}
          >
            Topic {topic.order}
          </span>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            {topic.title}
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {topic.description}
          </p>
        </header>

        {/* Subtopics Covered */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Core Themes & Knowledge Areas
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
              gap: "1rem",
            }}
          >
            {topic.subtopics.map((sub) => (
              <div
                key={sub.id}
                style={{
                  padding: "1rem",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#111827",
                    fontSize: "0.9375rem",
                  }}
                >
                  {sub.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Lessons */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Published Lessons in this Topic
          </h2>
          {topicLessons.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {topicLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.slug}`}
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
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#7c3aed",
                      }}
                    >
                      Lesson {lesson.order}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#065f46",
                        backgroundColor: "#d1fae5",
                        padding: "0.125rem 0.5rem",
                        borderRadius: "9999px",
                      }}
                    >
                      Verified
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {lesson.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "0.875rem",
                    }}
                  >
                    {lesson.objective}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
              Lessons for this topic are currently undergoing editorial and
              scientific review.
            </p>
          )}
        </section>

        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
          <Link
            href="/topics"
            style={{
              display: "inline-block",
              color: "#7c3aed",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← Back to All Topics
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
