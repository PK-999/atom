import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import styles from "@/features/education/Education.module.css";

export default function LessonNotFound() {
  return (
    <AppShell>
      <div
        className={styles.lessonPage}
        style={{ textAlign: "center", padding: "5rem 1.5rem" }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
          Lesson Not Found
        </h1>
        <p
          style={{
            color: "var(--atom-text-secondary)",
            marginBottom: "2rem",
            maxWidth: "28rem",
            margin: "0 auto 2rem",
          }}
        >
          The requested lesson does not exist or has not yet completed
          scientific and editorial review.
        </p>
        <Link
          href="/learn"
          className={styles.navLinkPrimary}
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Return to Curriculum Catalog
        </Link>
      </div>
    </AppShell>
  );
}
