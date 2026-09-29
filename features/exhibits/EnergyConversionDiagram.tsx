import { useId } from "react";
import {
  PressureVessel,
  SteamGenerator,
  TurbineCutaway,
  GeneratorCutaway,
  CoolantPump,
  CondenserCutaway,
} from "@/components/education/schematic/MechanicalParts";
import styles from "./SchematicPlate.module.css";

/** Conceptual PWR process plate. Stage changes emphasis, never circuit topology. */
export function EnergyConversionDiagram({
  stage,
  playing = false,
}: {
  stage: number;
  playing?: boolean;
}) {
  const id = useId();
  const hot = "#e4ac70",
    steam = "#88c5dc",
    cooling = "#86bca8";
  const pipe = (d: string, color: string, active: boolean) => (
    <g opacity={active ? 1 : 0.45}>
      <path
        d={d}
        fill="none"
        stroke="#344953"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={d}
        className={styles.flow}
        fill="none"
        stroke="#f4f0e6"
        strokeWidth="1.8"
        strokeDasharray="3 17"
        strokeLinejoin="round"
      />
    </g>
  );
  return (
    <figure className={styles.plate} data-playing={playing}>
      <div className={styles.heading}>
        <span>PWR · inside the energy cycle</span>
        <span>Cutaway study</span>
      </div>
      <svg
        viewBox="0 0 760 455"
        role="img"
        aria-label={`Energy conversion schematic, stage ${stage + 1}: reactor heat, steam, turbine motion, generator electricity`}
      >
        <desc>
          Primary coolant carries reactor heat through steam-generator tubes.
          Separate secondary water becomes steam, drives the turbine, condenses
          and returns. A third cooling circuit removes heat from the condenser.
        </desc>
        <defs>
          <pattern
            id={`${id}-grid`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M24 0H0V24"
              fill="none"
              stroke="#aec6d4"
              strokeWidth=".4"
              opacity=".1"
            />
          </pattern>
        </defs>
        <g id={`${id}-equipment`}>
          <rect width="760" height="455" fill={`url(#${id}-grid)`} />
          <path
            d="M25 357V151Q25 49 163 49T302 151V357Z"
            fill="#526b7c"
            fillOpacity=".08"
            stroke="#849aa5"
            strokeOpacity=".4"
            strokeDasharray="5 5"
          />
          <text
            x="163"
            y="38"
            className={styles.annotation}
            textAnchor="middle"
          >
            CONTAINMENT · SECTION VIEW
          </text>
          <path d="M25 359H738" stroke="#596e7b" />
          {pipe("M146 197H176V294H222", hot, true)}
          {pipe("M288 294V340H195V262H146", hot, true)}
          {pipe("M255 130V91H373V187", steam, stage >= 1)}
          {pipe("M407 243V272", steam, stage >= 2)}
          {pipe("M387 330V372H329V243H290", steam, stage >= 1)}
          {pipe("M499 289H672V252", cooling, stage >= 2)}
          {pipe("M692 325V347H499V312", cooling, stage >= 2)}
          <g id={`${id}-vessel`} transform="translate(52 130)">
            <PressureVessel />
          </g>
          <g id={`${id}-steam`} transform="translate(210 130)">
            <SteamGenerator />
          </g>
          <g transform="translate(169 303) scale(.75)">
            <CoolantPump />
          </g>
          <g transform="translate(310 345) scale(.65)">
            <CoolantPump />
          </g>
          <g id={`${id}-turbine`} transform="translate(351 163) scale(.85)">
            <TurbineCutaway selected={stage === 2} />
          </g>
          <path d="M486 211H521" stroke="#849fa9" strokeWidth="7" />
          <g id={`${id}-generator`} transform="translate(510 171) scale(.85)">
            <GeneratorCutaway selected={stage === 3} />
          </g>
          <g transform="translate(380 272)">
            <CondenserCutaway />
          </g>
          <path
            d="M604 211H618V158H723"
            fill="none"
            stroke={stage >= 3 ? "#ead6a1" : "#5c7482"}
            strokeWidth="3"
          />
          <path
            d="M665 180L692 83L719 180M674 148H710M678 128H705M683 108H700M666 100H718M673 86H710"
            fill="none"
            stroke="#95aab3"
            strokeWidth="2"
          />
          <path
            d="M642 272Q659 223 654 205H702Q698 233 718 325H634Z"
            fill="#819b9d"
            fillOpacity=".25"
            stroke="#a2b8b7"
            strokeWidth="2"
          />
          <ellipse
            cx="678"
            cy="205"
            rx="24"
            ry="5"
            fill="#203540"
            stroke="#9bb5b7"
          />
          <path
            d="M648 325L647 337M662 325V337M681 325V337M702 325L707 337"
            stroke="#91a8ab"
            strokeWidth="3"
          />
          <path d="M638 339H716" stroke={cooling} strokeWidth="5" />
          <g className={styles.labels} textAnchor="middle">
            <text x="102" y="111">
              Reactor vessel
            </text>
            <text x="255" y="113">
              Steam generator
            </text>
            <text x="416" y="144">
              Turbine stages
            </text>
            <text x="554" y="144">
              Generator
            </text>
            <text x="439" y="350">
              Condenser
            </text>
            <text x="688" y="65">
              To the grid
            </text>
            <text x="676" y="365">
              Cooling tower
            </text>
          </g>
          <g className={styles.annotation}>
            <text x="48" y="329">
              Fuel inside steel vessel
            </text>
            <text x="200" y="396">
              Pumps return water
            </text>
          </g>
          <g transform={`translate(${[101, 255, 417, 552][stage] ?? 101} 422)`}>
            <circle r="12" fill="#132d37" stroke="#80cbc6" />
            <text y="5" textAnchor="middle" fill="#b8eeea" fontSize="14">
              {stage + 1}
            </text>
          </g>
        </g>
      </svg>
      <details className={styles.inspector}>
        <summary>Inspect selected equipment</summary>
        <svg
          viewBox={
            [
              "-15 -10 130 195",
              "-15 -10 120 195",
              "-10 0 180 120",
              "-10 0 120 105",
            ][stage] ?? "-15 -10 130 195"
          }
          role="img"
          aria-label={`Enlarged ${["reactor vessel", "steam generator", "turbine stages", "generator"][stage] ?? "reactor vessel"} cutaway`}
        >
          {stage === 0 ? (
            <PressureVessel />
          ) : stage === 1 ? (
            <SteamGenerator />
          ) : stage === 2 ? (
            <TurbineCutaway selected />
          ) : (
            <GeneratorCutaway selected />
          )}
        </svg>
      </details>
      <figcaption className={styles.caption}>
        <ul className={styles.legend} aria-label="Circuits">
          <li>
            <i style={{ background: hot }} />
            Primary coolant
          </li>
          <li>
            <i style={{ background: steam }} />
            Steam &amp; feedwater
          </li>
          <li>
            <i style={{ background: cooling }} />
            Cooling water
          </li>
        </ul>
        <p>
          Separate circuits exchange heat through metal walls. Water returns
          through pumps; the cooling circuit carries away unused heat.
        </p>
        <small>
          Conceptual PWR cutaway · not to scale · supporting systems omitted
        </small>
      </figcaption>
    </figure>
  );
}
