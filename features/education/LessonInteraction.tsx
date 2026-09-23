"use client";

import { useState } from "react";
import styles from "./Education.module.css";

interface LessonInteractionProps {
  lessonId: string;
}

export function LessonInteraction({ lessonId }: LessonInteractionProps) {
  if (lessonId === "energy") {
    return <EnergyDensityInteraction />;
  }
  if (lessonId === "atom") {
    return <AtomIsotopeInteraction />;
  }
  if (lessonId === "fission") {
    return <FissionChainInteraction />;
  }
  if (lessonId === "reactor") {
    return <ReactorControlInteraction />;
  }
  if (lessonId === "electricity-generation") {
    return <SteamCycleInteraction />;
  }
  if (lessonId === "safety") {
    return <DefenseInDepthInteraction />;
  }
  if (lessonId === "waste") {
    return <WasteDecayInteraction />;
  }

  return null;
}

// 1. Energy Lesson: Fuel Equivalence Slider
function EnergyDensityInteraction() {
  const [pellets, setPellets] = useState(1);

  const coalTons = (pellets * 1).toLocaleString();
  const oilBarrels = (pellets * 3).toLocaleString();
  const gasCubicFeet = (pellets * 17000).toLocaleString();
  const householdMonths = pellets * 2;

  return (
    <div className={styles.interactionCard} data-testid="energy-interaction">
      <h2 className={styles.interactionTitle}>
        Interactive: Fuel Equivalence Calculator
      </h2>
      <p className={styles.interactionSubtitle}>
        Move the slider to compare the energy in small uranium dioxide fuel
        pellets to conventional fossil fuels.
      </p>

      <div className={styles.sliderGroup}>
        <label htmlFor="pellet-slider">
          Uranium fuel pellets: <strong>{pellets}</strong> (approx.{" "}
          {pellets * 7} grams total)
        </label>
        <input
          id="pellet-slider"
          type="range"
          min={1}
          max={10}
          value={pellets}
          onChange={(e) => setPellets(Number(e.target.value))}
          className={styles.slider}
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={pellets}
        />
      </div>

      <div className={styles.equivalenceGrid}>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{coalTons} ton</div>
          <div className={styles.equivalenceLabel}>Coal equivalent</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{oilBarrels} bbl</div>
          <div className={styles.equivalenceLabel}>Oil (barrels)</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{gasCubicFeet} ft³</div>
          <div className={styles.equivalenceLabel}>Natural Gas</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{householdMonths} mo</div>
          <div className={styles.equivalenceLabel}>Average Home Power</div>
        </div>
      </div>
    </div>
  );
}

// 2. Atom Lesson: Isotope Inspector
function AtomIsotopeInteraction() {
  const [selectedIsotope, setSelectedIsotope] = useState("U-235");

  const isotopes: Record<
    string,
    { protons: number; neutrons: number; stability: string; note: string }
  > = {
    "U-235": {
      protons: 92,
      neutrons: 143,
      stability: "Fissile with thermal neutrons",
      note: "Primary fuel for commercial thermal reactors. Constitutes ~0.7% of natural uranium.",
    },
    "U-238": {
      protons: 92,
      neutrons: 146,
      stability: "Fertile (captures neutrons to form Pu-239)",
      note: "Most abundant natural uranium (99.3%). Contributes to Doppler negative reactivity feedback.",
    },
    "Fe-56": {
      protons: 26,
      neutrons: 30,
      stability: "Extremely stable (highest binding energy per nucleon)",
      note: "Nuclear peak: cannot release net energy via either fission or fusion.",
    },
  };

  const current = isotopes[selectedIsotope];

  return (
    <div className={styles.interactionCard} data-testid="atom-interaction">
      <h2 className={styles.interactionTitle}>
        Interactive: Isotope Inspector
      </h2>
      <p className={styles.interactionSubtitle}>
        Select an atomic nucleus to inspect its internal composition and nuclear
        properties.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {Object.keys(isotopes).map((iso) => (
          <button
            key={iso}
            type="button"
            onClick={() => setSelectedIsotope(iso)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--color-border, #e5e7eb)",
              backgroundColor:
                selectedIsotope === iso ? "#7c3aed" : "transparent",
              color: selectedIsotope === iso ? "#fff" : "inherit",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {iso}
          </button>
        ))}
      </div>

      <div className={styles.equivalenceGrid}>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{current.protons}</div>
          <div className={styles.equivalenceLabel}>Protons (Z)</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{current.neutrons}</div>
          <div className={styles.equivalenceLabel}>Neutrons (N)</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>
            {current.protons + current.neutrons}
          </div>
          <div className={styles.equivalenceLabel}>Mass Number (A)</div>
        </div>
      </div>
      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.875rem",
          color: "var(--color-muted-foreground)",
        }}
      >
        <strong>Note:</strong> {current.note}
      </p>
    </div>
  );
}

// 3. Fission Lesson: Chain Reaction Trigger
function FissionChainInteraction() {
  const [generation, setGeneration] = useState(1);

  return (
    <div className={styles.interactionCard} data-testid="fission-interaction">
      <h2 className={styles.interactionTitle}>
        Interactive: Fission Neutron Multiplication
      </h2>
      <p className={styles.interactionSubtitle}>
        Trigger neutron generations to visualize steady critical multiplication
        (k = 1.0) in a controlled reactor core.
      </p>
      <div style={{ margin: "1rem 0" }}>
        <button
          type="button"
          onClick={() => setGeneration((g) => (g >= 5 ? 1 : g + 1))}
          style={{
            padding: "0.625rem 1.25rem",
            backgroundColor: "#7c3aed",
            color: "#fff",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Pulse Next Neutron Generation ({generation}/5)
        </button>
      </div>
      <div className={styles.equivalenceGrid}>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>1.000</div>
          <div className={styles.equivalenceLabel}>Reactivity (k_eff)</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{generation * 100} MW</div>
          <div className={styles.equivalenceLabel}>Thermal Output</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>Steady</div>
          <div className={styles.equivalenceLabel}>Multiplication State</div>
        </div>
      </div>
    </div>
  );
}

// 4. Reactor Control Interaction
function ReactorControlInteraction() {
  const [insertion, setInsertion] = useState(50);

  const reactivity = (1.05 - (insertion / 100) * 0.1).toFixed(3);
  const power = Math.max(0, Math.round(1000 * (1 - insertion / 100)));

  return (
    <div className={styles.interactionCard} data-testid="reactor-interaction">
      <h2 className={styles.interactionTitle}>
        Interactive: Control Rod Reactivity Simulator
      </h2>
      <p className={styles.interactionSubtitle}>
        Adjust control rod insertion depth to observe neutron absorption and
        core power modulation.
      </p>
      <div className={styles.sliderGroup}>
        <label htmlFor="control-rod-slider">
          Control Rod Insertion: <strong>{insertion}%</strong>
        </label>
        <input
          id="control-rod-slider"
          type="range"
          min={0}
          max={100}
          value={insertion}
          onChange={(e) => setInsertion(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.equivalenceGrid}>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{reactivity}</div>
          <div className={styles.equivalenceLabel}>Effective k</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>{power} MWe</div>
          <div className={styles.equivalenceLabel}>Electric Output</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div className={styles.equivalenceValue}>
            {insertion === 100 ? "Tripped" : "Operating"}
          </div>
          <div className={styles.equivalenceLabel}>Core Status</div>
        </div>
      </div>
    </div>
  );
}

// 5. Electricity Generation Steam Loop
function SteamCycleInteraction() {
  const [stage, setStage] = useState(1);

  const stages = [
    {
      num: 1,
      name: "Core Heat",
      desc: "Fission reactions heat high-pressure primary water to ~315°C.",
    },
    {
      num: 2,
      name: "Steam Generator",
      desc: "Heat exchanger transfers thermal energy to secondary water, making high-pressure steam.",
    },
    {
      num: 3,
      name: "Turbine-Generator",
      desc: "Steam expands through high and low pressure turbine rotors, spinning generator at 1800/3600 RPM.",
    },
    {
      num: 4,
      name: "Condenser",
      desc: "Exhaust steam is cooled back into liquid water by cooling water.",
    },
  ];

  const current = stages[stage - 1];

  return (
    <div
      className={styles.interactionCard}
      data-testid="generation-interaction"
    >
      <h2 className={styles.interactionTitle}>
        Interactive: Rankine Steam Cycle Stages
      </h2>
      <p className={styles.interactionSubtitle}>
        Step through the thermodynamic cycle transforming nuclear heat into grid
        electricity.
      </p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {stages.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStage(s.num)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--color-border, #e5e7eb)",
              backgroundColor: stage === s.num ? "#7c3aed" : "transparent",
              color: stage === s.num ? "#fff" : "inherit",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Step {s.num}
          </button>
        ))}
      </div>
      <div className={styles.equivalenceItem} style={{ textAlign: "left" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.125rem",
            marginBottom: "0.25rem",
          }}
        >
          {current.name}
        </div>
        <p
          style={{
            margin: 0,
            color: "var(--color-muted-foreground)",
            fontSize: "0.9375rem",
          }}
        >
          {current.desc}
        </p>
      </div>
    </div>
  );
}

// 6. Safety Defense-In-Depth
function DefenseInDepthInteraction() {
  const [activeBarrier, setActiveBarrier] = useState(1);

  const barriers = [
    {
      num: 1,
      name: "Ceramic Fuel Pellet",
      desc: "Uranium dioxide ceramic matrix locks in over 99% of fission products within its crystalline structure.",
    },
    {
      num: 2,
      name: "Zircaloy Cladding",
      desc: "Hermetically sealed zirconium alloy tubes resist high pressure, corrosion, and temperatures.",
    },
    {
      num: 3,
      name: "Reactor Pressure Vessel",
      desc: "20 cm thick forged steel vessel bounds the high-pressure reactor coolant system.",
    },
    {
      num: 4,
      name: "Containment Building",
      desc: "Prestressed concrete structure with 1.5m thick walls and steel liner engineered against external impacts.",
    },
  ];

  return (
    <div className={styles.interactionCard} data-testid="safety-interaction">
      <h2 className={styles.interactionTitle}>
        Interactive: The 4 Physical Safety Barriers
      </h2>
      <p className={styles.interactionSubtitle}>
        Click each concentric barrier to inspect how modern reactors implement
        defense-in-depth.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {barriers.map((b) => (
          <button
            key={b.num}
            type="button"
            onClick={() => setActiveBarrier(b.num)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--color-border, #e5e7eb)",
              backgroundColor:
                activeBarrier === b.num ? "#047857" : "transparent",
              color: activeBarrier === b.num ? "#fff" : "inherit",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            Barrier {b.num}: {b.name}
          </button>
        ))}
      </div>
      <div className={styles.equivalenceItem} style={{ textAlign: "left" }}>
        <p
          style={{
            margin: 0,
            color: "var(--color-foreground)",
            fontSize: "0.9375rem",
          }}
        >
          {barriers[activeBarrier - 1].desc}
        </p>
      </div>
    </div>
  );
}

// 7. Waste Decay Timeline
function WasteDecayInteraction() {
  const [years, setYears] = useState(30);

  let activityLabel =
    "High (Dominated by short-lived fission products Cs-137, Sr-90)";
  let management = "Active water pool cooling";
  if (years >= 10 && years < 300) {
    activityLabel = "Moderate (Declining exponentially by factor of 100)";
    management = "Passive dry cask storage on surface pad";
  } else if (years >= 300 && years < 10000) {
    activityLabel = "Low (Fission products decayed; actinides remain)";
    management = "Deep geological repository isolation";
  } else if (years >= 10000) {
    activityLabel = "Baseline (Radioactivity below natural uranium ore body)";
    management = "Permanent geological stability";
  }

  return (
    <div className={styles.interactionCard} data-testid="waste-interaction">
      <h2 className={styles.interactionTitle}>
        Interactive: Radioactive Decay Timeline
      </h2>
      <p className={styles.interactionSubtitle}>
        Slide across logarithmic time to observe spent fuel decay and required
        isolation mechanisms.
      </p>
      <div className={styles.sliderGroup}>
        <label htmlFor="decay-slider">
          Timescale: <strong>{years.toLocaleString()} years</strong>
        </label>
        <input
          id="decay-slider"
          type="range"
          min={1}
          max={100000}
          step={100}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.equivalenceGrid}>
        <div className={styles.equivalenceItem}>
          <div style={{ fontWeight: 700, color: "#7c3aed" }}>
            {activityLabel}
          </div>
          <div className={styles.equivalenceLabel}>Radiation Level</div>
        </div>
        <div className={styles.equivalenceItem}>
          <div style={{ fontWeight: 700, color: "#047857" }}>{management}</div>
          <div className={styles.equivalenceLabel}>Management Mode</div>
        </div>
      </div>
    </div>
  );
}
