import { useId } from "react";
/** Conceptual PWR energy pathway; no plant geometry or performance calculation. */
export function EnergyConversionDiagram({ stage }: { stage: number }) {
  const marker = useId();
  const text = "var(--atom-text-primary)",
    muted = "var(--atom-text-secondary)";
  const active = (step: number) =>
    stage >= step ? "var(--atom-accent)" : "var(--atom-border-strong)";
  return (
    <svg
      viewBox="0 0 600 400"
      role="img"
      aria-label={`Energy conversion schematic, stage ${stage + 1}: reactor heat, steam, turbine motion, generator electricity`}
      style={{
        width: "100%",
        display: "block",
        background: "var(--atom-surface-elevated)",
      }}
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="context-stroke" />
        </marker>
      </defs>
      <g fill="none" strokeWidth="4" markerEnd={`url(#${marker})`}>
        <path d="M115 165H202" stroke="var(--atom-warning)" />
        <path d="M240 165H335" stroke={active(1)} strokeDasharray="8 6" />
        <path d="M385 200H430" stroke={active(2)} />
        <path d="M490 200H560" stroke={active(3)} />
      </g>
      <rect
        x="58"
        y="125"
        width="64"
        height="132"
        rx="28"
        fill="var(--atom-energy-nuclear)"
        opacity=".2"
        stroke="var(--atom-energy-nuclear)"
        strokeWidth="3"
      />
      {[75, 89, 103].map((x) => (
        <rect
          key={x}
          x={x}
          y="165"
          width="8"
          height="68"
          rx="4"
          fill="var(--atom-warning)"
        />
      ))}
      <rect
        x="200"
        y="130"
        width="48"
        height="130"
        rx="22"
        fill="var(--atom-surface-panel)"
        stroke={active(1)}
        strokeWidth="3"
      />
      <path
        d="M210 220Q238 220 238 205T210 190T238 175"
        fill="none"
        stroke="var(--atom-warning)"
        strokeWidth="4"
      />
      <circle
        cx="360"
        cy="200"
        r="31"
        fill="var(--atom-surface-panel)"
        stroke={active(2)}
        strokeWidth="3"
      />
      {[0, 120, 240].map((angle) => (
        <path
          key={angle}
          transform={`rotate(${angle + stage * 25} 360 200)`}
          d="M360 200L354 174Q376 174 367 196Z"
          fill={active(2)}
        />
      ))}
      <rect
        x="430"
        y="174"
        width="60"
        height="52"
        rx="12"
        fill="var(--atom-surface-panel)"
        stroke={active(3)}
        strokeWidth="3"
      />
      <path
        d="M466 182L452 201H467L453 218"
        fill="none"
        stroke={active(3)}
        strokeWidth="3"
      />
      <g fontSize="16" fill={text} textAnchor="middle">
        <text x="90" y="105">
          Reactor heat
        </text>
        <text x="224" y="105">
          Steam generator
        </text>
        <text x="360" y="260">
          Turbine
        </text>
        <text x="460" y="260">
          Generator
        </text>
        <text x="540" y="168">
          Electricity
        </text>
      </g>
      <g fill={muted} fontSize="14" textAnchor="middle">
        <text x="300" y="320">
          Heat → steam → motion → electricity
        </text>
        <text x="300" y="349">
          Primary coolant and steam stay in separate circuits.
        </text>
        <text x="300" y="373">
          Cooling, return flows and losses are omitted from this pathway.
        </text>
      </g>
    </svg>
  );
}
