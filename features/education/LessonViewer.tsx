"use client";

import Link from "next/link";
import type { LessonRecord, Topic, Checkpoint } from "@/lib/education/schemas";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import { LessonInteraction } from "./LessonInteraction";
import { LessonCheckpoint } from "./LessonCheckpoint";
import styles from "./Education.module.css";

interface LessonViewerProps {
  lesson: LessonRecord;
  topic?: Topic | null;
  checkpoint?: Checkpoint | null;
  prevLesson?: LessonRecord | null;
  nextLesson?: LessonRecord | null;
}

export function LessonViewer({
  lesson,
  topic,
  checkpoint,
  prevLesson,
  nextLesson,
}: LessonViewerProps) {
  const [level] = useComplexityPreference("curious");

  const activeContent =
    lesson.contentByLevel[level] || lesson.contentByLevel.curious;

  return (
    <article className={styles.lessonPage} aria-labelledby="lesson-title">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={styles.breadcrumbSeparator} aria-hidden="true">
          /
        </span>
        <Link href="/learn">Learn</Link>
        {topic && (
          <>
            <span className={styles.breadcrumbSeparator} aria-hidden="true">
              /
            </span>
            <span>{topic.title}</span>
          </>
        )}
        <span className={styles.breadcrumbSeparator} aria-hidden="true">
          /
        </span>
        <span className={styles.breadcrumbCurrent} aria-current="page">
          {lesson.title}
        </span>
      </nav>

      {/* Lesson Header */}
      <header className={styles.header}>
        {topic && <span className={styles.topicBadge}>{topic.title}</span>}
        <h1 id="lesson-title" className={styles.title}>
          {lesson.title}
        </h1>
        <div className={styles.metaInfo}>
          <span>Lesson {lesson.order} of 7</span>
          <span aria-hidden="true">•</span>
          <span>~5 min read</span>
          <span aria-hidden="true">•</span>
          <span>Verified: {lesson.lastVerifiedAt}</span>
        </div>

        <div className={styles.objectiveCard}>
          <div className={styles.objectiveLabel}>Learning Objective</div>
          <p className={styles.objectiveText}>{lesson.objective}</p>
        </div>
      </header>

      {/* Educational Explanation Section */}
      <section
        className={styles.explanationSection}
        aria-labelledby="explanation-heading"
      >
        <div id="explanation-heading" className={styles.levelIndicator}>
          Level: {level.toUpperCase()}
        </div>
        <p className={styles.explanationText} data-testid="lesson-explanation">
          {activeContent}
        </p>
      </section>

      {/* Interactive Simulation / Widget */}
      <LessonInteraction lessonId={lesson.id} />

      {/* Formative Assessment Checkpoint */}
      {checkpoint && (
        <LessonCheckpoint
          checkpoint={checkpoint}
          lessonId={lesson.id}
          lessonVersion={lesson.version}
        />
      )}

      {/* Scientific Sources & Reference Basis */}
      <section
        className={styles.sourcesSection}
        aria-labelledby="sources-heading"
      >
        <h2 id="sources-heading" className={styles.sourcesTitle}>
          Scientific References & Evidence Standards
        </h2>
        <ul className={styles.sourcesList}>
          <li>
            International Atomic Energy Agency (IAEA) —{" "}
            <a
              href="https://www.iaea.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              IAEA Nuclear Energy Series & Technical Reports
            </a>
          </li>
          <li>
            U.S. Energy Information Administration (EIA) —{" "}
            <a
              href="https://www.eia.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Annual Energy Review & Electric Power Monthly
            </a>
          </li>
          <li>
            Intergovernmental Panel on Climate Change (IPCC) —{" "}
            <a
              href="https://www.ipcc.ch"
              target="_blank"
              rel="noopener noreferrer"
            >
              Working Group III: Mitigation of Climate Change (Annex III)
            </a>
          </li>
        </ul>
      </section>

      {/* Lesson Progression Navigation */}
      <nav className={styles.navigationBar} aria-label="Lesson progression">
        {prevLesson ? (
          <Link
            href={`/learn/${prevLesson.slug}`}
            className={styles.navLink}
            data-testid="prev-lesson"
          >
            ← Previous: {prevLesson.title}
          </Link>
        ) : (
          <Link href="/learn" className={styles.navLink}>
            ← Back to Curriculum
          </Link>
        )}

        {nextLesson ? (
          <Link
            href={`/learn/${nextLesson.slug}`}
            className={`${styles.navLink} ${styles.navLinkPrimary}`}
            data-testid="next-lesson"
          >
            Next: {nextLesson.title} →
          </Link>
        ) : (
          <Link
            href="/learn"
            className={`${styles.navLink} ${styles.navLinkPrimary}`}
            data-testid="complete-track"
          >
            Complete Curriculum ✓
          </Link>
        )}
      </nav>
    </article>
  );
}
