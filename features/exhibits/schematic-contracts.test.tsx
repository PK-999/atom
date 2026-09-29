import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnergyConversionDiagram } from "./EnergyConversionDiagram";
import { SpatialDiagram } from "./SpatialDiagram";
import { ReactorSchematic } from "../reactor/schematics/ReactorSchematic";
import { PWR_SYSTEM_DATA } from "@/lib/reactor/reactor-model";

describe("schematic contracts", () => {
  it("keeps SVG resources unique when a lesson mounts multiple reactor views", () => {
    const props = {
      system: PWR_SYSTEM_DATA,
      powerLevel: 100 as const,
      selectedPartId: null,
      activeLoopFilter: "all" as const,
      handleSelectPart: vi.fn(),
      setHoveredPartId: vi.fn(),
      playing: false,
    };
    const { container } = render(
      <>
        <ReactorSchematic {...props} />
        <ReactorSchematic {...props} />
      </>,
    );
    const ids = Array.from(container.querySelectorAll("[id]"), (e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const svg of container.querySelectorAll("svg")) {
      const ownIds = new Set(
        Array.from(svg.querySelectorAll("[id]"), (e) => e.id),
      );
      for (const node of svg.querySelectorAll("*")) {
        for (const attribute of node.attributes) {
          const match = attribute.value.match(/^url\(#(.+)\)$/);
          if (match) expect(ownIds.has(match[1])).toBe(true);
        }
      }
    }
  });
  it("retains cooling and return circuits at every energy step and pauses when requested", () => {
    const { rerender, container } = render(
      <EnergyConversionDiagram stage={0} />,
    );
    for (let stage = 0; stage < 4; stage++) {
      rerender(<EnergyConversionDiagram stage={stage} playing={stage < 3} />);
      expect(
        screen.getByRole("img", { name: new RegExp(`stage ${stage + 1}:`) }),
      ).toBeVisible();
      expect(screen.getByText("Condenser")).toBeVisible();
      expect(screen.getByText("Primary coolant")).toBeVisible();
      expect(screen.getByText("Cooling water")).toBeVisible();
      expect(container.querySelector("figure")).toHaveAttribute(
        "data-playing",
        String(stage < 3),
      );
    }
    rerender(<EnergyConversionDiagram stage={1} playing={false} />);
    expect(container.querySelector("figure")).toHaveAttribute(
      "data-playing",
      "false",
    );
  });
  it("keeps the selected spatial component and event stage in its accessible explanation", () => {
    const { rerender } = render(
      <SpatialDiagram kind="atom" selected="electrons" />,
    );
    expect(screen.getByRole("img")).toHaveAccessibleName(
      /selected component: electrons/,
    );
    expect(
      screen.getByText(/probability, not fixed electron paths/),
    ).toBeVisible();
    rerender(<SpatialDiagram kind="fission" selected="neutrons" stage={3} />);
    expect(screen.getByRole("img")).toHaveAccessibleName(
      /selected component: neutrons/,
    );
    expect(screen.getByText("Fragments and released neutrons")).toBeVisible();
  });
});
