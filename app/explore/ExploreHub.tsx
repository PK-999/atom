"use client";

import Link from "next/link";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LABELS,
  COMPLEXITY_DESCRIPTIONS,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";
import styles from "./ExploreHub.module.css";

interface LevelHighlight {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

const LEVEL_HIGHLIGHTS: Record<ComplexityLevel, LevelHighlight> = {
  beginner: {
    title: "Beginner Track: Fun Analogies & Visual Wonders",
    description:
      "Start with simple visual models! Learn how tiny atoms hold giant energy, bust spooky myths, and see why eating a banana gives you natural radiation.",
    ctaText: "Start with Atomic Basics",
    ctaHref: "/how-it-works",
  },
  explorer: {
    title: "Explorer Track: Everyday Nuclear Literacy",
    description:
      "Explore the step-by-step nuclear fuel cycle, examine real incident timelines like Chernobyl and Fukushima, and compare clean energy options.",
    ctaText: "Explore How Reactors Work",
    ctaHref: "/how-it-works",
  },
  curious: {
    title: "Curious Citizen Track: Deep Evidence & Real Trade-Offs",
    description:
      "Examine lifecycle emissions, capital costs, radiotoxic waste containment, and systemic grid reliability through peer-reviewed data.",
    ctaText: "Open Energy Comparison Lab",
    ctaHref: "/compare",
  },
  "deep-dive": {
    title: "Deep-Dive Track: Engineering & Thermal-Hydraulics",
    description:
      "Examine PWR vs BWR primary coolant loops, CANDU heavy water moderation, delayed neutron fractions, and loss-of-coolant accident (LOCA) mitigations.",
    ctaText: "Inspect Reactor Architectures",
    ctaHref: "/reactors",
  },
  geeky: {
    title: "Geeky Track: Raw Physics, Cross-Sections & Uncertainty",
    description:
      "Analyze ENDF/B-VIII cross section resonance integrals, Doppler broadening, point kinetics equations, and peer-reviewed econometric synthesis models.",
    ctaText: "Analyze Raw Comparison Data",
    ctaHref: "/compare?level=geeky",
  },
};

export function ExploreHub() {
  const [level, setLevel] = useComplexityPreference("curious");
  const highlight = LEVEL_HIGHLIGHTS[level];

  return (
    <div className={styles.hubContainer}>
      {/* Header with Level Switcher */}
      <header className={styles.hubHeader}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>Interactive Learning Hub</span>
          <h1 className={styles.hubTitle}>
            Explore ATOM:{" "}
            <span style={{ color: "var(--atom-accent)" }}>
              {COMPLEXITY_LABELS[level]}
            </span>
          </h1>
          <p className={styles.hubSubtitle}>{COMPLEXITY_DESCRIPTIONS[level]}</p>
        </div>
      </header>

      {/* Recommended Highlight Banner for Current Level */}
      <div className={styles.recommendedTrack}>
        <div className={styles.trackInfo}>
          <h2>{highlight.title}</h2>
          <p>{highlight.description}</p>
        </div>
        <Link href={highlight.ctaHref} className={styles.trackCta}>
          <span>{highlight.ctaText}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Section 1: Physics & How It Works */}
      <section
        className={styles.sectionBlock}
        aria-labelledby="physics-heading"
      >
        <div className={styles.sectionHeading}>
          <h3 id="physics-heading">1. How Nuclear Energy Works</h3>
          <span>Core Science & Mechanics</span>
        </div>
        <div className={styles.grid3}>
          <Link href="/how-it-works" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ⚛️
              </span>
              <span className={styles.cardBadge}>Foundational</span>
            </div>
            <h4 className={styles.cardTitle}>Reactor Working & Physics</h4>
            <p className={styles.cardDesc}>
              Follow the journey from atomic nucleus to electricity: uranium
              fuel pellets, fission reactions, heat exchangers, and steam
              turbines.
            </p>
            <div className={styles.cardFooter}>
              <span>Explore physics</span>
              <span className={styles.cardMeta}>Step-by-step</span>
            </div>
          </Link>

          <Link href="/simulations" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                🎮
              </span>
              <span className={styles.cardBadge}>Interactive</span>
            </div>
            <h4 className={styles.cardTitle}>Fission & Decay Simulators</h4>
            <p className={styles.cardDesc}>
              Fire neutrons to trigger chain reactions, adjust control rods, and
              watch radioactive half-life decay curves unfold in real time.
            </p>
            <div className={styles.cardFooter}>
              <span>Launch simulations</span>
              <span className={styles.cardMeta}>4 Simulators</span>
            </div>
          </Link>

          <Link href="/radiation" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ☢️
              </span>
              <span className={styles.cardBadge}>Dose Spectrum</span>
            </div>
            <h4 className={styles.cardTitle}>Radiation Around Us</h4>
            <p className={styles.cardDesc}>
              Compare natural background radiation, bananas, airline flights,
              and medical imaging against nuclear facility worker limits.
            </p>
            <div className={styles.cardFooter}>
              <span>Inspect doses</span>
              <span className={styles.cardMeta}>Log scale</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 2: Real-World Systems & Fleets */}
      <section className={styles.sectionBlock} aria-labelledby="fleet-heading">
        <div className={styles.sectionHeading}>
          <h3 id="fleet-heading">2. Global Reactor Fleet & Grid Systems</h3>
          <span>Engineering & Data</span>
        </div>
        <div className={styles.grid3}>
          <Link href="/reactors" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ⚙️
              </span>
              <span className={styles.cardBadge}>Schematics</span>
            </div>
            <h4 className={styles.cardTitle}>Commercial Reactor Designs</h4>
            <p className={styles.cardDesc}>
              Understand PWR, BWR, and PHWR/CANDU architectures: coolant
              pressurization, moderator choices, and safety containment
              barriers.
            </p>
            <div className={styles.cardFooter}>
              <span>View architectures</span>
              <span className={styles.cardMeta}>Technical Schematics</span>
            </div>
          </Link>

          <Link href="/globe" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                🗺️
              </span>
              <span className={styles.cardBadge}>IAEA PRIS</span>
            </div>
            <h4 className={styles.cardTitle}>Global Reactor Map</h4>
            <p className={styles.cardDesc}>
              Browse over 400 operational nuclear power reactors across the
              planet with real operational history, capacity, and age data.
            </p>
            <div className={styles.cardFooter}>
              <span>Open global fleet</span>
              <span className={styles.cardMeta}>Interactive Globe</span>
            </div>
          </Link>

          <Link href="/grid" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ⚡
              </span>
              <span className={styles.cardBadge}>Systems Lab</span>
            </div>
            <h4 className={styles.cardTitle}>Annual Grid Simulator</h4>
            <p className={styles.cardDesc}>
              Simulate an 8,760-hour electricity grid. Mix nuclear baseload with
              solar, wind, and storage to test real-time reliability.
            </p>
            <div className={styles.cardFooter}>
              <span>Balance the grid</span>
              <span className={styles.cardMeta}>8,760 Hours</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 3: Myths, Incidents & Safety */}
      <section className={styles.sectionBlock} aria-labelledby="myths-heading">
        <div className={styles.sectionHeading}>
          <h3 id="myths-heading">3. Myths, Incidents & Safety Evidence</h3>
          <span>Historical Post-Mortems</span>
        </div>
        <div className={styles.grid2}>
          <Link href="/myths" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                🛡️
              </span>
              <span className={styles.cardBadge}>Fact Checks</span>
            </div>
            <h4 className={styles.cardTitle}>Nuclear Myth Busting</h4>
            <p className={styles.cardDesc}>
              We dissect 10 common claims about nuclear waste, catastrophic
              explosions, radiation health effects, and mining footprints using
              peer-reviewed scientific studies.
            </p>
            <div className={styles.cardFooter}>
              <span>Explore myth busters</span>
              <span className={styles.cardMeta}>10 Verified Topics</span>
            </div>
          </Link>

          <Link href="/incidents" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ⚠️
              </span>
              <span className={styles.cardBadge}>Historical Audits</span>
            </div>
            <h4 className={styles.cardTitle}>Nuclear Incidents & FAQs</h4>
            <p className={styles.cardDesc}>
              In-depth engineering timelines, root causes, radiological release
              measurements, and WHO/UNSCEAR health casualty records for
              Chernobyl, Fukushima, and TMI.
            </p>
            <div className={styles.cardFooter}>
              <span>Inspect incident reports</span>
              <span className={styles.cardMeta}>INES 1–7 Case Studies</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Section 4: Debate & Comparisons */}
      <section className={styles.sectionBlock} aria-labelledby="debate-heading">
        <div className={styles.sectionHeading}>
          <h3 id="debate-heading">4. Scientific Comparison & Debate</h3>
          <span>Discourse & Analysis</span>
        </div>
        <div className={styles.grid3}>
          <Link href="/compare" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                📊
              </span>
              <span className={styles.cardBadge}>Quantitative</span>
            </div>
            <h4 className={styles.cardTitle}>Comparison Lab</h4>
            <p className={styles.cardDesc}>
              Multi-technology comparison across lifecycle GHG emissions, land
              footprint, mortality rates, and capacity factors with full source
              provenance.
            </p>
            <div className={styles.cardFooter}>
              <span>Compare sources</span>
              <span className={styles.cardMeta}>6 Technologies</span>
            </div>
          </Link>

          <Link href="/debates" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                💬
              </span>
              <span className={styles.cardBadge}>Multi-Perspective</span>
            </div>
            <h4 className={styles.cardTitle}>Core Nuclear Debates</h4>
            <p className={styles.cardDesc}>
              Structured pro/con arguments on capital intensity, long-term waste
              isolation, proliferation risk, and rapid decarbonization
              trade-offs.
            </p>
            <div className={styles.cardFooter}>
              <span>View structured debates</span>
              <span className={styles.cardMeta}>Curated Arguments</span>
            </div>
          </Link>

          <Link href="/ask" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                🤖
              </span>
              <span className={styles.cardBadge}>Evidence Q&A</span>
            </div>
            <h4 className={styles.cardTitle}>Ask ATOM Chat</h4>
            <p className={styles.cardDesc}>
              Direct Q&A interface grounded strictly in IPCC, IAEA, and
              peer-reviewed scientific papers. Answers cite sources with zero
              hallucination.
            </p>
            <div className={styles.cardFooter}>
              <span>Ask a question</span>
              <span className={styles.cardMeta}>Literature Grounded</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
