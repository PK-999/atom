import rawTopics from "@/content/topics/catalog.json";
import rawLessons from "@/content/lessons/catalog.json";
import rawCheckpoints from "@/content/lessons/checkpoints.json";
import rawGlossary from "@/content/glossary/terms.json";

import {
  TopicSchema,
  LessonRecordSchema,
  CheckpointSchema,
  type Topic,
  type LessonRecord,
  type Checkpoint,
} from "./schemas";
import { validateContentGraph } from "./content-validation";

// Validate content graph at module load time to guarantee structural integrity
const validation = validateContentGraph({
  topics: rawTopics,
  lessons: rawLessons,
  checkpoints: rawCheckpoints,
});

if (!validation.valid) {
  throw new Error(
    `Educational content catalog failed validation:\n${validation.errors.join("\n")}`,
  );
}

const TOPICS: readonly Topic[] = rawTopics.map((t) => TopicSchema.parse(t));
const LESSONS: readonly LessonRecord[] = rawLessons.map((l) =>
  LessonRecordSchema.parse(l),
);
const CHECKPOINTS: readonly Checkpoint[] = rawCheckpoints.map((c) =>
  CheckpointSchema.parse(c),
);

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
}

const GLOSSARY_TERMS: readonly GlossaryTerm[] = rawGlossary;

export function listTopics(): readonly Topic[] {
  return TOPICS;
}

export function getTopic(idOrSlug: string): Topic | null {
  return TOPICS.find((t) => t.id === idOrSlug || t.slug === idOrSlug) ?? null;
}

export function listAllLessons(): readonly LessonRecord[] {
  return LESSONS;
}

export function listPublishedLessons(): LessonRecord[] {
  return LESSONS.filter((l) => l.status === "published").sort(
    (a, b) => a.order - b.order,
  );
}

export function getLesson(idOrSlug: string): LessonRecord | null {
  return LESSONS.find((l) => l.id === idOrSlug || l.slug === idOrSlug) ?? null;
}

export function getPublishedLesson(slugOrId: string): LessonRecord | null {
  const lesson = getLesson(slugOrId);
  if (!lesson || lesson.status !== "published") {
    return null;
  }
  return lesson;
}

export function getCheckpointsForLesson(lessonId: string): Checkpoint[] {
  return CHECKPOINTS.filter((c) => c.lessonId === lessonId);
}

export function listGlossaryTerms(): readonly GlossaryTerm[] {
  return GLOSSARY_TERMS;
}

export function getGlossaryTerm(id: string): GlossaryTerm | null {
  return GLOSSARY_TERMS.find((g) => g.id === id) ?? null;
}
