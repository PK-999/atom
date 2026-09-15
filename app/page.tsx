import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingHero } from "@/components/onboarding/OnboardingHero";
import styles from "./HomePage.module.css";

export const metadata: Metadata = {
  title: "ATOM — Understand Nuclear Energy Through Evidence",
  description:
    "An evidence-first interactive energy-literacy platform centered on nuclear energy, risk, radiation, electricity systems, and trade-offs. Adaptable from beginner to geeky.",
};

interface FeatureItem {
  title: string;
  badge: string;
  icon: string;
  description: string;
  href: string;
  actionText: string;
}

const FEATURES: FeatureItem[] = [
  {
    title: "How Nuclear Works",
    badge: "Interactive Physics",
    icon: "⚛️",
    description:
      "Explore the science of atoms, induced fission reactions, radioactive decay chains, and how thermal energy turns water to steam to spin turbines.",
    href: "/how-it-works",
    actionText: "Explore reactor physics",
  },
  {
    title: "Incidents & FAQs",
    badge: "Case Studies",
    icon: "📋",
    description:
      "Objective, peer-reviewed post-mortems and timelines for Chernobyl, Fukushima Daiichi, and Three Mile Island with official IAEA & UNSCEAR data.",
    href: "/incidents",
    actionText: "Read incident analyses",
  },
  {
    title: "Myth Busting",
    badge: "Evidence Checks",
    icon: "🔍",
    description:
      "Can reactors explode like atomic bombs? Is radioactive waste unsolvable? Ten widespread claims examined with scientific citations.",
    href: "/myths",
    actionText: "Inspect myth checks",
  },
  {
    title: "Energy Comparison Lab",
    badge: "Empirical Tool",
    icon: "📊",
    description:
      "Compare nuclear, solar, wind, hydro, gas, and coal across lifecycle greenhouse gas emissions, land footprint, capacity factor, and safety statistics.",
    href: "/compare",
    actionText: "Launch Comparison Lab",
  },
  {
    title: "Global Reactor Fleet & Map",
    badge: "Geospatial Data",
    icon: "🗺️",
    description:
      "Interactive map of commercial nuclear reactors worldwide. Inspect reactor designs (PWR, BWR, PHWR), operating status, age, and electricity output.",
    href: "/reactors",
    actionText: "Browse global reactors",
  },
  {
    title: "Interactive Simulators",
    badge: "Hands-on Lab",
    icon: "🎮",
    description:
      "Experience fission chain reactions, radioactive decay half-life, reactor control rod mechanics, and annual hourly electricity grid balance.",
    href: "/simulations",
    actionText: "Run interactive simulations",
  },
  {
    title: "Radiation Around Us",
    badge: "Dose Explorer",
    icon: "☢️",
    description:
      "From eating bananas and transatlantic flights to dental X-rays and nuclear power plant workers. Put microSieverts in honest perspective.",
    href: "/radiation",
    actionText: "Explore radiation doses",
  },
  {
    title: "Evidence Debate Engine",
    badge: "Q&A & Chat",
    icon: "💬",
    description:
      "Interactive Q&A grounded strictly in peer-reviewed scientific papers and IPCC/IAEA assessments. Test your hypotheses against empirical evidence.",
    href: "/debates",
    actionText: "Enter the debate",
  },
  {
    title: "Sources & Methodology",
    badge: "Peer-Reviewed",
    icon: "📚",
    description:
      "Complete transparency: inspect system boundaries, unit conversions, data lineage, and bibliography backing every calculation on ATOM.",
    href: "/methodology",
    actionText: "Review scientific sources",
  },
];

const PRINCIPLES = [
  {
    title: "Evidence Before Persuasion",
    text: "ATOM does not ask you to trust us. ATOM provides transparent data so you can verify everything yourself.",
  },
  {
    title: "Never Hide Uncertainty",
    text: "Where peer-reviewed estimates differ across methodologies or vintages, we display explicit ranges rather than fake certainty.",
  },
  {
    title: "Complexity Changes Presentation",
    text: "Adjusting from Beginner to Geeky simplifies language and diagrams, but never alters scientific evidence.",
  },
  {
    title: "Every Claim Inspectable",
    text: "No invented numbers. Every quantitative claim is linked to published, peer-reviewed source literature with open system boundaries.",
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className={styles.pageWrapper}>
        {/* Hero Onboarding Section with Interactive Level Slider */}
        <OnboardingHero />

        {/* Core Capabilities & Features */}
        <section aria-labelledby="features-heading">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>What You Can Explore</span>
            <h2 id="features-heading" className={styles.sectionTitle}>
              Nine dimensions of energy literacy
            </h2>
            <p className={styles.sectionDescription}>
              From core physics and nuclear safety history to grid reliability
              and empirical life-cycle comparisons.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={styles.featureCard}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    {feature.icon}
                  </span>
                  <span className={styles.cardBadge}>{feature.badge}</span>
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
                <span className={styles.cardLinkText}>
                  {feature.actionText} <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Guiding Principles */}
        <section
          className={styles.principlesBanner}
          aria-labelledby="principles-heading"
        >
          <h2 id="principles-heading" className={styles.principlesTitle}>
            Built on Scientific Integrity
          </h2>
          <p className={styles.principlesSubtitle}>
            Our editorial and scientific commitments ensure balanced,
            transparent analysis.
          </p>
          <div className={styles.principlesGrid}>
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className={styles.principleItem}>
                <strong>{principle.title}</strong>
                <p>{principle.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
