import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LessonCheckpoint } from "./LessonCheckpoint";
import type { Checkpoint } from "@/lib/education/schemas";

const testCheckpoint: Checkpoint = {
  id: "chk-test",
  lessonId: "energy",
  prompt: "Why does nuclear fuel have a high energy density?",
  options: [
    {
      id: "opt-1",
      text: "It involves the strong nuclear force yielding MeV per event.",
      isCorrect: true,
      explanation:
        "Nuclear binding energy is millions of times stronger than chemical bonds.",
    },
    {
      id: "opt-2",
      text: "It burns at much higher chemical combustion temperatures.",
      isCorrect: false,
      explanation: "Nuclear energy is not chemical combustion.",
    },
  ],
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

describe("LessonCheckpoint", () => {
  it("renders the question and options with submit disabled initially", () => {
    render(
      <LessonCheckpoint
        checkpoint={testCheckpoint}
        lessonId="energy"
        lessonVersion="1.0.0"
      />,
    );

    expect(
      screen.getByText("Why does nuclear fuel have a high energy density?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "It involves the strong nuclear force yielding MeV per event.",
      ),
    ).toBeInTheDocument();

    const submitBtn = screen.getByTestId("checkpoint-submit");
    expect(submitBtn).toBeDisabled();
  });

  it("handles incorrect answer submission with retry flow", () => {
    const onComplete = vi.fn();
    render(
      <LessonCheckpoint
        checkpoint={testCheckpoint}
        lessonId="energy"
        lessonVersion="1.0.0"
        onComplete={onComplete}
      />,
    );

    const incorrectRadio = screen.getByLabelText(
      /It burns at much higher chemical combustion temperatures/i,
    );
    fireEvent.click(incorrectRadio);

    const submitBtn = screen.getByTestId("checkpoint-submit");
    expect(submitBtn).not.toBeDisabled();
    fireEvent.click(submitBtn);

    expect(screen.getByText("Not quite.")).toBeInTheDocument();
    expect(
      screen.getByText("Nuclear energy is not chemical combustion."),
    ).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    const retryBtn = screen.getByTestId("checkpoint-retry");
    fireEvent.click(retryBtn);

    expect(screen.queryByText("Not quite.")).not.toBeInTheDocument();
  });

  it("handles correct answer submission and records progress", () => {
    const onComplete = vi.fn();
    render(
      <LessonCheckpoint
        checkpoint={testCheckpoint}
        lessonId="energy"
        lessonVersion="1.0.0"
        onComplete={onComplete}
      />,
    );

    const correctRadio = screen.getByLabelText(
      /It involves the strong nuclear force/i,
    );
    fireEvent.click(correctRadio);

    const submitBtn = screen.getByTestId("checkpoint-submit");
    fireEvent.click(submitBtn);

    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Nuclear binding energy is millions of times stronger than chemical bonds.",
      ),
    ).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);

    const stored = window.localStorage.getItem("atom:learning-progress:v1");
    expect(stored).not.toBeNull();
    expect(stored).toContain("energy");
  });
});
