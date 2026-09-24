import type { SchematicParts } from "./types";
import styles from "../ReactorExplorer.module.css";
export function BwrSchematic({
  system,
  powerLevel,
  renderDefs,
  renderComponentButton,
  getLoopClass,
  getFlowSpeedClass,
  getTurbineClass,
  getFissionGlowClass,
}: SchematicParts) {
  // Bottom-entry rods translate upward in SCRAM
  const bwrRodTranslateY =
    powerLevel === 100 ? 0 : powerLevel === 50 ? -25 : -55;

  return (
    <svg
      viewBox="0 0 820 420"
      className={styles.diagramSvg}
      role="group"
      aria-label={`Interactive schematic diagram for ${system.name}`}
    >
      <g>
        {renderDefs()}

        {/* Civil Enclosures: Drywell & Wetwell (Torus) */}
        <path
          d="M 60 380 V 170 A 145 120 0 0 1 320 170 V 380 Z"
          fill="rgba(148, 163, 184, 0.08)"
          stroke="#64748b"
          strokeWidth="2"
          strokeDasharray="8 4"
        />
        <text
          x="190"
          y="68"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#64748b"
          letterSpacing="0.08em"
        >
          PRIMARY CONTAINMENT (DRYWELL)
        </text>

        {/* Torus / Suppression Pool (Wetwell) at Base */}
        <ellipse
          cx="190"
          cy="365"
          rx="110"
          ry="15"
          fill="#bae6fd"
          stroke="#0284c7"
          strokeWidth="2"
        />
        <text
          x="190"
          y="368"
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill="#0369a1"
        >
          SUPPRESSION POOL (WETWELL TORUS)
        </text>

        {/* Shielded Turbine Hall Enclosure */}
        <rect
          x="350"
          y="90"
          width="210"
          height="290"
          rx="8"
          fill="rgba(241, 245, 249, 0.4)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x="455"
          y="110"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#94a3b8"
          letterSpacing="0.05em"
        >
          SHIELDED TURBINE BUILDING (N-16 PROTECTION)
        </text>

        {/* Plant Base Foundation */}
        <line
          x1="30"
          y1="380"
          x2="790"
          y2="380"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* ---------------------------------------------------------------- */}
        {/* BWR Direct Steam Piping (RPV to Turbine)                         */}
        {/* ---------------------------------------------------------------- */}
        <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
          {/* Main Direct Steam Line */}
          <path
            d="M 190 95 V 75 H 410 V 135"
            className={styles.pipeBase}
            stroke="#0369a1"
            strokeWidth="12"
          />
          <path
            d="M 190 95 V 75 H 410 V 135"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#secSteamGrad)"
            strokeWidth="8"
            markerEnd="url(#arrowSecondary)"
          />

          {/* Feedwater Return Line (Condenser to RPV) */}
          <path
            d="M 420 300 H 260 V 225 H 235"
            className={styles.pipeBase}
            stroke="#1d4ed8"
            strokeWidth="10"
          />
          <path
            d="M 420 300 H 260 V 225 H 235"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#secCondensateGrad)"
            strokeWidth="6"
            markerEnd="url(#arrowSecondary)"
          />
        </g>

        {/* Tertiary Cooling Piping to Heat Sink */}
        <g className={`${styles.pipeGroup} ${getLoopClass("tertiary")}`}>
          <path
            d="M 515 270 H 640"
            className={styles.pipeBase}
            stroke="#047857"
            strokeWidth="8"
          />
          <path
            d="M 515 270 H 640"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#tertiaryCoolGrad)"
            strokeWidth="5"
            markerEnd="url(#arrowTertiary)"
          />
          <path
            d="M 640 305 H 515"
            className={styles.pipeBase}
            stroke="#047857"
            strokeWidth="8"
          />
          <path
            d="M 640 305 H 515"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#tertiaryCoolGrad)"
            strokeWidth="5"
            markerEnd="url(#arrowTertiary)"
          />
        </g>

        {/* ---------------------------------------------------------------- */}
        {/* BWR Components                                                   */}
        {/* ---------------------------------------------------------------- */}
        {/* BWR Reactor Pressure Vessel (RPV) */}
        {renderComponentButton("bwr-vessel", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Tall cylindrical pressure vessel with domed heads */}
            <path
              d="M 135 125 C 135 95, 245 95, 245 125 V 295 C 245 325, 135 325, 135 295 Z"
              fill="url(#vesselSteelGrad)"
              stroke={isSelected ? "#2563eb" : "#475569"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Upper Steam Dryers (Chevron moisture vanes) */}
            <rect
              x="155"
              y="120"
              width="70"
              height="22"
              rx="2"
              fill="#bae6fd"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <line
              x1="162"
              y1="125"
              x2="168"
              y2="135"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="176"
              y1="125"
              x2="182"
              y2="135"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="190"
              y1="125"
              x2="196"
              y2="135"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="204"
              y1="125"
              x2="210"
              y2="135"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <text
              x="190"
              y="135"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="800"
              fill="#0369a1"
            >
              STEAM DRYERS
            </text>

            {/* Internal Steam Separators (Cyclone tubes) */}
            <rect
              x="150"
              y="148"
              width="80"
              height="25"
              rx="3"
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <line
              x1="160"
              y1="152"
              x2="160"
              y2="170"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="175"
              y1="152"
              x2="175"
              y2="170"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="190"
              y1="152"
              x2="190"
              y2="170"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="205"
              y1="152"
              x2="205"
              y2="170"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <line
              x1="220"
              y1="152"
              x2="220"
              y2="170"
              stroke="#0284c7"
              strokeWidth="2"
            />

            {/* Feedwater Sparger Ring */}
            <line
              x1="145"
              y1="180"
              x2="235"
              y2="180"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeDasharray="5 3"
            />

            <text
              x="190"
              y="312"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill="#334155"
            >
              BWR RPV (7.0 MPa)
            </text>
          </g>
        ))}

        {/* BWR Fuel Bundles (Direct Boiling Core) */}
        {renderComponentButton("bwr-fuel", (isSelected) => (
          <g>
            {/* Core Thermal Fission Glow */}
            <ellipse
              cx="190"
              cy="235"
              rx="38"
              ry="45"
              fill="url(#fissionThermalGlow)"
              className={getFissionGlowClass()}
            />

            {/* Core boundary with fuel channel boxes */}
            <rect
              x="155"
              y="190"
              width="70"
              height="80"
              rx="4"
              fill="#fef08a"
              stroke={isSelected ? "#2563eb" : "#ca8a04"}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />

            {/* Channel box grid partitions */}
            <line
              x1="172"
              y1="192"
              x2="172"
              y2="268"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
            <line
              x1="190"
              y1="192"
              x2="190"
              y2="268"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
            <line
              x1="207"
              y1="192"
              x2="207"
              y2="268"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />

            {/* Direct Boiling Steam Bubbles rising past fuel */}
            <circle
              cx="165"
              cy="245"
              r="2.5"
              fill="#38bdf8"
              className={styles.steamBubble}
            />
            <circle
              cx="180"
              cy="225"
              r="3"
              fill="#38bdf8"
              className={styles.steamBubbleD2}
            />
            <circle
              cx="200"
              cy="240"
              r="2.5"
              fill="#38bdf8"
              className={styles.steamBubbleD3}
            />
            <circle
              cx="190"
              cy="205"
              r="3.5"
              fill="#38bdf8"
              className={styles.steamBubble}
            />

            <text
              x="190"
              y="238"
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill="#78350f"
            >
              BOILING CORE
            </text>
          </g>
        ))}

        {/* Bottom-Entry Control Rods (Unique to BWR!) */}
        {renderComponentButton("bwr-control-rods", (isSelected) => (
          <g
            className={styles.controlRodsGroup}
            style={{ transform: `translateY(${bwrRodTranslateY}px)` }}
          >
            {/* Hydraulic drive mechanism housings beneath RPV */}
            <rect
              x="165"
              y="325"
              width="50"
              height="30"
              rx="3"
              fill="#e2e8f0"
              stroke={isSelected ? "#2563eb" : "#334155"}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            {/* Nitrogen accumulator bottles */}
            <line
              x1="175"
              y1="330"
              x2="175"
              y2="350"
              stroke="#0284c7"
              strokeWidth="3"
            />
            <line
              x1="190"
              y1="330"
              x2="190"
              y2="350"
              stroke="#0284c7"
              strokeWidth="3"
            />
            <line
              x1="205"
              y1="330"
              x2="205"
              y2="350"
              stroke="#0284c7"
              strokeWidth="3"
            />

            {/* Cruciform absorber blades pushing UP into core */}
            <line
              x1="175"
              y1="325"
              x2="175"
              y2="265"
              stroke="#0f172a"
              strokeWidth="3"
            />
            <line
              x1="190"
              y1="325"
              x2="190"
              y2="265"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            <line
              x1="205"
              y1="325"
              x2="205"
              y2="265"
              stroke="#0f172a"
              strokeWidth="3"
            />

            <text
              x="190"
              y="368"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#0f172a"
            >
              {powerLevel === 0
                ? "SCRAM (BOTTOM INSERTED)"
                : "BOTTOM CONTROL RODS"}
            </text>
          </g>
        ))}

        {/* Direct Steam Turbine & Synchronous Generator */}
        {renderComponentButton("bwr-turbine", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Multi-stage direct steam turbine casing */}
            <polygon
              points="400,135 450,120 450,180 400,165"
              fill="#e0e7ff"
              stroke={isSelected ? "#2563eb" : "#4f46e5"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Spinning multi-blade turbine rotor */}
            <g
              className={`${styles.turbineRotor} ${getTurbineClass()}`}
              style={{ transformOrigin: "425px 150px" }}
            >
              <circle
                cx="425"
                cy="150"
                r="16"
                fill="rgba(99, 102, 241, 0.15)"
              />
              <line
                x1="425"
                y1="134"
                x2="425"
                y2="166"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />
              <line
                x1="409"
                y1="150"
                x2="441"
                y2="150"
                stroke="#4f46e5"
                strokeWidth="2.5"
              />
              <line
                x1="413"
                y1="138"
                x2="437"
                y2="162"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <line
                x1="413"
                y1="162"
                x2="437"
                y2="138"
                stroke="#4f46e5"
                strokeWidth="2"
              />
              <circle cx="425" cy="150" r="4" fill="#312e81" />
            </g>

            {/* Coupling shaft */}
            <rect x="450" y="146" width="12" height="8" fill="#475569" />

            {/* Synchronous Generator */}
            <rect
              x="462"
              y="125"
              width="55"
              height="50"
              rx="5"
              fill="#f1f5f9"
              stroke={isSelected ? "#2563eb" : "#4338ca"}
              strokeWidth={isSelected ? 3 : 2}
            />
            <line
              x1="470"
              y1="135"
              x2="510"
              y2="135"
              stroke="#6366f1"
              strokeWidth="2"
            />
            <line
              x1="470"
              y1="165"
              x2="510"
              y2="165"
              stroke="#6366f1"
              strokeWidth="2"
            />

            {/* Electrical Power Grid Lines & Animated Sparks */}
            <path
              d="M 517 145 H 550 V 130"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
            />
            {powerLevel > 0 && (
              <path
                d="M 520 145 L 530 141 L 540 149 L 550 130"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                className={styles.generatorSpark}
              />
            )}

            <text
              x="425"
              y="195"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#3730a3"
            >
              DIRECT TURBINE
            </text>
            <text
              x="490"
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

        {/* Main Condenser & Feedwater Pumps */}
        {renderComponentButton("bwr-condenser", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Turbine exhaust steam hood */}
            <polygon
              points="420,180 445,180 470,240 400,240"
              fill="rgba(199, 210, 254, 0.35)"
              stroke="#818cf8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Deep vacuum condenser shell */}
            <rect
              x="405"
              y="240"
              width="105"
              height="65"
              rx="6"
              fill="#ccfbf1"
              stroke={isSelected ? "#2563eb" : "#0d9488"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Internal cooling tubes */}
            <line
              x1="415"
              y1="255"
              x2="500"
              y2="255"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
            <line
              x1="415"
              y1="267"
              x2="500"
              y2="267"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
            <line
              x1="415"
              y1="279"
              x2="500"
              y2="279"
              stroke="#0d9488"
              strokeWidth="2.5"
            />

            {/* Hotwell condensate */}
            <rect
              x="407"
              y="290"
              width="101"
              height="13"
              rx="2"
              fill="#38bdf8"
              opacity="0.8"
            />

            <text
              x="457"
              y="250"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#0f766e"
            >
              CONDENSER & FEEDWATER
            </text>
          </g>
        ))}

        {/* Cooling Tower / Heat Sink */}
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
