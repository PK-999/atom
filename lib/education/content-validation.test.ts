import { describe, it, expect } from "vitest";
import {
  validateContentGraph,
  detectCyclicPrerequisites,
  REQUIRED_INITIAL_LESSONS,
} from "./content-validation";
import rawTopics from "@/content/topics/catalog.json";
import rawLessons from "@/content/lessons/catalog.json";
import rawCheckpoints from "@/content/lessons/checkpoints.json";
import type { LessonRecord } from "./schemas";

describe("Content Validation (R10)", () => {
  it("validates the checked repository content graph without errors", () => {
    const result = validateContentGraph({
      topics: rawTopics,
      lessons: rawLessons,
      checkpoints: rawCheckpoints,
    });
    expect(result.valid, `Validation failed: ${result.errors.join(", ")}`).toBe(
      true,
    );
    expect(result.errors).toEqual([]);
  });

  it("fails when a lesson references a non-existent topicId", () => {
    const invalidLessons = [
      {
        ...rawLessons[0],
        topicId: "non-existent-topic",
      },
    ];
    const result = validateContentGraph({
      topics: rawTopics,
      lessons: invalidLessons,
      checkpoints: rawCheckpoints,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("non-existent topicId"))).toBe(
      true,
    );
  });

  it("fails when a published lesson depends on an unpublished lesson as a prerequisite", () => {
    const mutatedLessons = JSON.parse(JSON.stringify(rawLessons)) as Array<{
      status: string;
      prerequisiteIds: string[];
      id: string;
      [key: string]: unknown;
    }>;
    // Mark first lesson as draft
    mutatedLessons[0].status = "draft";
    // Second lesson depends on first
    mutatedLessons[1].prerequisiteIds = [mutatedLessons[0].id];
    mutatedLessons[1].status = "published";

    const result = validateContentGraph({
      topics: rawTopics,
      lessons: mutatedLessons,
      checkpoints: rawCheckpoints,
    });
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes("unpublished prerequisite")),
    ).toBe(true);
  });

  it("detects cyclic prerequisites in lesson chains", () => {
    const cyclicLessons = [
      {
        ...rawLessons[0],
        id: "lesson-a",
        prerequisiteIds: ["lesson-c"],
      },
      {
        ...rawLessons[1],
        id: "lesson-b",
        prerequisiteIds: ["lesson-a"],
      },
      {
        ...rawLessons[2],
        id: "lesson-c",
        prerequisiteIds: ["lesson-b"],
      },
    ] as unknown as LessonRecord[];

    const cycle = detectCyclicPrerequisites(cyclicLessons);
    expect(cycle).not.toBeNull();
  });

  it("enforces the seven required initial lessons in exact order", () => {
    const ids = rawLessons.map((l) => l.id);
    expect(ids.slice(0, 7)).toEqual(REQUIRED_INITIAL_LESSONS);
  });
});
