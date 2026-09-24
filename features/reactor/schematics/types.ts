import type { ReactNode } from "react";
import type { ReactorSystem } from "@/lib/reactor/schemas";
export interface SchematicParts {
  system: ReactorSystem;
  powerLevel: 100 | 50 | 0;
  renderDefs: () => ReactNode;
  renderComponentButton: (
    id: string,
    children: (selected: boolean) => ReactNode,
  ) => ReactNode;
  getLoopClass: (loop: "primary" | "secondary" | "tertiary") => string;
  getFlowSpeedClass: () => string;
  getTurbineClass: () => string;
  getPumpClass: () => string;
  getFissionGlowClass: () => string;
}
