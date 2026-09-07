"use client";

import { useState } from "react";
import type { Checkpoint } from "@/lib/education/schemas";
import {
  getLessonProgress,
  recordLessonProgress,
} from "@/lib/education/progress";
import styles from "./Education.module.css";

interface LessonCheckpointProps {
  checkpoint: Checkpoint;
  lessonId: string;
  lessonVersion: string;
  onComplete?: () => void;
}

export function LessonCheckpoint({
  checkpoint,
  lessonId,
  lessonVersion,
  onComplete,
}: LessonCheckpointProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return getLessonProgress(lessonId)?.completed ?? false;
  });

  const selectedOption = checkpoint.options.find(
    (opt) => opt.id === selectedOptionId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;

    setSubmitted(true);
    if (selectedOption.isCorrect) {
      recordLessonProgress(lessonId, lessonVersion, true);
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setSubmitted(false);
  };

  return (
    <section
      className={styles.checkpointSection}
      aria-labelledby={`checkpoint-heading-${checkpoint.id}`}
      data-testid="lesson-checkpoint"
    >
      <div className={styles.checkpointHeader}>
        <span className={styles.checkpointBadge}>Formative Checkpoint</span>
        {isCompleted && (
          <span className={styles.completedBadge} data-testid="completed-badge">
            ✓ Completed
          </span>
        )}
      </div>

      <h3
        id={`checkpoint-heading-${checkpoint.id}`}
        className={styles.checkpointPrompt}
      >
        {checkpoint.prompt}
      </h3>

      <form onSubmit={handleSubmit} className={styles.checkpointForm}>
        <fieldset
          className={styles.checkpointFieldset}
          disabled={submitted && (selectedOption?.isCorrect ?? false)}
        >
          <legend className="sr-only">Choose the best answer</legend>
          <div className={styles.optionsList}>
            {checkpoint.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              let optionClass = styles.optionItem;
              if (isSelected) optionClass += ` ${styles.optionItemSelected}`;
              if (submitted && isSelected) {
                optionClass += option.isCorrect
                  ? ` ${styles.optionItemCorrect}`
                  : ` ${styles.optionItemIncorrect}`;
              }

              return (
                <label key={option.id} className={optionClass}>
                  <input
                    type="radio"
                    name={`checkpoint-${checkpoint.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => {
                      if (!submitted || !selectedOption?.isCorrect) {
                        setSelectedOptionId(option.id);
                      }
                    }}
                    className={styles.optionRadio}
                  />
                  <span className={styles.optionText}>{option.text}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {!submitted && (
          <button
            type="submit"
            disabled={!selectedOptionId}
            className={styles.submitButton}
            data-testid="checkpoint-submit"
          >
            Check Answer
          </button>
        )}
      </form>

      <div aria-live="polite" className={styles.feedbackContainer}>
        {submitted && selectedOption && (
          <div
            className={
              selectedOption.isCorrect
                ? styles.feedbackCorrect
                : styles.feedbackIncorrect
            }
            data-testid="checkpoint-feedback"
          >
            <div className={styles.feedbackTitle}>
              {selectedOption.isCorrect ? "Correct!" : "Not quite."}
            </div>
            <p className={styles.feedbackExplanation}>
              {selectedOption.explanation}
            </p>
            {!selectedOption.isCorrect && (
              <button
                type="button"
                onClick={handleRetry}
                className={styles.retryButton}
                data-testid="checkpoint-retry"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
