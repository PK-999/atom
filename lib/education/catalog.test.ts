import { describe, it, expect } from "vitest";
import {
  listTopics,
  getTopic,
  listPublishedLessons,
  getPublishedLesson,
  getCheckpointsForLesson,
  listGlossaryTerms,
  getGlossaryTerm,
} from "./catalog";

describe("Education Catalog (R10)", () => {
  it("lists all available topics and retrieves by slug", () => {
    const topics = listTopics();
    expect(topics.length).toBeGreaterThanOrEqual(4);

    const fundamentals = getTopic("fundamentals");
    expect(fundamentals).not.toBeNull();
    expect(fundamentals?.title).toBe("Energy Fundamentals");
  });

  it("lists published lessons in strictly sequential order", () => {
    const lessons = listPublishedLessons();
    expect(lessons.length).toBe(7);

    // Verify order 1..7
    for (let i = 0; i < lessons.length; i++) {
      expect(lessons[i].order).toBe(i + 1);
    }
  });

  it("returns null when requesting an unpublished or non-existent lesson via getPublishedLesson", () => {
    expect(getPublishedLesson("non-existent")).toBeNull();
  });

  it("keeps lesson progress versions while providing one explanation", () => {
    const lesson = getPublishedLesson("energy");
    expect(lesson?.version).toBe("1.0.0");
    expect(lesson?.explanation.summary).toContain("Energy");
    expect(
      lesson?.explanation.details?.some(
        (detail) => detail.id === "energy-density",
      ),
    ).toBe(true);
  });

  it("retrieves checkpoints associated with a lesson", () => {
    const checkpoints = getCheckpointsForLesson("energy");
    expect(checkpoints.length).toBeGreaterThanOrEqual(1);
    expect(checkpoints[0].options.some((o) => o.isCorrect)).toBe(true);
  });

  it("lists glossary terms and retrieves specific term by id", () => {
    const terms = listGlossaryTerms();
    expect(terms.length).toBeGreaterThanOrEqual(5);

    const term = getGlossaryTerm("half-life");
    expect(term).not.toBeNull();
    expect(term?.term).toBe("Half-life");
  });
});
