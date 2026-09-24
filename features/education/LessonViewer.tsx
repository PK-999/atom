"use client";

import { useEffect, useState } from "react";
import { recordLessonVisit } from "@/lib/education/progress";
import Link from "next/link";
import type { LessonRecord, Topic, Checkpoint } from "@/lib/education/schemas";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import { LessonInteraction } from "./LessonInteraction";
import { LessonCheckpoint } from "./LessonCheckpoint";
import styles from "./Education.module.css";
import { LESSON_GUIDES } from "@/lib/education/lesson-guides";

interface LessonViewerProps {
  lesson: LessonRecord;
  pathId?: string;
  topic?: Topic | null;
  checkpoint?: Checkpoint | null;
  prevLesson?: LessonRecord | null;
  nextLesson?: LessonRecord | null;
}

export function LessonViewer({
  lesson,
  pathId = "fundamentals",
  topic,
  checkpoint,
  prevLesson,
  nextLesson,
}: LessonViewerProps) {
  const [level] = useComplexityPreference("curious");
  const [prediction, setPrediction] = useState("");
  const guide = LESSON_GUIDES[lesson.id];
  useEffect(() => recordLessonVisit(lesson.id), [lesson.id]);

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
          <span>Content dated: {lesson.lastVerifiedAt}</span>
        </div>

        <div className={styles.objectiveCard}>
          <div className={styles.objectiveLabel}>Learning Objective</div>
          <p className={styles.objectiveText}>{lesson.objective}</p>
        </div>
      </header>

      {guide && (
        <section
          className={styles.objectiveCard}
          aria-labelledby="lesson-question"
        >
          <h2 id="lesson-question">{guide.question}</h2>
          <label htmlFor="lesson-prediction">{guide.prediction}</label>
          <textarea
            id="lesson-prediction"
            value={prediction}
            onChange={(event) => setPrediction(event.target.value)}
            rows={2}
            placeholder="Make a prediction, then try the experiment."
          />
          <p>
            Your prediction stays here while you change the explanation depth.
            No answer is sent to a server.
          </p>
        </section>
      )}

      <LessonInteraction lessonId={lesson.id} />

      <section
        className={styles.explanationSection}
        aria-labelledby="explanation-heading"
      >
        <h2 id="explanation-heading">What explains the result?</h2>
        <div className={styles.levelIndicator}>
          Level: {level.toUpperCase()}
        </div>
        <p className={styles.explanationText} data-testid="lesson-explanation">
          {activeContent}
        </p>
      </section>

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
        <p>
          Background reading for this lesson. Claim-level review records are not
          yet available here.
        </p>
        <ul className={styles.sourcesList}>
          {guide && (
            <li>
              <a
                href={guide.source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {guide.source.title}
              </a>
            </li>
          )}
          <li>
            <Link href="/methodology">
              How ATOM handles evidence and uncertainty
            </Link>
          </li>
        </ul>
      </section>

      {/* Lesson Progression Navigation */}
      <nav className={styles.navigationBar} aria-label="Lesson progression">
        {prevLesson ? (
          <Link
            href={`/learn/${prevLesson.slug}?path=${pathId}`}
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
            href={`/learn/${nextLesson.slug}?path=${pathId}`}
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
            Return to learning paths →
          </Link>
        )}
      </nav>
    </article>
  );
}
