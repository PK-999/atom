import { Circle } from "@phosphor-icons/react/Circle";
import { Diamond } from "@phosphor-icons/react/Diamond";
import { Pentagon } from "@phosphor-icons/react/Pentagon";
import { Square } from "@phosphor-icons/react/Square";
import { Triangle } from "@phosphor-icons/react/Triangle";

import type { ChartMarker as ChartMarkerName } from "./chart-types";

export function ChartMarker({ marker }: { marker: ChartMarkerName }) {
  const properties = { "aria-hidden": true, size: 18, weight: "fill" as const };
  if (marker === "circle") return <Circle {...properties} />;
  if (marker === "square") return <Square {...properties} />;
  if (marker === "triangle") return <Triangle {...properties} />;
  if (marker === "diamond") return <Diamond {...properties} />;
  return <Pentagon {...properties} />;
}
