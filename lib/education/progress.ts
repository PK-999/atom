import { getPublishedLesson } from "./catalog";
export const PROGRESS_STORAGE_KEY = "atom:learning-progress:v1";

export interface LessonProgressEntry {
  version: string;
  completed: boolean;
  completedAt?: string;
  checkpointAnswers?: Record<string, string>;
}

export interface LearningProgressState {
  completedLessons: string[];
  checkpointAnswers: Record<string, string>; // checkpointId -> optionId
  lessons: Record<string, LessonProgressEntry>; // lessonId -> entry
  lastAccessedLesson: string | null;
}

const DEFAULT_PROGRESS: LearningProgressState = {
  completedLessons: [],
  checkpointAnswers: {},
  lessons: {},
  lastAccessedLesson: null,
};

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadProgress(): LearningProgressState {
  const storage = getStorage();
  if (!storage) return { ...DEFAULT_PROGRESS };

  try {
    const raw = storage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return { ...DEFAULT_PROGRESS };
    }

    const isRecord = (value: unknown): value is Record<string, unknown> =>
      typeof value === "object" && value !== null && !Array.isArray(value);
    const checkpointAnswers: Record<string, string> = {};
    if (isRecord(parsed.checkpointAnswers))
      for (const [key, value] of Object.entries(parsed.checkpointAnswers))
        if (typeof value === "string") checkpointAnswers[key] = value;
    const lessons: Record<string, LessonProgressEntry> = {};
    if (isRecord(parsed.lessons))
      for (const [id, value] of Object.entries(parsed.lessons)) {
        if (
          !getPublishedLesson(id) ||
          !isRecord(value) ||
          typeof value.version !== "string" ||
          typeof value.completed !== "boolean"
        )
          continue;
        lessons[id] = {
          version: value.version,
          completed: value.completed,
          ...(typeof value.completedAt === "string"
            ? { completedAt: value.completedAt }
            : {}),
        };
      }
    const completedLessons = Object.entries(lessons)
      .filter(
        ([id, entry]) =>
          entry.completed && entry.version === getPublishedLesson(id)?.version,
      )
      .map(([id]) => id);

    return {
      completedLessons,
      checkpointAnswers,
      lessons,
      lastAccessedLesson:
        typeof parsed.lastAccessedLesson === "string" &&
        getPublishedLesson(parsed.lastAccessedLesson)
          ? parsed.lastAccessedLesson
          : null,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(state: LearningProgressState): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("atom:progress"));
  } catch {
    // Ignore storage quota errors
  }
}

export function getLessonProgress(
  lessonId: string,
): LessonProgressEntry | null {
  const progress = loadProgress();
  return progress.lessons[lessonId] ?? null;
}

export function isLessonCompleted(lessonId: string): boolean {
  const progress = loadProgress();
  return progress.completedLessons.includes(lessonId);
}

export function recordLessonProgress(
  lessonId: string,
  version: string,
  completed: boolean,
): void {
  if (!getPublishedLesson(lessonId)) return;
  const progress = loadProgress();
  const completedSet = new Set(progress.completedLessons);
  if (completed) {
    completedSet.add(lessonId);
  } else {
    completedSet.delete(lessonId);
  }

  const existingEntry = progress.lessons[lessonId] || {
    version,
    completed: false,
  };

  const nextEntry: LessonProgressEntry = {
    ...existingEntry,
    version,
    completed,
    completedAt: completed ? new Date().toISOString() : undefined,
  };

  const nextState: LearningProgressState = {
    ...progress,
    completedLessons: Array.from(completedSet),
    lessons: {
      ...progress.lessons,
      [lessonId]: nextEntry,
    },
    lastAccessedLesson: lessonId,
  };

  saveProgress(nextState);
}

export function markLessonCompleted(
  lessonId: string,
  checkpointId?: string,
  selectedOptionId?: string,
): LearningProgressState {
  const progress = loadProgress();
  const completed = new Set(progress.completedLessons);
  completed.add(lessonId);

  const answers = { ...progress.checkpointAnswers };
  if (checkpointId && selectedOptionId) {
    answers[checkpointId] = selectedOptionId;
  }

  const nextEntry: LessonProgressEntry = {
    version: "1.0.0",
    completed: true,
    completedAt: new Date().toISOString(),
    checkpointAnswers: answers,
  };

  const nextState: LearningProgressState = {
    completedLessons: Array.from(completed),
    checkpointAnswers: answers,
    lessons: {
      ...progress.lessons,
      [lessonId]: nextEntry,
    },
    lastAccessedLesson: lessonId,
  };

  saveProgress(nextState);
  return nextState;
}

export function getCompletedLessonsCount(): number {
  return loadProgress().completedLessons.length;
}

export function clearProgress(): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(PROGRESS_STORAGE_KEY);
    window.dispatchEvent(new Event("atom:progress"));
  } catch {
    // Ignore
  }
}

export const resetProgress = clearProgress;

export function recordLessonVisit(lessonId: string): void {
  if (!getPublishedLesson(lessonId)) return;
  saveProgress({ ...loadProgress(), lastAccessedLesson: lessonId });
}
