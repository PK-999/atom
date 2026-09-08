import { describe, expect, it } from "vitest";
import {
  ReactorSystemSchema,
  ReactorComponentSchema,
  ReactorFlowSchema,
} from "./schemas";

describe("Reactor Schemas (R15)", () => {
  it("validates a valid reactor system with components and flows", () => {
    const system = {
      id: "pwr-gen3",
      type: "PWR",
      name: "Pressurized Water Reactor (Gen III+)",
      summary: "The most common type of light water reactor.",
      components: [
        {
          id: "pwr-vessel",
          name: "Reactor Pressure Vessel",
          type: "vessel",
          role: "Houses the core and contains pressure",
          description: "Thick carbon-steel forged vessel.",
          connectedFlowIds: ["flow-1"],
        },
        {
          id: "pwr-fuel",
          name: "Low-Enriched Uranium",
          type: "fuel",
          role: "Heat generation",
          description: "Uranium dioxide pellets enclosed in zirconium alloy.",
          connectedFlowIds: ["flow-1"],
        },
      ],
      flows: [
        {
          id: "flow-1",
          name: "Primary Hot Leg",
          fromComponentId: "pwr-vessel",
          toComponentId: "pwr-fuel",
          loop: "primary",
          fluid: "Pressurized light water",
          operatingTemp: "325°C",
          operatingPressure: "15.5 MPa",
        },
      ],
    };

    const parsed = ReactorSystemSchema.parse(system);
    expect(parsed.id).toBe("pwr-gen3");
    expect(parsed.components).toHaveLength(2);
    expect(parsed.flows).toHaveLength(1);
  });

  it("validates component coordinates bounds", () => {
    const validComp = {
      id: "comp-1",
      name: "Core",
      type: "fuel",
      role: "Fission",
      description: "Fuel bundle",
      diagramCoords: { x: 100, y: 150, width: 80, height: 120 },
    };
    expect(ReactorComponentSchema.parse(validComp).diagramCoords?.x).toBe(100);

    const invalidCoords = {
      ...validComp,
      diagramCoords: { x: -10, y: 150, width: 80, height: 120 },
    };
    expect(() => ReactorComponentSchema.parse(invalidCoords)).toThrow();
  });

  it("validates flow loops", () => {
    const validFlow = {
      id: "flow-secondary",
      name: "Steam flow",
      fromComponentId: "c1",
      toComponentId: "c2",
      loop: "secondary",
      fluid: "Saturated steam",
    };
    expect(ReactorFlowSchema.parse(validFlow).loop).toBe("secondary");
  });
});
