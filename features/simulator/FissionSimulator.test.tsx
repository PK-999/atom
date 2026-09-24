import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FissionSimulator } from "./FissionSimulator";
describe("replayable fission exhibit", () => {
  it("keeps a single event when revisiting stages and resets explicitly", () => {
    render(<FissionSimulator />);
    fireEvent.click(screen.getByRole("button", { name: "4. Split" }));
    expect(screen.getByText(/Events in this replay: 1/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "1. Approach" }));
    fireEvent.click(screen.getByRole("button", { name: "4. Split" }));
    expect(screen.getByText(/Events in this replay: 1/)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByText(/Events in this replay: 0/)).toBeVisible();
  });
  it("supports manual steps, prediction feedback and a readable alternative", () => {
    render(<FissionSimulator />);
    fireEvent.change(screen.getByLabelText("My prediction"), {
      target: { value: "always" },
    });
    for (let i = 0; i < 3; i++)
      fireEvent.click(screen.getByRole("button", { name: "Step" }));
    expect(
      screen.getByText(/Capture does not always cause fission/),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Step" })).toBeDisabled();
    expect(screen.getByText("Read all steps")).toBeVisible();
    expect(screen.getByRole("button", { name: "Sound off" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
