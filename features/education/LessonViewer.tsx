import React from "react";
import type { Lesson } from "../../lib/education/schemas";
import { ComplexityLevelSchema } from "../../lib/evidence/schemas";
import { z } from "zod";

type ComplexityLevel = z.infer<typeof ComplexityLevelSchema>;

export function LessonViewer({
  lesson,
  level,
}: {
  lesson: Lesson;
  level: ComplexityLevel;
}) {
  return (
    <article aria-labelledby={`lesson-title-${lesson.id}`}>
      <h2 id={`lesson-title-${lesson.id}`}>{lesson.title}</h2>
      <div className="prose">
        <p>{lesson.explanations[level]}</p>
      </div>
      {lesson.conceptIds.length > 0 && (
        <aside>
          <h3>Related Concepts</h3>
          <ul>
            {lesson.conceptIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
