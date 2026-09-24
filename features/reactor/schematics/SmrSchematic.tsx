import type { SchematicParts } from "./types";
import styles from "../ReactorExplorer.module.css";
export function SmrSchematic({
  system,
  powerLevel,
  renderDefs,
  renderComponentButton,
  getLoopClass,
  getFlowSpeedClass,
  getTurbineClass,
  getFissionGlowClass,
}: SchematicParts) {
  const rodTranslateY = powerLevel === 100 ? 0 : powerLevel === 50 ? 20 : 45;

  return (
    <svg
      viewBox="0 0 820 420"
      className={styles.diagramSvg}
      role="group"
      aria-label={`Interactive schematic diagram for ${system.name}`}
    >
      <g>
        {renderDefs()}

        {/* SMR Underground Pool & Module Cavity */}
        {renderComponentButton("smr-cooling-pool", (isSelected) => (
          <g>
            <rect
              x="40"
              y="50"
              width="360"
              height="340"
              rx="12"
              fill="rgba(6, 182, 212, 0.12)"
              stroke="#0891b2"
              strokeWidth={isSelected ? 3 : 1.5}
              strokeDasharray="6 4"
            />
            <text
              x="220"
              y="38"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#0891b2"
              letterSpacing="0.08em"
            >
              PASSIVE REACTOR BUILDING POOL (ULTIMATE HEAT SINK)
            </text>
          </g>
        ))}

        {/* Submerged Containment Vessel */}
        {renderComponentButton("smr-containment", (isSelected) => (
          <g>
            <rect
              x="110"
              y="75"
              width="220"
              height="300"
              rx="30"
              fill="rgba(15, 23, 42, 0.85)"
              stroke="#38bdf8"
              strokeWidth={isSelected ? 3.5 : 2}
            />
            <text
              x="220"
              y="96"
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="#38bdf8"
            >
              SUBMERGED STEEL CONTAINMENT
            </text>
          </g>
        ))}

        {/* Integral Reactor Pressure Vessel */}
        {renderComponentButton("smr-vessel", (isSelected) => (
          <g>
            <rect
              x="150"
              y="115"
              width="140"
              height="240"
              rx="20"
              fill="url(#vesselSteelGrad)"
              stroke="#475569"
              strokeWidth={isSelected ? 3.5 : 2}
            />
            <text
              x="220"
              y="135"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#1e293b"
            >
              INTEGRAL RPV
            </text>
          </g>
        ))}

        {/* SMR Core & Fuel */}
        {renderComponentButton("smr-fuel", (isSelected) => (
          <g>
            <rect
              x="170"
              y="270"
              width="100"
              height="65"
              rx="6"
              fill="url(#fissionThermalGlow)"
              stroke="#ea580c"
              strokeWidth={isSelected ? 3 : 1.5}
              className={getFissionGlowClass()}
            />
            <text
              x="220"
              y="308"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#ffffff"
            >
              SMR CORE
            </text>
          </g>
        ))}

        {/* Control Rod Clusters */}
        {renderComponentButton("smr-control-rods", (isSelected) => (
          <g transform={`translate(0, ${rodTranslateY})`}>
            <rect
              x="185"
              y="225"
              width="70"
              height="20"
              rx="3"
              fill="#64748b"
              stroke="#334155"
              strokeWidth={isSelected ? 2.5 : 1}
            />
            <line
              x1="195"
              y1="245"
              x2="195"
              y2="270"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="220"
              y1="245"
              x2="220"
              y2="270"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="245"
              y1="245"
              x2="245"
              y2="270"
              stroke="#475569"
              strokeWidth="2"
            />
            <text
              x="220"
              y="238"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#f8fafc"
            >
              CONTROL RODS
            </text>
          </g>
        ))}

        {/* Helical-Coil Steam Generator */}
        {renderComponentButton("smr-sg", (isSelected) => (
          <g>
            <rect
              x="165"
              y="150"
              width="110"
              height="65"
              rx="6"
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#0284c7"
              strokeWidth={isSelected ? 3 : 1.5}
            />
            <path
              d="M 175 160 Q 220 170 265 160 M 175 175 Q 220 185 265 175 M 175 190 Q 220 200 265 190 M 175 205 Q 220 215 265 205"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text
              x="220"
              y="185"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#0369a1"
            >
              HELICAL-COIL SG
            </text>
          </g>
        ))}

        {/* Modular Steam Turbine & Generator */}
        {renderComponentButton("smr-turbine", (isSelected) => (
          <g>
            <path
              d="M 500 150 L 590 120 L 590 220 L 500 190 Z"
              fill="#334155"
              stroke="#0284c7"
              strokeWidth={isSelected ? 3 : 1.5}
              className={getTurbineClass()}
            />
            <rect
              x="610"
              y="140"
              width="60"
              height="60"
              rx="6"
              fill="#1e293b"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <text
              x="640"
              y="175"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#34d399"
            >
              GEN
            </text>
            <text
              x="545"
              y="173"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#ffffff"
            >
              TURBINE
            </text>
          </g>
        ))}

        {/* Secondary Steam Loop Pipe */}
        <path
          d="M 275 165 H 480 V 170 H 500"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          className={`${getLoopClass("secondary")} ${getFlowSpeedClass()}`}
        />
      </g>
    </svg>
  );
}
