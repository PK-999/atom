import type { SchematicParts } from "./types";
import styles from "../ReactorExplorer.module.css";
export function PwrSchematic({
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
  // Control rod translation based on power level
  const rodTranslateY = powerLevel === 100 ? 0 : powerLevel === 50 ? 25 : 55;

  return (
    <svg
      viewBox="0 0 820 420"
      className={styles.diagramSvg}
      role="group"
      aria-label={`Interactive schematic diagram for ${system.name}`}
    >
      <g>
        {renderDefs()}

        {/* ---------------------------------------------------------------- */}
        {/* Layer 0: Plant Structural Boundaries & Civil Enclosures           */}
        {/* ---------------------------------------------------------------- */}
        {/* Containment Structure (Dome + Cylinder) */}
        {renderComponentButton("pwr-containment", (isSelected) => (
          <g>
            {/* Containment Pre-stressed Concrete Outer Shell */}
            <path
              d="M 50 380 V 160 A 155 130 0 0 1 360 160 V 380 Z"
              fill="rgba(148, 163, 184, 0.08)"
              stroke="#64748b"
              strokeWidth={isSelected ? 3.5 : 2}
              strokeDasharray="8 4"
            />
            {/* Containment Steel Liner Inner Line */}
            <path
              d="M 58 380 V 164 A 147 122 0 0 1 352 164 V 380"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x="205"
              y="58"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#64748b"
              letterSpacing="0.08em"
            >
              PRE-STRESSED CONCRETE CONTAINMENT DOME
            </text>
            {/* Airlock Hatch */}
            <rect
              x="42"
              y="320"
              width="16"
              height="30"
              rx="3"
              fill="#cbd5e1"
              stroke="#475569"
              strokeWidth="1.5"
            />
          </g>
        ))}

        {/* Turbine Hall & Condenser Ground Enclosure */}
        <rect
          x="390"
          y="90"
          width="200"
          height="290"
          rx="8"
          fill="rgba(241, 245, 249, 0.4)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x="490"
          y="110"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#94a3b8"
          letterSpacing="0.05em"
        >
          TURBINE & GENERATOR BUILDING
        </text>

        {/* Plant Base Foundation Line */}
        <line
          x1="30"
          y1="380"
          x2="790"
          y2="380"
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* ---------------------------------------------------------------- */}
        {/* Layer 1: Piping Circuits & Dynamic Fluid Streams                 */}
        {/* ---------------------------------------------------------------- */}
        {/* PRIMARY LOOP: Hot Leg (RPV to Steam Generator) */}
        <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
          {/* Base outer pipe */}
          <path
            d="M 180 190 H 230 V 215 H 275"
            className={styles.pipeBase}
            stroke="#b91c1c"
            strokeWidth="12"
          />
          {/* Inner animated hot water */}
          <path
            d="M 180 190 H 230 V 215 H 275"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#pwrHotGrad)"
            strokeWidth="8"
            markerEnd="url(#arrowPrimary)"
          />
        </g>

        {/* PRIMARY LOOP: Cold Leg (SG -> Pump -> RPV) */}
        <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
          {/* SG to RCP */}
          <path
            d="M 275 285 H 245"
            className={styles.pipeBase}
            stroke="#b91c1c"
            strokeWidth="12"
          />
          <path
            d="M 275 285 H 245"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#pwrColdGrad)"
            strokeWidth="8"
            markerEnd="url(#arrowPrimary)"
          />
          {/* RCP to RPV */}
          <path
            d="M 215 285 H 180"
            className={styles.pipeBase}
            stroke="#b91c1c"
            strokeWidth="12"
          />
          <path
            d="M 215 285 H 180"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#pwrColdGrad)"
            strokeWidth="8"
            markerEnd="url(#arrowPrimary)"
          />
        </g>

        {/* Pressurizer Surge Line */}
        <path
          d="M 225 185 V 215"
          className={styles.pipeBase}
          stroke="#dc2626"
          strokeWidth="6"
        />

        {/* SECONDARY LOOP: Main Steam Line (SG to Turbine) */}
        <g className={`${styles.pipeGroup} ${getLoopClass("secondary")}`}>
          <path
            d="M 315 110 V 85 H 450 V 135"
            className={styles.pipeBase}
            stroke="#0369a1"
            strokeWidth="10"
          />
          <path
            d="M 315 110 V 85 H 450 V 135"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#secSteamGrad)"
            strokeWidth="6"
            markerEnd="url(#arrowSecondary)"
          />
        </g>

        {/* SECONDARY LOOP: Condensate Return (Condenser to SG) */}
        <g className={`${styles.pipeGroup} ${getLoopClass("secondary")}`}>
          <path
            d="M 450 295 H 380 V 240 H 355"
            className={styles.pipeBase}
            stroke="#1d4ed8"
            strokeWidth="9"
          />
          <path
            d="M 450 295 H 380 V 240 H 355"
            className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
            stroke="url(#secCondensateGrad)"
            strokeWidth="5"
            markerEnd="url(#arrowSecondary)"
          />
        </g>

        {/* TERTIARY LOOP: Condenser to Cooling Tower */}
        <g className={`${styles.pipeGroup} ${getLoopClass("tertiary")}`}>
          {/* Warm water to tower */}
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
          {/* Cooled water return from tower basin */}
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
        {/* Layer 2: Mechanical Vessels & Components                         */}
        {/* ---------------------------------------------------------------- */}
        {/* Reactor Pressure Vessel (RPV) */}
        {renderComponentButton("pwr-vessel", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Outer thick carbon-steel vessel body with rounded bottom */}
            <path
              d="M 95 145 H 185 V 285 C 185 315, 95 315, 95 285 Z"
              fill="url(#vesselSteelGrad)"
              stroke={isSelected ? "#2563eb" : "#475569"}
              strokeWidth={isSelected ? 3 : 2}
            />
            {/* Domed upper vessel head with flange */}
            <path
              d="M 90 145 C 90 125, 190 125, 190 145 Z"
              fill="#cbd5e1"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Flange bolt notches */}
            <line
              x1="90"
              y1="145"
              x2="190"
              y2="145"
              stroke="#475569"
              strokeWidth="2.5"
            />
            <circle cx="102" cy="145" r="2.5" fill="#334155" />
            <circle cx="140" cy="143" r="2.5" fill="#334155" />
            <circle cx="178" cy="145" r="2.5" fill="#334155" />

            {/* Core barrel / thermal shield outline */}
            <rect
              x="105"
              y="185"
              width="70"
              height="105"
              rx="4"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text
              x="140"
              y="302"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill="#334155"
            >
              RPV (15.5 MPa)
            </text>
          </g>
        ))}

        {/* Nuclear Fuel Assemblies (Active Core) */}
        {renderComponentButton("pwr-fuel", (isSelected) => (
          <g>
            {/* Core thermal fission glow pulse */}
            <ellipse
              cx="140"
              cy="235"
              rx="34"
              ry="44"
              fill="url(#fissionThermalGlow)"
              className={getFissionGlowClass()}
            />
            {/* Fuel assembly boundary box */}
            <rect
              x="112"
              y="195"
              width="56"
              height="75"
              rx="4"
              fill="#fef08a"
              stroke={isSelected ? "#2563eb" : "#ca8a04"}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            {/* Vertical fuel rod bundles */}
            <line
              x1="120"
              y1="198"
              x2="120"
              y2="266"
              stroke="#b45309"
              strokeWidth="2"
            />
            <line
              x1="130"
              y1="198"
              x2="130"
              y2="266"
              stroke="#b45309"
              strokeWidth="2"
            />
            <line
              x1="140"
              y1="198"
              x2="140"
              y2="266"
              stroke="#b45309"
              strokeWidth="2"
            />
            <line
              x1="150"
              y1="198"
              x2="150"
              y2="266"
              stroke="#b45309"
              strokeWidth="2"
            />
            <line
              x1="160"
              y1="198"
              x2="160"
              y2="266"
              stroke="#b45309"
              strokeWidth="2"
            />

            <text
              x="140"
              y="238"
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill="#78350f"
            >
              FUEL CORE
            </text>
          </g>
        ))}

        {/* Top-Mounted Control Rod Clusters */}
        {renderComponentButton("pwr-control-rods", (isSelected) => (
          <g
            className={styles.controlRodsGroup}
            style={{ transform: `translateY(${rodTranslateY}px)` }}
          >
            {/* Control rod drive mechanism housing */}
            <rect
              x="120"
              y="75"
              width="40"
              height="28"
              rx="3"
              fill="#e2e8f0"
              stroke={isSelected ? "#2563eb" : "#334155"}
              strokeWidth={isSelected ? 2.5 : 1.5}
            />
            {/* Drive coil detail */}
            <line
              x1="124"
              y1="83"
              x2="156"
              y2="83"
              stroke="#64748b"
              strokeWidth="2"
            />
            <line
              x1="124"
              y1="91"
              x2="156"
              y2="91"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Spider hub */}
            <rect x="126" y="103" width="28" height="6" rx="2" fill="#334155" />

            {/* Absorber rod blades penetrating down toward/into core */}
            <line
              x1="130"
              y1="109"
              x2="130"
              y2="185"
              stroke="#0f172a"
              strokeWidth="3"
            />
            <line
              x1="140"
              y1="109"
              x2="140"
              y2="185"
              stroke="#0f172a"
              strokeWidth="3"
            />
            <line
              x1="150"
              y1="109"
              x2="150"
              y2="185"
              stroke="#0f172a"
              strokeWidth="3"
            />

            <text
              x="140"
              y="70"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#334155"
            >
              {powerLevel === 0 ? "SCRAM (INSERTED)" : "CONTROL RODS"}
            </text>
          </g>
        ))}

        {/* Pressurizer */}
        {renderComponentButton("pwr-pressurizer", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Pressurizer vertical vessel with hemispherical heads */}
            <path
              d="M 210 90 C 210 75, 245 75, 245 90 V 165 C 245 180, 210 180, 210 165 Z"
              fill="url(#vesselSteelGrad)"
              stroke={isSelected ? "#2563eb" : "#dc2626"}
              strokeWidth={isSelected ? 3 : 2}
            />
            {/* Water level interface inside pressurizer (~60% water, 40% steam) */}
            <path
              d="M 212 135 H 243 V 165 C 243 176, 212 176, 212 165 Z"
              fill="rgba(239, 68, 68, 0.25)"
            />
            {/* Electric immersion heaters (bottom coils) */}
            <path
              d="M 218 160 L 222 152 L 226 160 L 230 152 L 234 160 L 238 152"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
            {/* Top spray nozzle */}
            <path
              d="M 227 82 V 92 L 223 98 M 227 92 L 231 98"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <text
              x="228"
              y="125"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#0f172a"
            >
              PRESSURIZER
            </text>
          </g>
        ))}

        {/* Steam Generator (U-Tube Heat Exchanger) */}
        {renderComponentButton("pwr-steam-gen", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Steam generator tall cylindrical shell with wide upper steam dome */}
            <path
              d="M 275 305 V 170 L 265 155 V 125 C 265 110, 345 110, 345 125 V 155 L 335 170 V 305 Z"
              fill="url(#vesselSteelGrad)"
              stroke={isSelected ? "#2563eb" : "#0284c7"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Inverted U-tube bundle inside */}
            <path
              d="M 288 295 V 205 C 288 185, 304 185, 304 205 V 295"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              opacity="0.85"
            />
            <path
              d="M 306 295 V 215 C 306 195, 322 195, 322 215 V 295"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3.5"
              opacity="0.85"
            />

            {/* Tube Sheet dividing primary and secondary sides */}
            <line
              x1="275"
              y1="280"
              x2="335"
              y2="280"
              stroke="#334155"
              strokeWidth="3"
            />

            {/* Steam dryer chevron vanes in upper dome */}
            <path
              d="M 280 145 L 290 140 L 300 145 L 310 140 L 320 145 L 330 140"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
            />

            {/* Animated rising steam bubbles in boiling secondary section */}
            <circle
              cx="295"
              cy="220"
              r="2.5"
              fill="#38bdf8"
              className={styles.steamBubble}
            />
            <circle
              cx="315"
              cy="235"
              r="3"
              fill="#38bdf8"
              className={styles.steamBubbleD2}
            />
            <circle
              cx="302"
              cy="250"
              r="2"
              fill="#38bdf8"
              className={styles.steamBubbleD3}
            />

            <text
              x="305"
              y="162"
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill="#0369a1"
            >
              STEAM GEN
            </text>
          </g>
        ))}

        {/* Reactor Coolant Pump (RCP) */}
        {renderComponentButton("pwr-coolant-pump", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Centrifugal pump volute casing */}
            <circle
              cx="230"
              cy="285"
              r="22"
              fill="#e2e8f0"
              stroke={isSelected ? "#2563eb" : "#475569"}
              strokeWidth={isSelected ? 3 : 2}
            />
            {/* Heavy top flywheel motor casing */}
            <rect
              x="220"
              y="245"
              width="20"
              height="18"
              rx="2"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Rotating 4-vane pump impeller */}
            <g
              className={`${styles.pumpImpeller} ${getPumpClass()}`}
              style={{ transformOrigin: "230px 285px" }}
            >
              <path
                d="M 230 285 C 230 273, 237 270, 240 270"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
              />
              <path
                d="M 230 285 C 242 285, 245 292, 245 295"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
              />
              <path
                d="M 230 285 C 230 297, 223 300, 220 300"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
              />
              <path
                d="M 230 285 C 218 285, 215 278, 215 275"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
              />
              <circle cx="230" cy="285" r="4" fill="#0f172a" />
            </g>
            <text
              x="230"
              y="320"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#334155"
            >
              PUMP (RCP)
            </text>
          </g>
        ))}

        {/* Steam Turbine & Synchronous Generator */}
        {renderComponentButton("pwr-turbine", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Multi-stage High/Low Pressure Turbine Casing */}
            <polygon
              points="435,135 485,120 485,180 435,165"
              fill="#e0e7ff"
              stroke={isSelected ? "#2563eb" : "#4f46e5"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Spinning multi-blade turbine rotor */}
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

            {/* Shaft coupling to synchronous generator */}
            <rect x="485" y="146" width="12" height="8" fill="#475569" />

            {/* Synchronous Generator Housing */}
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
            {/* Stator coils detail */}
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

            {/* Electrical Power Grid Lines & Animated Sparks */}
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
              STEAM TURBINE
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

        {/* Surface Condenser (Below Turbine) */}
        {renderComponentButton("pwr-condenser", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Exhaust steam steam-hood from turbine to condenser */}
            <polygon
              points="455,180 480,180 505,235 435,235"
              fill="rgba(199, 210, 254, 0.35)"
              stroke="#818cf8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* Condenser shell with internal vacuum */}
            <rect
              x="440"
              y="235"
              width="105"
              height="65"
              rx="6"
              fill="#ccfbf1"
              stroke={isSelected ? "#2563eb" : "#0d9488"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Shell-and-tube internal cooling tube bank */}
            <line
              x1="448"
              y1="250"
              x2="537"
              y2="250"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
            <line
              x1="448"
              y1="262"
              x2="537"
              y2="262"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
            <line
              x1="448"
              y1="274"
              x2="537"
              y2="274"
              stroke="#0d9488"
              strokeWidth="2.5"
            />

            {/* Hotwell liquid condensate level */}
            <rect
              x="442"
              y="285"
              width="101"
              height="13"
              rx="2"
              fill="#38bdf8"
              opacity="0.8"
            />

            <text
              x="492"
              y="245"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#0f766e"
            >
              SURFACE CONDENSER
            </text>
          </g>
        ))}

        {/* Hyperbolic Natural Draft Cooling Tower */}
        {renderComponentButton("pwr-cooling-tower", (isSelected) => (
          <g filter="url(#partDropShadow)">
            {/* Animated Evaporative Clean Water Vapor Plumes */}
            {powerLevel > 0 && (
              <g>
                <ellipse
                  cx="665"
                  cy="110"
                  rx="22"
                  ry="12"
                  fill="rgba(255, 255, 255, 0.85)"
                  className={styles.vaporPlume}
                />
                <ellipse
                  cx="668"
                  cy="105"
                  rx="18"
                  ry="10"
                  fill="rgba(255, 255, 255, 0.75)"
                  className={styles.vaporPlumeDelay}
                />
              </g>
            )}

            {/* Hyperboloid tower shell geometry */}
            <path
              d="M 628 350 C 648 240, 650 180, 642 125 H 693 C 685 180, 687 240, 707 350 Z"
              fill="#f1f5f9"
              stroke={isSelected ? "#2563eb" : "#059669"}
              strokeWidth={isSelected ? 3 : 2}
            />

            {/* Base air inlet diagonal louvers */}
            <line
              x1="632"
              y1="350"
              x2="636"
              y2="370"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="645"
              y1="350"
              x2="649"
              y2="370"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="660"
              y1="350"
              x2="664"
              y2="370"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="675"
              y1="350"
              x2="679"
              y2="370"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="690"
              y1="350"
              x2="694"
              y2="370"
              stroke="#475569"
              strokeWidth="2"
            />
            <line
              x1="703"
              y1="350"
              x2="707"
              y2="370"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Cold water collection basin at ground level */}
            <rect
              x="626"
              y="370"
              width="82"
              height="10"
              rx="2"
              fill="#10b981"
            />

            <text
              x="667"
              y="225"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#065f46"
            >
              COOLING TOWER
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
