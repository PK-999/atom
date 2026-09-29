import { useId } from "react";
import { MaterialDefs } from "@/components/education/schematic/MechanicalParts";
import type { ExhibitKind } from "./spatial-model";

/** Nucleons are illustrative samples, not an isotope's proton/neutron inventory. */
function NucleonCluster({
  id,
  x,
  y,
  stretch = 1,
  radius = 43,
  count = 31,
}: {
  id: string;
  x: number;
  y: number;
  stretch?: number;
  radius?: number;
  count?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${stretch} ${1 / stretch})`}>
      {Array.from({ length: count }, (_, i) => {
        const a = i * 2.39996,
          r = radius * Math.sqrt(i / count);
        return (
          <circle
            key={i}
            cx={Math.cos(a) * r}
            cy={Math.sin(a) * r}
            r={radius * 0.24}
            fill={`url(#${id}-${i % 2 ? "neutron" : "proton"})`}
            stroke="#1b3547"
            strokeWidth=".5"
          />
        );
      })}
    </g>
  );
}
export function SpatialDiagram({
  kind,
  stage = 0,
  selected,
}: {
  kind: ExhibitKind;
  stage?: number;
  selected: string;
}) {
  const id = useId();
  const focus = (part: string) => (selected === part ? "#a7e3d8" : "#7894a1");
  return (
    <svg
      viewBox="0 0 560 320"
      role="img"
      aria-label={`${kind} schematic; selected component: ${selected}`}
      style={{ background: "#14212c", color: "#dae7ea" }}
    >
      <MaterialDefs id={id} />
      <defs>
        <radialGradient id={`${id}-cloud`}>
          <stop stopColor="#73c6cf" stopOpacity=".03" />
          <stop offset=".45" stopColor="#73c6cf" stopOpacity=".32" />
          <stop offset="1" stopColor="#73c6cf" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-proton`} cx=".3" cy=".25">
          <stop stopColor="#f4dac0" />
          <stop offset=".4" stopColor="#bb896c" />
          <stop offset="1" stopColor="#533e43" />
        </radialGradient>
        <radialGradient id={`${id}-neutron`} cx=".3" cy=".25">
          <stop stopColor="#d2edf0" />
          <stop offset=".4" stopColor="#76aab4" />
          <stop offset="1" stopColor="#28465c" />
        </radialGradient>
      </defs>
      <text x="24" y="28" fill="#b0c6d0" fontSize="11" letterSpacing="2">
        {kind === "fuel"
          ? "FUEL ASSEMBLY · CUTAWAY"
          : kind === "atom"
            ? "ATOMIC STRUCTURE · CONCEPTUAL"
            : "ONE FISSION EVENT · STORYBOARD"}
      </text>
      {kind === "atom" ? (
        <>
          <circle cx="265" cy="165" r="126" fill={`url(#${id}-cloud)`} />
          {Array.from({ length: 180 }, (_, i) => {
            const a = i * 2.39996,
              r = 20 + 105 * Math.sqrt(i / 180);
            return (
              <circle
                key={i}
                cx={265 + Math.cos(a) * r}
                cy={165 + Math.sin(a) * r * 0.9}
                r={i % 3 ? 1 : 1.8}
                fill="#91d0d4"
                opacity={selected === "electrons" ? 0.65 : 0.28}
              />
            );
          })}
          <NucleonCluster id={id} x={265} y={165} radius={35} />
          <path
            d="M292 143L360 91H449M365 211L399 250H496"
            fill="none"
            stroke={focus("nucleus")}
          />
          <text x="360" y="80" fontSize="15" fill={focus("nucleus")}>
            Nucleus
          </text>
          <text x="394" y="271" fontSize="15" fill={focus("electrons")}>
            Electron cloud
          </text>
          <text x="24" y="303" fontSize="12" fill="#acc3ce">
            Cloud shows probability, not fixed electron paths.
          </text>
        </>
      ) : kind === "fuel" ? (
        <>
          <ellipse
            cx="266"
            cy="280"
            rx="135"
            ry="13"
            fill="#000"
            opacity=".18"
          />
          {Array.from({ length: 11 }, (_, i) => {
            const x = 167 + i * 19 + (i - 5) * stage * 4,
              y = 65 - stage * 5;
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width="12"
                  height="190"
                  rx="5"
                  fill={`url(#${id}-steel)`}
                  stroke={focus("rods")}
                  strokeWidth={selected === "rods" ? 1.5 : 0.4}
                />
                <ellipse cx={x + 6} cy={y + 2} rx="5" ry="2" fill="#c8d6da" />
                {i === 5 && (
                  <>
                    <rect
                      x={x + 1}
                      y={y + 41}
                      width="10"
                      height="126"
                      fill="#1b2c37"
                    />
                    {Array.from({ length: 8 }, (_, j) => (
                      <g key={j}>
                        <rect
                          x={x + 2}
                          y={y + 43 + j * 15}
                          width="8"
                          height="12"
                          rx="1"
                          fill={`url(#${id}-pellet)`}
                          stroke={
                            selected === "pellets" ? "#f0c994" : "#9faeba"
                          }
                          strokeWidth=".7"
                        />
                        <ellipse
                          cx={x + 6}
                          cy={y + 44 + j * 15}
                          rx="4"
                          ry="1.5"
                          fill="#bdc5c7"
                        />
                      </g>
                    ))}
                  </>
                )}
              </g>
            );
          })}
          {[108, 220].map((y) => (
            <g key={y} transform={`translate(0 ${stage * 12})`}>
              <path
                d={`M151 ${y}L170 ${y - 8}H374L386 ${y}V${y + 13}H151Z`}
                fill={`url(#${id}-steel)`}
                stroke={focus("spacers")}
                strokeWidth={selected === "spacers" ? 2.5 : 1}
              />
              {Array.from({ length: 13 }, (_, i) => (
                <path
                  key={i}
                  d={`M${157 + i * 17} ${y + 3}v8`}
                  stroke="#4a6271"
                  strokeWidth="4"
                />
              ))}
            </g>
          ))}
          <path
            d="M269 179H419M182 87H83M371 233H422"
            fill="none"
            stroke="#9bb3bf"
          />
          <g fontSize="13" fill="#dce8eb">
            <text x="423" y="182">
              Pellets
            </text>
            <text x="31" y="83">
              Cladding
            </text>
            <text x="421" y="254">
              Spacer grid
            </text>
          </g>
          <text x="24" y="303" fontSize="12" fill="#acc3ce">
            Illustrative rod count · central rod opened for inspection
          </text>
        </>
      ) : (
        <>
          <path
            d="M48 159H214"
            fill="none"
            stroke={focus("neutrons")}
            strokeDasharray="3 7"
          />
          {stage < 2 && (
            <circle
              cx={stage === 0 ? 97 : 246}
              cy="159"
              r="8"
              fill={`url(#${id}-neutron)`}
              stroke={focus("neutrons")}
            />
          )}
          {stage < 3 ? (
            <NucleonCluster
              id={id}
              x={283}
              y={159}
              stretch={stage === 2 ? 1.45 : 1}
              count={stage >= 2 ? 32 : 31}
            />
          ) : (
            <>
              <path
                d="M284 159L198 112M284 159L363 206M284 159L447 86M284 159L465 162M284 159L431 253"
                fill="none"
                stroke="#8aaebc"
                strokeDasharray="3 7"
                opacity=".6"
              />
              <NucleonCluster id={id} x={212} y={117} radius={32} count={17} />
              <NucleonCluster id={id} x={354} y={199} radius={27} count={12} />
              {[
                [447, 86],
                [465, 162],
                [431, 253],
              ].map(([x, y]) => (
                <circle
                  key={y}
                  cx={x}
                  cy={y}
                  r="7"
                  fill={`url(#${id}-neutron)`}
                  stroke={focus("neutrons")}
                />
              ))}
            </>
          )}
          <text x="24" y="284" fontSize="15" fill={focus("nucleus")}>
            {stage >= 3
              ? "Fragments and released neutrons"
              : stage === 0
                ? "A neutron approaches the nucleus"
                : stage === 1
                  ? "The nucleus absorbs the neutron"
                  : "The excited nucleus deforms"}
          </text>
          <text x="24" y="305" fontSize="12" fill="#acc3ce">
            Illustrative nucleons · fragment sizes and neutron yields vary
          </text>
        </>
      )}
    </svg>
  );
}
