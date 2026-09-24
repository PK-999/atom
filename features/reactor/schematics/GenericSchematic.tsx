import type { SchematicParts } from "./types";
import styles from "../ReactorExplorer.module.css";
export function GenericSchematic({
  system,
  renderDefs,
  renderComponentButton,
}: SchematicParts) {
  return (
    <svg
      viewBox="0 0 820 420"
      className={styles.diagramSvg}
      role="group"
      aria-label={`Interactive schematic diagram for ${system.name}`}
    >
      <g>
        {renderDefs()}

        <rect
          x="40"
          y="40"
          width="740"
          height="340"
          rx="16"
          fill="rgba(15, 23, 42, 0.6)"
          stroke="#334155"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x="410"
          y="70"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#64748b"
          letterSpacing="0.06em"
        >
          {system.name.toUpperCase()} SCHEMATIC
        </text>

        {system.components.map((comp) => {
          const coords = comp.diagramCoords ?? {
            x: 100,
            y: 150,
            width: 100,
            height: 80,
          };
          return renderComponentButton(comp.id, (isSelected) => (
            <g key={comp.id} data-part-id={comp.id}>
              <rect
                x={coords.x}
                y={coords.y}
                width={coords.width}
                height={coords.height}
                rx="8"
                fill={
                  comp.type === "fuel"
                    ? "url(#fissionThermalGlow)"
                    : comp.type === "vessel"
                      ? "url(#vesselSteelGrad)"
                      : "rgba(30, 41, 59, 0.85)"
                }
                stroke={isSelected ? "#38bdf8" : "#64748b"}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x={coords.x + coords.width / 2}
                y={coords.y + coords.height / 2 + 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill={comp.type === "vessel" ? "#0f172a" : "#f8fafc"}
              >
                {comp.name.length > 20
                  ? comp.name.substring(0, 18) + "…"
                  : comp.name}
              </text>
            </g>
          ));
        })}
      </g>
    </svg>
  );
}
