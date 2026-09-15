import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { LessonViewer } from "./LessonViewer";
import type { LessonRecord, Topic } from "@/lib/education/schemas";

const sampleLesson: LessonRecord = {
  id: "energy",
  slug: "energy",
  title: "Energy & Power",
  topicId: "fundamentals",
  objective: "Distinguish power from energy and understand energy density.",
  order: 1,
  prerequisiteIds: [],
  conceptIds: ["energy-conservation"],
  claimIds: ["fuel-energy-density"],
  contentByLevel: {
    beginner: "Energy is the ability to do work.",
    explorer: "Energy is measured in kilowatt-hours and power in watts.",
    curious:
      "Chemical fuels store energy in electron bonds (~4 eV), while nuclear fuels store energy in nuclei (~200 MeV).",
    "deep-dive":
      "Specific energy density governs fuel logistics: uranium dioxide yields ~500,000 MJ/kg.",
    geeky: "Mass-energy equivalence governs nuclear mass defect in fission.",
  },
  checkpointIds: ["chk-energy-density"],
  nextLessonId: "atom",
  status: "published",
  version: "1.0.0",
  lastVerifiedAt: "2026-09-07",
};

const sampleTopic: Topic = {
  id: "fundamentals",
  slug: "fundamentals",
  title: "Energy Fundamentals",
  description: "Core physical definitions and principles.",
  order: 1,
  status: "published",
  subtopics: [],
};

const sampleNextLesson: LessonRecord = {
  id: "atom",
  slug: "atom",
  title: "Inside the Atom",
  topicId: "fundamentals",
  objective: "Atomic structure and isotopes.",
  order: 2,
  prerequisiteIds: ["energy"],
  conceptIds: [],
  claimIds: [],
  contentByLevel: {
    beginner: "Atoms are tiny.",
    explorer: "Atoms have protons.",
    curious: "Atoms have nuclei.",
    "deep-dive": "Atomic cross sections.",
    geeky: "Binding energy.",
  },
  checkpointIds: [],
  nextLessonId: null,
  status: "published",
  version: "1.0.0",
  lastVerifiedAt: "2026-09-07",
};

beforeEach(() => {
  const values = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      clear: () => values.clear(),
      getItem: (key: string) => values.get(key) ?? null,
      key: (index: number) => [...values.keys()][index] ?? null,
      length: values.size,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, val: string) => values.set(key, val),
    },
  });
});

describe("LessonViewer", () => {
  it("renders breadcrumbs, title, objective, and level switcher", () => {
    render(
      <LessonViewer
        lesson={sampleLesson}
        topic={sampleTopic}
        nextLesson={sampleNextLesson}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Energy & Power",
    );
    expect(
      screen.getByText(
        "Distinguish power from energy and understand energy density.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Energy Fundamentals")[0]).toBeInTheDocument();
    expect(screen.getByTestId("next-lesson")).toHaveAttribute(
      "href",
      "/learn/atom",
    );
  });

  it("adapts explanation content based on stored complexity level", () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "beginner");

    render(
      <LessonViewer
        lesson={sampleLesson}
        topic={sampleTopic}
        nextLesson={sampleNextLesson}
      />,
    );

    const explanationEl = screen.getByTestId("lesson-explanation");
    expect(explanationEl).toHaveTextContent(
      "Energy is the ability to do work.",
    );
  });
});
