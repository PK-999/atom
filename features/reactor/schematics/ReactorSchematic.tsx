"use client";
import { useEffect, useState } from "react";
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
