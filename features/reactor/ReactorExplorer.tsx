"use client";
import { GraphicsBoundary } from "@/features/exhibits/GraphicsBoundary";

import React, { useState } from "react";
import Image from "next/image";
import { ReactorSchematic } from "./schematics/ReactorSchematic";
import type {
  ReactorSystem,
  ReactorComponent,
} from "../../lib/reactor/schemas";
import {
  selectPart,
  getConnectedFlows,
  resolveComponentCitations,
} from "../../lib/reactor/reactor-model";
import dynamic from "next/dynamic";
const Reactor3DCanvas = dynamic(
  () => import("./Reactor3DCanvas").then((m) => m.Reactor3DCanvas),
  { ssr: false, loading: () => <p role="status">Loading 3D view…</p> },
);
import styles from "./ReactorExplorer.module.css";
import canvasStyles from "./Reactor3DCanvas.module.css";

const HIGH_RES_RENDERS = [
  {
    title: "Pressurized Water Reactor (PWR) 3D Cutaway",
    src: "/assets/reactor/reactor_schematic_1789243747503.jpg",
    caption:
      "Full digital museum cutaway schematic showing containment dome, reactor pressure vessel, primary coolant loops, steam generator, and turbine building.",
  },
  {
    title: "Nuclear Fuel Assembly Core 3D Geometry",
    src: "/assets/reactor/fuel_assembly_1789243766975.jpg",
    caption:
      "High-precision geometric lattice of zirconium-clad fuel rods, spacer grids, and water channels emitting Cherenkov radiation.",
  },
  {
    title: "Plant & Grid Power Distribution Facility",
    src: "/assets/reactor/nuclear_plant_overview_1789243785602.jpg",
    caption:
      "Architectural overview of reactor containment, multi-stage cooling towers, switchyard transformers, and high-voltage transmission interconnects.",
  },
];

export interface ReactorExplorerProps {
  system: ReactorSystem;
}

export function ReactorExplorer({ system }: ReactorExplorerProps) {
  const [selectedPartId, setSelectedPartId] = useState<string | null>(
    system.components[0]?.id ?? null,
  );
  const [graphicsFailed, setGraphicsFailed] = useState(false);
  const graphicsFallback = () => {
    setGraphicsFailed(true);
    setViewMode("2d");
  };
  const [viewMode, setViewMode] = useState<"3d" | "2d">("2d");
  const [schematicPlaying, setSchematicPlaying] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [gallerySlide, setGallerySlide] = useState(0);
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [explanationMode, setExplanationMode] = useState<
    "standard" | "simpler" | "deeper"
  >("standard");
  const [powerLevel, setPowerLevel] = useState<100 | 50 | 0>(100);
  const [activeLoopFilter, setActiveLoopFilter] = useState<
    "all" | "primary" | "secondary" | "tertiary"
  >("all");

  const handleSelectPart = (id: string | null) => {
    const safeId = selectPart(system, id);
    setSelectedPartId(safeId);
  };

  const selectedComponent: ReactorComponent | undefined =
    system.components.find((c) => c.id === selectedPartId);
  const activeHoverComponent: ReactorComponent | undefined =
    system.components.find((c) => c.id === hoveredPartId);
  const displayComponent = activeHoverComponent ?? selectedComponent;

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
      {graphicsFailed && (
        <p role="status">
          3D graphics are unavailable. Your selection is preserved in the 2D
          view and component list.
        </p>
      )}
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
        {/* Left Column: Interactive Diagram + Simulation Toolbar + Text Buttons */}
        <section className={styles.diagramCard} aria-label="Reactor Schematic">
          <div className={styles.diagramHeader}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <h2 className={styles.diagramTitle} style={{ margin: 0 }}>
                Interactive Plant Schematic
              </h2>

              <div
                className={canvasStyles.viewModeToggle}
                role="group"
                aria-label="Visual Mode Switcher"
              >
                <button
                  type="button"
                  className={`${canvasStyles.viewModeBtn} ${viewMode === "3d" ? canvasStyles.viewModeBtnActive : ""}`}
                  onClick={() => {
                    setGraphicsFailed(false);
                    setViewMode("3d");
                  }}
                  aria-pressed={viewMode === "3d"}
                >
                  🧊 3D Digital Model
                </button>
                <button
                  type="button"
                  className={`${canvasStyles.viewModeBtn} ${viewMode === "2d" ? canvasStyles.viewModeBtnActive : ""}`}
                  onClick={() => setViewMode("2d")}
                  aria-pressed={viewMode === "2d"}
                >
                  📐 2D Technical Schematic
                </button>
                <button
                  type="button"
                  className={canvasStyles.viewModeBtn}
                  onClick={() => setShowGallery(true)}
                  title="Open high-resolution 3D cutaway renders gallery"
                >
                  📸 3D Renders
                </button>
              </div>
            </div>

            {/* Interactive Circuit Filters */}
            <div
              className={styles.legend}
              role="group"
              aria-label="Circuit Filter Selection"
            >
              <button
                type="button"
                className={`${styles.legendBtn} ${activeLoopFilter === "all" ? styles.legendBtnActive : ""}`}
                onClick={() => setActiveLoopFilter("all")}
              >
                All Circuits
              </button>
              <button
                type="button"
                className={`${styles.legendBtn} ${activeLoopFilter === "primary" ? styles.legendBtnActive : ""}`}
                onClick={() => setActiveLoopFilter("primary")}
              >
                <span className={styles.legendDotPrimary} /> Primary
              </button>
              <button
                type="button"
                className={`${styles.legendBtn} ${activeLoopFilter === "secondary" ? styles.legendBtnActive : ""}`}
                onClick={() => setActiveLoopFilter("secondary")}
              >
                <span className={styles.legendDotSecondary} /> Secondary
              </button>
              <button
                type="button"
                className={`${styles.legendBtn} ${activeLoopFilter === "tertiary" ? styles.legendBtnActive : ""}`}
                onClick={() => setActiveLoopFilter("tertiary")}
              >
                <span className={styles.legendDotTertiary} /> Tertiary
              </button>
            </div>
          </div>

          {/* Plant Operational Simulator Controls */}
          <div className={styles.toolbar}>
            <div className={styles.simControls}>
              <span>Reactor Power:</span>
              <div
                className={styles.simBtnGroup}
                role="radiogroup"
                aria-label="Reactor Power Simulator"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={powerLevel === 100}
                  className={`${styles.simBtn} ${powerLevel === 100 ? styles.simBtnActive : ""}`}
                  onClick={() => setPowerLevel(100)}
                >
                  ⚡ 100% Full Power
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={powerLevel === 50}
                  className={`${styles.simBtn} ${powerLevel === 50 ? styles.simBtnActive : ""}`}
                  onClick={() => setPowerLevel(50)}
                >
                  🟡 50% Reduced
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={powerLevel === 0}
                  className={`${styles.simBtn} ${styles.simBtnScram} ${powerLevel === 0 ? styles.simBtnActive : ""}`}
                  onClick={() => setPowerLevel(0)}
                >
                  🛑 SCRAM / Trip
                </button>
              </div>
            </div>
          </div>

          {viewMode === "2d" && (
            <button
              type="button"
              className={styles.simBtn}
              aria-pressed={schematicPlaying}
              onClick={() => setSchematicPlaying(!schematicPlaying)}
            >
              {schematicPlaying
                ? "Pause schematic flow"
                : "Play schematic flow"}
            </button>
          )}
          {/* Visual Presentation Area (3D WebGL Digital Model & 2D Technical Diagram) */}
          <div className={styles.svgWrapper}>
            {viewMode === "3d" ? (
              <>
                <GraphicsBoundary onFailure={graphicsFallback}>
                  <Reactor3DCanvas
                    onUnavailable={graphicsFallback}
                    system={system}
                    selectedId={selectedPartId}
                    onSelectPart={handleSelectPart}
                    powerLevel={powerLevel}
                    activeLoopFilter={activeLoopFilter}
                  />
                </GraphicsBoundary>
                {/* 2D Accessible SVG preserved in DOM for screen-readers & test assertions */}
                <div className={canvasStyles.paneHiddenAccessible}>
                  {
                    <ReactorSchematic
                      system={system}
                      powerLevel={powerLevel}
                      selectedPartId={selectedPartId}
                      activeLoopFilter={activeLoopFilter}
                      handleSelectPart={handleSelectPart}
                      setHoveredPartId={setHoveredPartId}
                      playing={false}
                    />
                  }
                </div>
              </>
            ) : (
              <ReactorSchematic
                system={system}
                powerLevel={powerLevel}
                selectedPartId={selectedPartId}
                activeLoopFilter={activeLoopFilter}
                handleSelectPart={handleSelectPart}
                setHoveredPartId={setHoveredPartId}
                playing={viewMode === "2d" && schematicPlaying}
              />
            )}

            {/* Real-time Technical HUD Readout */}
            <div className={styles.hudBar}>
              <div>
                <span className={styles.hudActiveTag}>
                  {displayComponent ? displayComponent.name : "Plant Overview"}
                </span>{" "}
                <span>
                  {displayComponent
                    ? `· Subsystem Type: ${displayComponent.type.toUpperCase()} · Status: Nominal`
                    : "· Click any 3D component or diagram part to zoom & inspect."}
                </span>
              </div>
              <div>
                <span>
                  Power: <strong>{powerLevel}%</strong>
                </span>
              </div>
            </div>
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
                          style={{
                            marginLeft: "0.25rem",
                            color: "var(--atom-accent)",
                          }}
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
            <p style={{ color: "var(--atom-text-muted)" }}>
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

      {/* Lightbox Modal for 3D Photorealistic Renders */}
      {showGallery && (
        <div
          className={canvasStyles.modalOverlay}
          onClick={() => setShowGallery(false)}
        >
          <div
            className={canvasStyles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={canvasStyles.modalHeader}>
              <div className={canvasStyles.modalTitle}>
                <span>📸</span>
                <span>{HIGH_RES_RENDERS[gallerySlide].title}</span>
              </div>
              <button
                type="button"
                className={canvasStyles.modalCloseBtn}
                onClick={() => setShowGallery(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className={canvasStyles.modalBody}>
              <div className={canvasStyles.modalImageWrapper}>
                <Image
                  src={HIGH_RES_RENDERS[gallerySlide].src}
                  alt={HIGH_RES_RENDERS[gallerySlide].title}
                  width={880}
                  height={495}
                  className={canvasStyles.modalImage}
                  priority
                />
              </div>
              <div className={canvasStyles.modalThumbnails}>
                {HIGH_RES_RENDERS.map((render, idx) => (
                  <button
                    key={render.title}
                    type="button"
                    className={`${canvasStyles.modalThumbBtn} ${
                      gallerySlide === idx
                        ? canvasStyles.modalThumbBtnActive
                        : ""
                    }`}
                    onClick={() => setGallerySlide(idx)}
                  >
                    {idx + 1}. {render.title.split(" ")[0]}{" "}
                    {render.title.split(" ")[1]}
                  </button>
                ))}
              </div>
              <p className={canvasStyles.modalCaption}>
                {HIGH_RES_RENDERS[gallerySlide].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
