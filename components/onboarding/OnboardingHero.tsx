"use client";
import Link from "next/link";
import { EnergyJourney } from "@/features/exhibits/EnergyJourney";
import styles from "./OnboardingHero.module.css";
export function OnboardingHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          A little curiosity. A bigger perspective.
        </p>
        <h1 id="hero-heading">
          Small atoms.
          <br />
          <span>Big questions.</span>
        </h1>
        <p className={styles.subtitle}>
          Explore nuclear energy, try the science, and follow the evidence. From
          your first atom to the choices that shape our electricity.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/learn">
            Start exploring →
          </Link>
          <Link className={styles.secondary} href="/compare">
            Compare energy
          </Link>
        </div>
      </div>
      <EnergyJourney />
    </section>
  );
}
