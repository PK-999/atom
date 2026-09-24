"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { LEARNING_PATHS } from "@/lib/education/paths";
import { loadProgress, clearProgress } from "@/lib/education/progress";
import styles from "@/features/exhibits/ExhibitFrame.module.css";
const empty = JSON.stringify({
  completedLessons: [],
  lastAccessedLesson: null,
});
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("atom:progress", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("atom:progress", listener);
  };
}
export function LearningPaths({
  lessons,
}: {
  lessons: readonly { id: string; slug: string; title: string }[];
}) {
  const [pathId, setPathId] = useState<string>("fundamentals");
  const [confirmReset, setConfirmReset] = useState(false);
  const progress: {
    completedLessons: string[];
    lastAccessedLesson: string | null;
  } = JSON.parse(
    useSyncExternalStore(
      subscribe,
      () => JSON.stringify(loadProgress()),
      () => empty,
    ),
  );
  const path = LEARNING_PATHS.find((p) => p.id === pathId)!;
  const ordered = path.lessons.flatMap((id) => {
    const lesson = lessons.find((l) => l.id === id);
    return lesson ? [lesson] : [];
  });
  const resume = lessons.find((l) => l.id === progress.lastAccessedLesson);
  const next = ordered.find((l) => !progress.completedLessons.includes(l.id));
  return (
    <section className={styles.frame} aria-label="Learning paths">
      <h2>Choose your question. Set your own depth.</h2>
      <p>
        Paths suggest an order. Reading depth changes the detail, and can be
        adjusted on any page. Progress stays on this device.
      </p>
      {resume && (
        <p>
          <Link href={`/learn/${resume.slug}?path=${pathId}`}>
            Resume: {resume.title} →
          </Link>
        </p>
      )}
      <div
        className={styles.parts}
        role="group"
        aria-label="Choose a learning path"
      >
        {LEARNING_PATHS.map((p) => (
          <button
            type="button"
            key={p.id}
            aria-pressed={path.id === p.id}
            onClick={() => setPathId(p.id)}
          >
            {p.title}
          </button>
        ))}
      </div>
      <p>{path.description}</p>
      <ol>
        {ordered.map((lesson) => (
          <li key={lesson.id}>
            <Link href={`/learn/${lesson.slug}?path=${pathId}`}>
              {lesson.title}
            </Link>
            {progress.completedLessons.includes(lesson.id)
              ? " · Completed"
              : ""}
          </li>
        ))}
      </ol>
      <p>
        {ordered.filter((l) => progress.completedLessons.includes(l.id)).length}{" "}
        of {ordered.length} checkpoints complete
      </p>
      {next && (
        <Link href={`/learn/${next.slug}?path=${pathId}`}>
          Next: {next.title} →
        </Link>
      )}
      <div className={styles.controls}>
        {confirmReset ? (
          <>
            <span>Clear all learning progress on this device?</span>
            <button
              type="button"
              onClick={() => {
                clearProgress();
                setConfirmReset(false);
              }}
            >
              Clear progress
            </button>
            <button type="button" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)}>
            Reset learning progress
          </button>
        )}
      </div>
    </section>
  );
}
