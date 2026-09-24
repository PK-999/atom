"use client";
import { useCallback, useState } from "react";
import {
  createFissionSequence,
  selectFissionStage,
  stepFissionSequence,
  FISSION_STAGES,
} from "@/lib/exhibits/fission-sequence";
import { usePlayback } from "@/lib/exhibits/use-playback";
import { playCue } from "@/lib/audio/sound-controller";
import { ExhibitFrame } from "./ExhibitFrame";
import { SpatialExhibit } from "./SpatialExhibit";
import styles from "./ExhibitFrame.module.css";
export function FissionExhibit() {
  const [state, setState] = useState(createFissionSequence);
  const [prediction, setPrediction] = useState("");
  const step = useCallback(() => {
    setState(stepFissionSequence);
    playCue();
  }, []);
  const { target, playing, setPlaying, speed, setSpeed, prefersReducedMotion } =
    usePlayback(step, state.stage === 3);
  return (
    <div ref={target}>
      <ExhibitFrame
        title="Follow one fission"
        exhibit="fission"
        limitation="Single-event storyboard v1. Geometry and timing are illustrative. This is not a neutron transport, chain-reaction, power or safety calculation. Returning to a stage never creates a second event; Reset starts a new replay. Fragment yields and encounter probabilities are outside this model."
      >
        <p>
          What happens after a neutron is captured? Make a prediction, then
          follow the event.
        </p>
        <label>
          My prediction{" "}
          <select
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
          >
            <option value="">Choose a prediction</option>
            <option value="split">
              The nucleus can split and release neutrons
            </option>
            <option value="always">Every capture must cause fission</option>
          </select>
        </label>
        <SpatialExhibit kind="fission" stage={state.stage} />
        <ol className={styles.stageList}>
          {FISSION_STAGES.map((stage, index) => (
            <li key={stage.name}>
              <button
                type="button"
                aria-current={state.stage === index ? "step" : undefined}
                onClick={() => {
                  setState((s) => selectFissionStage(s, index));
                  setPlaying(false);
                  playCue(index === 3);
                }}
              >
                {index + 1}. {stage.name}
              </button>
            </li>
          ))}
        </ol>
        <div className={styles.controls}>
          <button
            type="button"
            disabled={prefersReducedMotion || state.stage === 3}
            onClick={() => setPlaying(!playing)}
          >
            {playing && state.stage !== 3 ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            disabled={state.stage === 3}
            onClick={() => {
              setPlaying(false);
              step();
            }}
          >
            Step
          </button>
          <button
            type="button"
            onClick={() => {
              setState(createFissionSequence());
              setPlaying(false);
            }}
          >
            Reset
          </button>
          <label>
            Speed{" "}
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value="0.5">0.5×</option>
              <option value="1">1×</option>
              <option value="2">2×</option>
            </select>
          </label>
        </div>
        {prefersReducedMotion && (
          <p>
            Reduced motion is on. Use Step or choose a stage to explore at your
            own pace.
          </p>
        )}
        <div className={styles.explanation} aria-live="polite">
          <strong>
            {FISSION_STAGES[state.stage].name} · Events in this replay:{" "}
            {state.events}
          </strong>
          <p>{FISSION_STAGES[state.stage].text}</p>
          {state.stage === 3 && prediction && (
            <p>
              {prediction === "split"
                ? "Your prediction matches this selected pathway."
                : "Capture does not always cause fission. This storyboard deliberately selects a fission pathway."}
            </p>
          )}
        </div>
        <details>
          <summary>Read all steps</summary>
          <ol>
            {FISSION_STAGES.map((stage) => (
              <li key={stage.name}>
                <strong>{stage.name}.</strong> {stage.text}
              </li>
            ))}
          </ol>
        </details>
        <p>
          <a href="https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/what-is-a-chain-reaction">
            Source: NRC — What is a chain reaction?
          </a>
        </p>
      </ExhibitFrame>
    </div>
  );
}
