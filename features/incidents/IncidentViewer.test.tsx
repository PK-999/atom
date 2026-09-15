import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IncidentViewer } from "./IncidentViewer";

function renderViewer() {
  return render(<IncidentViewer />);
}

describe("IncidentViewer Component", () => {
  it("renders page title and initial Chernobyl incident", () => {
    renderViewer();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Nuclear Incidents & Forensics/i,
      }),
    ).toBeDefined();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Chernobyl Disaster \(1986\)/i,
      }),
    ).toBeDefined();

    expect(screen.getByText(/RBMK-1000/i)).toBeDefined();
    expect(screen.getByText(/Root Cause Breakdown/i)).toBeDefined();
  });

  it("switches to Fukushima Daiichi and updates metadata and ines badge", () => {
    renderViewer();

    const fukushimaBtn = screen.getByRole("tab", {
      name: /Fukushima Daiichi Accident/i,
    });
    fireEvent.click(fukushimaBtn);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /Fukushima Daiichi Accident \(2011\)/i,
      }),
    ).toBeDefined();

    expect(screen.getByText(/BWR-3 \/ BWR-4/i)).toBeDefined();
  });

  it("navigates through incident sub-tabs (timeline, health, lessons)", () => {
    renderViewer();

    // Click Chronological Timeline sub-tab
    const timelineTab = screen.getByRole("tab", {
      name: /Chronological Timeline/i,
    });
    fireEvent.click(timelineTab);
    expect(screen.getByText(/Sequence of Events/i)).toBeDefined();
    expect(screen.getByText(/Emergency SCRAM \(AZ-5\) Pressed/i)).toBeDefined();

    // Click Radiological Release & Health sub-tab
    const healthTab = screen.getByRole("tab", {
      name: /Radiological Release & Health/i,
    });
    fireEvent.click(healthTab);
    expect(
      screen.getByText(/Radiological Release & Independent Health Audits/i),
    ).toBeDefined();
    expect(screen.getByText(/Immediate Fatalities/i)).toBeDefined();
    expect(screen.getByText("31")).toBeDefined();

    // Click Engineering Safeguards Enacted sub-tab
    const lessonsTab = screen.getByRole("tab", {
      name: /Engineering Safeguards Enacted/i,
    });
    fireEvent.click(lessonsTab);
    expect(
      screen.getByText(/Engineering & Regulatory Changes Implemented/i),
    ).toBeDefined();
    expect(screen.getByText(/longer control rod displacers/i)).toBeDefined();
  });

  it("switches to Fact Checks & FAQs mode and filters questions", () => {
    renderViewer();

    // Switch to FAQs mode
    const faqsModeBtn = screen.getByRole("tab", {
      name: /Fact Checks & FAQs/i,
    });
    fireEvent.click(faqsModeBtn);

    expect(
      screen.getByRole("region", {
        name: /Frequently Asked Questions & Fact Checks/i,
      }),
    ).toBeDefined();

    // Search for "bomb"
    const searchInput = screen.getByPlaceholderText(/Search questions/i);
    fireEvent.change(searchInput, { target: { value: "bomb" } });

    expect(
      screen.getByText(
        /Can any nuclear power station explode like a nuclear bomb/i,
      ),
    ).toBeDefined();

    // Toggle category filter
    const healthPill = screen.getByRole("button", { name: "Health" });
    fireEvent.click(healthPill);

    // Question about bomb is physics category, should not show in health category
    expect(
      screen.queryByText(
        /Can any nuclear power station explode like a nuclear bomb/i,
      ),
    ).toBeNull();
  });

  it("allows switching explanation depth level", () => {
    renderViewer();

    // Switch to Geeky level
    const geekyBtn = screen.getByRole("button", { name: "geeky" });
    fireEvent.click(geekyBtn);

    // Look for technical geeky terminology
    expect(screen.getAllByText(/INSAG-7/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/delayed neutron fraction/i)).toBeDefined();
  });
});
