"use client";

import { useState } from "react";
import Link from "next/link";
import { Explanation } from "@/components/education/Explanation";
import type { ExplanationContent } from "@/lib/education/schemas";
import styles from "./HowItWorksViewer.module.css";

interface StepData {
  id: string;
  stepNumber: number;
  tabLabel: string;
  title: string;
  explanation: ExplanationContent;
  keyTakeaway: string;
}

const STEPS: StepData[] = [
  {
    id: "atom-density",
    stepNumber: 1,
    tabLabel: "The Atom & Density",
    title: "1. The Atomic Nucleus & Extreme Energy Density",
    explanation: {
      summary:
        "Energy makes change possible. Power describes how quickly energy is transferred.",
      body: [
        "A lamp transfers electrical energy into light and heat. Its power tells you the rate; the energy used also depends on how long it stays on.",
        "Chemical reactions rearrange electrons and bonds. Fission changes atomic nuclei, making nuclear fuel a concentrated source of energy.",
      ],
      details: [
        {
          id: "energy-density",
          title: "Why does fuel energy density matter?",
          body: "Energy per kilogram affects how much fuel must be mined, transported and stored. A comparison needs to say whether it counts raw material, prepared fuel or electricity actually delivered.",
        },
        {
          id: "mass-energy",
          title: "Where does the energy come from?",
          body: "The mass difference between the initial particles and reaction products corresponds to released energy: ΔE = Δm × c². Much of the recoverable fission energy begins as motion of the fragments and becomes heat.",
        },
      ],
      citationIds: [],
    },
    keyTakeaway:
      "Energy makes change possible. Power describes how quickly energy is transferred.",
  },
  {
    id: "fission-mechanics",
    stepNumber: 2,
    tabLabel: "Fission Mechanics",
    title: "2. Induced Nuclear Fission: Splitting the Nucleus",
    explanation: {
      summary:
        "Fission splits a heavy nucleus, releasing energy and additional neutrons.",
      body: [
        "A captured neutron can lead to fission, but not every capture causes a split. The fragments transfer energy to their surroundings as heat.",
        "Released neutrons may escape, be absorbed, or cause further fissions. A chain reaction continues when enough of them cause new splits.",
      ],
      details: [
        {
          id: "moderation",
          title: "Why slow neutrons down?",
          body: "In light-water reactors, water acts as a moderator: collisions slow neutrons. The chance of fission depends on both the isotope and the neutron energy.",
        },
        {
          id: "criticality",
          title: "What does critical mean?",
          body: "The effective multiplication factor, k_eff, compares neutron populations across generations. At k_eff = 1 the chain reaction is self-sustaining; below 1 it declines and above 1 it grows. Delayed neutrons affect how quickly it responds. This exhibit does not calculate k_eff.",
        },
      ],
      citationIds: [],
    },
    keyTakeaway:
      "Fission splits a heavy nucleus, releasing energy and additional neutrons.",
  },
  {
    id: "chain-reaction",
    stepNumber: 3,
    tabLabel: "Chain Reactions",
    title: "3. Self-Sustaining Criticality & Safe Control",
    explanation: {
      summary:
        "Fission splits a heavy nucleus, releasing energy and additional neutrons.",
      body: [
        "A captured neutron can lead to fission, but not every capture causes a split. The fragments transfer energy to their surroundings as heat.",
        "Released neutrons may escape, be absorbed, or cause further fissions. A chain reaction continues when enough of them cause new splits.",
      ],
      details: [
        {
          id: "moderation",
          title: "Why slow neutrons down?",
          body: "In light-water reactors, water acts as a moderator: collisions slow neutrons. The chance of fission depends on both the isotope and the neutron energy.",
        },
        {
          id: "criticality",
          title: "What does critical mean?",
          body: "The effective multiplication factor, k_eff, compares neutron populations across generations. At k_eff = 1 the chain reaction is self-sustaining; below 1 it declines and above 1 it grows. Delayed neutrons affect how quickly it responds. This exhibit does not calculate k_eff.",
        },
      ],
      citationIds: [],
    },
    keyTakeaway:
      "Fission splits a heavy nucleus, releasing energy and additional neutrons.",
  },
  {
    id: "thermal-generation",
    stepNumber: 4,
    tabLabel: "Thermal to Electricity",
    title: "4. The Three Isolated Loops: Turning Heat into Clean Power",
    explanation: {
      summary:
        "Steam turns a turbine, and the turbine drives an electrical generator.",
      body: [
        "A nuclear station converts heat into motion and then electricity. A condenser turns the turbine exhaust steam back into water for reuse.",
        "Some heat must be rejected to the surroundings. Cooling arrangements may use rivers, seawater or cooling towers; they differ between plants.",
      ],
      details: [
        {
          id: "efficiency",
          title: "Why is heat output larger than electric output?",
          body: "A heat engine converts only part of its heat input into useful work. The temperature difference between the heat source and heat sink limits the possible efficiency. Actual plant performance also includes losses and the electricity used by equipment.",
        },
        {
          id: "cycles",
          title: "How does the steam cycle work?",
          body: "The Rankine cycle describes heating and vaporizing water, expanding steam through a turbine, condensing it and pumping the liquid back. Reactor designs supply heat to this cycle in different ways.",
        },
      ],
      citationIds: [],
    },
    keyTakeaway:
      "Steam turns a turbine, and the turbine drives an electrical generator.",
  },
  {
    id: "defense-in-depth",
    stepNumber: 5,
    tabLabel: "Safety Barriers",
    title: "5. Defense-in-Depth: Four Concentric Safety Barriers",
    explanation: {
      summary:
        "Defense in depth combines barriers, cooling systems and operating practices.",
      body: [
        "Fuel, cladding, the coolant boundary and containment can help retain radioactive material. The exact barriers and backup systems depend on the design.",
        "Safety also depends on maintenance, regulation, training and preparation for accidents. Multiple layers reduce risk; they do not make an accident impossible.",
      ],
      details: [
        {
          id: "passive",
          title: "What does passive cooling mean?",
          body: "Some systems use gravity, natural circulation or evaporation to move coolant and heat. Their capability still depends on conditions such as water inventory, available heat sinks and the duration of an event.",
        },
        {
          id: "risk",
          title: "How is safety assessed?",
          body: "Engineers examine accident sequences and the reliability of protective systems. Probabilistic assessments estimate risks under stated assumptions; historical experience and accident investigations provide a separate source of lessons.",
        },
      ],
      citationIds: [],
    },
    keyTakeaway:
      "Defense in depth combines barriers, cooling systems and operating practices.",
  },
];

export function HowItWorksViewer() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStep = STEPS[activeStepIndex];
  const takeaway = currentStep.keyTakeaway;

  const handleNext = () => {
    if (activeStepIndex < STEPS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>Physics & Engineering Tour</span>
          <h1 className={styles.title}>How Nuclear Energy Works</h1>
          <p className={styles.subtitle}>
            From splitting atomic nuclei to generating gigawatts of clean
            electricity on the power grid.
          </p>
        </div>
      </header>

      {/* 5 Step Navigation Tabs */}
      <nav aria-label="How Nuclear Works Steps" className={styles.stepTabs}>
        {STEPS.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            aria-label={`Step ${step.stepNumber}: ${step.tabLabel}`}
            className={`${styles.stepTab} ${
              idx === activeStepIndex ? styles.stepTabActive : ""
            }`}
            onClick={() => setActiveStepIndex(idx)}
            aria-pressed={idx === activeStepIndex}
          >
            <span className={styles.stepNumber}>{step.stepNumber}</span>
            <span>{step.tabLabel}</span>
          </button>
        ))}
      </nav>

      {/* Main Interactive Stage Card */}
      <article className={styles.stageCard}>
        {/* Visual Diagram Area based on current step */}
        <div className={styles.stageVisual}>
          {activeStepIndex === 0 && (
            <div className={styles.diagramContainer}>
              <div className={styles.diagramTitle}>
                Energy Density Comparison (Specific Energy in MJ/kg)
              </div>
              <div className={styles.densityGrid}>
                <div className={styles.densityCard}>
                  <div className={styles.densityFuel}>Firewood</div>
                  <div className={styles.densityValue}>~16</div>
                  <div className={styles.densityDesc}>MJ / kg</div>
                </div>
                <div className={styles.densityCard}>
                  <div className={styles.densityFuel}>Coal</div>
                  <div className={styles.densityValue}>~24</div>
                  <div className={styles.densityDesc}>MJ / kg</div>
                </div>
                <div className={styles.densityCard}>
                  <div className={styles.densityFuel}>Natural Gas</div>
                  <div className={styles.densityValue}>~55</div>
                  <div className={styles.densityDesc}>MJ / kg</div>
                </div>
                <div
                  className={styles.densityCard}
                  style={{ borderColor: "var(--atom-accent)" }}
                >
                  <div
                    className={styles.densityFuel}
                    style={{ color: "var(--atom-accent)" }}
                  >
                    Uranium Fuel (UO₂)
                  </div>
                  <div className={styles.densityValue}>~500,000</div>
                  <div className={styles.densityDesc}>
                    MJ / kg (Reactor burnup)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStepIndex === 1 && (
            <div
              className={styles.diagramContainer}
              style={{ textAlign: "center" }}
            >
              <div className={styles.diagramTitle}>
                Induced Fission Reaction Reaction Mechanics
              </div>
              <p
                style={{
                  color: "var(--atom-text-primary)",
                  fontSize: "1.1rem",
                  fontFamily: "monospace",
                  margin: "16px 0",
                }}
              >
                ¹n + ²³⁵U ➔ [²³⁶U*] ➔ ¹⁴¹Ba + ⁹²Kr + 3 ¹n + ~200 MeV
              </p>
              <p
                style={{
                  color: "var(--atom-text-secondary)",
                  fontSize: "0.85rem",
                  margin: 0,
                }}
              >
                1 neutron absorbed ➔ unstable compound nucleus ➔ 2 fragment
                nuclei + 3 free neutrons + kinetic heat
              </p>
            </div>
          )}

          {activeStepIndex === 2 && (
            <div
              className={styles.diagramContainer}
              style={{ textAlign: "center" }}
            >
              <div className={styles.diagramTitle}>
                Self-Sustaining Critical State
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  margin: "16px 0",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <span
                    style={{
                      display: "block",
                      color: "var(--atom-text-muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Subcritical
                  </span>
                  <strong
                    style={{ color: "var(--atom-warning)", fontSize: "1.2rem" }}
                  >
                    k &lt; 1.0
                  </strong>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--atom-text-muted)",
                    }}
                  >
                    Power decays
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      color: "var(--atom-text-muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Critical (Target)
                  </span>
                  <strong
                    style={{ color: "var(--atom-accent)", fontSize: "1.4rem" }}
                  >
                    k = 1.0
                  </strong>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--atom-accent)",
                    }}
                  >
                    Steady electrical output
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      display: "block",
                      color: "var(--atom-text-muted)",
                      fontSize: "0.8rem",
                    }}
                  >
                    Supercritical
                  </span>
                  <strong
                    style={{
                      color: "var(--atom-positive)",
                      fontSize: "1.2rem",
                    }}
                  >
                    k &gt; 1.0
                  </strong>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--atom-text-muted)",
                    }}
                  >
                    Power ramping up
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeStepIndex === 3 && (
            <div className={styles.diagramContainer}>
              <div className={styles.diagramTitle}>
                The Three Isolated Thermal Circuits
              </div>
              <div className={styles.barrierStack}>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Loop 1: Primary System
                  </span>
                  <span className={styles.barrierRole}>
                    Passes through reactor core (315°C, 155 atm); sealed &
                    isolated
                  </span>
                </div>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Loop 2: Secondary System
                  </span>
                  <span className={styles.barrierRole}>
                    Clean steam turns turbine generator; zero radioactive
                    contact
                  </span>
                </div>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Loop 3: Cooling Circuit
                  </span>
                  <span className={styles.barrierRole}>
                    Condenses turbine steam; cooling tower emits 100% clean
                    water vapor
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeStepIndex === 4 && (
            <div className={styles.diagramContainer}>
              <div className={styles.diagramTitle}>
                Four Concentric Physical Barriers
              </div>
              <div className={styles.barrierStack}>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Barrier 1: Ceramic Fuel Matrix
                  </span>
                  <span className={styles.barrierRole}>
                    UO₂ ceramic locks in solid & volatile fission products
                  </span>
                </div>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Barrier 2: Zircaloy Metal Cladding
                  </span>
                  <span className={styles.barrierRole}>
                    Gas-tight corrosion-resistant metal tubes encapsulate fuel
                  </span>
                </div>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Barrier 3: Steel Reactor Pressure Vessel
                  </span>
                  <span className={styles.barrierRole}>
                    20 cm thick forged steel vessel handles 155 atmospheres
                  </span>
                </div>
                <div className={styles.barrierLayer}>
                  <span className={styles.barrierName}>
                    Barrier 4: Concrete Containment Dome
                  </span>
                  <span className={styles.barrierRole}>
                    1.5 m steel-reinforced concrete built to withstand external
                    impacts
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Textual & Educational Body */}
        <div className={styles.stageContent}>
          <div className={styles.stageHeader}>
            <h2 className={styles.stageTitle}>{currentStep.title}</h2>
          </div>

          <div className={styles.stageExplanation}>
            <Explanation content={currentStep.explanation} />
          </div>

          <div className={styles.keyTakeawayBox}>
            <strong>Key Concept:</strong>
            <p>{takeaway}</p>
          </div>

          {/* Navigation Controls */}
          <div className={styles.stepControls}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handlePrev}
              disabled={activeStepIndex === 0}
            >
              ← Previous:{" "}
              {activeStepIndex > 0
                ? STEPS[activeStepIndex - 1].tabLabel
                : "Start"}
            </button>
            <span
              style={{ fontSize: "0.875rem", color: "var(--atom-text-muted)" }}
            >
              Step {activeStepIndex + 1} of {STEPS.length}
            </span>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handleNext}
              disabled={activeStepIndex === STEPS.length - 1}
            >
              Next:{" "}
              {activeStepIndex < STEPS.length - 1
                ? STEPS[activeStepIndex + 1].tabLabel
                : "Finish"}{" "}
              →
            </button>
          </div>
        </div>
      </article>

      {/* Hands-on Interactive Callout Row */}
      <section
        className={styles.ctaRow}
        aria-label="Hands-on Interactive Explorations"
      >
        <Link href="/simulations" className={styles.ctaCard}>
          <div>
            <h3>Interactive Fission & Decay Simulator</h3>
            <p>
              Fire individual neutrons into a U-235 lattice, adjust control rod
              insertion depth, and observe prompt versus delayed neutron
              kinetics in real time.
            </p>
          </div>
          <span className={styles.ctaLink}>
            Launch Fission Simulator <span aria-hidden="true">→</span>
          </span>
        </Link>

        <Link href="/reactors" className={styles.ctaCard}>
          <div>
            <h3>Commercial Reactor Architectures</h3>
            <p>
              Explore interactive schematics of Pressurized Water Reactors
              (PWR), Boiling Water Reactors (BWR), and Heavy Water (CANDU)
              plants.
            </p>
          </div>
          <span className={styles.ctaLink}>
            Explore Reactor Schematics <span aria-hidden="true">→</span>
          </span>
        </Link>

        <Link href="/compare" className={styles.ctaCard}>
          <div>
            <h3>Energy Comparison Lab</h3>
            <p>
              Put nuclear into perspective: compare lifecycle greenhouse gases,
              land intensity, capacity factor, and safety statistics against
              solar, wind, and gas.
            </p>
          </div>
          <span className={styles.ctaLink}>
            Open Comparison Lab <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>
    </div>
  );
}
