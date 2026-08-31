import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";
import { Chip } from "./Chip";
import { CommandMenu } from "./CommandMenu";
import { Skeleton, StatePanel } from "./Feedback";
import { OverlayPanel } from "./OverlayPanel";
import { SegmentedControl } from "./SegmentedControl";
import { Tabs } from "./Tabs";
import { Tooltip } from "./Tooltip";

function SegmentedHarness() {
  const [value, setValue] = useState("typical");
  return (
    <SegmentedControl
      label="Display mode"
      onValueChange={setValue}
      options={[
        { label: "Typical", value: "typical" },
        { label: "Range", value: "range" },
      ]}
      value={value}
    />
  );
}

function ChipHarness() {
  const [selected, setSelected] = useState(false);
  return (
    <Chip onSelectedChange={setSelected} selected={selected}>
      Wind
    </Chip>
  );
}

describe("shared UI primitives", () => {
  it("communicates button loading and disabled states", () => {
    render(
      <>
        <Button loading>Save review</Button>
        <Button disabled>Publish</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Save review" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Save review" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("button", { name: "Publish" })).toBeDisabled();
  });

  it("supports pressed chips and segmented selection", () => {
    render(
      <>
        <ChipHarness />
        <SegmentedHarness />
      </>,
    );

    expect(screen.getByRole("button", { name: "Wind" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    fireEvent.click(screen.getByRole("button", { name: "Wind" }));
    expect(screen.getByRole("button", { name: "Wind" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Range" }));
    expect(screen.getByRole("button", { name: "Range" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("moves between tabs with arrow keys and updates the panel", () => {
    render(
      <Tabs
        items={[
          { id: "summary", label: "Summary", content: "Concise evidence" },
          { id: "method", label: "Method", content: "Method details" },
        ]}
        label="Evidence views"
      />,
    );
    const summary = screen.getByRole("tab", { name: "Summary" });

    summary.focus();
    fireEvent.keyDown(summary, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Method" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Method details");
  });

  it("keeps tab and panel relationships unique across component instances", () => {
    const items = [
      { id: "summary", label: "Summary", content: "Concise evidence" },
      { id: "method", label: "Method", content: "Method details" },
    ];
    render(
      <>
        <Tabs items={items} label="First evidence views" />
        <Tabs items={items} label="Second evidence views" />
      </>,
    );

    const summaryTabs = screen.getAllByRole("tab", { name: "Summary" });
    const panels = screen.getAllByRole("tabpanel");
    expect(new Set(summaryTabs.map((tab) => tab.id)).size).toBe(2);
    expect(new Set(panels.map((panel) => panel.id)).size).toBe(2);
    summaryTabs.forEach((tab, index) => {
      expect(tab).toHaveAttribute("aria-controls", panels[index]?.id);
      expect(panels[index]).toHaveAttribute("aria-labelledby", tab.id);
    });
  });

  it("opens overlays and restores focus after Escape", async () => {
    render(
      <OverlayPanel
        description="Inspect the selected record."
        title="Evidence record"
        trigger="Open evidence"
        variant="drawer"
      >
        <p>Record details</p>
      </OverlayPanel>,
    );
    const trigger = screen.getByRole("button", { name: "Open evidence" });
    trigger.focus();

    fireEvent.click(trigger);
    expect(
      screen.getByRole("dialog", { name: "Evidence record" }),
    ).toBeVisible();
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("filters command items and returns the selected result", () => {
    function Harness() {
      const [selected, setSelected] = useState("None");
      return (
        <>
          <CommandMenu
            items={[
              { id: "land", label: "Land use", description: "m²/GWh" },
              { id: "water", label: "Water use", description: "L/MWh" },
            ]}
            label="Browse metrics"
            onSelect={(item) => setSelected(item.label)}
            trigger="Choose metric"
          />
          <output>{selected}</output>
        </>
      );
    }
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: "Choose metric" }));
    const dialog = screen.getByRole("dialog", { name: "Browse metrics" });
    fireEvent.change(within(dialog).getByRole("searchbox"), {
      target: { value: "water" },
    });

    expect(within(dialog).queryByText("Land use")).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", { name: /Water use/ }));
    expect(screen.getByText("Water use", { selector: "output" })).toBeVisible();
  });

  it("makes tooltip and feedback content available without hover", () => {
    render(
      <>
        <Tooltip
          content="A representative value selected by policy"
          label="Define typical"
        />
        <Skeleton label="Loading chart" />
        <StatePanel
          action={<button type="button">Choose another metric</button>}
          message="We do not currently have reliable comparable data."
          title="Missing evidence"
          tone="missing"
        />
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Define typical" }));
    expect(screen.getByRole("tooltip")).toBeVisible();
    expect(screen.getByRole("status", { name: "Loading chart" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Missing evidence" }),
    ).toBeVisible();
  });

  it("opens tooltips on hover and closes them when focus or pointer leaves", () => {
    render(<Tooltip content="Inspectable definition" label="Define metric" />);
    const trigger = screen.getByRole("button", { name: "Define metric" });

    fireEvent.mouseEnter(trigger.closest("span")!);
    expect(screen.getByRole("tooltip")).toBeVisible();
    fireEvent.mouseLeave(trigger.closest("span")!);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeVisible();
    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("keeps a pointer-clicked tooltip open until all active inputs leave", () => {
    render(<Tooltip content="Inspectable definition" label="Define metric" />);
    const trigger = screen.getByRole("button", { name: "Define metric" });
    const wrapper = trigger.closest("span")!;

    fireEvent.mouseEnter(wrapper);
    fireEvent.focus(trigger);
    fireEvent.click(trigger);
    expect(screen.getByRole("tooltip")).toBeVisible();

    fireEvent.mouseLeave(wrapper);
    expect(screen.getByRole("tooltip")).toBeVisible();
    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("dismisses a focused and hovered tooltip with Escape", () => {
    render(<Tooltip content="Inspectable definition" label="Define metric" />);
    const trigger = screen.getByRole("button", { name: "Define metric" });
    const wrapper = trigger.closest("span")!;

    fireEvent.mouseEnter(wrapper);
    fireEvent.focus(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
