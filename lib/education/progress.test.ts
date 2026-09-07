// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  loadProgress,
  isLessonCompleted,
  markLessonCompleted,
  getCompletedLessonsCount,
  clearProgress,
  PROGRESS_STORAGE_KEY,
} from "./progress";

describe("Education Progress Tracking (R11)", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        clear: () => values.clear(),
        getItem: (key: string) => values.get(key) ?? null,
        key: (index: number) => [...values.keys()][index] ?? null,
        get length() {
          return values.size;
        },
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, value),
      } satisfies Storage,
    });
  });

  it("returns default state when storage is empty", () => {
    const state = loadProgress();
    expect(state.completedLessons).toEqual([]);
    expect(state.checkpointAnswers).toEqual({});
    expect(isLessonCompleted("energy")).toBe(false);
  });

  it("marks a lesson completed and updates localStorage", () => {
    markLessonCompleted("energy", "chk-energy-density", "opt-1");
    expect(isLessonCompleted("energy")).toBe(true);
    expect(isLessonCompleted("atom")).toBe(false);
    expect(getCompletedLessonsCount()).toBe(1);

    const saved = JSON.parse(
      window.localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}",
    );
    expect(saved.completedLessons).toContain("energy");
    expect(saved.checkpointAnswers["chk-energy-density"]).toBe("opt-1");
  });

  it("accumulates completions without duplicates", () => {
    markLessonCompleted("energy");
    markLessonCompleted("energy");
    markLessonCompleted("atom");

    expect(getCompletedLessonsCount()).toBe(2);
    expect(isLessonCompleted("energy")).toBe(true);
    expect(isLessonCompleted("atom")).toBe(true);
  });

  it("clears progress successfully", () => {
    markLessonCompleted("energy");
    expect(getCompletedLessonsCount()).toBe(1);
    clearProgress();
    expect(getCompletedLessonsCount()).toBe(0);
  });
});
