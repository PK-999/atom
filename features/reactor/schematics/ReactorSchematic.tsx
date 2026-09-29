"use client";
import { useEffect, useId, useState } from "react";
import type React from "react";
import type { ReactorSystem } from "@/lib/reactor/schemas";
import { useMotionPreferences } from "@/lib/accessibility/motion";
import styles from "../ReactorExplorer.module.css";
import { PwrSchematic } from "./PwrSchematic";
import { BwrSchematic } from "./BwrSchematic";
import { PhwrSchematic } from "./PhwrSchematic";
import { SmrSchematic } from "./SmrSchematic";
import { HtgrSchematic } from "./HtgrSchematic";
import { GenericSchematic } from "./GenericSchematic";
export function ReactorSchematic({
  system,
  powerLevel,
  selectedPartId,
  activeLoopFilter,
  handleSelectPart,
  setHoveredPartId,
  playing,
}: {
  system: ReactorSystem;
  powerLevel: 100 | 50 | 0;
  selectedPartId: string | null;
  activeLoopFilter: "all" | "primary" | "secondary" | "tertiary";
  handleSelectPart: (id: string | null) => void;
  setHoveredPartId: (id: string | null) => void;
  playing: boolean;
}) {
  const svgId = useId();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(true);
  const { shouldAnimate } = useMotionPreferences();
  useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
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

  // Common SVG Definitions (Gradients, Markers, Filters)
  const renderDefs = () => (
    <defs>
      {/* Primary Coolant Gradient */}
      <linearGradient
        id={`${svgId}-pwrHotGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#e9ba85" />
        <stop offset="100%" stopColor="#bb8158" />
      </linearGradient>
      <linearGradient
        id={`${svgId}-pwrColdGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#d9baa1" />
        <stop offset="100%" stopColor="#ba9577" />
      </linearGradient>

      {/* Secondary Steam / Water Gradient */}
      <linearGradient
        id={`${svgId}-secSteamGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#a1d3e1" />
        <stop offset="100%" stopColor="#649db6" />
      </linearGradient>
      <linearGradient
        id={`${svgId}-secCondensateGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>

      {/* Tertiary Cooling Water Gradient */}
      <linearGradient
        id={`${svgId}-tertiaryCoolGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#a4cebb" />
        <stop offset="100%" stopColor="#6a9e8b" />
      </linearGradient>

      {/* Vessel Metal Gradients */}
      <linearGradient id={`${svgId}-fuelMetalGrad`}>
        <stop stopColor="#957953" />
        <stop offset=".4" stopColor="#ead2a4" />
        <stop offset="1" stopColor="#a38961" />
      </linearGradient>
      <linearGradient
        id={`${svgId}-vesselSteelGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="0%"
      >
        <stop offset="0%" stopColor="#8294a1" />
        <stop offset="18%" stopColor="#c1cdd2" />
        <stop offset="38%" stopColor="#edf0ed" />
        <stop offset="65%" stopColor="#b4c3ca" />
        <stop offset="100%" stopColor="#78909c" />
      </linearGradient>
      <linearGradient
        id={`${svgId}-vesselDarkSteelGrad`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>

      {/* Fission Thermal Core Radial Glow */}
      <radialGradient
        id={`${svgId}-fissionThermalGlow`}
        cx="50%"
        cy="50%"
        r="50%"
      >
        <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
        <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.8" />
        <stop offset="85%" stopColor="#ea580c" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
      </radialGradient>

      {/* Cherenkov Blue Radiation Radial Glow */}
      <radialGradient id={`${svgId}-cherenkovGlow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
      </radialGradient>

      {/* Heavy Water (D2O) Moderator Tint */}
      <linearGradient
        id={`${svgId}-heavyWaterGrad`}
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#cffafe" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.85" />
      </linearGradient>

      {/* Directional Flow Arrow Markers */}
      <marker
        id={`${svgId}-arrowPrimary`}
        viewBox="0 0 10 10"
        refX="6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#d9ac7d" />
      </marker>
      <marker
        id={`${svgId}-arrowSecondary`}
        viewBox="0 0 10 10"
        refX="6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#8cbcd0" />
      </marker>
      <marker
        id={`${svgId}-arrowTertiary`}
        viewBox="0 0 10 10"
        refX="6"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#8ebfa7" />
      </marker>

      {/* Drop Shadows */}
      <filter
        id={`${svgId}-partDropShadow`}
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
      >
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
  );

  // ----------------------------------------------------------------------
  // 1. PWR Schematic Renderer (Indirect 2-Loop Cycle + Cooling Tower)
  // ----------------------------------------------------------------------
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

  const parts = {
    svgId,
    system,
    powerLevel,
    renderDefs,
    renderComponentButton,
    getLoopClass,
    getFlowSpeedClass,
    getTurbineClass,
    getPumpClass,
    getFissionGlowClass,
  };
  const Scene =
    (
      {
        pwr: PwrSchematic,
        bwr: BwrSchematic,
        phwr: PhwrSchematic,
        smr: SmrSchematic,
        htgr: HtgrSchematic,
      } as Record<string, typeof PwrSchematic>
    )[system.id] ?? GenericSchematic;
  return (
    <div
      ref={setElement}
      className={
        playing && visible && shouldAnimate ? undefined : styles.motionPaused
      }
    >
      <Scene {...parts} />
    </div>
  );
}
