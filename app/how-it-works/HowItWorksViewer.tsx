"use client";

import { useState } from "react";
import Link from "next/link";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LABELS,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";
import styles from "./HowItWorksViewer.module.css";

interface StepData {
  id: string;
  stepNumber: number;
  tabLabel: string;
  title: string;
  explanations: Record<ComplexityLevel, string>;
  keyTakeaways: Record<ComplexityLevel, string>;
}

const STEPS: StepData[] = [
  {
    id: "atom-density",
    stepNumber: 1,
    tabLabel: "The Atom & Density",
    title: "1. The Atomic Nucleus & Extreme Energy Density",
    explanations: {
      beginner:
        "Everything around us is made of tiny LEGO blocks called atoms. Chemical fuels like wood and coal burn by rearranging the electron coatings on the outside. But nuclear power taps directly into the nucleus — the atomic core held together by the strongest force in the entire universe! That is why a single uranium pellet the size of a gummy bear makes as much electricity as an entire train car of coal.",
      explorer:
        "Chemical combustion involves electron bonds (~4 electron-volts per reaction). In contrast, nuclear reactions tap the strong nuclear force binding protons and neutrons inside the nucleus (~200 million electron-volts per fission). Because nuclear force is millions of times stronger than chemical bonds, nuclear fuel requires thousands of times less physical mass and mining footprint than fossil fuels.",
      curious:
        "Energy density dictates supply-chain footprint. Uranium dioxide (UO₂) pellets achieve a specific energy density of approximately 500,000 MJ/kg (at typical 4.5% enrichment burnup), compared to natural gas at ~55 MJ/kg and bituminous coal at ~24 MJ/kg. This ~2,000,000x density differential drastically shrinks fuel transportation, operational land footprint, and aggregate solid waste volume per megawatt-hour.",
      "deep-dive":
        "The nuclear mass defect governs energy density via Einstein's rest mass-energy relation ΔE = Δm · c². In U-235 fission, roughly 0.09% of the total rest mass converts directly into kinetic energy and gamma rays (~200 MeV per fission event, or 3.204 × 10⁻¹¹ J). Standard commercial light-water reactor fuel assemblies operate at burnups between 45 and 60 GWd/tU (gigawatt-days per metric ton of uranium).",
      geeky:
        "Binding energy per nucleon increases from ~7.6 MeV in heavy actinides like U-235 to ~8.5 MeV in mid-mass fission product fragments (e.g., A ≈ 95 and A ≈ 140 peaks of the asymmetric fission yield curve). The ~0.9 MeV/nucleon deficit manifests as ~200 MeV recoverable Q-value: 168 MeV fragment kinetic energy, 5 MeV prompt neutron kinetic energy, 7 MeV prompt gamma, 7 MeV delayed gamma, 8 MeV beta particles, and 12 MeV antineutrino energy (unrecoverable).",
    },
    keyTakeaways: {
      beginner: "1 uranium fuel pellet = 1 ton of coal = 149 gallons of oil.",
      explorer:
        "Nuclear force is millions of times stronger than chemical combustion bonds.",
      curious:
        "High energy density reduces raw fuel mining, shipping logistics, and lifecycle land use.",
      "deep-dive":
        "Commercial UO₂ achieves ~45–60 GWd/tU burnup, extracting ~200 MeV per fission.",
      geeky:
        "Fragment kinetic energy dominates recoverable Q (~168 MeV out of ~190 MeV thermal).",
    },
  },
  {
    id: "fission-mechanics",
    stepNumber: 2,
    tabLabel: "Fission Mechanics",
    title: "2. Induced Nuclear Fission: Splitting the Nucleus",
    explanations: {
      beginner:
        "How do you crack an atom? You gently tap it with a neutron! When an extra neutron enters a heavy uranium-235 atom, the atom starts wobbling like a water droplet in zero gravity. It stretches out and snaps into two smaller pieces, shooting out hot energy and 2 or 3 brand-new free neutrons.",
      explorer:
        "Fission begins when a low-energy thermal neutron is absorbed by a uranium-235 nucleus. This forms an excited uranium-236 compound nucleus. Within less than a picosecond, the compound nucleus deforms and undergoes binary fission, splitting into two lighter fragment nuclei (such as Barium-141 and Krypton-92) while releasing 2 to 3 free prompt neutrons and intense thermal radiation.",
      curious:
        "The fundamental fission equation can be expressed as: n + ²³⁵U → ²³⁶U* → ¹⁴¹Ba + ⁹²Kr + 3n + ~200 MeV. Because the resulting fission fragments possess excess neutrons relative to stable valley isotopes, they undergo radioactive beta decay over time, releasing residual decay heat that requires continued coolant circulation even after the reactor shuts down.",
      "deep-dive":
        "Fission cross section σ_f depends strongly on incident neutron kinetic energy. For fissile U-235, thermal neutrons (0.025 eV) have an absorption cross section of ~585 barns, compared to only ~1 barn for fast 1 MeV neutrons. This 500-fold cross section difference requires moderating fast fission neutrons down to thermal energies using light water (H₂O) or heavy water (D₂O).",
      geeky:
        "Liquid drop model Bohr-Wheeler fission barrier is ~5.7 MeV for U-236. The neutron separation energy of U-236 is ~6.5 MeV; thus, zero-kinetic-energy (thermal) neutron capture provides sufficient excitation energy to exceed the fission barrier without incident threshold energy (unlike fertile U-238, which requires fast neutrons >1 MeV to overcome its ~6.2 MeV barrier).",
    },
    keyTakeaways: {
      beginner:
        "A single neutron splits uranium, creating heat and free neutrons to keep the process going.",
      explorer:
        "Neutron absorption creates an unstable intermediate nucleus that divides within picoseconds.",
      curious:
        "Fission produces decay heat that persists post-shutdown due to radioactive fission products.",
      "deep-dive":
        "Thermal neutrons have 585 barns fission cross section versus 1 barn for fast neutrons.",
      geeky:
        "U-235 thermal capture exceeds the 5.7 MeV barrier, enabling thermal light-water reactors.",
    },
  },
  {
    id: "chain-reaction",
    stepNumber: 3,
    tabLabel: "Chain Reactions",
    title: "3. Self-Sustaining Criticality & Safe Control",
    explanations: {
      beginner:
        "Imagine a room filled with thousands of mousetraps, each holding two ping-pong balls. If you drop one ball, it triggers a chain reaction! In a nuclear power plant, we keep the reaction perfectly balanced so exactly ONE neutron from each split goes on to cause another split. We use control rods like gentle sponges that soak up extra neutrons.",
      explorer:
        "A reactor operates in a state called 'criticality' (k = 1.0), where the neutron population remains exactly constant from one generation to the next. If the rate increases (supercritical), control rods containing neutron-absorbing elements like Boron, Cadmium, or Hafnium are lowered into the core to absorb neutrons and restore equilibrium.",
      curious:
        "The effective neutron multiplication factor is k_eff. When k_eff = 1.0, power output is steady. Commercial reactors are engineered with intrinsic negative temperature reactivity coefficients: if the core overheats, water expands and becomes less dense, moderating fewer neutrons, which naturally chokes off the reaction without human intervention.",
      "deep-dive":
        "Reactor kinetics relies critically on delayed neutrons. While prompt neutrons emit within 10⁻¹⁴ seconds, roughly 0.65% (β_eff ≈ 0.0065 in U-235) are emitted seconds to minutes later by decaying precursor isotopes (e.g., Br-87, I-137). This delayed fraction shifts the effective neutron generation time from microseconds to seconds, allowing mechanical control systems and control-rod stepping mechanisms to comfortably regulate core power.",
      geeky:
        "The 6-factor formula k_eff = ε · p · f · η · P_FNL · P_TNL dictates the neutron economy. Inherent passive safety requires negative Doppler coefficient (∂ρ/∂T_fuel < 0 via resonance capture broadening in U-238) and negative moderator temperature coefficient (∂ρ/∂T_mod < 0). Commercial PWR/BWR designs legally forbid positive void coefficients at operational states.",
    },
    keyTakeaways: {
      beginner:
        "Control rods absorb extra neutrons to keep the reaction calm and perfectly steady.",
      explorer:
        "k_eff = 1.0 means constant electricity generation. Control rods regulate output.",
      curious:
        "Inherent negative temperature feedback means hotter water automatically slows the reactor down.",
      "deep-dive":
        "Delayed neutrons (β_eff ~0.0065) slow core response from microseconds to seconds for control.",
      geeky:
        "Doppler resonance capture in U-238 provides instantaneous physical negative reactivity feedback.",
    },
  },
  {
    id: "thermal-generation",
    stepNumber: 4,
    tabLabel: "Thermal to Electricity",
    title: "4. The Three Isolated Loops: Turning Heat into Clean Power",
    explanations: {
      beginner:
        "A nuclear plant is basically a super high-tech steam kettle! The nuclear core heats water in a sealed loop. That hot loop warms up a second clean water loop until it boils into high-pressure steam. The rushing steam spins a giant electric fan (a turbine) connected to a generator. The steam is then cooled back into water and used again and again.",
      explorer:
        "Modern nuclear plants use three separate, isolated water circuits. Loop 1 (Primary) circulates through the reactor core to absorb fission heat. Loop 2 (Secondary) receives heat via a steam generator to create clean steam that drives the turbo-generator. Loop 3 (Tertiary) draws cooling water from a cooling tower or ocean to condense the steam back into liquid water.",
      curious:
        "Because Loop 1 (pressurized to ~155 bar in PWRs to prevent boiling at 315°C) is completely isolated by the steam generator tubes, the water that turns the turbine contains zero radioactive activation products. The huge white clouds rising from nuclear cooling towers are 100% pure water vapor, not smoke or pollution.",
      "deep-dive":
        "The thermodynamic cycle follows a modified Rankine cycle with moisture separators and reheat stages, achieving thermal efficiencies around 33% to 37%. Pressurizers maintain primary loop pressure to prevent bulk subcooled nucleate boiling departure (DNB). Secondary steam at ~60–70 bar and ~280°C expands through high- and low-pressure turbine casings coupled to a synchronous 50/60 Hz electric generator.",
      geeky:
        "Thermal-hydraulic heat balance: Q_thermal = m_dot · (h_out - h_in). Critical Heat Flux (CHF) margin is monitored via Departure from Nucleate Boiling Ratio (DNBR > 1.3 minimum safety limit). Condenser vacuum (typically 0.04 to 0.08 bar absolute) maximizes turbine enthalpy drop Δh, rejecting low-grade heat through hyperbolic cooling towers via evaporative heat flux.",
    },
    keyTakeaways: {
      beginner:
        "Nuclear plants make steam that spins a generator; cooling towers release pure water vapor.",
      explorer:
        "Three separate closed loops ensure radiation never touches the steam turbine.",
      curious:
        "The primary loop operates at 155 atmospheres of pressure so water stays liquid at 315°C.",
      "deep-dive":
        "Rankine thermodynamic cycle achieves ~34% thermal-to-electric conversion efficiency.",
      geeky:
        "DNBR safety margins prevent film boiling and protect fuel cladding thermal integrity.",
    },
  },
  {
    id: "defense-in-depth",
    stepNumber: 5,
    tabLabel: "Safety Barriers",
    title: "5. Defense-in-Depth: Four Concentric Safety Barriers",
    explanations: {
      beginner:
        "Nuclear reactors are built like nesting Russian dolls of steel and concrete. Even if one wall fails, there are three more solid walls trapping all the radiation inside. The outermost building is made of reinforced concrete so thick it can survive a direct hit from an airplane!",
      explorer:
        "Safety relies on 'Defense-in-Depth'. Four physical containment boundaries exist between the radioactive fuel and the environment: (1) the solid ceramic fuel pellet, (2) the sealed Zircaloy fuel cladding tube, (3) the thick steel reactor pressure vessel, and (4) the massive steel-lined reinforced concrete containment building.",
      curious:
        "Commercial reactors are designed around Design Basis Accidents (DBAs) like a double-ended guillotine break of the largest primary coolant pipe. Emergency Core Cooling Systems (ECCS), passive gravity-fed cooling tanks, and containment spray systems ensure core cooling even in the complete loss of off-site electrical power (station blackout).",
      "deep-dive":
        "Barrier 1: UO₂ ceramic matrix retains >98% of fission gases. Barrier 2: Zircaloy-4 / M5 alloy cladding tubes withstand 1200°C without runaway oxidation. Barrier 3: Low-alloy carbon steel RPV (15–25 cm thick with stainless steel liner) withstands 17 MPa operating pressure. Barrier 4: Pre-stressed post-tensioned concrete containment building (1.2–1.8 m thick with a steel liner plate) engineered for internal pressure containment up to 0.5 MPa.",
      geeky:
        "Probabilistic Risk Assessment (PRA) calculates Core Damage Frequency (CDF) below 10⁻⁵ / reactor-year for Gen III/III+ plants (AP1000, EPR, VVER-1200) and Large Early Release Frequency (LERF) below 10⁻⁶. Passive containment cooling systems (PCCS) rely purely on natural circulation, gravity drainage, and atmospheric heat sinks for 72+ hours coping time without AC power.",
    },
    keyTakeaways: {
      beginner:
        "4 nested layers of ceramic, metal, steel, and concrete trap all radioactive material.",
      explorer:
        "The outer dome is over a meter of reinforced concrete designed to resist airplane impacts.",
      curious:
        "Emergency Core Cooling Systems use gravity and pressurized tanks to cool the core without power.",
      "deep-dive":
        "UO₂ ceramic matrix + Zircaloy cladding retain 98%+ of volatile fission products.",
      geeky:
        "Gen III+ passive safety achieves Core Damage Frequency < 10⁻⁵ / reactor-year with 72h coping.",
    },
  },
];

export function HowItWorksViewer() {
  const [level, setLevel] = useComplexityPreference("curious");
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStep = STEPS[activeStepIndex];
  const explanation = currentStep.explanations[level];
  const takeaway = currentStep.keyTakeaways[level];

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
            aria-selected={idx === activeStepIndex}
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
            <span className={styles.stageLevelBadge}>
              Level: {COMPLEXITY_LABELS[level]}
            </span>
          </div>

          <p className={styles.stageExplanation}>{explanation}</p>

          <div className={styles.keyTakeawayBox}>
            <strong>Key Concept ({COMPLEXITY_LABELS[level]}):</strong>
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
            <h4>Interactive Fission & Decay Simulator</h4>
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
            <h4>Commercial Reactor Architectures</h4>
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
            <h4>Energy Comparison Lab</h4>
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
