import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DebateViewer } from "@/features/debate/DebateViewer";
import { getDebateTopic, listDebateTopics } from "@/lib/debate/debate-model";

interface DebateTopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const topics = listDebateTopics();
  return topics.map((t) => ({
    topic: t.id,
  }));
}

export async function generateMetadata({
  params,
}: DebateTopicPageProps): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getDebateTopic(slug);
  if (!topic) {
    return {
      title: "Debate Not Found | ATOM",
    };
  }

  return {
    title: `${topic.question} | ATOM Debates`,
    description: topic.summary,
  };
}

export default async function DebateTopicPage({
  params,
}: DebateTopicPageProps) {
  const { topic: slug } = await params;
  const topic = getDebateTopic(slug);

  if (!topic) {
    notFound();
  }

  return (
    <AppShell>
      <div
        style={{
          maxWidth: "64rem",
          margin: "0 auto",
          padding: "1.5rem 1.5rem 6rem",
        }}
      >
        <nav
          aria-label="Breadcrumbs"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            color: "#64748b",
            marginBottom: "1.5rem",
          }}
        >
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
            Home
          </Link>
          <span>/</span>
          <Link
            href="/debates"
            style={{ color: "#64748b", textDecoration: "none" }}
          >
            Debates
          </Link>
          <span>/</span>
          <span style={{ color: "#0f172a", fontWeight: 500 }}>{topic.id}</span>
        </nav>

        <DebateViewer topic={topic} />
      </div>
    </AppShell>
  );
}
