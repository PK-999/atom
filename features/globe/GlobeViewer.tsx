"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Facility, FacilityStatus } from "../../lib/globe/schemas";
import { filterFacilities } from "../../lib/globe/facility-model";
import worldLand from "@/data/reactors/world-land-110m.json";
import { Globe3DCanvas } from "./Globe3DCanvas";
import styles from "./GlobeViewer.module.css";

const FOCUS_ZOOM_LEVEL = 3.2;
const MAX_ZOOM_LEVEL = 6.0;
const MIN_ZOOM_LEVEL = 0.8;

export interface GlobeViewerProps {
  facilities: readonly Facility[];
  initialFacilityId?: string;
}

export function GlobeViewer({
  facilities,
  initialFacilityId,
}: GlobeViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialFacilityId ??
      (facilities.some((f) => f.id === "kudankulam")
        ? "kudankulam"
        : (facilities[0]?.id ?? null)),
  );
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Geospatial View State
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 2D Pan State
  const [isDragging2D, setIsDragging2D] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svg2DRef = useRef<SVGSVGElement | null>(null);

  const filteredFacilities = useMemo(() => {
    const year = yearFilter === "all" ? undefined : parseInt(yearFilter, 10);
    return filterFacilities(facilities, {
      country: countryFilter,
      status: statusFilter,
      year,
      searchQuery,
    });
  }, [facilities, countryFilter, statusFilter, yearFilter, searchQuery]);

  // If currently selected facility is filtered out, fall back safely
  const activeSelectedId = useMemo(() => {
    if (selectedId && filteredFacilities.some((f) => f.id === selectedId)) {
      return selectedId;
    }
    return filteredFacilities[0]?.id ?? null;
  }, [selectedId, filteredFacilities]);

  const selectedFacility = useMemo(() => {
    return facilities.find((f) => f.id === activeSelectedId) ?? null;
  }, [facilities, activeSelectedId]);

  const statusClass = (status: string) => {
    switch (status) {
      case "operating":
        return styles.statusOperating;
      case "under-construction":
        return styles.statusConstruction;
      case "shutdown":
      case "decommissioned":
        return styles.statusShutdown;
      case "mixed":
        return styles.statusMixed;
      default:
        return "";
    }
  };

  // Convert lat/long to equirectangular SVG coords: 800 x 400
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 800;
    const y = ((90 - lat) / 180) * 400;
    return { x, y };
  };

  // De-conflict overlapping pins and calculate scale-invariant positions
  const deconflictedPins = useMemo(() => {
    // Minimum separation in SVG units between pin centers to avoid overlap
    const minDist = 11 / Math.sqrt(zoomLevel);
    const pins = filteredFacilities.map((fac) => {
      const raw = projectCoords(
        fac.coordinates.latitude,
        fac.coordinates.longitude,
      );
      return {
        ...fac,
        x: raw.x,
        y: raw.y,
      };
    });

    // Iterative repulsive relaxation so close neighbors never collide
    for (let iter = 0; iter < 5; iter++) {
      for (let i = 0; i < pins.length; i++) {
        for (let j = i + 1; j < pins.length; j++) {
          const dx = pins[j].x - pins[i].x;
          const dy = pins[j].y - pins[i].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const overlap = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            pins[i].x -= nx * overlap * 0.5;
            pins[i].y -= ny * overlap * 0.5;
            pins[j].x += nx * overlap * 0.5;
            pins[j].y += ny * overlap * 0.5;
          }
        }
      }
    }

    return pins;
  }, [filteredFacilities, zoomLevel]);

  // Coordinates for conical projection beam origin
  const selectedCoords = useMemo(() => {
    if (!selectedFacility) return { x: 50, y: 50 };
    if (viewMode === "2d") {
      const found = deconflictedPins.find((p) => p.id === selectedFacility.id);
      const pinX = found
        ? found.x
        : projectCoords(
            selectedFacility.coordinates.latitude,
            selectedFacility.coordinates.longitude,
          ).x;
      const pinY = found
        ? found.y
        : projectCoords(
            selectedFacility.coordinates.latitude,
            selectedFacility.coordinates.longitude,
          ).y;
      const vbW = 800 / zoomLevel;
      const vbH = 400 / zoomLevel;
      const vbX = (800 - vbW) / 2 - panOffset.x;
      const vbY = (400 - vbH) / 2 - panOffset.y;
      const normX = Math.max(5, Math.min(95, ((pinX - vbX) / vbW) * 100));
      const normY = Math.max(5, Math.min(95, ((pinY - vbY) / vbH) * 100));
      return { x: Number(normX.toFixed(1)), y: Number(normY.toFixed(1)) };
    }
    // In 3D, the globe centers the selected facility at the focal center
    return { x: 50, y: 50 };
  }, [selectedFacility, viewMode, zoomLevel, panOffset, deconflictedPins]);

  // Selection Handlers — both 2D and 3D reach identical FOCUS_ZOOM_LEVEL
  const handleSelectFacility2D = (facId: string) => {
    setSelectedId(facId);
    const fac = facilities.find((f) => f.id === facId);
    if (fac) {
      const { x, y } = projectCoords(
        fac.coordinates.latitude,
        fac.coordinates.longitude,
      );
      // Center SVG view on coordinates: 400 - x and 200 - y
      setPanOffset({ x: 400 - x, y: 200 - y });
      setZoomLevel((prev) => Math.max(prev, FOCUS_ZOOM_LEVEL));
    }
  };

  const handleSelectFacility3D = (facId: string) => {
    setSelectedId(facId);
    setIsAutoRotate(false);
    setZoomLevel((prev) => Math.max(prev, FOCUS_ZOOM_LEVEL));
  };

  const handleSelectTableRow = (facId: string) => {
    setSelectedId(facId);
    const fac = facilities.find((f) => f.id === facId);
    if (fac) {
      const { x, y } = projectCoords(
        fac.coordinates.latitude,
        fac.coordinates.longitude,
      );
      setPanOffset({ x: 400 - x, y: 200 - y });
      setIsAutoRotate(false);
      setZoomLevel((prev) => Math.max(prev, FOCUS_ZOOM_LEVEL));
    }
  };

  const handleScrollToInspector = () => {
    document
      .getElementById("facility-inspector")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Zoom Controls with deep zoom up to 6.0x
  const handleZoomIn = () => {
    setZoomLevel((prev) =>
      Math.min(Number((prev + 0.35).toFixed(2)), MAX_ZOOM_LEVEL),
    );
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) =>
      Math.max(Number((prev - 0.35).toFixed(2)), MIN_ZOOM_LEVEL),
    );
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  // 2D Pan & Wheel Zoom
  const handlePointerDown2D = (e: React.PointerEvent<SVGSVGElement>) => {
    if (zoomLevel <= 1.0) return;
    setIsDragging2D(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
  };

  const handlePointerMove2D = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging2D) return;
    const dx = (e.clientX - dragStartRef.current.x) / zoomLevel;
    const dy = (e.clientY - dragStartRef.current.y) / zoomLevel;
    setPanOffset({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp2D = () => {
    setIsDragging2D(false);
  };

  // Non-passive wheel event listener on 2D map SVG to prevent browser page scroll
  useEffect(() => {
    const svg = svg2DRef.current;
    if (!svg) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const sensitivity = e.ctrlKey ? 0.008 : 0.0018;
      const zoomMultiplier = 1 - e.deltaY * sensitivity;

      setZoomLevel((prev) => {
        const next = prev * zoomMultiplier;
        const clamped = Math.max(
          MIN_ZOOM_LEVEL,
          Math.min(MAX_ZOOM_LEVEL, next),
        );
        return Number(clamped.toFixed(2));
      });
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Dynamic ViewBox for 2D Panning & Zooming
  const baseW = 800;
  const baseH = 400;
  const vbW = baseW / zoomLevel;
  const vbH = baseH / zoomLevel;
  const vbX = (baseW - vbW) / 2 - panOffset.x;
  const vbY = (baseH - vbH) / 2 - panOffset.y;
  const dynamicViewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

  const filtersSection = (
    <section className={styles.filterPanel} aria-label="Facility Filters">
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label htmlFor="filter-search" className={styles.filterLabel}>
            Search Name or Type
          </label>
          <input
            id="filter-search"
            type="text"
            placeholder="e.g. Kudankulam, VVER, Olkiluoto, AP1000..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="filter-country" className={styles.filterLabel}>
            Country
          </label>
          <select
            id="filter-country"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">
              All Countries ({facilities.length} sites)
            </option>
            <option value="IN">India (IN)</option>
            <option value="US">United States (US)</option>
            <option value="FR">France (FR)</option>
            <option value="CN">China (CN)</option>
            <option value="JP">Japan (JP)</option>
            <option value="KR">South Korea (KR)</option>
            <option value="CA">Canada (CA)</option>
            <option value="GB">United Kingdom (GB)</option>
            <option value="RU">Russia (RU)</option>
            <option value="UA">Ukraine (UA)</option>
            <option value="FI">Finland (FI)</option>
            <option value="AE">United Arab Emirates (AE)</option>
            {Array.from(new Set(facilities.map((f) => f.countryCode)))
              .filter(
                (c) =>
                  ![
                    "IN",
                    "US",
                    "FR",
                    "CN",
                    "JP",
                    "KR",
                    "CA",
                    "GB",
                    "RU",
                    "UA",
                    "FI",
                    "AE",
                  ].includes(c),
              )
              .sort()
              .map((code) => {
                const fac = facilities.find((f) => f.countryCode === code);
                return (
                  <option key={code} value={code}>
                    {fac?.countryName ?? code} ({code})
                  </option>
                );
              })}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="filter-status" className={styles.filterLabel}>
            Operational Status
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as FacilityStatus | "all")
            }
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="operating">Operating Only</option>
            <option value="under-construction">Under Construction Only</option>
            <option value="mixed">Mixed Status (Multi-Unit)</option>
            <option value="shutdown">Shutdown / Decommissioned</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="filter-year" className={styles.filterLabel}>
            Operating Year
          </label>
          <select
            id="filter-year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Years (Historical + Current)</option>
            <option value="1970">1970</option>
            <option value="1980">1980</option>
            <option value="1990">1990</option>
            <option value="2000">2000</option>
            <option value="2010">2010</option>
            <option value="2020">2020</option>
            <option value="2025">2025 (Current Fleet)</option>
          </select>
        </div>
      </div>
    </section>
  );

  return (
    <article className={styles.container} aria-labelledby="globe-viewer-title">
      <header className={styles.header}>
        <h1 id="globe-viewer-title" className={styles.title}>
          Global Nuclear Facilities Directory
        </h1>
        <p className={styles.summary}>
          Sourced, dated geospatial catalog of commercial nuclear power
          facilities worldwide with unit-level operating histories, verified
          coordinates, and capacity baselines grounded in the IAEA Power Reactor
          Information System (PRIS).
        </p>
      </header>

      {/* Top Hero Section: Map (Left) + Unit Breakdown Inspector (Right) */}
      <div className={styles.heroSection}>
        {/* Geospatial Map & 3D Globe Card */}
        <section
          className={styles.mapCard}
          aria-label="Geospatial Map and 3D Globe"
        >
          <div className={styles.mapHeader}>
            <div className={styles.mapTitleGroup}>
              <h2 className={styles.mapTitle}>Geospatial Projection</h2>
              <div
                className={styles.viewModeToggle}
                role="group"
                aria-label="Map View Mode"
              >
                <button
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === "3d" ? styles.viewModeBtnActive : ""}`}
                  onClick={() => setViewMode("3d")}
                  aria-pressed={viewMode === "3d"}
                >
                  🌐 3D Globe
                </button>
                <button
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === "2d" ? styles.viewModeBtnActive : ""}`}
                  onClick={() => setViewMode("2d")}
                  aria-pressed={viewMode === "2d"}
                >
                  🗺️ 2D Map
                </button>
              </div>
            </div>

            <div className={styles.mapToolbar}>
              {/* Zoom Controls */}
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={handleZoomIn}
                aria-label="Zoom in map"
                title="Zoom In"
              >
                ＋
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={handleZoomOut}
                aria-label="Zoom out map"
                title="Zoom Out"
              >
                －
              </button>
              <button
                type="button"
                className={styles.toolbarBtn}
                onClick={handleResetView}
                aria-label="Reset map zoom and pan"
                title="Reset View"
              >
                ⟲ Reset
              </button>

              {/* 3D Auto-Rotate Toggle */}
              {viewMode === "3d" && (
                <button
                  type="button"
                  className={`${styles.toolbarBtn} ${isAutoRotate ? styles.toolbarBtnActive : ""}`}
                  onClick={() => setIsAutoRotate(!isAutoRotate)}
                  aria-label={
                    isAutoRotate ? "Pause 3D rotation" : "Resume 3D rotation"
                  }
                  title="Toggle Auto Rotation"
                >
                  {isAutoRotate ? "⏸ Spin" : "▶ Spin"}
                </button>
              )}

              <span className={styles.zoomBadge}>
                {Math.round(zoomLevel * 100)}%
              </span>

              <span className={styles.mapCount}>
                Showing {filteredFacilities.length} of {facilities.length}{" "}
                facilities
              </span>
            </div>
          </div>

          {/* Visual Map Area */}
          <div className={styles.mapVisualArea}>
            {/* 3D Globe Pane */}
            {viewMode === "3d" && (
              <div
                className={styles.mapPane}
                aria-label="3D Interactive Earth Globe"
              >
                <div className={styles.paneHeader}>
                  <span className={styles.paneBadge}>
                    🌐 3D Interactive World Globe
                  </span>
                  <span className={styles.paneHint}>
                    Click & drag to spin · Scroll to zoom
                  </span>
                </div>
                <div className={styles.canvasContainer}>
                  <Globe3DCanvas
                    facilities={filteredFacilities}
                    selectedId={activeSelectedId}
                    onSelectFacility={handleSelectFacility3D}
                    isAutoRotate={isAutoRotate}
                    zoomLevel={zoomLevel}
                    onZoomChange={setZoomLevel}
                  />
                </div>
              </div>
            )}

            {/* 2D Equirectangular Map Pane */}
            <div
              className={`${styles.mapPane} ${
                viewMode === "2d"
                  ? styles.paneVisible
                  : styles.paneHiddenAccessible
              }`}
              aria-label="2D World Projection Map"
            >
              <div className={styles.paneHeader}>
                <span className={styles.paneBadge}>
                  🗺️ 2D Geospatial Projection
                </span>
                <span className={styles.paneHint}>
                  {zoomLevel > 1
                    ? "Drag to pan across world"
                    : "Click pins to inspect"}
                </span>
              </div>
              <svg
                ref={svg2DRef}
                viewBox={dynamicViewBox}
                className={styles.mapSvg}
                role="img"
                aria-label="World map showing nuclear facility locations"
                onPointerDown={handlePointerDown2D}
                onPointerMove={handlePointerMove2D}
                onPointerUp={handlePointerUp2D}
                onPointerLeave={handlePointerUp2D}
                style={{
                  cursor:
                    zoomLevel > 1
                      ? isDragging2D
                        ? "grabbing"
                        : "grab"
                      : "default",
                }}
              >
                <defs>
                  <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#0c182e" />
                    <stop offset="100%" stopColor="#030712" />
                  </radialGradient>
                </defs>

                {/* Background Ocean */}
                <rect width="800" height="400" fill="url(#oceanGradient)" />

                {/* Equator Guide Line */}
                <line
                  x1="0"
                  y1="200"
                  x2="800"
                  y2="200"
                  stroke="rgba(56, 189, 248, 0.15)"
                  strokeDasharray="4 4"
                  strokeWidth="0.8"
                />

                {/* Prime Meridian Line */}
                <line
                  x1="400"
                  y1="0"
                  x2="400"
                  y2="400"
                  stroke="rgba(56, 189, 248, 0.15)"
                  strokeDasharray="4 4"
                  strokeWidth="0.8"
                />

                {/* High-Fidelity Natural Earth 110m Landmass Path */}
                <path
                  d={worldLand.d}
                  fill="#132238"
                  stroke="rgba(56, 189, 248, 0.35)"
                  strokeWidth="0.75"
                  className={styles.landmass}
                />

                {/* Facility Pins */}
                {deconflictedPins.map((fac) => {
                  const isSelected = activeSelectedId === fac.id;

                  let pinColor = "#10b981";
                  if (fac.status === "under-construction") pinColor = "#0284c7";
                  if (
                    fac.status === "shutdown" ||
                    fac.status === "decommissioned"
                  )
                    pinColor = "#ef4444";
                  if (fac.status === "mixed") pinColor = "#f59e0b";

                  // Scale-invariant radii in SVG coordinate units
                  const baseR = 4.2 / Math.sqrt(zoomLevel);
                  const coreR = isSelected ? baseR * 1.35 : baseR;
                  const auraR = isSelected ? baseR * 2.2 : baseR * 1.5;
                  const pulseR = baseR * 2.6;

                  return (
                    <g
                      key={fac.id}
                      className={`${styles.mapPin} ${isSelected ? styles.mapPinSelected : ""}`}
                      onClick={() => handleSelectFacility2D(fac.id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select facility ${fac.name}`}
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectFacility2D(fac.id);
                        }
                      }}
                    >
                      <title>
                        {fac.name} ({fac.countryName}) —{" "}
                        {fac.totalCapacityMw !== null
                          ? `${fac.totalCapacityMw} MW`
                          : "Unknown"}{" "}
                        ({fac.status})
                      </title>
                      {/* Subtle soft glowing aura */}
                      <circle
                        cx={fac.x}
                        cy={fac.y}
                        r={auraR}
                        fill={pinColor}
                        opacity={isSelected ? "0.35" : "0.15"}
                      />
                      {/* Core pin circle with non-scaling crisp border */}
                      <circle
                        cx={fac.x}
                        cy={fac.y}
                        r={coreR}
                        fill={pinColor}
                        stroke="#ffffff"
                        strokeWidth={isSelected ? "2" : "1.2"}
                        vectorEffect="non-scaling-stroke"
                        opacity="0.95"
                      />
                      {/* Active radar ring for selected facility */}
                      {isSelected && (
                        <circle
                          cx={fac.x}
                          cy={fac.y}
                          r={pulseR}
                          fill="none"
                          stroke={pinColor}
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                          opacity="0.7"
                          className={styles.radarPulse}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Conical Projection Beam originating from facility point and expanding to details tab */}
            {selectedFacility && (
              <svg
                className={styles.projectionBeamOverlay}
                aria-hidden="true"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="beamGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#0284c7" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="rayGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Conical Projection Beam Polygon centered on facility elevation */}
                <polygon
                  points={`${selectedCoords.x},${selectedCoords.y} 100,${Math.max(10, selectedCoords.y - 22)} 100,${Math.min(90, selectedCoords.y + 22)}`}
                  fill="url(#beamGradient)"
                />

                {/* Top and Bottom Boundary Projection Rays */}
                <line
                  x1={selectedCoords.x}
                  y1={selectedCoords.y}
                  x2="100"
                  y2={Math.max(10, selectedCoords.y - 22)}
                  stroke="url(#rayGradient)"
                  strokeWidth="0.5"
                  strokeDasharray="2 1.5"
                />
                <line
                  x1={selectedCoords.x}
                  y1={selectedCoords.y}
                  x2="100"
                  y2={Math.min(90, selectedCoords.y + 22)}
                  stroke="url(#rayGradient)"
                  strokeWidth="0.5"
                  strokeDasharray="2 1.5"
                />

                {/* Central Focus Tracer Ray */}
                <line
                  x1={selectedCoords.x}
                  y1={selectedCoords.y}
                  x2="100"
                  y2={selectedCoords.y}
                  stroke="url(#rayGradient)"
                  strokeWidth="0.35"
                  strokeDasharray="1.5 2"
                />

                {/* Origin Optical Targeting Reticle at Selected Point (no solid white blob) */}
                <circle
                  cx={selectedCoords.x}
                  cy={selectedCoords.y}
                  r="3.4"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.5"
                  opacity="0.8"
                  className={styles.beamReticle}
                />
                <circle
                  cx={selectedCoords.x}
                  cy={selectedCoords.y}
                  r="1.8"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.4"
                  opacity="0.9"
                />
                {/* 4 Precision Crosshair Ticks */}
                <line
                  x1={selectedCoords.x - 4.5}
                  y1={selectedCoords.y}
                  x2={selectedCoords.x - 2.4}
                  y2={selectedCoords.y}
                  stroke="#38bdf8"
                  strokeWidth="0.4"
                  opacity="0.75"
                />
                <line
                  x1={selectedCoords.x + 2.4}
                  y1={selectedCoords.y}
                  x2={selectedCoords.x + 4.5}
                  y2={selectedCoords.y}
                  stroke="#38bdf8"
                  strokeWidth="0.4"
                  opacity="0.75"
                />
                <line
                  x1={selectedCoords.x}
                  y1={selectedCoords.y - 4.5}
                  x2={selectedCoords.x}
                  y2={selectedCoords.y - 2.4}
                  stroke="#38bdf8"
                  strokeWidth="0.4"
                  opacity="0.75"
                />
                <line
                  x1={selectedCoords.x}
                  y1={selectedCoords.y + 2.4}
                  x2={selectedCoords.x}
                  y2={selectedCoords.y + 4.5}
                  stroke="#38bdf8"
                  strokeWidth="0.4"
                  opacity="0.75"
                />
              </svg>
            )}
          </div>

          {/* Status Legend */}
          <div className={styles.mapLegend} aria-label="Facility Status Legend">
            <span className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#10b981", color: "#10b981" }}
              />
              Operating
            </span>
            <span className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#0284c7", color: "#0284c7" }}
              />
              Under Construction
            </span>
            <span className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#f59e0b", color: "#f59e0b" }}
              />
              Mixed Status
            </span>
            <span className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#ef4444", color: "#ef4444" }}
              />
              Shutdown / Decommissioned
            </span>
          </div>
        </section>

        {/* Selected Facility Inspector / Unit Breakdown to the Right of the Map */}
        <aside
          id="facility-inspector"
          className={styles.inspectorCard}
          aria-label="Facility Unit Inspector"
        >
          <div className={styles.inspectorTopBar}>
            <span className={styles.inspectorBadge}>
              📋 Unit Breakdown & Details
            </span>
            {selectedFacility && (
              <span className={styles.inspectorStatusHint}>
                IAEA: {selectedFacility.source?.id ?? selectedFacility.id}
              </span>
            )}
          </div>
          {selectedFacility ? (
            (() => {
              const operatingUnits = selectedFacility.units.filter(
                (u) => u.status === "operating",
              ).length;
              const reactorTypes =
                Array.from(
                  new Set(
                    selectedFacility.units
                      .map((u) => u.reactorType)
                      .filter(Boolean),
                  ),
                ).join(", ") || "Nuclear Reactor";

              let statusLabel = "Operating";
              let statusBadgeClass = styles.statusOperating;
              let statusColor = "#10b981";
              if (selectedFacility.status === "under-construction") {
                statusLabel = "Under Construction";
                statusBadgeClass = styles.statusConstruction;
                statusColor = "#0284c7";
              } else if (
                selectedFacility.status === "shutdown" ||
                selectedFacility.status === "decommissioned"
              ) {
                statusLabel = "Shutdown / Decommissioned";
                statusBadgeClass = styles.statusShutdown;
                statusColor = "#ef4444";
              } else if (selectedFacility.status === "mixed") {
                statusLabel = "Mixed Status";
                statusBadgeClass = styles.statusMixed;
                statusColor = "#f59e0b";
              }

              return (
                <div>
                  {/* Magnifying Focal Lens Header (Reference Callout Style) */}
                  <div className={styles.focalHeader}>
                    <div
                      className={styles.focalLens}
                      style={{ borderColor: statusColor }}
                      title={`${selectedFacility.name} — ${statusLabel}`}
                    >
                      <div
                        className={styles.focalLensStatusRing}
                        style={{ borderColor: statusColor }}
                      />
                      <span className={styles.focalLensReticle}>⌖</span>
                      <span className={styles.focalLensCode}>
                        {selectedFacility.countryCode}
                      </span>
                    </div>

                    <div className={styles.focalInfo}>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className={`${styles.statusBadge} ${statusBadgeClass}`}
                        >
                          {statusLabel}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          Verified Fleet Registry
                        </span>
                      </div>

                      <h3 className={styles.facilityName}>
                        {selectedFacility.name}
                      </h3>

                      <div className={styles.facilityLocation}>
                        📍{" "}
                        {[
                          selectedFacility.city,
                          selectedFacility.stateProvince,
                          `${selectedFacility.countryName} (${selectedFacility.countryCode})`,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className={styles.inspectorMetricsGrid}>
                    <div className={styles.metricBlock}>
                      <span className={styles.metricBlockLabel}>
                        Total Net Capacity
                      </span>
                      <span className={styles.metricBlockValue}>
                        {selectedFacility.totalCapacityMw !== null
                          ? `${selectedFacility.totalCapacityMw.toLocaleString()} MWe`
                          : "Explicitly Unknown"}
                      </span>
                    </div>

                    <div className={styles.metricBlock}>
                      <span className={styles.metricBlockLabel}>
                        Geographic Coordinates
                      </span>
                      <span className={styles.metricBlockCoords}>
                        {selectedFacility.coordinates.latitude >= 0
                          ? `${selectedFacility.coordinates.latitude.toFixed(3)}° N`
                          : `${Math.abs(selectedFacility.coordinates.latitude).toFixed(3)}° S`}
                        ,{" "}
                        {selectedFacility.coordinates.longitude >= 0
                          ? `${selectedFacility.coordinates.longitude.toFixed(3)}° E`
                          : `${Math.abs(selectedFacility.coordinates.longitude).toFixed(3)}° W`}{" "}
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${selectedFacility.coordinates.latitude}&mlon=${selectedFacility.coordinates.longitude}#map=12/${selectedFacility.coordinates.latitude}/${selectedFacility.coordinates.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceLink}
                        >
                          [OSM ↗]
                        </a>
                      </span>
                    </div>

                    <div
                      className={styles.metricBlock}
                      style={{ gridColumn: "1 / -1" }}
                    >
                      <span className={styles.metricBlockLabel}>
                        Fleet Units & Design
                      </span>
                      <span className={styles.metricBlockSub}>
                        {selectedFacility.reactorCount}{" "}
                        {selectedFacility.reactorCount === 1 ? "unit" : "units"}{" "}
                        ({operatingUnits} operating) · {reactorTypes}
                      </span>
                    </div>
                  </div>

                  {/* Mixed Status Site Transparency Callout */}
                  {selectedFacility.status === "mixed" && (
                    <div className={styles.mixedCallout}>
                      <strong>Mixed-Status Multi-Unit Facility:</strong> This
                      site operates multiple reactor units in distinct lifecycle
                      phases (e.g. commercial generation alongside ongoing new
                      construction). Unit statuses are listed individually
                      below.
                    </div>
                  )}

                  {/* Unit-by-Unit Breakdown Table */}
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      margin: "0.75rem 0 0.25rem 0",
                    }}
                  >
                    Reactor Units Breakdown ({selectedFacility.units.length})
                  </h4>
                  <div className={styles.unitsTableWrapper}>
                    <table
                      className={styles.unitsTable}
                      aria-label="Individual Reactor Units"
                    >
                      <thead>
                        <tr>
                          <th scope="col">Unit</th>
                          <th scope="col">Type</th>
                          <th scope="col">Status</th>
                          <th scope="col">Net MWe</th>
                          <th scope="col">Commercial</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFacility.units.map((unit) => (
                          <tr key={unit.id}>
                            <td>
                              <strong>{unit.name}</strong>
                            </td>
                            <td>{unit.reactorType}</td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${statusClass(unit.status)}`}
                              >
                                {unit.status}
                              </span>
                            </td>
                            <td>
                              {unit.capacityMWe !== null
                                ? `${unit.capacityMWe.toLocaleString()} MW`
                                : "Unknown"}
                            </td>
                            <td>{unit.commercialYear ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Source Attribution */}
                  {selectedFacility.source && (
                    <div className={styles.sourceFooter}>
                      <strong>Source:</strong> {selectedFacility.source.title} (
                      {selectedFacility.source.publisher},{" "}
                      {selectedFacility.source.asOf})
                      {selectedFacility.source.url && (
                        <a
                          href={selectedFacility.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.sourceLink}
                        >
                          [IAEA Record ↗]
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <p style={{ color: "#64748b" }}>
              Select a facility to inspect unit breakdown and technical history.
            </p>
          )}
        </aside>
      </div>

      {/* Interactive Filters Panel: Below Map Section & Above Facility Directory */}
      {filtersSection}

      {/* Facility Directory Table: Full-width directory at the bottom */}
      <section className={styles.directoryCard} aria-label="Facility Directory">
        <h2 className={styles.mapTitle} style={{ marginBottom: "0.75rem" }}>
          Facility Directory ({filteredFacilities.length})
        </h2>

        {filteredFacilities.length === 0 ? (
          <p style={{ color: "#64748b", padding: "1rem 0" }}>
            No facilities match the selected filters. Try broadening your
            criteria.
          </p>
        ) : (
          <div className={styles.tableWrapper}>
            <table
              className={styles.table}
              aria-label="Nuclear Facilities Table"
            >
              <thead>
                <tr>
                  <th scope="col">Facility Name</th>
                  <th scope="col">Country</th>
                  <th scope="col">Status</th>
                  <th scope="col">Net MWe</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((fac) => {
                  const isSelected = activeSelectedId === fac.id;
                  return (
                    <tr
                      key={fac.id}
                      className={`${styles.tableRow} ${isSelected ? styles.tableRowSelected : ""}`}
                      onClick={() => handleSelectTableRow(fac.id)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectTableRow(fac.id);
                        }
                      }}
                    >
                      <td>
                        <strong>{fac.name}</strong>
                        {(fac.city || fac.stateProvince) && (
                          <div
                            style={{ fontSize: "0.75rem", color: "#38bdf8" }}
                          >
                            📍{" "}
                            {[fac.city, fac.stateProvince]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {fac.reactorCount} units
                        </div>
                      </td>
                      <td>
                        {fac.countryName} ({fac.countryCode})
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${statusClass(fac.status)}`}
                        >
                          {fac.status}
                        </span>
                      </td>
                      <td>
                        {fac.totalCapacityMw !== null
                          ? `${fac.totalCapacityMw.toLocaleString()} MW`
                          : "Unknown"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  );
}
