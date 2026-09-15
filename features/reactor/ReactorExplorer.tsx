"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type {
  ReactorSystem,
  ReactorComponent,
} from "../../lib/reactor/schemas";
import {
  selectPart,
  getConnectedFlows,
  resolveComponentCitations,
} from "../../lib/reactor/reactor-model";
import { Reactor3DCanvas } from "./Reactor3DCanvas";
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
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
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

  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: "translate(0px, 0px) scale(1)",
    transformOrigin: "0 0",
  });

  useEffect(() => {
    if (!svgRef.current) return;
    const animId = requestAnimationFrame(() => {
      if (!svgRef.current) return;
      if (!selectedPartId) {
        setZoomStyle({
          transform: "translate(0px, 0px) scale(1)",
          transformOrigin: "0 0",
        });
        return;
      }
      const el = svgRef.current.querySelector(
        `g[data-part-id="${selectedPartId}"]`,
      ) as SVGGElement | null;
      if (el) {
        try {
          const bbox = el.getBBox();
          if (bbox.width === 0 && bbox.height === 0) return;
          const svgWidth = 820;
          const svgHeight = 420;
          // Cap the zoom scale to 2.2 maximum
          const scale =
            Math.min(svgWidth / bbox.width, svgHeight / bbox.height) * 0.6;
          const cappedScale = Math.min(scale, 2.2);

          const cx = bbox.x + bbox.width / 2;
          const cy = bbox.y + bbox.height / 2;

          const tx = svgWidth / 2 - cx * cappedScale;
          const ty = svgHeight / 2 - cy * cappedScale;

          setZoomStyle({
            transform: `translate(${tx}px, ${ty}px) scale(${cappedScale})`,
            transformOrigin: "0 0",
          });
        } catch {
          // Ignored
        }
      } else {
        setZoomStyle({
          transform: "translate(0px, 0px) scale(1)",
          transformOrigin: "0 0",
        });
      }
    });

    return () => cancelAnimationFrame(animId);
  }, [selectedPartId]);

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

  // Helper to determine loop opacity based on activeLoopFilter
  const getLoopClass = (loopType: "primary" | "secondary" | "tertiary") => {
    if (activeLoopFilter === "all") return styles.highlightedCircuit;
    if (activeLoopFilter === loopType) return styles.highlightedCircuit;
    return styles.dimmedCircuit;
  };

  // Helper for dynamic flow animation speed class
  const getFlowSpeedClass = () => {
    if (powerLevel === 100) return styles.flowSpeed100;
    if (powerLevel === 50) return styles.flowSpeed50;
    return styles.flowSpeed0;
  };

  // Helper for turbine spin animation class
  const getTurbineClass = () => {
    if (powerLevel === 100) return styles.turbineSpin100;
    if (powerLevel === 50) return styles.turbineSpin50;
    return styles.turbineSpin0;
  };

  // Helper for pump spin animation class
  const getPumpClass = () => {
    if (powerLevel === 100) return styles.pumpSpin100;
    if (powerLevel === 50) return styles.pumpSpin50;
    return styles.pumpSpin0;
  };

  // Helper for core fission glow class
  const getFissionGlowClass = () => {
    if (powerLevel === 100) return styles.fissionGlow100;
    if (powerLevel === 50) return styles.fissionGlow50;
    return styles.fissionGlow0;
  };

  // Render SVG Schematics based on reactor architecture
  const renderSchematicSvg = () => {
    switch (system.id) {
      case "bwr":
        return renderBwrSvg();
      case "phwr":
        return renderPhwrSvg();
      case "smr":
        return renderSmrSvg();
      case "htgr":
        return renderHtgrSvg();
      case "pwr":
        return renderPwrSvg();
      default:
        return renderGenericSvg();
    }
  };

  // Common SVG Definitions (Gradients, Markers, Filters)
  const renderDefs = () => (
    <defs>
      {/* Primary Coolant Gradient */}
      <linearGradient id="pwrHotGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="pwrColdGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>

      {/* Secondary Steam / Water Gradient */}
      <linearGradient id="secSteamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="secCondensateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>

      {/* Tertiary Cooling Water Gradient */}
      <linearGradient id="tertiaryCoolGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>

      {/* Vessel Metal Gradients */}
      <linearGradient id="vesselSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient
        id="vesselDarkSteelGrad"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>

      {/* Fission Thermal Core Radial Glow */}
      <radialGradient id="fissionThermalGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.8" />
        <stop offset="85%" stopColor="#ea580c" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
      </radialGradient>

      {/* Cherenkov Blue Radiation Radial Glow */}
      <radialGradient id="cherenkovGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
      </radialGradient>

      {/* Heavy Water (D2O) Moderator Tint */}
      <linearGradient id="heavyWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#cffafe" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.85" />
      </linearGradient>

      {/* Directional Flow Arrow Markers */}
      <marker
        id="arrowPrimary"
        viewBox="0 0 10 10"
        refX="6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" />
      </marker>
      <marker
        id="arrowSecondary"
        viewBox="0 0 10 10"
        refX="6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284c7" />
      </marker>
      <marker
        id="arrowTertiary"
        viewBox="0 0 10 10"
        refX="6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
      </marker>

      {/* Drop Shadows */}
      <filter id="partDropShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
  );

  // ----------------------------------------------------------------------
  // 1. PWR Schematic Renderer (Indirect 2-Loop Cycle + Cooling Tower)
  // ----------------------------------------------------------------------
  const renderPwrSvg = () => {
    // Control rod translation based on power level
    const rodTranslateY = powerLevel === 100 ? 0 : powerLevel === 50 ? 25 : 55;

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 820 420"
        className={styles.diagramSvg}
        role="img"
        aria-label={`Interactive schematic diagram for ${system.name}`}
      >
        <g
          style={{
            ...zoomStyle,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {renderDefs()}

          {/* ---------------------------------------------------------------- */}
          {/* Layer 0: Plant Structural Boundaries & Civil Enclosures           */}
          {/* ---------------------------------------------------------------- */}
          {/* Containment Structure (Dome + Cylinder) */}
          {renderComponentButton("pwr-containment", (isSelected) => (
            <g>
              {/* Containment Pre-stressed Concrete Outer Shell */}
              <path
                d="M 50 380 V 160 A 155 130 0 0 1 360 160 V 380 Z"
                fill="rgba(148, 163, 184, 0.08)"
                stroke="#64748b"
                strokeWidth={isSelected ? 3.5 : 2}
                strokeDasharray="8 4"
              />
              {/* Containment Steel Liner Inner Line */}
              <path
                d="M 58 380 V 164 A 147 122 0 0 1 352 164 V 380"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x="205"
                y="58"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#64748b"
                letterSpacing="0.08em"
              >
                PRE-STRESSED CONCRETE CONTAINMENT DOME
              </text>
              {/* Airlock Hatch */}
              <rect
                x="42"
                y="320"
                width="16"
                height="30"
                rx="3"
                fill="#cbd5e1"
                stroke="#475569"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Turbine Hall & Condenser Ground Enclosure */}
          <rect
            x="390"
            y="90"
            width="200"
            height="290"
            rx="8"
            fill="rgba(241, 245, 249, 0.4)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x="490"
            y="110"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#94a3b8"
            letterSpacing="0.05em"
          >
            TURBINE & GENERATOR BUILDING
          </text>

          {/* Plant Base Foundation Line */}
          <line
            x1="30"
            y1="380"
            x2="790"
            y2="380"
            stroke="#475569"
            strokeWidth="2.5"
          />

          {/* ---------------------------------------------------------------- */}
          {/* Layer 1: Piping Circuits & Dynamic Fluid Streams                 */}
          {/* ---------------------------------------------------------------- */}
          {/* PRIMARY LOOP: Hot Leg (RPV to Steam Generator) */}
          <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
            {/* Base outer pipe */}
            <path
              d="M 180 190 H 230 V 215 H 275"
              className={styles.pipeBase}
              stroke="#b91c1c"
              strokeWidth="12"
            />
            {/* Inner animated hot water */}
            <path
              d="M 180 190 H 230 V 215 H 275"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#pwrHotGrad)"
              strokeWidth="8"
              markerEnd="url(#arrowPrimary)"
            />
          </g>

          {/* PRIMARY LOOP: Cold Leg (SG -> Pump -> RPV) */}
          <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
            {/* SG to RCP */}
            <path
              d="M 275 285 H 245"
              className={styles.pipeBase}
              stroke="#b91c1c"
              strokeWidth="12"
            />
            <path
              d="M 275 285 H 245"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#pwrColdGrad)"
              strokeWidth="8"
              markerEnd="url(#arrowPrimary)"
            />
            {/* RCP to RPV */}
            <path
              d="M 215 285 H 180"
              className={styles.pipeBase}
              stroke="#b91c1c"
              strokeWidth="12"
            />
            <path
              d="M 215 285 H 180"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#pwrColdGrad)"
              strokeWidth="8"
              markerEnd="url(#arrowPrimary)"
            />
          </g>

          {/* Pressurizer Surge Line */}
          <path
            d="M 225 185 V 215"
            className={styles.pipeBase}
            stroke="#dc2626"
            strokeWidth="6"
          />

          {/* SECONDARY LOOP: Main Steam Line (SG to Turbine) */}
          <g className={`${styles.pipeGroup} ${getLoopClass("secondary")}`}>
            <path
              d="M 315 110 V 85 H 450 V 135"
              className={styles.pipeBase}
              stroke="#0369a1"
              strokeWidth="10"
            />
            <path
              d="M 315 110 V 85 H 450 V 135"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#secSteamGrad)"
              strokeWidth="6"
              markerEnd="url(#arrowSecondary)"
            />
          </g>

          {/* SECONDARY LOOP: Condensate Return (Condenser to SG) */}
          <g className={`${styles.pipeGroup} ${getLoopClass("secondary")}`}>
            <path
              d="M 450 295 H 380 V 240 H 355"
              className={styles.pipeBase}
              stroke="#1d4ed8"
              strokeWidth="9"
            />
            <path
              d="M 450 295 H 380 V 240 H 355"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#secCondensateGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowSecondary)"
            />
          </g>

          {/* TERTIARY LOOP: Condenser to Cooling Tower */}
          <g className={`${styles.pipeGroup} ${getLoopClass("tertiary")}`}>
            {/* Warm water to tower */}
            <path
              d="M 545 260 H 645"
              className={styles.pipeBase}
              stroke="#047857"
              strokeWidth="8"
            />
            <path
              d="M 545 260 H 645"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#tertiaryCoolGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowTertiary)"
            />
            {/* Cooled water return from tower basin */}
            <path
              d="M 645 295 H 545"
              className={styles.pipeBase}
              stroke="#047857"
              strokeWidth="8"
            />
            <path
              d="M 645 295 H 545"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#tertiaryCoolGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowTertiary)"
            />
          </g>

          {/* ---------------------------------------------------------------- */}
          {/* Layer 2: Mechanical Vessels & Components                         */}
          {/* ---------------------------------------------------------------- */}
          {/* Reactor Pressure Vessel (RPV) */}
          {renderComponentButton("pwr-vessel", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Outer thick carbon-steel vessel body with rounded bottom */}
              <path
                d="M 95 145 H 185 V 285 C 185 315, 95 315, 95 285 Z"
                fill="url(#vesselSteelGrad)"
                stroke={isSelected ? "#2563eb" : "#475569"}
                strokeWidth={isSelected ? 3 : 2}
              />
              {/* Domed upper vessel head with flange */}
              <path
                d="M 90 145 C 90 125, 190 125, 190 145 Z"
                fill="#cbd5e1"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Flange bolt notches */}
              <line
                x1="90"
                y1="145"
                x2="190"
                y2="145"
                stroke="#475569"
                strokeWidth="2.5"
              />
              <circle cx="102" cy="145" r="2.5" fill="#334155" />
              <circle cx="140" cy="143" r="2.5" fill="#334155" />
              <circle cx="178" cy="145" r="2.5" fill="#334155" />

              {/* Core barrel / thermal shield outline */}
              <rect
                x="105"
                y="185"
                width="70"
                height="105"
                rx="4"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text
                x="140"
                y="302"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#334155"
              >
                RPV (15.5 MPa)
              </text>
            </g>
          ))}

          {/* Nuclear Fuel Assemblies (Active Core) */}
          {renderComponentButton("pwr-fuel", (isSelected) => (
            <g>
              {/* Core thermal fission glow pulse */}
              <ellipse
                cx="140"
                cy="235"
                rx="34"
                ry="44"
                fill="url(#fissionThermalGlow)"
                className={getFissionGlowClass()}
              />
              {/* Fuel assembly boundary box */}
              <rect
                x="112"
                y="195"
                width="56"
                height="75"
                rx="4"
                fill="#fef08a"
                stroke={isSelected ? "#2563eb" : "#ca8a04"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {/* Vertical fuel rod bundles */}
              <line
                x1="120"
                y1="198"
                x2="120"
                y2="266"
                stroke="#b45309"
                strokeWidth="2"
              />
              <line
                x1="130"
                y1="198"
                x2="130"
                y2="266"
                stroke="#b45309"
                strokeWidth="2"
              />
              <line
                x1="140"
                y1="198"
                x2="140"
                y2="266"
                stroke="#b45309"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="198"
                x2="150"
                y2="266"
                stroke="#b45309"
                strokeWidth="2"
              />
              <line
                x1="160"
                y1="198"
                x2="160"
                y2="266"
                stroke="#b45309"
                strokeWidth="2"
              />

              <text
                x="140"
                y="238"
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#78350f"
              >
                FUEL CORE
              </text>
            </g>
          ))}

          {/* Top-Mounted Control Rod Clusters */}
          {renderComponentButton("pwr-control-rods", (isSelected) => (
            <g
              className={styles.controlRodsGroup}
              style={{ transform: `translateY(${rodTranslateY}px)` }}
            >
              {/* Control rod drive mechanism housing */}
              <rect
                x="120"
                y="75"
                width="40"
                height="28"
                rx="3"
                fill="#e2e8f0"
                stroke={isSelected ? "#2563eb" : "#334155"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {/* Drive coil detail */}
              <line
                x1="124"
                y1="83"
                x2="156"
                y2="83"
                stroke="#64748b"
                strokeWidth="2"
              />
              <line
                x1="124"
                y1="91"
                x2="156"
                y2="91"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Spider hub */}
              <rect
                x="126"
                y="103"
                width="28"
                height="6"
                rx="2"
                fill="#334155"
              />

              {/* Absorber rod blades penetrating down toward/into core */}
              <line
                x1="130"
                y1="109"
                x2="130"
                y2="185"
                stroke="#0f172a"
                strokeWidth="3"
              />
              <line
                x1="140"
                y1="109"
                x2="140"
                y2="185"
                stroke="#0f172a"
                strokeWidth="3"
              />
              <line
                x1="150"
                y1="109"
                x2="150"
                y2="185"
                stroke="#0f172a"
                strokeWidth="3"
              />

              <text
                x="140"
                y="70"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#334155"
              >
                {powerLevel === 0 ? "SCRAM (INSERTED)" : "CONTROL RODS"}
              </text>
            </g>
          ))}

          {/* Pressurizer */}
          {renderComponentButton("pwr-pressurizer", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Pressurizer vertical vessel with hemispherical heads */}
              <path
                d="M 210 90 C 210 75, 245 75, 245 90 V 165 C 245 180, 210 180, 210 165 Z"
                fill="url(#vesselSteelGrad)"
                stroke={isSelected ? "#2563eb" : "#dc2626"}
                strokeWidth={isSelected ? 3 : 2}
              />
              {/* Water level interface inside pressurizer (~60% water, 40% steam) */}
              <path
                d="M 212 135 H 243 V 165 C 243 176, 212 176, 212 165 Z"
                fill="rgba(239, 68, 68, 0.25)"
              />
              {/* Electric immersion heaters (bottom coils) */}
              <path
                d="M 218 160 L 222 152 L 226 160 L 230 152 L 234 160 L 238 152"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
              {/* Top spray nozzle */}
              <path
                d="M 227 82 V 92 L 223 98 M 227 92 L 231 98"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              <text
                x="228"
                y="125"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#0f172a"
              >
                PRESSURIZER
              </text>
            </g>
          ))}

          {/* Steam Generator (U-Tube Heat Exchanger) */}
          {renderComponentButton("pwr-steam-gen", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Steam generator tall cylindrical shell with wide upper steam dome */}
              <path
                d="M 275 305 V 170 L 265 155 V 125 C 265 110, 345 110, 345 125 V 155 L 335 170 V 305 Z"
                fill="url(#vesselSteelGrad)"
                stroke={isSelected ? "#2563eb" : "#0284c7"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Inverted U-tube bundle inside */}
              <path
                d="M 288 295 V 205 C 288 185, 304 185, 304 205 V 295"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                opacity="0.85"
              />
              <path
                d="M 306 295 V 215 C 306 195, 322 195, 322 215 V 295"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                opacity="0.85"
              />

              {/* Tube Sheet dividing primary and secondary sides */}
              <line
                x1="275"
                y1="280"
                x2="335"
                y2="280"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Steam dryer chevron vanes in upper dome */}
              <path
                d="M 280 145 L 290 140 L 300 145 L 310 140 L 320 145 L 330 140"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
              />

              {/* Animated rising steam bubbles in boiling secondary section */}
              <circle
                cx="295"
                cy="220"
                r="2.5"
                fill="#38bdf8"
                className={styles.steamBubble}
              />
              <circle
                cx="315"
                cy="235"
                r="3"
                fill="#38bdf8"
                className={styles.steamBubbleD2}
              />
              <circle
                cx="302"
                cy="250"
                r="2"
                fill="#38bdf8"
                className={styles.steamBubbleD3}
              />

              <text
                x="305"
                y="162"
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#0369a1"
              >
                STEAM GEN
              </text>
            </g>
          ))}

          {/* Reactor Coolant Pump (RCP) */}
          {renderComponentButton("pwr-coolant-pump", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Centrifugal pump volute casing */}
              <circle
                cx="230"
                cy="285"
                r="22"
                fill="#e2e8f0"
                stroke={isSelected ? "#2563eb" : "#475569"}
                strokeWidth={isSelected ? 3 : 2}
              />
              {/* Heavy top flywheel motor casing */}
              <rect
                x="220"
                y="245"
                width="20"
                height="18"
                rx="2"
                fill="#64748b"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Rotating 4-vane pump impeller */}
              <g
                className={`${styles.pumpImpeller} ${getPumpClass()}`}
                style={{ transformOrigin: "230px 285px" }}
              >
                <path
                  d="M 230 285 C 230 273, 237 270, 240 270"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                <path
                  d="M 230 285 C 242 285, 245 292, 245 295"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                <path
                  d="M 230 285 C 230 297, 223 300, 220 300"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                <path
                  d="M 230 285 C 218 285, 215 278, 215 275"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                />
                <circle cx="230" cy="285" r="4" fill="#0f172a" />
              </g>
              <text
                x="230"
                y="320"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#334155"
              >
                PUMP (RCP)
              </text>
            </g>
          ))}

          {/* Steam Turbine & Synchronous Generator */}
          {renderComponentButton("pwr-turbine", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Multi-stage High/Low Pressure Turbine Casing */}
              <polygon
                points="435,135 485,120 485,180 435,165"
                fill="#e0e7ff"
                stroke={isSelected ? "#2563eb" : "#4f46e5"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Spinning multi-blade turbine rotor */}
              <g
                className={`${styles.turbineRotor} ${getTurbineClass()}`}
                style={{ transformOrigin: "460px 150px" }}
              >
                <circle
                  cx="460"
                  cy="150"
                  r="16"
                  fill="rgba(99, 102, 241, 0.15)"
                />
                <line
                  x1="460"
                  y1="134"
                  x2="460"
                  y2="166"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <line
                  x1="444"
                  y1="150"
                  x2="476"
                  y2="150"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <line
                  x1="448"
                  y1="138"
                  x2="472"
                  y2="162"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <line
                  x1="448"
                  y1="162"
                  x2="472"
                  y2="138"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <circle cx="460" cy="150" r="4" fill="#312e81" />
              </g>

              {/* Shaft coupling to synchronous generator */}
              <rect x="485" y="146" width="12" height="8" fill="#475569" />

              {/* Synchronous Generator Housing */}
              <rect
                x="497"
                y="125"
                width="55"
                height="50"
                rx="5"
                fill="#f1f5f9"
                stroke={isSelected ? "#2563eb" : "#4338ca"}
                strokeWidth={isSelected ? 3 : 2}
              />
              {/* Stator coils detail */}
              <line
                x1="504"
                y1="135"
                x2="545"
                y2="135"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <line
                x1="504"
                y1="165"
                x2="545"
                y2="165"
                stroke="#6366f1"
                strokeWidth="2"
              />

              {/* Electrical Power Grid Lines & Animated Sparks */}
              <path
                d="M 552 145 H 585 V 130"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />
              {powerLevel > 0 && (
                <path
                  d="M 555 145 L 565 141 L 575 149 L 585 130"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  className={styles.generatorSpark}
                />
              )}

              <text
                x="460"
                y="195"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#3730a3"
              >
                STEAM TURBINE
              </text>
              <text
                x="525"
                y="154"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#4338ca"
              >
                GEN
              </text>
            </g>
          ))}

          {/* Surface Condenser (Below Turbine) */}
          {renderComponentButton("pwr-condenser", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Exhaust steam steam-hood from turbine to condenser */}
              <polygon
                points="455,180 480,180 505,235 435,235"
                fill="rgba(199, 210, 254, 0.35)"
                stroke="#818cf8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Condenser shell with internal vacuum */}
              <rect
                x="440"
                y="235"
                width="105"
                height="65"
                rx="6"
                fill="#ccfbf1"
                stroke={isSelected ? "#2563eb" : "#0d9488"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Shell-and-tube internal cooling tube bank */}
              <line
                x1="448"
                y1="250"
                x2="537"
                y2="250"
                stroke="#0d9488"
                strokeWidth="2.5"
              />
              <line
                x1="448"
                y1="262"
                x2="537"
                y2="262"
                stroke="#0d9488"
                strokeWidth="2.5"
              />
              <line
                x1="448"
                y1="274"
                x2="537"
                y2="274"
                stroke="#0d9488"
                strokeWidth="2.5"
              />

              {/* Hotwell liquid condensate level */}
              <rect
                x="442"
                y="285"
                width="101"
                height="13"
                rx="2"
                fill="#38bdf8"
                opacity="0.8"
              />

              <text
                x="492"
                y="245"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#0f766e"
              >
                SURFACE CONDENSER
              </text>
            </g>
          ))}

          {/* Hyperbolic Natural Draft Cooling Tower */}
          {renderComponentButton("pwr-cooling-tower", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Animated Evaporative Clean Water Vapor Plumes */}
              {powerLevel > 0 && (
                <g>
                  <ellipse
                    cx="665"
                    cy="110"
                    rx="22"
                    ry="12"
                    fill="rgba(255, 255, 255, 0.85)"
                    className={styles.vaporPlume}
                  />
                  <ellipse
                    cx="668"
                    cy="105"
                    rx="18"
                    ry="10"
                    fill="rgba(255, 255, 255, 0.75)"
                    className={styles.vaporPlumeDelay}
                  />
                </g>
              )}

              {/* Hyperboloid tower shell geometry */}
              <path
                d="M 628 350 C 648 240, 650 180, 642 125 H 693 C 685 180, 687 240, 707 350 Z"
                fill="#f1f5f9"
                stroke={isSelected ? "#2563eb" : "#059669"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Base air inlet diagonal louvers */}
              <line
                x1="632"
                y1="350"
                x2="636"
                y2="370"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="645"
                y1="350"
                x2="649"
                y2="370"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="660"
                y1="350"
                x2="664"
                y2="370"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="675"
                y1="350"
                x2="679"
                y2="370"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="690"
                y1="350"
                x2="694"
                y2="370"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="703"
                y1="350"
                x2="707"
                y2="370"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Cold water collection basin at ground level */}
              <rect
                x="626"
                y="370"
                width="82"
                height="10"
                rx="2"
                fill="#10b981"
              />

              <text
                x="667"
                y="225"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#065f46"
              >
                COOLING TOWER
              </text>
            </g>
          ))}
        </g>
      </svg>
    );
  };

  // ----------------------------------------------------------------------
  // 2. BWR Schematic Renderer (Direct 1-Loop Cycle, Bottom Rods, Torus)
  // ----------------------------------------------------------------------
  const renderBwrSvg = () => {
    // Bottom-entry rods translate upward in SCRAM
    const bwrRodTranslateY =
      powerLevel === 100 ? 0 : powerLevel === 50 ? -25 : -55;

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 820 420"
        className={styles.diagramSvg}
        role="img"
        aria-label={`Interactive schematic diagram for ${system.name}`}
      >
        <g
          style={{
            ...zoomStyle,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {renderDefs()}

          {/* Civil Enclosures: Drywell & Wetwell (Torus) */}
          <path
            d="M 60 380 V 170 A 145 120 0 0 1 320 170 V 380 Z"
            fill="rgba(148, 163, 184, 0.08)"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <text
            x="190"
            y="68"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#64748b"
            letterSpacing="0.08em"
          >
            PRIMARY CONTAINMENT (DRYWELL)
          </text>

          {/* Torus / Suppression Pool (Wetwell) at Base */}
          <ellipse
            cx="190"
            cy="365"
            rx="110"
            ry="15"
            fill="#bae6fd"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <text
            x="190"
            y="368"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="700"
            fill="#0369a1"
          >
            SUPPRESSION POOL (WETWELL TORUS)
          </text>

          {/* Shielded Turbine Hall Enclosure */}
          <rect
            x="350"
            y="90"
            width="210"
            height="290"
            rx="8"
            fill="rgba(241, 245, 249, 0.4)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x="455"
            y="110"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#94a3b8"
            letterSpacing="0.05em"
          >
            SHIELDED TURBINE BUILDING (N-16 PROTECTION)
          </text>

          {/* Plant Base Foundation */}
          <line
            x1="30"
            y1="380"
            x2="790"
            y2="380"
            stroke="#475569"
            strokeWidth="2.5"
          />

          {/* ---------------------------------------------------------------- */}
          {/* BWR Direct Steam Piping (RPV to Turbine)                         */}
          {/* ---------------------------------------------------------------- */}
          <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
            {/* Main Direct Steam Line */}
            <path
              d="M 190 95 V 75 H 410 V 135"
              className={styles.pipeBase}
              stroke="#0369a1"
              strokeWidth="12"
            />
            <path
              d="M 190 95 V 75 H 410 V 135"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#secSteamGrad)"
              strokeWidth="8"
              markerEnd="url(#arrowSecondary)"
            />

            {/* Feedwater Return Line (Condenser to RPV) */}
            <path
              d="M 420 300 H 260 V 225 H 235"
              className={styles.pipeBase}
              stroke="#1d4ed8"
              strokeWidth="10"
            />
            <path
              d="M 420 300 H 260 V 225 H 235"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#secCondensateGrad)"
              strokeWidth="6"
              markerEnd="url(#arrowSecondary)"
            />
          </g>

          {/* Tertiary Cooling Piping to Heat Sink */}
          <g className={`${styles.pipeGroup} ${getLoopClass("tertiary")}`}>
            <path
              d="M 515 270 H 640"
              className={styles.pipeBase}
              stroke="#047857"
              strokeWidth="8"
            />
            <path
              d="M 515 270 H 640"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#tertiaryCoolGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowTertiary)"
            />
            <path
              d="M 640 305 H 515"
              className={styles.pipeBase}
              stroke="#047857"
              strokeWidth="8"
            />
            <path
              d="M 640 305 H 515"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#tertiaryCoolGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowTertiary)"
            />
          </g>

          {/* ---------------------------------------------------------------- */}
          {/* BWR Components                                                   */}
          {/* ---------------------------------------------------------------- */}
          {/* BWR Reactor Pressure Vessel (RPV) */}
          {renderComponentButton("bwr-vessel", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Tall cylindrical pressure vessel with domed heads */}
              <path
                d="M 135 125 C 135 95, 245 95, 245 125 V 295 C 245 325, 135 325, 135 295 Z"
                fill="url(#vesselSteelGrad)"
                stroke={isSelected ? "#2563eb" : "#475569"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Upper Steam Dryers (Chevron moisture vanes) */}
              <rect
                x="155"
                y="120"
                width="70"
                height="22"
                rx="2"
                fill="#bae6fd"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              <line
                x1="162"
                y1="125"
                x2="168"
                y2="135"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="176"
                y1="125"
                x2="182"
                y2="135"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="190"
                y1="125"
                x2="196"
                y2="135"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="204"
                y1="125"
                x2="210"
                y2="135"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <text
                x="190"
                y="135"
                textAnchor="middle"
                fontSize="7.5"
                fontWeight="800"
                fill="#0369a1"
              >
                STEAM DRYERS
              </text>

              {/* Internal Steam Separators (Cyclone tubes) */}
              <rect
                x="150"
                y="148"
                width="80"
                height="25"
                rx="3"
                fill="#e2e8f0"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <line
                x1="160"
                y1="152"
                x2="160"
                y2="170"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="175"
                y1="152"
                x2="175"
                y2="170"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="190"
                y1="152"
                x2="190"
                y2="170"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="205"
                y1="152"
                x2="205"
                y2="170"
                stroke="#0284c7"
                strokeWidth="2"
              />
              <line
                x1="220"
                y1="152"
                x2="220"
                y2="170"
                stroke="#0284c7"
                strokeWidth="2"
              />

              {/* Feedwater Sparger Ring */}
              <line
                x1="145"
                y1="180"
                x2="235"
                y2="180"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />

              <text
                x="190"
                y="312"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#334155"
              >
                BWR RPV (7.0 MPa)
              </text>
            </g>
          ))}

          {/* BWR Fuel Bundles (Direct Boiling Core) */}
          {renderComponentButton("bwr-fuel", (isSelected) => (
            <g>
              {/* Core Thermal Fission Glow */}
              <ellipse
                cx="190"
                cy="235"
                rx="38"
                ry="45"
                fill="url(#fissionThermalGlow)"
                className={getFissionGlowClass()}
              />

              {/* Core boundary with fuel channel boxes */}
              <rect
                x="155"
                y="190"
                width="70"
                height="80"
                rx="4"
                fill="#fef08a"
                stroke={isSelected ? "#2563eb" : "#ca8a04"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Channel box grid partitions */}
              <line
                x1="172"
                y1="192"
                x2="172"
                y2="268"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />
              <line
                x1="190"
                y1="192"
                x2="190"
                y2="268"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />
              <line
                x1="207"
                y1="192"
                x2="207"
                y2="268"
                stroke="#ca8a04"
                strokeWidth="1.5"
              />

              {/* Direct Boiling Steam Bubbles rising past fuel */}
              <circle
                cx="165"
                cy="245"
                r="2.5"
                fill="#38bdf8"
                className={styles.steamBubble}
              />
              <circle
                cx="180"
                cy="225"
                r="3"
                fill="#38bdf8"
                className={styles.steamBubbleD2}
              />
              <circle
                cx="200"
                cy="240"
                r="2.5"
                fill="#38bdf8"
                className={styles.steamBubbleD3}
              />
              <circle
                cx="190"
                cy="205"
                r="3.5"
                fill="#38bdf8"
                className={styles.steamBubble}
              />

              <text
                x="190"
                y="238"
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#78350f"
              >
                BOILING CORE
              </text>
            </g>
          ))}

          {/* Bottom-Entry Control Rods (Unique to BWR!) */}
          {renderComponentButton("bwr-control-rods", (isSelected) => (
            <g
              className={styles.controlRodsGroup}
              style={{ transform: `translateY(${bwrRodTranslateY}px)` }}
            >
              {/* Hydraulic drive mechanism housings beneath RPV */}
              <rect
                x="165"
                y="325"
                width="50"
                height="30"
                rx="3"
                fill="#e2e8f0"
                stroke={isSelected ? "#2563eb" : "#334155"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {/* Nitrogen accumulator bottles */}
              <line
                x1="175"
                y1="330"
                x2="175"
                y2="350"
                stroke="#0284c7"
                strokeWidth="3"
              />
              <line
                x1="190"
                y1="330"
                x2="190"
                y2="350"
                stroke="#0284c7"
                strokeWidth="3"
              />
              <line
                x1="205"
                y1="330"
                x2="205"
                y2="350"
                stroke="#0284c7"
                strokeWidth="3"
              />

              {/* Cruciform absorber blades pushing UP into core */}
              <line
                x1="175"
                y1="325"
                x2="175"
                y2="265"
                stroke="#0f172a"
                strokeWidth="3"
              />
              <line
                x1="190"
                y1="325"
                x2="190"
                y2="265"
                stroke="#0f172a"
                strokeWidth="3.5"
              />
              <line
                x1="205"
                y1="325"
                x2="205"
                y2="265"
                stroke="#0f172a"
                strokeWidth="3"
              />

              <text
                x="190"
                y="368"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#0f172a"
              >
                {powerLevel === 0
                  ? "SCRAM (BOTTOM INSERTED)"
                  : "BOTTOM CONTROL RODS"}
              </text>
            </g>
          ))}

          {/* Direct Steam Turbine & Synchronous Generator */}
          {renderComponentButton("bwr-turbine", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Multi-stage direct steam turbine casing */}
              <polygon
                points="400,135 450,120 450,180 400,165"
                fill="#e0e7ff"
                stroke={isSelected ? "#2563eb" : "#4f46e5"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Spinning multi-blade turbine rotor */}
              <g
                className={`${styles.turbineRotor} ${getTurbineClass()}`}
                style={{ transformOrigin: "425px 150px" }}
              >
                <circle
                  cx="425"
                  cy="150"
                  r="16"
                  fill="rgba(99, 102, 241, 0.15)"
                />
                <line
                  x1="425"
                  y1="134"
                  x2="425"
                  y2="166"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <line
                  x1="409"
                  y1="150"
                  x2="441"
                  y2="150"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <line
                  x1="413"
                  y1="138"
                  x2="437"
                  y2="162"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <line
                  x1="413"
                  y1="162"
                  x2="437"
                  y2="138"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <circle cx="425" cy="150" r="4" fill="#312e81" />
              </g>

              {/* Coupling shaft */}
              <rect x="450" y="146" width="12" height="8" fill="#475569" />

              {/* Synchronous Generator */}
              <rect
                x="462"
                y="125"
                width="55"
                height="50"
                rx="5"
                fill="#f1f5f9"
                stroke={isSelected ? "#2563eb" : "#4338ca"}
                strokeWidth={isSelected ? 3 : 2}
              />
              <line
                x1="470"
                y1="135"
                x2="510"
                y2="135"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <line
                x1="470"
                y1="165"
                x2="510"
                y2="165"
                stroke="#6366f1"
                strokeWidth="2"
              />

              {/* Electrical Power Grid Lines & Animated Sparks */}
              <path
                d="M 517 145 H 550 V 130"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />
              {powerLevel > 0 && (
                <path
                  d="M 520 145 L 530 141 L 540 149 L 550 130"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  className={styles.generatorSpark}
                />
              )}

              <text
                x="425"
                y="195"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#3730a3"
              >
                DIRECT TURBINE
              </text>
              <text
                x="490"
                y="154"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#4338ca"
              >
                GEN
              </text>
            </g>
          ))}

          {/* Main Condenser & Feedwater Pumps */}
          {renderComponentButton("bwr-condenser", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Turbine exhaust steam hood */}
              <polygon
                points="420,180 445,180 470,240 400,240"
                fill="rgba(199, 210, 254, 0.35)"
                stroke="#818cf8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Deep vacuum condenser shell */}
              <rect
                x="405"
                y="240"
                width="105"
                height="65"
                rx="6"
                fill="#ccfbf1"
                stroke={isSelected ? "#2563eb" : "#0d9488"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Internal cooling tubes */}
              <line
                x1="415"
                y1="255"
                x2="500"
                y2="255"
                stroke="#0d9488"
                strokeWidth="2.5"
              />
              <line
                x1="415"
                y1="267"
                x2="500"
                y2="267"
                stroke="#0d9488"
                strokeWidth="2.5"
              />
              <line
                x1="415"
                y1="279"
                x2="500"
                y2="279"
                stroke="#0d9488"
                strokeWidth="2.5"
              />

              {/* Hotwell condensate */}
              <rect
                x="407"
                y="290"
                width="101"
                height="13"
                rx="2"
                fill="#38bdf8"
                opacity="0.8"
              />

              <text
                x="457"
                y="250"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#0f766e"
              >
                CONDENSER & FEEDWATER
              </text>
            </g>
          ))}

          {/* Cooling Tower / Heat Sink */}
          <g filter="url(#partDropShadow)">
            {powerLevel > 0 && (
              <ellipse
                cx="675"
                cy="110"
                rx="22"
                ry="12"
                fill="rgba(255, 255, 255, 0.85)"
                className={styles.vaporPlume}
              />
            )}
            <path
              d="M 638 350 C 658 240, 660 180, 652 125 H 703 C 695 180, 697 240, 717 350 Z"
              fill="#f1f5f9"
              stroke="#059669"
              strokeWidth="2"
            />
            <text
              x="677"
              y="225"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#065f46"
            >
              COOLING TOWER
            </text>
          </g>
        </g>
      </svg>
    );
  };

  // ----------------------------------------------------------------------
  // 3. PHWR (CANDU) Schematic Renderer (Horizontal Calandria, D2O, Fueling)
  // ----------------------------------------------------------------------
  const renderPhwrSvg = () => {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 820 420"
        className={styles.diagramSvg}
        role="img"
        aria-label={`Interactive schematic diagram for ${system.name}`}
      >
        <g
          style={{
            ...zoomStyle,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {renderDefs()}

          {/* Reactor Vault Concrete Enclosure */}
          <rect
            x="60"
            y="70"
            width="320"
            height="310"
            rx="12"
            fill="rgba(148, 163, 184, 0.08)"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="8 4"
          />
          <text
            x="220"
            y="92"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#64748b"
            letterSpacing="0.08em"
          >
            HEAVY WATER REACTOR VAULT
          </text>

          {/* Turbine Building */}
          <rect
            x="400"
            y="90"
            width="190"
            height="290"
            rx="8"
            fill="rgba(241, 245, 249, 0.4)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x="495"
            y="110"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#94a3b8"
            letterSpacing="0.05em"
          >
            CONVENTIONAL TURBINE HALL
          </text>

          {/* Base Foundation */}
          <line
            x1="30"
            y1="380"
            x2="790"
            y2="380"
            stroke="#475569"
            strokeWidth="2.5"
          />

          {/* ---------------------------------------------------------------- */}
          {/* PHWR Heavy Water Primary Transport Loops (D2O)                   */}
          {/* ---------------------------------------------------------------- */}
          {/* Primary Hot Leg (Calandria Headers to Steam Generator) */}
          <g className={`${styles.pipeGroup} ${getLoopClass("primary")}`}>
            <path
              d="M 230 185 H 265 V 215 H 295"
              className={styles.pipeBase}
              stroke="#b91c1c"
              strokeWidth="12"
            />
            <path
              d="M 230 185 H 265 V 215 H 295"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#pwrHotGrad)"
              strokeWidth="8"
              markerEnd="url(#arrowPrimary)"
            />

            {/* Primary Cold Leg (SG -> PHT Pump -> Calandria) */}
            <path
              d="M 295 285 H 255 V 250 H 230"
              className={styles.pipeBase}
              stroke="#b91c1c"
              strokeWidth="12"
            />
            <path
              d="M 295 285 H 255 V 250 H 230"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#pwrColdGrad)"
              strokeWidth="8"
              markerEnd="url(#arrowPrimary)"
            />
          </g>

          {/* Secondary Light Water Steam (SG to Turbine) */}
          <g className={`${styles.pipeGroup} ${getLoopClass("secondary")}`}>
            <path
              d="M 330 105 V 85 H 450 V 135"
              className={styles.pipeBase}
              stroke="#0369a1"
              strokeWidth="10"
            />
            <path
              d="M 330 105 V 85 H 450 V 135"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#secSteamGrad)"
              strokeWidth="6"
              markerEnd="url(#arrowSecondary)"
            />

            {/* Feedwater Return to SG */}
            <path
              d="M 450 295 H 390 V 240 H 365"
              className={styles.pipeBase}
              stroke="#1d4ed8"
              strokeWidth="9"
            />
            <path
              d="M 450 295 H 390 V 240 H 365"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#secCondensateGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowSecondary)"
            />
          </g>

          {/* Tertiary Condenser Cooling to Tower */}
          <g className={`${styles.pipeGroup} ${getLoopClass("tertiary")}`}>
            <path
              d="M 545 260 H 645"
              className={styles.pipeBase}
              stroke="#047857"
              strokeWidth="8"
            />
            <path
              d="M 545 260 H 645"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#tertiaryCoolGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowTertiary)"
            />
            <path
              d="M 645 295 H 545"
              className={styles.pipeBase}
              stroke="#047857"
              strokeWidth="8"
            />
            <path
              d="M 645 295 H 545"
              className={`${styles.pipeFluid} ${getFlowSpeedClass()}`}
              stroke="url(#tertiaryCoolGrad)"
              strokeWidth="5"
              markerEnd="url(#arrowTertiary)"
            />
          </g>

          {/* ---------------------------------------------------------------- */}
          {/* PHWR Components                                                  */}
          {/* ---------------------------------------------------------------- */}
          {/* Horizontal Calandria Tank */}
          {renderComponentButton("phwr-calandria", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Cylindrical horizontal tank with dished end shields */}
              <rect
                x="100"
                y="140"
                width="155"
                height="160"
                rx="24"
                fill="url(#heavyWaterGrad)"
                stroke={isSelected ? "#2563eb" : "#475569"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Stainless steel end-shield tubesheets */}
              <line
                x1="115"
                y1="145"
                x2="115"
                y2="295"
                stroke="#64748b"
                strokeWidth="2.5"
              />
              <line
                x1="240"
                y1="145"
                x2="240"
                y2="295"
                stroke="#64748b"
                strokeWidth="2.5"
              />

              {/* Horizontal Calandria Lattice Array (Zircaloy Pressure Tubes) */}
              <line
                x1="110"
                y1="170"
                x2="245"
                y2="170"
                stroke="#0891b2"
                strokeWidth="3"
              />
              <line
                x1="110"
                y1="190"
                x2="245"
                y2="190"
                stroke="#0891b2"
                strokeWidth="3"
              />
              <line
                x1="110"
                y1="210"
                x2="245"
                y2="210"
                stroke="#0891b2"
                strokeWidth="3"
              />
              <line
                x1="110"
                y1="230"
                x2="245"
                y2="230"
                stroke="#0891b2"
                strokeWidth="3"
              />
              <line
                x1="110"
                y1="250"
                x2="245"
                y2="250"
                stroke="#0891b2"
                strokeWidth="3"
              />
              <line
                x1="110"
                y1="270"
                x2="245"
                y2="270"
                stroke="#0891b2"
                strokeWidth="3"
              />

              {/* Left & Right Bidirectional Fueling Machines (CANDU Signature) */}
              <rect
                x="75"
                y="195"
                width="22"
                height="50"
                rx="3"
                fill="#64748b"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <rect
                x="258"
                y="195"
                width="22"
                height="50"
                rx="3"
                fill="#64748b"
                stroke="#334155"
                strokeWidth="1.5"
              />

              <text
                x="177"
                y="158"
                textAnchor="middle"
                fontSize="9"
                fontWeight="800"
                fill="#0e7490"
              >
                CALANDRIA (D2O MODERATOR)
              </text>
              <text
                x="177"
                y="288"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#334155"
              >
                HORIZONTAL PRESSURE TUBES
              </text>
            </g>
          ))}

          {/* Natural Uranium Fuel Bundles */}
          {renderComponentButton("phwr-fuel", (isSelected) => (
            <g>
              {/* Core Thermal Fission Glow */}
              <ellipse
                cx="177"
                cy="220"
                rx="45"
                ry="30"
                fill="url(#fissionThermalGlow)"
                className={getFissionGlowClass()}
              />

              {/* Fuel bundle container highlight */}
              <rect
                x="130"
                y="200"
                width="95"
                height="40"
                rx="4"
                fill="#fef08a"
                stroke={isSelected ? "#2563eb" : "#ca8a04"}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Segmented 0.5m natural uranium fuel bundle cylinders */}
              <line
                x1="145"
                y1="202"
                x2="145"
                y2="238"
                stroke="#ca8a04"
                strokeWidth="2"
              />
              <line
                x1="165"
                y1="202"
                x2="165"
                y2="238"
                stroke="#ca8a04"
                strokeWidth="2"
              />
              <line
                x1="185"
                y1="202"
                x2="185"
                y2="238"
                stroke="#ca8a04"
                strokeWidth="2"
              />
              <line
                x1="205"
                y1="202"
                x2="205"
                y2="238"
                stroke="#ca8a04"
                strokeWidth="2"
              />

              <text
                x="177"
                y="224"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#78350f"
              >
                NATURAL U FUEL
              </text>
            </g>
          ))}

          {/* Steam Generators (PHWR) */}
          {renderComponentButton("phwr-steam-gen", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Vertical Steam Generator shell */}
              <path
                d="M 295 305 V 165 L 285 150 V 120 C 285 105, 365 105, 365 120 V 150 L 355 165 V 305 Z"
                fill="url(#vesselSteelGrad)"
                stroke={isSelected ? "#2563eb" : "#0284c7"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Inverted U-tube bundle */}
              <path
                d="M 308 295 V 200 C 308 180, 324 180, 324 200 V 295"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                opacity="0.85"
              />
              <path
                d="M 326 295 V 210 C 326 190, 342 190, 342 210 V 295"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                opacity="0.85"
              />

              {/* Boiling steam bubbles */}
              <circle
                cx="315"
                cy="215"
                r="2.5"
                fill="#38bdf8"
                className={styles.steamBubble}
              />
              <circle
                cx="335"
                cy="230"
                r="3"
                fill="#38bdf8"
                className={styles.steamBubbleD2}
              />

              <text
                x="325"
                y="155"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#0369a1"
              >
                STEAM GEN (PHWR)
              </text>
            </g>
          ))}

          {/* Light Water Steam Turbine & Synchronous Generator */}
          {renderComponentButton("phwr-turbine", (isSelected) => (
            <g filter="url(#partDropShadow)">
              {/* Turbine casing */}
              <polygon
                points="435,135 485,120 485,180 435,165"
                fill="#e0e7ff"
                stroke={isSelected ? "#2563eb" : "#4f46e5"}
                strokeWidth={isSelected ? 3 : 2}
              />

              {/* Spinning rotor */}
              <g
                className={`${styles.turbineRotor} ${getTurbineClass()}`}
                style={{ transformOrigin: "460px 150px" }}
              >
                <circle
                  cx="460"
                  cy="150"
                  r="16"
                  fill="rgba(99, 102, 241, 0.15)"
                />
                <line
                  x1="460"
                  y1="134"
                  x2="460"
                  y2="166"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <line
                  x1="444"
                  y1="150"
                  x2="476"
                  y2="150"
                  stroke="#4f46e5"
                  strokeWidth="2.5"
                />
                <line
                  x1="448"
                  y1="138"
                  x2="472"
                  y2="162"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <line
                  x1="448"
                  y1="162"
                  x2="472"
                  y2="138"
                  stroke="#4f46e5"
                  strokeWidth="2"
                />
                <circle cx="460" cy="150" r="4" fill="#312e81" />
              </g>

              {/* Shaft to Generator */}
              <rect x="485" y="146" width="12" height="8" fill="#475569" />

              {/* Synchronous Generator */}
              <rect
                x="497"
                y="125"
                width="55"
                height="50"
                rx="5"
                fill="#f1f5f9"
                stroke={isSelected ? "#2563eb" : "#4338ca"}
                strokeWidth={isSelected ? 3 : 2}
              />
              <line
                x1="504"
                y1="135"
                x2="545"
                y2="135"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <line
                x1="504"
                y1="165"
                x2="545"
                y2="165"
                stroke="#6366f1"
                strokeWidth="2"
              />

              {/* Grid Power Sparks */}
              <path
                d="M 552 145 H 585 V 130"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />
              {powerLevel > 0 && (
                <path
                  d="M 555 145 L 565 141 L 575 149 L 585 130"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  className={styles.generatorSpark}
                />
              )}

              <text
                x="460"
                y="195"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="700"
                fill="#3730a3"
              >
                LIGHT WATER TURBINE
              </text>
              <text
                x="525"
                y="154"
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill="#4338ca"
              >
                GEN
              </text>
            </g>
          ))}

          {/* Condenser & Cooling Tower */}
          <g filter="url(#partDropShadow)">
            <polygon
              points="455,180 480,180 505,235 435,235"
              fill="rgba(199, 210, 254, 0.35)"
              stroke="#818cf8"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <rect
              x="440"
              y="235"
              width="105"
              height="65"
              rx="6"
              fill="#ccfbf1"
              stroke="#0d9488"
              strokeWidth="2"
            />
            <text
              x="492"
              y="250"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#0f766e"
            >
              CONDENSER
            </text>
          </g>

          {/* Cooling Tower */}
          <g filter="url(#partDropShadow)">
            {powerLevel > 0 && (
              <ellipse
                cx="675"
                cy="110"
                rx="22"
                ry="12"
                fill="rgba(255, 255, 255, 0.85)"
                className={styles.vaporPlume}
              />
            )}
            <path
              d="M 638 350 C 658 240, 660 180, 652 125 H 703 C 695 180, 697 240, 717 350 Z"
              fill="#f1f5f9"
              stroke="#059669"
              strokeWidth="2"
            />
            <text
              x="677"
              y="225"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="800"
              fill="#065f46"
            >
              COOLING TOWER
            </text>
          </g>
        </g>
      </svg>
    );
  };

  // ----------------------------------------------------------------------
  // 4. SMR Schematic Renderer (Integral PWR in Submerged Containment)
  // ----------------------------------------------------------------------
  const renderSmrSvg = () => {
    const rodTranslateY = powerLevel === 100 ? 0 : powerLevel === 50 ? 20 : 45;

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 820 420"
        className={styles.diagramSvg}
        role="img"
        aria-label={`Interactive schematic diagram for ${system.name}`}
      >
        <g
          style={{
            ...zoomStyle,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {renderDefs()}

          {/* SMR Underground Pool & Module Cavity */}
          {renderComponentButton("smr-cooling-pool", (isSelected) => (
            <g>
              <rect
                x="40"
                y="50"
                width="360"
                height="340"
                rx="12"
                fill="rgba(6, 182, 212, 0.12)"
                stroke="#0891b2"
                strokeWidth={isSelected ? 3 : 1.5}
                strokeDasharray="6 4"
              />
              <text
                x="220"
                y="38"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#0891b2"
                letterSpacing="0.08em"
              >
                PASSIVE REACTOR BUILDING POOL (ULTIMATE HEAT SINK)
              </text>
            </g>
          ))}

          {/* Submerged Containment Vessel */}
          {renderComponentButton("smr-containment", (isSelected) => (
            <g>
              <rect
                x="110"
                y="75"
                width="220"
                height="300"
                rx="30"
                fill="rgba(15, 23, 42, 0.85)"
                stroke="#38bdf8"
                strokeWidth={isSelected ? 3.5 : 2}
              />
              <text
                x="220"
                y="96"
                textAnchor="middle"
                fontSize="10"
                fontWeight="600"
                fill="#38bdf8"
              >
                SUBMERGED STEEL CONTAINMENT
              </text>
            </g>
          ))}

          {/* Integral Reactor Pressure Vessel */}
          {renderComponentButton("smr-vessel", (isSelected) => (
            <g>
              <rect
                x="150"
                y="115"
                width="140"
                height="240"
                rx="20"
                fill="url(#vesselSteelGrad)"
                stroke="#475569"
                strokeWidth={isSelected ? 3.5 : 2}
              />
              <text
                x="220"
                y="135"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#1e293b"
              >
                INTEGRAL RPV
              </text>
            </g>
          ))}

          {/* SMR Core & Fuel */}
          {renderComponentButton("smr-fuel", (isSelected) => (
            <g>
              <rect
                x="170"
                y="270"
                width="100"
                height="65"
                rx="6"
                fill="url(#fissionThermalGlow)"
                stroke="#ea580c"
                strokeWidth={isSelected ? 3 : 1.5}
                className={getFissionGlowClass()}
              />
              <text
                x="220"
                y="308"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#ffffff"
              >
                SMR CORE
              </text>
            </g>
          ))}

          {/* Control Rod Clusters */}
          {renderComponentButton("smr-control-rods", (isSelected) => (
            <g transform={`translate(0, ${rodTranslateY})`}>
              <rect
                x="185"
                y="225"
                width="70"
                height="20"
                rx="3"
                fill="#64748b"
                stroke="#334155"
                strokeWidth={isSelected ? 2.5 : 1}
              />
              <line
                x1="195"
                y1="245"
                x2="195"
                y2="270"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="220"
                y1="245"
                x2="220"
                y2="270"
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1="245"
                y1="245"
                x2="245"
                y2="270"
                stroke="#475569"
                strokeWidth="2"
              />
              <text
                x="220"
                y="238"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#f8fafc"
              >
                CONTROL RODS
              </text>
            </g>
          ))}

          {/* Helical-Coil Steam Generator */}
          {renderComponentButton("smr-sg", (isSelected) => (
            <g>
              <rect
                x="165"
                y="150"
                width="110"
                height="65"
                rx="6"
                fill="rgba(56, 189, 248, 0.15)"
                stroke="#0284c7"
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <path
                d="M 175 160 Q 220 170 265 160 M 175 175 Q 220 185 265 175 M 175 190 Q 220 200 265 190 M 175 205 Q 220 215 265 205"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text
                x="220"
                y="185"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#0369a1"
              >
                HELICAL-COIL SG
              </text>
            </g>
          ))}

          {/* Modular Steam Turbine & Generator */}
          {renderComponentButton("smr-turbine", (isSelected) => (
            <g>
              <path
                d="M 500 150 L 590 120 L 590 220 L 500 190 Z"
                fill="#334155"
                stroke="#0284c7"
                strokeWidth={isSelected ? 3 : 1.5}
                className={getTurbineClass()}
              />
              <rect
                x="610"
                y="140"
                width="60"
                height="60"
                rx="6"
                fill="#1e293b"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <text
                x="640"
                y="175"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#34d399"
              >
                GEN
              </text>
              <text
                x="545"
                y="173"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#ffffff"
              >
                TURBINE
              </text>
            </g>
          ))}

          {/* Secondary Steam Loop Pipe */}
          <path
            d="M 275 165 H 480 V 170 H 500"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            className={`${getLoopClass("secondary")} ${getFlowSpeedClass()}`}
          />
        </g>
      </svg>
    );
  };

  // ----------------------------------------------------------------------
  // 5. HTGR Schematic Renderer (TRISO, Solid Graphite, Helium Circuit)
  // ----------------------------------------------------------------------
  const renderHtgrSvg = () => {
    const rodTranslateY = powerLevel === 100 ? 0 : powerLevel === 50 ? 20 : 45;

    return (
      <svg
        ref={svgRef}
        viewBox="0 0 820 420"
        className={styles.diagramSvg}
        role="img"
        aria-label={`Interactive schematic diagram for ${system.name}`}
      >
        <g
          style={{
            ...zoomStyle,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {renderDefs()}

          {/* Reactor Pressure Vessel */}
          {renderComponentButton("htgr-vessel", (isSelected) => (
            <g>
              <rect
                x="80"
                y="70"
                width="200"
                height="300"
                rx="24"
                fill="url(#vesselDarkSteelGrad)"
                stroke="#94a3b8"
                strokeWidth={isSelected ? 3.5 : 2}
              />
              <text
                x="180"
                y="95"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#e2e8f0"
              >
                HTGR PRESSURE VESSEL (7 MPa He)
              </text>
            </g>
          ))}

          {/* Solid Graphite Moderator Core */}
          {renderComponentButton("htgr-core", (isSelected) => (
            <g>
              <rect
                x="105"
                y="115"
                width="150"
                height="230"
                rx="10"
                fill="rgba(51, 65, 85, 0.9)"
                stroke="#64748b"
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x="180"
                y="135"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#94a3b8"
              >
                SOLID GRAPHITE CORE
              </text>
            </g>
          ))}

          {/* TRISO Pebble Fuel Core */}
          {renderComponentButton("htgr-fuel", (isSelected) => (
            <g>
              <rect
                x="125"
                y="170"
                width="110"
                height="150"
                rx="8"
                fill="url(#fissionThermalGlow)"
                stroke="#ea580c"
                strokeWidth={isSelected ? 3 : 1.5}
                className={getFissionGlowClass()}
              />
              <text
                x="180"
                y="245"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#ffffff"
              >
                TRISO FUEL (750°C)
              </text>
            </g>
          ))}

          {/* Reflector Control & Shutdown Rods */}
          {renderComponentButton("htgr-control-rods", (isSelected) => (
            <g transform={`translate(0, ${rodTranslateY})`}>
              <rect
                x="110"
                y="140"
                width="14"
                height="80"
                rx="2"
                fill="#f59e0b"
                stroke="#b45309"
                strokeWidth={isSelected ? 2.5 : 1}
              />
              <rect
                x="236"
                y="140"
                width="14"
                height="80"
                rx="2"
                fill="#f59e0b"
                stroke="#b45309"
                strokeWidth={isSelected ? 2.5 : 1}
              />
              <text
                x="180"
                y="155"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#fde68a"
              >
                REFLECTOR RODS
              </text>
            </g>
          ))}

          {/* Cross-Duct Primary Connection */}
          <path
            d="M 280 200 H 380 V 220 H 280 Z"
            fill="#334155"
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* Steam Generator Vessel */}
          {renderComponentButton("htgr-steam-gen", (isSelected) => (
            <g>
              <rect
                x="380"
                y="90"
                width="130"
                height="260"
                rx="18"
                fill="url(#vesselSteelGrad)"
                stroke="#0284c7"
                strokeWidth={isSelected ? 3.5 : 2}
              />
              <text
                x="445"
                y="115"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#0369a1"
              >
                STEAM GENERATOR (560°C)
              </text>
            </g>
          ))}

          {/* Helium Gas Circulator */}
          {renderComponentButton("htgr-circulator", (isSelected) => (
            <g>
              <circle
                cx="445"
                cy="310"
                r="25"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth={isSelected ? 3 : 1.5}
                className={getPumpClass()}
              />
              <text
                x="445"
                y="314"
                textAnchor="middle"
                fontSize="8"
                fontWeight="700"
                fill="#38bdf8"
              >
                CIRC
              </text>
            </g>
          ))}

          {/* High-Efficiency Steam Turbine */}
          {renderComponentButton("htgr-turbine", (isSelected) => (
            <g>
              <path
                d="M 580 150 L 670 120 L 670 220 L 580 190 Z"
                fill="#334155"
                stroke="#0284c7"
                strokeWidth={isSelected ? 3 : 1.5}
                className={getTurbineClass()}
              />
              <text
                x="625"
                y="173"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#ffffff"
              >
                TURBINE (44% η)
              </text>
            </g>
          ))}

          {/* Primary Helium Flow Loop */}
          <path
            d="M 235 220 H 380 M 380 290 H 280"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            className={`${getLoopClass("primary")} ${getFlowSpeedClass()}`}
          />

          {/* Secondary Superheated Steam Pipe */}
          <path
            d="M 510 160 H 580"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            className={`${getLoopClass("secondary")} ${getFlowSpeedClass()}`}
          />
        </g>
      </svg>
    );
  };

  // ----------------------------------------------------------------------
  // 6. Generic Architecture Fallback Renderer
  // ----------------------------------------------------------------------
  const renderGenericSvg = () => {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 820 420"
        className={styles.diagramSvg}
        role="img"
        aria-label={`Interactive schematic diagram for ${system.name}`}
      >
        <g
          style={{
            ...zoomStyle,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {renderDefs()}

          <rect
            x="40"
            y="40"
            width="740"
            height="340"
            rx="16"
            fill="rgba(15, 23, 42, 0.6)"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <text
            x="410"
            y="70"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#64748b"
            letterSpacing="0.06em"
          >
            {system.name.toUpperCase()} SCHEMATIC
          </text>

          {system.components.map((comp) => {
            const coords = comp.diagramCoords ?? {
              x: 100,
              y: 150,
              width: 100,
              height: 80,
            };
            return renderComponentButton(comp.id, (isSelected) => (
              <g key={comp.id} data-part-id={comp.id}>
                <rect
                  x={coords.x}
                  y={coords.y}
                  width={coords.width}
                  height={coords.height}
                  rx="8"
                  fill={
                    comp.type === "fuel"
                      ? "url(#fissionThermalGlow)"
                      : comp.type === "vessel"
                        ? "url(#vesselSteelGrad)"
                        : "rgba(30, 41, 59, 0.85)"
                  }
                  stroke={isSelected ? "#38bdf8" : "#64748b"}
                  strokeWidth={isSelected ? 3 : 1.5}
                />
                <text
                  x={coords.x + coords.width / 2}
                  y={coords.y + coords.height / 2 + 4}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={comp.type === "vessel" ? "#0f172a" : "#f8fafc"}
                >
                  {comp.name.length > 20
                    ? comp.name.substring(0, 18) + "…"
                    : comp.name}
                </text>
              </g>
            ));
          })}
        </g>
      </svg>
    );
  };

  // Helper to wrap any schematic part in interactive button attributes
  const renderComponentButton = (
    compId: string,
    children: (isSelected: boolean) => React.ReactNode,
  ) => {
    const comp = system.components.find((c) => c.id === compId);
    if (!comp) return null;

    const isSelected = selectedPartId === comp.id;

    return (
      <g
        key={comp.id}
        className={`${styles.svgPartButton} ${isSelected ? styles.svgPartSelected : ""}`}
        onClick={() => handleSelectPart(comp.id)}
        onMouseEnter={() => setHoveredPartId(comp.id)}
        onMouseLeave={() => setHoveredPartId(null)}
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
        {children(isSelected)}
      </g>
    );
  };

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
                  onClick={() => setViewMode("3d")}
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

          {/* Visual Presentation Area (3D WebGL Digital Model & 2D Technical Diagram) */}
          <div className={styles.svgWrapper}>
            {viewMode === "3d" ? (
              <>
                <Reactor3DCanvas
                  system={system}
                  selectedId={selectedPartId}
                  onSelectPart={handleSelectPart}
                  powerLevel={powerLevel}
                  activeLoopFilter={activeLoopFilter}
                />
                {/* 2D Accessible SVG preserved in DOM for screen-readers & test assertions */}
                <div className={canvasStyles.paneHiddenAccessible}>
                  {renderSchematicSvg()}
                </div>
              </>
            ) : (
              renderSchematicSvg()
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
