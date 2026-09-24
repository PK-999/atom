"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import { EnergyConversionDiagram } from "./EnergyConversionDiagram";
import { usePlayback } from "@/lib/exhibits/use-playback";
import { Atom } from "@phosphor-icons/react/Atom";
import { Drop } from "@phosphor-icons/react/Drop";
import { Fan } from "@phosphor-icons/react/Fan";
import { Lightning } from "@phosphor-icons/react/Lightning";
import styles from "./EnergyJourney.module.css";
const steps = [
  {
    name: "Heat",
    Icon: Atom,
    text: "Fission releases energy in the fuel. Heat passes into the coolant.",
  },
  {
    name: "Steam",
    Icon: Drop,
    text: "Heat produces steam. In a pressurized-water reactor, a heat exchanger keeps primary coolant separate from the steam circuit.",
  },
  {
    name: "Motion",
    Icon: Fan,
    text: "Expanding steam turns the turbine. Its shaft transfers mechanical energy to a generator.",
  },
  {
    name: "Electricity",
    Icon: Lightning,
    text: "The generator converts mechanical energy into electrical energy. Cooling and other losses mean only part of the heat becomes electricity.",
  },
];
export function EnergyJourney() {
  const [stage, setStage] = useState(0),
    [started, setStarted] = useState(false);
  const step = useCallback(() => setStage((s) => Math.min(3, s + 1)), []);
  const { target, playing, setPlaying, prefersReducedMotion } = usePlayback(
    step,
    stage === 3,
  );
  return (
    <div
      className={styles.journey}
      ref={target}
      aria-label="Heat to electricity journey"
    >
      <div className={styles.poster}>
        {started ? (
          <EnergyConversionDiagram stage={stage} />
        ) : (
          <Image
            src="/images/exhibits/conversion-museum-v1.webp"
            alt="Conceptual museum illustration of a reactor vessel, steam turbine and generator"
            width={1536}
            height={1024}
            sizes="(max-width: 760px) 100vw, 55vw"
            priority
          />
        )}
        {!started && (
          <span className={styles.artLabel}>Conceptual illustration</span>
        )}
      </div>
      <div className={styles.experiment}>
        <ol className={styles.steps}>
          {steps.map(({ name, Icon }, index) => (
            <li key={name}>
              <button
                type="button"
                aria-current={stage === index ? "step" : undefined}
                onClick={() => {
                  setStage(index);
                  setStarted(true);
                  setPlaying(false);
                }}
              >
                <Icon size={22} aria-hidden />
                <span>
                  {index + 1}. {name}
                </span>
              </button>
            </li>
          ))}
        </ol>
        {started && (
          <p className={styles.explanation} aria-live="polite">
            <strong>{steps[stage].name}.</strong> {steps[stage].text}
          </p>
        )}
        <div className={styles.controls}>
          {!started ? (
            <button
              type="button"
              onClick={() => {
                setStarted(true);
                setPlaying(!prefersReducedMotion);
              }}
            >
              Play the journey →
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={prefersReducedMotion || stage === 3}
                onClick={() => setPlaying(!playing)}
              >
                {playing && stage < 3 ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                disabled={stage === 3}
                onClick={() => {
                  step();
                  setPlaying(false);
                }}
              >
                Step
              </button>
              <button
                type="button"
                onClick={() => {
                  setStage(0);
                  setPlaying(false);
                }}
              >
                Reset
              </button>
            </>
          )}
          <span>Heat → steam → motion → electricity</span>
        </div>
        {started && (
          <p className={styles.note}>
            Illustrative sequence, not a plant performance model.{" "}
            <a href="https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/how-does-a-nuclear-power-plant-make-electricity">
              Read the NRC explanation
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
