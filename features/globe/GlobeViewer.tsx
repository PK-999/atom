"use client";

import React, { useState, useMemo } from "react";
import type { Facility, FacilityStatus } from "../../lib/globe/schemas";
import { filterFacilities } from "../../lib/globe/facility-model";
import styles from "./GlobeViewer.module.css";

export interface GlobeViewerProps {
  facilities: readonly Facility[];
  initialFacilityId?: string;
}

export function GlobeViewer({
  facilities,
  initialFacilityId,
}: GlobeViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialFacilityId ?? facilities[0]?.id ?? null,
  );
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("all");

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

      {/* Interactive Filters Panel */}
      <section className={styles.filterPanel} aria-label="Facility Filters">
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label htmlFor="filter-search" className={styles.filterLabel}>
              Search Name or Type
            </label>
            <input
              id="filter-search"
              type="text"
              placeholder="e.g. Kudankulam, VVER, Olkiluoto..."
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
              <option value="all">All Countries</option>
              <option value="IN">India (IN)</option>
              <option value="US">United States (US)</option>
              <option value="FR">France (FR)</option>
              <option value="FI">Finland (FI)</option>
              <option value="AE">United Arab Emirates (AE)</option>
              <option value="UA">Ukraine (UA)</option>
              <option value="JP">Japan (JP)</option>
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
              <option value="operating">Operating</option>
              <option value="under-construction">Under Construction</option>
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

      {/* Map Card */}
      <section
        className={styles.mapCard}
        aria-label="Geospatial Map Projection"
      >
        <div className={styles.mapHeader}>
          <h2 className={styles.mapTitle}>Geospatial Projection</h2>
          <span className={styles.mapCount}>
            Showing {filteredFacilities.length} of {facilities.length}{" "}
            facilities
          </span>
        </div>

        <div className={styles.mapWrapper}>
          <svg
            viewBox="0 0 800 400"
            className={styles.mapSvg}
            role="img"
            aria-label="World map showing nuclear facility locations"
          >
            <rect width="800" height="400" fill="#0f172a" />
            {/* Latitude / Longitude Reference Grid */}
            <line
              x1="0"
              y1="200"
              x2="800"
              y2="200"
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="400"
              y1="0"
              x2="400"
              y2="400"
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="200"
              y1="0"
              x2="200"
              y2="400"
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line
              x1="600"
              y1="0"
              x2="600"
              y2="400"
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Stylized Landmass Silhouette Guides */}
            <path
              d="M 120 100 L 220 100 L 240 180 L 160 220 Z M 380 90 L 460 90 L 450 160 L 390 140 Z M 520 140 L 620 130 L 640 220 L 550 240 Z"
              fill="#1e293b"
              opacity="0.4"
            />

            {/* Facility Pins */}
            {filteredFacilities.map((fac) => {
              const { x, y } = projectCoords(
                fac.coordinates.latitude,
                fac.coordinates.longitude,
              );
              const isSelected = activeSelectedId === fac.id;

              let pinColor = "#10b981";
              if (fac.status === "under-construction") pinColor = "#0284c7";
              if (fac.status === "shutdown" || fac.status === "decommissioned")
                pinColor = "#ef4444";
              if (fac.status === "mixed") pinColor = "#f59e0b";

              return (
                <g
                  key={fac.id}
                  className={`${styles.mapPin} ${isSelected ? styles.mapPinSelected : ""}`}
                  onClick={() => setSelectedId(fac.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select facility ${fac.name}`}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(fac.id);
                    }
                  }}
                >
                  <circle
                    cx={x}
                    y={y}
                    r={isSelected ? "9" : "6"}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "3" : "1.5"}
                    opacity="0.95"
                  />
                  {isSelected && (
                    <circle
                      cx={x}
                      y={y}
                      r="16"
                      fill="none"
                      stroke={pinColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* Main Content Grid: Server-Readable Directory Table + Facility Inspector */}
      <div className={styles.contentGrid}>
        {/* Facility Directory Table */}
        <section
          className={styles.directoryCard}
          aria-label="Facility Directory"
        >
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
                        onClick={() => setSelectedId(fac.id)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(fac.id);
                          }
                        }}
                      >
                        <td>
                          <strong>{fac.name}</strong>
                          <div
                            style={{ fontSize: "0.75rem", color: "#64748b" }}
                          >
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
                            ? `${fac.totalCapacityMw} MW`
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

        {/* Selected Facility Inspector */}
        <aside
          className={styles.inspectorCard}
          aria-label="Facility Unit Inspector"
        >
          {selectedFacility ? (
            <div>
              <div className={styles.inspectorHeader}>
                <h3 className={styles.facilityName}>{selectedFacility.name}</h3>
                <div className={styles.facilityMeta}>
                  <span>
                    <strong>Country:</strong> {selectedFacility.countryName}
                  </span>
                  <span>
                    <strong>Coordinates:</strong>{" "}
                    {selectedFacility.coordinates.latitude.toFixed(3)}°,{" "}
                    {selectedFacility.coordinates.longitude.toFixed(3)}°
                  </span>
                  <span>
                    <strong>Total Net Capacity:</strong>{" "}
                    {selectedFacility.totalCapacityMw !== null
                      ? `${selectedFacility.totalCapacityMw} MWe`
                      : "Explicitly Unknown"}
                  </span>
                </div>
              </div>

              {/* Mixed Status Site Transparency Callout */}
              {selectedFacility.status === "mixed" && (
                <div className={styles.mixedCallout}>
                  <strong>Mixed-Status Multi-Unit Facility:</strong> This site
                  operates multiple reactor units in distinct lifecycle phases
                  (e.g. commercial generation alongside ongoing new
                  construction). Unit statuses are listed individually below.
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
                          ? unit.capacityMWe
                          : "Unknown"}
                      </td>
                      <td>{unit.commercialYear ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
                      [IAEA Record]
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>
              Select a facility to inspect unit breakdown and technical history.
            </p>
          )}
        </aside>
      </div>
    </article>
  );
}
