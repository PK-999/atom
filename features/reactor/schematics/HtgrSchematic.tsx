import type { SchematicParts } from "./types";
import styles from "../ReactorExplorer.module.css";
export function HtgrSchematic({
  system,
  powerLevel,
  renderDefs,
  renderComponentButton,
  getLoopClass,
  getFlowSpeedClass,
  getTurbineClass,
  getPumpClass,
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

        {/* Reactor Pressure Vessel */}
        {renderComponentButton("htgr-vessel", (isSelected) => (
          <g>
            <rect
              x="80"
              y="70"
              width="200"
              height="300"
              rx="24"
              fill="url(#vesselDarkSteelGrad)"
              stroke="#94a3b8"
              strokeWidth={isSelected ? 3.5 : 2}
            />
            <text
              x="180"
              y="95"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#e2e8f0"
            >
              HTGR PRESSURE VESSEL (7 MPa He)
            </text>
          </g>
        ))}

        {/* Solid Graphite Moderator Core */}
        {renderComponentButton("htgr-core", (isSelected) => (
          <g>
            <rect
              x="105"
              y="115"
              width="150"
              height="230"
              rx="10"
              fill="rgba(51, 65, 85, 0.9)"
              stroke="#64748b"
              strokeWidth={isSelected ? 3 : 1.5}
            />
            <text
              x="180"
              y="135"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#94a3b8"
            >
              SOLID GRAPHITE CORE
            </text>
          </g>
        ))}

        {/* TRISO Pebble Fuel Core */}
        {renderComponentButton("htgr-fuel", (isSelected) => (
          <g>
            <rect
              x="125"
              y="170"
              width="110"
              height="150"
              rx="8"
              fill="url(#fissionThermalGlow)"
              stroke="#ea580c"
              strokeWidth={isSelected ? 3 : 1.5}
              className={getFissionGlowClass()}
            />
            <text
              x="180"
              y="245"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#ffffff"
            >
              TRISO FUEL (750°C)
            </text>
          </g>
        ))}

        {/* Reflector Control & Shutdown Rods */}
        {renderComponentButton("htgr-control-rods", (isSelected) => (
          <g transform={`translate(0, ${rodTranslateY})`}>
            <rect
              x="110"
              y="140"
              width="14"
              height="80"
              rx="2"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth={isSelected ? 2.5 : 1}
            />
            <rect
              x="236"
              y="140"
              width="14"
              height="80"
              rx="2"
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth={isSelected ? 2.5 : 1}
            />
            <text
              x="180"
              y="155"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#fde68a"
            >
              REFLECTOR RODS
            </text>
          </g>
        ))}

        {/* Cross-Duct Primary Connection */}
        <path
          d="M 280 200 H 380 V 220 H 280 Z"
          fill="#334155"
          stroke="#64748b"
          strokeWidth="1.5"
        />

        {/* Steam Generator Vessel */}
        {renderComponentButton("htgr-steam-gen", (isSelected) => (
          <g>
            <rect
              x="380"
              y="90"
              width="130"
              height="260"
              rx="18"
              fill="url(#vesselSteelGrad)"
              stroke="#0284c7"
              strokeWidth={isSelected ? 3.5 : 2}
            />
            <text
              x="445"
              y="115"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#0369a1"
            >
              STEAM GENERATOR (560°C)
            </text>
          </g>
        ))}

        {/* Helium Gas Circulator */}
        {renderComponentButton("htgr-circulator", (isSelected) => (
          <g>
            <circle
              cx="445"
              cy="310"
              r="25"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth={isSelected ? 3 : 1.5}
              className={getPumpClass()}
            />
            <text
              x="445"
              y="314"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#38bdf8"
            >
              CIRC
            </text>
          </g>
        ))}

        {/* High-Efficiency Steam Turbine */}
        {renderComponentButton("htgr-turbine", (isSelected) => (
          <g>
            <path
              d="M 580 150 L 670 120 L 670 220 L 580 190 Z"
              fill="#334155"
              stroke="#0284c7"
              strokeWidth={isSelected ? 3 : 1.5}
              className={getTurbineClass()}
            />
            <text
              x="625"
              y="173"
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="#ffffff"
            >
              TURBINE (44% η)
            </text>
          </g>
        ))}

        {/* Primary Helium Flow Loop */}
        <path
          d="M 235 220 H 380 M 380 290 H 280"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          className={`${getLoopClass("primary")} ${getFlowSpeedClass()}`}
        />

        {/* Secondary Superheated Steam Pipe */}
        <path
          d="M 510 160 H 580"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          className={`${getLoopClass("secondary")} ${getFlowSpeedClass()}`}
        />
      </g>
    </svg>
  );
}
