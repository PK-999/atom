"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { FissionExhibit } from "@/features/exhibits/FissionExhibit";
import { AtomExhibit, FuelExhibit } from "@/features/exhibits/AtomFuelExhibits";
import { EnergyJourney } from "@/features/exhibits/EnergyJourney";
import { energyFromPower, atomIdentity } from "@/lib/education/learning-models";
import styles from "@/features/exhibits/ExhibitFrame.module.css";
const Decay = dynamic(() =>
  import("@/features/simulator/DecaySimulator").then((m) => m.DecaySimulator),
);
const Reactor = dynamic(() =>
  import("@/features/simulator/ReactorControlSimulator").then(
    (m) => m.ReactorControlSimulator,
  ),
);
export function LessonInteraction({ lessonId }: { lessonId: string }) {
  if (lessonId === "energy") return <EnergyExperiment />;
  if (lessonId === "atom")
    return (
      <>
        <AtomExhibit />
        <AtomIdentity />
      </>
    );
  if (lessonId === "fission") return <FissionExhibit />;
  if (lessonId === "reactor")
    return (
      <>
        <FuelExhibit />
        <Reactor />
      </>
    );
  if (lessonId === "electricity-generation") return <EnergyJourney />;
  if (lessonId === "safety") return <SafetyBarriers />;
  if (lessonId === "waste")
    return (
      <>
        <p>
          Half-life describes one isotope. It cannot by itself determine how
          spent fuel must be stored or when it is safe. Waste contains mixtures
          of radionuclides, with different hazards and management requirements.
        </p>
        <Decay />
      </>
    );
  return null;
}
function EnergyExperiment() {
  const [power, setPower] = useState(2),
    [hours, setHours] = useState(3);
  return (
    <section className={styles.frame} data-testid="energy-interaction">
      <h2>Power × time = energy</h2>
      <p>
        Predict what happens if the same appliance runs twice as long. This is a
        synthetic constant-power example, not a household or fuel equivalence.
      </p>
      <div className={styles.controls}>
        <label>
          Power (kW)
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
          />
          <output>{power} kW</output>
        </label>
        <label>
          Time (hours)
          <input
            type="range"
            min="0"
            max="24"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
          <output>{hours} h</output>
        </label>
      </div>
      <p aria-live="polite">
        <strong>
          {power} kW × {hours} h = {energyFromPower(power, hours)} kWh
        </strong>
      </p>
      <p>
        Power is a rate. Energy is the accumulated amount. This model assumes
        power stays constant over the chosen time.
      </p>
      <button
        type="button"
        onClick={() => {
          setPower(2);
          setHours(3);
        }}
      >
        Reset experiment
      </button>
    </section>
  );
}
function AtomIdentity() {
  const [protons, setProtons] = useState(92),
    [neutrons, setNeutrons] = useState(143);
  const identity = atomIdentity(protons, neutrons);
  return (
    <section className={styles.frame} data-testid="atom-interaction">
      <h2>Build an atomic identity</h2>
      <p>
        Change the neutron count, then the proton count. Which change makes a
        different element?
      </p>
      <div className={styles.controls}>
        <label>
          Protons
          <input
            type="number"
            min="1"
            max="118"
            value={protons}
            onChange={(e) => setProtons(Number(e.target.value))}
          />
        </label>
        <label>
          Neutrons
          <input
            type="number"
            min="0"
            max="200"
            value={neutrons}
            onChange={(e) => setNeutrons(Number(e.target.value))}
          />
        </label>
      </div>
      <p aria-live="polite">
        {identity
          ? `${identity.name} · Mass number ${identity.massNumber} · ${identity.electrons} electrons if neutral`
          : "Enter whole counts in the supported ranges."}
      </p>
      <p>
        Proton count determines the element. Changing neutrons gives a different
        isotope. This arithmetic does not establish whether that isotope exists
        or is stable.
      </p>
    </section>
  );
}
const barriers = [
  {
    name: "Fuel matrix",
    text: "The solid fuel matrix retains many fission products during normal operation. Retention depends on material, temperature and damage.",
  },
  {
    name: "Cladding",
    text: "The metal tube separates fuel from coolant. Corrosion, heat and mechanical stress can challenge this barrier.",
  },
  {
    name: "Coolant boundary",
    text: "Pipes and vessels contain coolant. The arrangement and pressure differ among reactor designs.",
  },
  {
    name: "Containment",
    text: "A surrounding structure can limit releases in accidents. Its design and performance are plant-specific; it does not make risk zero.",
  },
];
function SafetyBarriers() {
  const [selected, setSelected] = useState(0);
  return (
    <section className={styles.frame} data-testid="safety-interaction">
      <h2>Layers of protection and their limits</h2>
      <p>
        Inspect a conceptual set of barriers used in many water-cooled reactor
        designs.
      </p>
      <div className={styles.parts}>
        {barriers.map((b, i) => (
          <button
            type="button"
            key={b.name}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {i + 1}. {b.name}
          </button>
        ))}
      </div>
      <p aria-live="polite">{barriers[selected].text}</p>
      <p>
        Defense in depth also depends on equipment, procedures, people and
        oversight. No single barrier is a guarantee.
      </p>
      <Link href="/reactors">
        Inspect a specific reactor design and its sources →
      </Link>
    </section>
  );
}
