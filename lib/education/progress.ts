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

    const completedLessons = Array.isArray(parsed.completedLessons)
      ? parsed.completedLessons
      : [];
    const checkpointAnswers =
      typeof parsed.checkpointAnswers === "object" &&
      parsed.checkpointAnswers !== null
        ? parsed.checkpointAnswers
        : {};
    const lessons =
      typeof parsed.lessons === "object" && parsed.lessons !== null
        ? parsed.lessons
        : {};

    // Ensure all completedLessons are reflected in lessons map
    for (const id of completedLessons) {
      if (!lessons[id]) {
        lessons[id] = { version: "1.0.0", completed: true };
      }
    }

    return {
      completedLessons,
      checkpointAnswers,
      lessons,
      lastAccessedLesson:
        typeof parsed.lastAccessedLesson === "string"
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
  return (
    progress.completedLessons.includes(lessonId) ||
    Boolean(progress.lessons[lessonId]?.completed)
  );
}

export function recordLessonProgress(
  lessonId: string,
  version: string,
  completed: boolean,
): void {
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
  } catch {
    // Ignore
  }
}

export const resetProgress = clearProgress;
