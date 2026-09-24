"use client";
import { useState } from "react";
import { ExhibitFrame } from "./ExhibitFrame";
import { SpatialExhibit } from "./SpatialExhibit";
import styles from "./ExhibitFrame.module.css";
export function AtomExhibit() {
  return (
    <ExhibitFrame
      title="Inside the atom"
      exhibit="atom"
      limitation="Conceptual spatial illustration v1. The nucleus and electrons are enlarged for visibility. Electron clouds represent probability distributions; these dots do not show literal paths, measured positions or a particular isotope."
    >
      <p>
        Inspect the nucleus and electron cloud. What changes when you look at an
        atom at a different scale?
      </p>
      <SpatialExhibit kind="atom" />
      <p>
        <a href="https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/what-is-an-atom">
          Source: NRC — What is an atom?
        </a>
      </p>
    </ExhibitFrame>
  );
}
export function FuelExhibit() {
  const [stage, setStage] = useState(0);
  return (
    <ExhibitFrame
      title="From pellet to fuel assembly"
      exhibit="fuel"
      limitation="Generic rod-and-grid assembly v1, inspired by water-cooled reactor fuel. Rod count, proportions and assembly layout are illustrative, not engineering specifications. Designs vary; this diagram does not apply to all fuel types."
    >
      <p>
        Separate the parts to see how fuel pellets, metal tubes and spacer grids
        fit together.
      </p>
      <SpatialExhibit kind="fuel" stage={stage} />
      <div className={styles.controls}>
        <button
          type="button"
          aria-pressed={stage === 1}
          onClick={() => setStage(stage === 1 ? 0 : 1)}
        >
          {stage === 1 ? "Reassemble" : "Explode assembly"}
        </button>
        <button type="button" onClick={() => setStage(0)}>
          Reset assembly
        </button>
      </div>
      <p>
        <a href="https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/what-is-nuclear-fuel">
          Source: NRC — What is nuclear fuel?
        </a>
      </p>
    </ExhibitFrame>
  );
}
