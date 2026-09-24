import type { SchematicParts } from "./types";
import styles from "../ReactorExplorer.module.css";
export function PhwrSchematic({
  system,
  powerLevel,
  renderDefs,
  renderComponentButton,
  getLoopClass,
  getFlowSpeedClass,
  getTurbineClass,
  getFissionGlowClass,
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

        {/* Reactor Vault Concrete Enclosure */}
        <rect
          x="60"
          y="70"
          width="320"
          height="310"
          rx="12"
          fill="rgba(148, 163, 184, 0.08)"
          stroke="#64748b"
          strokeWidth="2"
          strokeDasharray="8 4"
        />
        <text
          x="220"
          y="92"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#64748b"
          letterSpacing="0.08em"
        >
          HEAVY WATER REACTOR VAULT
        </text>

        {/* Turbine Building */}
        <rect
          x="400"
          y="90"
          width="190"
          height="290"
          rx="8"
          fill="rgba(241, 245, 249, 0.4)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x="495"
          y="110"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#94a3b8"
          letterSpacing="0.05em"
        >
          CONVENTIONAL TURBINE HALL
        </text>

        {/* Base Foundation */}
        <line
          x1="30"
          y1="380"
          x2="790"
          y2="380"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* ---------------------------------------------------------------- */}
        {/* PHWR Heavy Water Primary Transport Loops (D2O)                   */}
        {/* ---------------------------------------------------------------- */}
        {/* Primary Hot Leg (Calandria Headers to Steam Generator) */}
        <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
          <path
            d="M 230 185 H 265 V 215 H 295"
            className={styles.pipeBase}
            stroke="#b91c1c"
            strokeWidth="12"
          />
          <path
            d="M 230 185 H 265 V 215 H 295"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#pwrHotGrad)"
            strokeWidth="8"
            markerEnd="url(#arrowPrimary)"
          />

          {/* Primary Cold Leg (SG -> PHT Pump -> Calandria) */}
          <path
            d="M 295 285 H 255 V 250 H 230"
            className={styles.pipeBase}
            stroke="#b91c1c"
            strokeWidth="12"
          />
          <path
            d="M 295 285 H 255 V 250 H 230"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#pwrColdGrad)"
            strokeWidth="8"
            markerEnd="url(#arrowPrimary)"
          />
        </g>

        {/* Secondary Light Water Steam (SG to Turbine) */}
        <g className={`${styles.pipeGroup} ${getLoopClass("secondary")}`}>
          <path
            d="M 330 105 V 85 H 450 V 135"
            className={styles.pipeBase}
            stroke="#0369a1"
            strokeWidth="10"
          />
          <path
            d="M 330 105 V 85 H 450 V 135"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#secSteamGrad)"
            strokeWidth="6"
            markerEnd="url(#arrowSecondary)"
          />

          {/* Feedwater Return to SG */}
          <path
            d="M 450 295 H 390 V 240 H 365"
            className={styles.pipeBase}
            stroke="#1d4ed8"
            strokeWidth="9"
          />
          <path
            d="M 450 295 H 390 V 240 H 365"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#secCondensateGrad)"
            strokeWidth="5"
            markerEnd="url(#arrowSecondary)"
          />
        </g>

        {/* Tertiary Condenser Cooling to Tower */}
        <g className={`${styles.pipeGroup} ${getLoopClass("tertiary")}`}>
          <path
            d="M 545 260 H 645"
            className={styles.pipeBase}
            stroke="#047857"
            strokeWidth="8"
          />
          <path
            d="M 545 260 H 645"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#tertiaryCoolGrad)"
            strokeWidth="5"
            markerEnd="url(#arrowTertiary)"
          />
          <path
            d="M 645 295 H 545"
            className={styles.pipeBase}
            stroke="#047857"
            strokeWidth="8"
          />
          <path
            d="M 645 295 H 545"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#tertiaryCoolGrad)"
            strokeWidth="5"
            markerEnd="url(#arrowTertiary)"
          />
        </g>

        {/* ---------------------------------------------------------------- */}
        {/* PHWR Components                                                  */}
        {/* ---------------------------------------------------------------- */}
        {/* Horizontal Calandria Tank */}
        {renderComponentButton("phwr-calandria", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Cylindrical horizontal tank with dished end shields */}
            <rect
              x="100"
              y="140"
              width="155"
              height="160"
              rx="24"
              fill="url(#heavyWaterGrad)"
              stroke={isSelected ? "#2563eb" : "#475569"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Stainless steel end-shield tubesheets */}
            <line
              x1="115"
              y1="145"
              x2="115"
              y2="295"
              stroke="#64748b"
              strokeWidth="2.5"
            />
            <line
              x1="240"
              y1="145"
              x2="240"
              y2="295"
              stroke="#64748b"
              strokeWidth="2.5"
            />

            {/* Horizontal Calandria Lattice Array (Zircaloy Pressure Tubes) */}
            <line
              x1="110"
              y1="170"
              x2="245"
              y2="170"
              stroke="#0891b2"
              strokeWidth="3"
            />
            <line
              x1="110"
              y1="190"
              x2="245"
              y2="190"
              stroke="#0891b2"
              strokeWidth="3"
            />
            <line
              x1="110"
              y1="210"
              x2="245"
              y2="210"
              stroke="#0891b2"
              strokeWidth="3"
            />
            <line
              x1="110"
              y1="230"
              x2="245"
              y2="230"
              stroke="#0891b2"
              strokeWidth="3"
            />
            <line
              x1="110"
              y1="250"
              x2="245"
              y2="250"
              stroke="#0891b2"
              strokeWidth="3"
            />
            <line
              x1="110"
              y1="270"
              x2="245"
              y2="270"
              stroke="#0891b2"
              strokeWidth="3"
            />

            {/* Left & Right Bidirectional Fueling Machines (CANDU Signature) */}
            <rect
              x="75"
              y="195"
              width="22"
              height="50"
              rx="3"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <rect
              x="258"
              y="195"
              width="22"
              height="50"
              rx="3"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="1.5"
            />

            <text
              x="177"
              y="158"
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill="#0e7490"
            >
              CALANDRIA (D2O MODERATOR)
            </text>
            <text
              x="177"
              y="288"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#334155"
            >
              HORIZONTAL PRESSURE TUBES
            </text>
          </g>
        ))}

        {/* Natural Uranium Fuel Bundles */}
        {renderComponentButton("phwr-fuel", (isSelected) => (
          <g>
            {/* Core Thermal Fission Glow */}
            <ellipse
              cx="177"
              cy="220"
              rx="45"
              ry="30"
              fill="url(#fissionThermalGlow)"
              className={getFissionGlowClass()}
            />

            {/* Fuel bundle container highlight */}
            <rect
              x="130"
              y="200"
              width="95"
              height="40"
              rx="4"
              fill="#fef08a"
              stroke={isSelected ? "#2563eb" : "#ca8a04"}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />

            {/* Segmented 0.5m natural uranium fuel bundle cylinders */}
            <line
              x1="145"
              y1="202"
              x2="145"
              y2="238"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <line
              x1="165"
              y1="202"
              x2="165"
              y2="238"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <line
              x1="185"
              y1="202"
              x2="185"
              y2="238"
              stroke="#ca8a04"
              strokeWidth="2"
            />
            <line
              x1="205"
              y1="202"
              x2="205"
              y2="238"
              stroke="#ca8a04"
              strokeWidth="2"
            />

            <text
              x="177"
              y="224"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#78350f"
            >
              NATURAL U FUEL
            </text>
          </g>
        ))}

        {/* Steam Generators (PHWR) */}
        {renderComponentButton("phwr-steam-gen", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Vertical Steam Generator shell */}
            <path
              d="M 295 305 V 165 L 285 150 V 120 C 285 105, 365 105, 365 120 V 150 L 355 165 V 305 Z"
              fill="url(#vesselSteelGrad)"
              stroke={isSelected ? "#2563eb" : "#0284c7"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Inverted U-tube bundle */}
            <path
              d="M 308 295 V 200 C 308 180, 324 180, 324 200 V 295"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              opacity="0.85"
            />
            <path
              d="M 326 295 V 210 C 326 190, 342 190, 342 210 V 295"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              opacity="0.85"
            />

            {/* Boiling steam bubbles */}
            <circle
              cx="315"
              cy="215"
              r="2.5"
              fill="#38bdf8"
              className={styles.steamBubble}
            />
            <circle
              cx="335"
              cy="230"
              r="3"
              fill="#38bdf8"
              className={styles.steamBubbleD2}
            />

            <text
              x="325"
              y="155"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#0369a1"
            >
              STEAM GEN (PHWR)
            </text>
          </g>
        ))}

        {/* Light Water Steam Turbine & Synchronous Generator */}
        {renderComponentButton("phwr-turbine", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Turbine casing */}
            <polygon
              points="435,135 485,120 485,180 435,165"
              fill="#e0e7ff"
              stroke={isSelected ? "#2563eb" : "#4f46e5"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Spinning rotor */}
            <g
              className={`${styles.turbineRotor} ${getTurbineClass()}`}
              style={{ transformOrigin: "460px 150px" }}
            >
              <circle
                cx="460"
                cy="150"
                r="16"
                fill="rgba(99, 102, 241, 0.15)"
              />
              <line
                x1="460"
                y1="134"
                x2="460"
                y2="166"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />
              <line
                x1="444"
                y1="150"
                x2="476"
                y2="150"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />
              <line
                x1="448"
                y1="138"
                x2="472"
                y2="162"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <line
                x1="448"
                y1="162"
                x2="472"
                y2="138"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <circle cx="460" cy="150" r="4" fill="#312e81" />
            </g>

            {/* Shaft to Generator */}
            <rect x="485" y="146" width="12" height="8" fill="#475569" />

            {/* Synchronous Generator */}
            <rect
              x="497"
              y="125"
              width="55"
              height="50"
              rx="5"
              fill="#f1f5f9"
              stroke={isSelected ? "#2563eb" : "#4338ca"}
              strokeWidth={isSelected ? 3 : 2}
            />
            <line
              x1="504"
              y1="135"
              x2="545"
              y2="135"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="504"
              y1="165"
              x2="545"
              y2="165"
              stroke="#6366f1"
              strokeWidth="2"
            />

            {/* Grid Power Sparks */}
            <path
              d="M 552 145 H 585 V 130"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />
            {powerLevel > 0 && (
              <path
                d="M 555 145 L 565 141 L 575 149 L 585 130"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                className={styles.generatorSpark}
              />
            )}

            <text
              x="460"
              y="195"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#3730a3"
            >
              LIGHT WATER TURBINE
            </text>
            <text
              x="525"
              y="154"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#4338ca"
            >
              GEN
            </text>
          </g>
        ))}

        {/* Condenser & Cooling Tower */}
        <g filter="url(#partDropShadow)">
          <polygon
            points="455,180 480,180 505,235 435,235"
            fill="rgba(199, 210, 254, 0.35)"
            stroke="#818cf8"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <rect
            x="440"
            y="235"
            width="105"
            height="65"
            rx="6"
            fill="#ccfbf1"
            stroke="#0d9488"
            strokeWidth="2"
          />
          <text
            x="492"
            y="250"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            fill="#0f766e"
          >
            CONDENSER
          </text>
        </g>

        {/* Cooling Tower */}
        <g filter="url(#partDropShadow)">
          {powerLevel > 0 && (
            <ellipse
              cx="675"
              cy="110"
              rx="22"
              ry="12"
              fill="rgba(255, 255, 255, 0.85)"
              className={styles.vaporPlume}
            />
          )}
          <path
            d="M 638 350 C 658 240, 660 180, 652 125 H 703 C 695 180, 697 240, 717 350 Z"
            fill="#f1f5f9"
            stroke="#059669"
            strokeWidth="2"
          />
          <text
            x="677"
            y="225"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="800"
            fill="#065f46"
          >
            COOLING TOWER
          </text>
        </g>
      </g>
    </svg>
  );
}
