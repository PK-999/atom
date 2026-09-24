import type { ExhibitKind } from "./spatial-model";
export function SpatialDiagram({
  kind,
  stage = 0,
  selected,
}: {
  kind: ExhibitKind;
  stage?: number;
  selected: string;
}) {
  const violet = "var(--atom-energy-nuclear)",
    teal = "var(--atom-accent)",
    amber = "var(--atom-warning)";
  return (
    <svg
      viewBox="0 0 560 300"
      role="img"
      aria-label={`${kind} schematic; selected component: ${selected}`}
    >
      {kind === "atom" ? (
        <>
          <ellipse
            cx="280"
            cy="150"
            rx="150"
            ry="85"
            fill="none"
            stroke={teal}
            strokeWidth="2"
            strokeDasharray="4 7"
          />
          <ellipse
            cx="280"
            cy="150"
            rx="115"
            ry="115"
            fill={teal}
            opacity=".07"
          />
          {[
            [-16, -8],
            [10, -15],
            [-8, 16],
            [18, 12],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={280 + x}
              cy={150 + y}
              r="18"
              fill={i % 2 ? teal : violet}
              stroke="var(--atom-surface-panel)"
              strokeWidth="2"
            />
          ))}
          <circle cx="415" cy="110" r="7" fill={amber} />
          <path
            d="M292 128L350 65H420M407 115L435 200H475"
            fill="none"
            stroke="currentColor"
          />
          <text x="353" y="55" fill="currentColor" fontSize="15">
            Nucleus
          </text>
          <text x="425" y="222" fill="currentColor" fontSize="15">
            Electron cloud
          </text>
        </>
      ) : kind === "fuel" ? (
        <>
          {Array.from({ length: 7 }, (_, i) => (
            <g
              key={i}
              transform={`translate(${165 + i * 32 + (i - 3) * stage * 7},0)`}
            >
              <rect
                x="0"
                y={65 - stage * 10}
                width="15"
                height="170"
                rx="7"
                fill={i === 3 ? violet : teal}
                opacity={i === 3 ? 1 : 0.55}
              />
              {i === 3 &&
                Array.from({ length: 8 }, (_, j) => (
                  <rect
                    key={j}
                    x="2"
                    y={75 + j * 18 - stage * 10}
                    width="11"
                    height="13"
                    rx="2"
                    fill={amber}
                  />
                ))}
            </g>
          ))}
          <path
            d={`M150 ${100 + stage * 13}H390M150 ${205 + stage * 13}H390`}
            stroke={violet}
            strokeWidth="12"
          />
          <text x="26" y="36" fill="currentColor" fontSize="15">
            Fuel pellets → rods → assembly
          </text>
        </>
      ) : (
        <>
          <path
            d="M55 150H205"
            stroke={teal}
            strokeDasharray="5 7"
            fill="none"
          />
          <circle
            cx={stage === 0 ? 95 : 245}
            cy="150"
            r="8"
            fill={teal}
            opacity={stage < 2 ? 1 : 0}
          />
          {stage < 3 ? (
            <ellipse
              cx="285"
              cy="150"
              rx={stage === 2 ? 66 : 44}
              ry={stage === 2 ? 26 : 44}
              fill={violet}
            />
          ) : (
            <>
              <circle cx="220" cy="125" r="32" fill={violet} />
              <circle cx="355" cy="175" r="27" fill={amber} />
              {[70, 140, 220].map((y, i) => (
                <circle key={y} cx={410 + i * 20} cy={y} r="7" fill={teal} />
              ))}
            </>
          )}
          <text x="45" y="255" fill="currentColor" fontSize="15">
            {stage === 3
              ? "Fragments + released neutrons"
              : stage === 0
                ? "Incoming neutron → uranium nucleus"
                : "Excited nucleus (conceptual shape)"}
          </text>
        </>
      )}
    </svg>
  );
}
