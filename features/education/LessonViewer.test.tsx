import { render, screen, fireEvent } from "@testing-library/react";
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
  explanation: {
    summary: "Energy is the ability to do work.",
    body: ["Power describes how quickly energy is transferred."],
    details: [
      {
        id: "units",
        title: "Energy and power units",
        body: "Energy is measured in kilowatt-hours and power in watts.",
      },
    ],
    citationIds: [],
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
  explanation: {
    summary: "Atoms have nuclei.",
    body: ["Protons identify an element."],
    citationIds: [],
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
  it("renders breadcrumbs, title, objective, and next lesson", () => {
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
      "/learn/atom?path=fundamentals",
    );
  });

  it("ignores legacy preferences and opens details without changing a prediction", () => {
    window.localStorage.setItem("atom:preferences:v1:complexity", "beginner");

    render(
      <LessonViewer
        lesson={sampleLesson}
        topic={sampleTopic}
        nextLesson={sampleNextLesson}
      />,
    );

    const prediction = screen.getByRole("textbox");
    fireEvent.change(prediction, {
      target: { value: "More fuel holds more energy" },
    });
    fireEvent.click(screen.getByText("Energy and power units"));
    expect(prediction).toHaveValue("More fuel holds more energy");
    expect(screen.queryByLabelText("Reading depth")).not.toBeInTheDocument();
    expect(window.localStorage.getItem("atom:preferences:v1:complexity")).toBe(
      "beginner",
    );
    const explanationEl = screen.getByTestId("lesson-explanation");
    expect(explanationEl).toHaveTextContent(
      "Energy is the ability to do work.",
    );
  });
});
