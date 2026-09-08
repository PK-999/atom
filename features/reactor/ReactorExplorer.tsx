"use client";

import React, { useState } from "react";
import type {
  ReactorSystem,
  ReactorComponent,
} from "../../lib/reactor/schemas";
import {
  selectPart,
  getConnectedFlows,
  resolveComponentCitations,
} from "../../lib/reactor/reactor-model";
import styles from "./ReactorExplorer.module.css";

export interface ReactorExplorerProps {
  system: ReactorSystem;
}

export function ReactorExplorer({ system }: ReactorExplorerProps) {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(
    system.components[0]?.id ?? null,
  );
  const [explanationMode, setExplanationMode] = useState<
    "standard" | "simpler" | "deeper"
  >("standard");

  const handleSelectPart = (id: string | null) => {
    const safeId = selectPart(system, id);
    setSelectedPartId(safeId);
  };

  const selectedComponent: ReactorComponent | undefined =
    system.components.find((c) => c.id === selectedPartId);
  const connectedFlows = selectedComponent
    ? getConnectedFlows(system, selectedComponent.id)
    : [];
  const citations = selectedComponent
    ? resolveComponentCitations(system, selectedComponent)
    : [];

  return (
    <article
      className={styles.container}
      aria-labelledby={`reactor-title-${system.id}`}
    >
      <header className={styles.header}>
        <span className={styles.conceptBadge}>
          Reactor Architecture · {system.type}
        </span>
        <h1 id={`reactor-title-${system.id}`} className={styles.title}>
          {system.name}
        </h1>
        <p className={styles.summary}>{system.summary}</p>
      </header>

      <div className={styles.layoutGrid}>
        {/* Left Column: Interactive Diagram + Text Button List */}
        <section className={styles.diagramCard} aria-label="Reactor Schematic">
          <div className={styles.diagramHeader}>
            <h2 className={styles.diagramTitle}>Interactive Plant Schematic</h2>
            <div className={styles.legend} aria-label="Flow Legend">
              <span className={styles.legendItem}>
                <span className={styles.legendDotPrimary} /> Primary Coolant
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDotSecondary} /> Secondary Steam
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDotTertiary} /> Tertiary Cooling
              </span>
            </div>
          </div>

          <div className={styles.svgWrapper}>
            <svg
              viewBox="0 0 760 380"
              className={styles.diagramSvg}
              role="img"
              aria-label={`Interactive schematic diagram for ${system.name}`}
            >
              <defs>
                <linearGradient
                  id="primaryPipeGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient
                  id="secondaryPipeGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient
                  id="tertiaryPipeGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background Flow Piping (Primary Loop) */}
              <path
                d="M 170 190 H 290 V 275 H 170 Z"
                fill="none"
                stroke="url(#primaryPipeGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />

              {/* Secondary Loop Steam & Return */}
              <path
                d="M 330 150 H 450 V 270 H 330 Z"
                fill="none"
                stroke="url(#secondaryPipeGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />

              {/* Tertiary Cooling Loop */}
              <path
                d="M 540 270 H 640 V 210 H 540 Z"
                fill="none"
                stroke="url(#tertiaryPipeGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />

              {/* Interactive Schematic Parts */}
              {system.components.map((comp) => {
                const coords = comp.diagramCoords ?? {
                  x: 50,
                  y: 50,
                  width: 80,
                  height: 60,
                };
                const isSelected = selectedPartId === comp.id;

                // Color mappings based on component type
                let fill = "#f1f5f9";
                let stroke = "#94a3b8";

                if (comp.type === "vessel" || comp.type === "calandria") {
                  fill = "#e2e8f0";
                  stroke = "#475569";
                } else if (comp.type === "fuel") {
                  fill = "#fef08a";
                  stroke = "#eab308";
                } else if (comp.type === "control-rod") {
                  fill = "#cbd5e1";
                  stroke = "#334155";
                } else if (comp.type === "steam-generator") {
                  fill = "#bae6fd";
                  stroke = "#0284c7";
                } else if (comp.type === "pressurizer") {
                  fill = "#fecaca";
                  stroke = "#ef4444";
                } else if (comp.type === "turbine") {
                  fill = "#e0e7ff";
                  stroke = "#6366f1";
                } else if (comp.type === "condenser") {
                  fill = "#ccfbf1";
                  stroke = "#14b8a6";
                } else if (comp.type === "containment") {
                  fill = "none";
                  stroke = "#64748b";
                } else if (comp.type === "cooling-tower") {
                  fill = "#f8fafc";
                  stroke = "#10b981";
                }

                return (
                  <g
                    key={comp.id}
                    className={`${styles.svgPartButton} ${isSelected ? styles.svgPartSelected : ""}`}
                    onClick={() => handleSelectPart(comp.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${comp.name}`}
                    aria-pressed={isSelected}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelectPart(comp.id);
                      }
                    }}
                  >
                    <rect
                      x={coords.x}
                      y={coords.y}
                      width={coords.width}
                      height={coords.height}
                      rx={comp.type === "containment" ? 30 : 6}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      strokeDasharray={
                        comp.type === "containment" ? "6 3" : undefined
                      }
                      opacity={comp.type === "containment" ? 0.6 : 0.95}
                    />
                    {comp.type !== "containment" && (
                      <text
                        x={coords.x + coords.width / 2}
                        y={coords.y + coords.height / 2 + 4}
                        textAnchor="middle"
                        fontSize={coords.width < 60 ? "10" : "11"}
                        fontWeight="600"
                        fill="#0f172a"
                        pointerEvents="none"
                      >
                        {comp.name.split(" ")[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Labeled Text Control Equivalents for Keyboard / Screen Reader users */}
          <div
            className={styles.componentButtonGrid}
            role="group"
            aria-label="System Components Selection"
          >
            {system.components.map((comp) => {
              const isSelected = selectedPartId === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  className={`${styles.componentTextButton} ${
                    isSelected ? styles.componentTextButtonSelected : ""
                  }`}
                  onClick={() => handleSelectPart(comp.id)}
                  aria-pressed={isSelected}
                  aria-controls="reactor-part-details"
                >
                  {comp.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Right Column: Component Details Panel */}
        <section
          id="reactor-part-details"
          className={styles.detailCard}
          aria-label="Component Details Inspector"
        >
          {selectedComponent ? (
            <div>
              <div className={styles.detailHeader}>
                <h3 className={styles.partName}>{selectedComponent.name}</h3>
                <p className={styles.partRole}>{selectedComponent.role}</p>
              </div>

              {/* Explanation Level Toggles */}
              <div
                className={styles.explanationTabs}
                role="tablist"
                aria-label="Explanation Complexity"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={explanationMode === "simpler"}
                  className={`${styles.tabButton} ${
                    explanationMode === "simpler" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setExplanationMode("simpler")}
                >
                  Simple (L1–L2)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={explanationMode === "standard"}
                  className={`${styles.tabButton} ${
                    explanationMode === "standard" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setExplanationMode("standard")}
                >
                  Standard (L3)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={explanationMode === "deeper"}
                  className={`${styles.tabButton} ${
                    explanationMode === "deeper" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setExplanationMode("deeper")}
                >
                  Technical (L4–L5)
                </button>
              </div>

              {/* Explanation Prose */}
              <p className={styles.explanationBody}>
                {explanationMode === "simpler" &&
                selectedComponent.simplerExplanation
                  ? selectedComponent.simplerExplanation
                  : explanationMode === "deeper" &&
                      selectedComponent.deeperExplanation
                    ? selectedComponent.deeperExplanation
                    : selectedComponent.description}
              </p>

              {/* Connected Fluid Flows */}
              {connectedFlows.length > 0 && (
                <div className={styles.flowsSection}>
                  <h4 className={styles.flowsTitle}>
                    Connected Heat & Fluid Flows
                  </h4>
                  {connectedFlows.map((flow) => {
                    const badgeType =
                      flow.loop === "primary"
                        ? styles.flowPrimary
                        : flow.loop === "secondary"
                          ? styles.flowSecondary
                          : styles.flowTertiary;
                    return (
                      <div key={flow.id} className={styles.flowItem}>
                        <span className={`${styles.flowBadge} ${badgeType}`}>
                          {flow.loop}
                        </span>
                        <strong>{flow.name}:</strong> {flow.fluid}
                        {flow.operatingTemp && (
                          <span> ({flow.operatingTemp}</span>
                        )}
                        {flow.operatingPressure && (
                          <span>, {flow.operatingPressure})</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Component Citations */}
              {citations.length > 0 && (
                <div className={styles.detailFooter}>
                  <strong>Source:</strong>{" "}
                  {citations.map((c) => (
                    <span key={c.id}>
                      {c.title} ({c.publisher}, {c.year})
                      {c.url && (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: "0.25rem", color: "#0284c7" }}
                        >
                          [Link]
                        </a>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>
              Select a component in the diagram or list to inspect details.
            </p>
          )}

          {/* System Deployed Examples */}
          {system.deployedExamples && system.deployedExamples.length > 0 && (
            <div className={styles.detailFooter}>
              <strong>Real-World Commercial Examples:</strong>
              <div className={styles.deployedList}>
                {system.deployedExamples.map((ex) => (
                  <span key={ex} className={styles.deployedTag}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
