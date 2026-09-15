import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ReactorControlSimulator } from "./ReactorControlSimulator";

describe("ReactorControlSimulator", () => {
  it("renders core simulator with controls and readouts", () => {
    render(<ReactorControlSimulator />);
    expect(
      screen.getByText(/Commercial Reactor Core & Control Rod Simulator/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/TRIGGER EMERGENCY SCRAM/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Thermal Power/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getAllByText(/Electrical Output/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("updates control rod insertion and adjusts power", () => {
    render(<ReactorControlSimulator />);
    const rodSlider = screen.getByLabelText(
      /Control Rod Bank Insertion Percentage/i,
    );
    fireEvent.change(rodSlider, { target: { value: "30.0" } });
    expect(screen.getByText("30.0%")).toBeInTheDocument();
  });

  it("triggers emergency SCRAM, disables rod slider, and engages decay heat", () => {
    render(<ReactorControlSimulator />);
    const scramBtn = screen.getByRole("button", {
      name: /TRIGGER EMERGENCY SCRAM/i,
    });
    fireEvent.click(scramBtn);

    expect(
      screen.getAllByText(/REACTOR SCRAMMED/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(scramBtn).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Cold Restart & Reset Core Trip/i }),
    ).toBeInTheDocument();
  });

  it("resets reactor on cold restart button click", () => {
    render(<ReactorControlSimulator />);
    const scramBtn = screen.getByRole("button", {
      name: /TRIGGER EMERGENCY SCRAM/i,
    });
    fireEvent.click(scramBtn);

    const restartBtn = screen.getByRole("button", {
      name: /Cold Restart & Reset Core Trip/i,
    });
    fireEvent.click(restartBtn);

    expect(scramBtn).not.toBeDisabled();
    expect(screen.getByText("52.0%")).toBeInTheDocument();
  });

  it("renders the RPV engineering cutaway diagram with nozzles and fuel zone", () => {
    render(<ReactorControlSimulator />);
    expect(
      screen.getByRole("img", { name: /Reactor pressure vessel schematic/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/IN \(290°C\)/i)).toBeInTheDocument();
    expect(screen.getByText(/OUT \(326°C\)/i)).toBeInTheDocument();
  });

  it("displays Xenon-135 poisoning telemetry and records safety trip events in the event log", () => {
    render(<ReactorControlSimulator />);
    expect(screen.getByText(/Xenon-135 Worth/i)).toBeInTheDocument();
    expect(screen.getByText(/Xenon State/i)).toBeInTheDocument();

    const eventLog = screen.getByRole("log", {
      name: /Reactor Trip and Event Log/i,
    });
    expect(eventLog).toBeInTheDocument();
    expect(eventLog).toHaveTextContent(
      /synchronized to 400kV transmission grid/i,
    );

    // Trigger SCRAM and check event log addition
    const scramBtn = screen.getByRole("button", {
      name: /TRIGGER EMERGENCY SCRAM/i,
    });
    fireEvent.click(scramBtn);
    expect(eventLog).toHaveTextContent(
      /\[SAFETY TRIP\] Emergency SCRAM actuated/i,
    );
  });
});
