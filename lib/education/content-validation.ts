import {
  LessonRecordSchema,
  TopicSchema,
  CheckpointSchema,
  type LessonRecord,
  type Topic,
  type Checkpoint,
} from "./schemas";
import { METRICS } from "@/lib/evidence/metrics";

export const REQUIRED_INITIAL_LESSONS = [
  "energy",
  "atom",
  "fission",
  "reactor",
  "electricity-generation",
  "safety",
  "waste",
] as const;

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function detectCyclicPrerequisites(
  lessons: readonly LessonRecord[],
): string[] | null {
  const lessonMap = new Map(lessons.map((l) => [l.id, l]));
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(lessonId: string, currentPath: string[]): string[] | null {
    visited.add(lessonId);
    recursionStack.add(lessonId);

    const lesson = lessonMap.get(lessonId);
    if (lesson) {
      for (const prereqId of lesson.prerequisiteIds) {
        if (!visited.has(prereqId)) {
          const cycle = dfs(prereqId, [...currentPath, prereqId]);
          if (cycle) return cycle;
        } else if (recursionStack.has(prereqId)) {
          return [...currentPath, prereqId];
        }
      }
    }

    recursionStack.delete(lessonId);
    return null;
  }

  for (const lesson of lessons) {
    if (!visited.has(lesson.id)) {
      const cycle = dfs(lesson.id, [lesson.id]);
      if (cycle) return cycle;
    }
  }

  return null;
}

export function validateContentGraph({
  topics,
  lessons,
  checkpoints,
}: {
  topics: unknown[];
  lessons: unknown[];
  checkpoints: unknown[];
}): ValidationResult {
  const errors: string[] = [];

  // 1. Schema parsing
  const parsedTopics: Topic[] = [];
  topics.forEach((t, i) => {
    const result = TopicSchema.safeParse(t);
    if (!result.success) {
      errors.push(`Topic[${i}] schema error: ${result.error.message}`);
    } else {
      parsedTopics.push(result.data);
    }
  });

  const parsedLessons: LessonRecord[] = [];
  lessons.forEach((l, i) => {
    const result = LessonRecordSchema.safeParse(l);
    if (!result.success) {
      errors.push(`Lesson[${i}] schema error: ${result.error.message}`);
    } else {
      parsedLessons.push(result.data);
    }
  });

  const parsedCheckpoints: Checkpoint[] = [];
  checkpoints.forEach((c, i) => {
    const result = CheckpointSchema.safeParse(c);
    if (!result.success) {
      errors.push(`Checkpoint[${i}] schema error: ${result.error.message}`);
    } else {
      parsedCheckpoints.push(result.data);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 2. Uniqueness checks
  const topicIds = new Set<string>();
  for (const t of parsedTopics) {
    if (topicIds.has(t.id)) errors.push(`Duplicate topic id: ${t.id}`);
    topicIds.add(t.id);
  }

  const lessonIds = new Set<string>();
  const lessonSlugs = new Set<string>();
  for (const l of parsedLessons) {
    if (lessonIds.has(l.id)) errors.push(`Duplicate lesson id: ${l.id}`);
    if (lessonSlugs.has(l.slug))
      errors.push(`Duplicate lesson slug: ${l.slug}`);
    lessonIds.add(l.id);
    lessonSlugs.add(l.slug);
  }

  const checkpointIds = new Set<string>();
  for (const c of parsedCheckpoints) {
    if (checkpointIds.has(c.id))
      errors.push(`Duplicate checkpoint id: ${c.id}`);
    checkpointIds.add(c.id);
  }

  // 3. Foreign key / reference checks
  const lessonMap = new Map(parsedLessons.map((l) => [l.id, l]));
  const knownMetricIds = new Set(METRICS.map((m) => m.id));

  for (const lesson of parsedLessons) {
    if (!topicIds.has(lesson.topicId)) {
      errors.push(
        `Lesson ${lesson.id} references non-existent topicId: ${lesson.topicId}`,
      );
    }

    for (const prereqId of lesson.prerequisiteIds) {
      const prereq = lessonMap.get(prereqId);
      if (!prereq) {
        errors.push(
          `Lesson ${lesson.id} references non-existent prerequisiteId: ${prereqId}`,
        );
      } else if (
        lesson.status === "published" &&
        prereq.status !== "published"
      ) {
        errors.push(
          `Published lesson ${lesson.id} has unpublished prerequisite ${prereqId} (${prereq.status})`,
        );
      }
    }

    if (lesson.nextLessonId !== null && !lessonMap.has(lesson.nextLessonId)) {
      errors.push(
        `Lesson ${lesson.id} has dangling nextLessonId: ${lesson.nextLessonId}`,
      );
    }

    for (const chkId of lesson.checkpointIds) {
      if (!checkpointIds.has(chkId)) {
        errors.push(
          `Lesson ${lesson.id} references non-existent checkpointId: ${chkId}`,
        );
      }
    }

    for (const claimId of lesson.claimIds) {
      if (!knownMetricIds.has(claimId)) {
        errors.push(
          `Lesson ${lesson.id} references unknown metric claimId: ${claimId}`,
        );
      }
    }
  }

  // 4. Checkpoint lesson back-references
  for (const c of parsedCheckpoints) {
    if (!lessonMap.has(c.lessonId)) {
      errors.push(
        `Checkpoint ${c.id} references non-existent lessonId: ${c.lessonId}`,
      );
    }
  }

  // 5. Cyclic prerequisite check
  const cycle = detectCyclicPrerequisites(parsedLessons);
  if (cycle) {
    errors.push(`Cyclic prerequisite chain detected: ${cycle.join(" -> ")}`);
  }

  // 6. Verification of seven required initial lessons
  const existingInitial = parsedLessons
    .filter((l) =>
      REQUIRED_INITIAL_LESSONS.includes(
        l.id as (typeof REQUIRED_INITIAL_LESSONS)[number],
      ),
    )
    .sort((a, b) => a.order - b.order)
    .map((l) => l.id);

  if (existingInitial.join(",") !== REQUIRED_INITIAL_LESSONS.join(",")) {
    errors.push(
      `Initial 7 lessons must be defined in exact sequence: ${REQUIRED_INITIAL_LESSONS.join(
        ", ",
      )}, but got: ${existingInitial.join(", ")}`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
