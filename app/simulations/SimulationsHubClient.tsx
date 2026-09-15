"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GridSimulator } from "@/features/simulator/GridSimulator";
import { FissionSimulator } from "@/features/simulator/FissionSimulator";
import { DecaySimulator } from "@/features/simulator/DecaySimulator";
import { ReactorControlSimulator } from "@/features/simulator/ReactorControlSimulator";
import styles from "./SimulationsHub.module.css";

type SimulationTab = "grid" | "fission" | "decay" | "reactor";

export function SimulationsHubClient() {
  const [activeTab, setActiveTab] = useState<SimulationTab>("grid");

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroHeader}>
        <span className={styles.badge}>Interactive Lab</span>
        <h1 className={styles.pageTitle}>Nuclear & Energy Simulations</h1>
        <p className={styles.pageSubtitle}>
          Step into four evidence-grounded physics and engineering simulators.
          Explore the atomic chain reaction, radioisotope half-life decay,
          reactor core control rod dynamics, and annual electricity grid
          reliability.
        </p>
      </div>

      {/* Simulator Navigation Tabs */}
      <div
        className={styles.tabsBar}
        role="tablist"
        aria-label="Select Simulation Tool"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "grid"}
          className={`${styles.tabButton} ${activeTab === "grid" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("grid")}
        >
          <span className={styles.tabIcon} aria-hidden="true">
            ⚡
          </span>
          <span>Annual Grid Dispatch</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "fission"}
          className={`${styles.tabButton} ${activeTab === "fission" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("fission")}
        >
          <span className={styles.tabIcon} aria-hidden="true">
            ⚛
          </span>
          <span>Fission Chain Reaction</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "decay"}
          className={`${styles.tabButton} ${activeTab === "decay" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("decay")}
        >
          <span className={styles.tabIcon} aria-hidden="true">
            ⏱
          </span>
          <span>Radioactive Decay & Half-Life</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "reactor"}
          className={`${styles.tabButton} ${activeTab === "reactor" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("reactor")}
        >
          <span className={styles.tabIcon} aria-hidden="true">
            🎛️
          </span>
          <span>Reactor Core & SCRAM</span>
        </button>
      </div>

      {/* Active Simulator Container */}
      <div className={styles.tabPanel} role="tabpanel">
        {activeTab === "grid" && <GridSimulator />}
        {activeTab === "fission" && <FissionSimulator />}
        {activeTab === "decay" && <DecaySimulator />}
        {activeTab === "reactor" && <ReactorControlSimulator />}
      </div>

      {/* Related Explorations */}
      <div className={styles.relatedSection}>
        <h3 className={styles.relatedTitle}>Connect Science to Context</h3>
        <div className={styles.relatedGrid}>
          <Link href="/how-it-works" className={styles.relatedCard}>
            <div className={styles.relatedCardTitle}>
              <span>🔬</span> How Nuclear Energy Works
            </div>
            <p className={styles.relatedCardDesc}>
              Follow the step-by-step physical journey from uranium fuel pellets
              to spinning turbine generators.
            </p>
          </Link>

          <Link href="/reactors" className={styles.relatedCard}>
            <div className={styles.relatedCardTitle}>
              <span>🏗️</span> Reactor Architecture & Fleet
            </div>
            <p className={styles.relatedCardDesc}>
              Examine pressurized water, boiling water, and heavy water designs
              operating across the world.
            </p>
          </Link>

          <Link href="/radiation" className={styles.relatedCard}>
            <div className={styles.relatedCardTitle}>
              <span>☢️</span> Radiation Around Us
            </div>
            <p className={styles.relatedCardDesc}>
              Contextualize ionizing radiation doses on a logarithmic scale from
              bananas to medical CT scans.
            </p>
          </Link>

          <Link href="/compare" className={styles.relatedCard}>
            <div className={styles.relatedCardTitle}>
              <span>📊</span> Comparison Lab
            </div>
            <p className={styles.relatedCardDesc}>
              Compare lifecycle carbon intensity, land use, and historical
              mortality across all energy technologies.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
