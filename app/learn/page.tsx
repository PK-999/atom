import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { listTopics, listPublishedLessons } from "@/lib/education/catalog";
import styles from "@/features/education/Education.module.css";

export const metadata: Metadata = {
  title: "Nuclear Energy Learning Path",
  description:
    "An evidence-grounded progressive curriculum covering atomic physics, nuclear fission, reactor engineering, grid electricity, safety, and waste.",
};

export default function LearnCatalogPage() {
  const topics = listTopics();
  const publishedLessons = listPublishedLessons();

  return (
    <AppShell>
      <div className={styles.catalogPage}>
        <header className={styles.catalogHero}>
          <h1 className={styles.catalogTitle}>Nuclear Energy Curriculum</h1>
          <p className={styles.catalogSubtitle}>
            A structured, interactive seven-lesson track grounded in physical
            principles, engineering realities, and empirical energy data.
          </p>
        </header>

        {topics.map((topic) => {
          const topicLessons = publishedLessons.filter(
            (lesson) => lesson.topicId === topic.id,
          );
          if (topicLessons.length === 0) return null;

          return (
            <section
              key={topic.id}
              className={styles.topicSection}
              aria-labelledby={`topic-${topic.id}`}
            >
              <h2 id={`topic-${topic.id}`} className={styles.topicSectionTitle}>
                {topic.title}
              </h2>
              <p className={styles.topicSectionDescription}>
                {topic.description}
              </p>

              <div className={styles.lessonsGrid}>
                {topicLessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${lesson.slug}`}
                    className={styles.lessonCard}
                    data-testid={`lesson-card-${lesson.slug}`}
                  >
                    <div>
                      <div className={styles.lessonCardHeader}>
                        <span className={styles.lessonOrder}>
                          Lesson {lesson.order}
                        </span>
                        <span className={styles.lessonStatus}>Verified</span>
                      </div>
                      <h3 className={styles.lessonCardTitle}>{lesson.title}</h3>
                      <p className={styles.lessonCardObjective}>
                        {lesson.objective}
                      </p>
                    </div>

                    <div className={styles.lessonCardFooter}>
                      <span>~5 min read</span>
                      <span>Explore →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
