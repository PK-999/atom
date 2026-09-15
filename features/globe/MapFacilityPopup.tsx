"use client";

import React from "react";
import type { Facility } from "@/lib/globe/schemas";
import styles from "./GlobeViewer.module.css";

interface MapFacilityPopupProps {
  facility: Facility;
  onClose?: () => void;
  onInspect?: () => void;
}

export function MapFacilityPopup({
  facility,
  onClose,
  onInspect,
}: MapFacilityPopupProps) {
  const lat = facility.coordinates.latitude;
  const lon = facility.coordinates.longitude;
  const latStr = `${Math.abs(lat).toFixed(3)}° ${lat >= 0 ? "N" : "S"}`;
  const lonStr = `${Math.abs(lon).toFixed(3)}° ${lon >= 0 ? "E" : "W"}`;

  let statusLabel = "Operating";
  let statusBadgeClass = styles.statusOperating;
  if (facility.status === "under-construction") {
    statusLabel = "Under Construction";
    statusBadgeClass = styles.statusConstruction;
  } else if (
    facility.status === "shutdown" ||
    facility.status === "decommissioned"
  ) {
    statusLabel = "Shutdown / Decommissioned";
    statusBadgeClass = styles.statusShutdown;
  } else if (facility.status === "mixed") {
    statusLabel = "Mixed Status";
    statusBadgeClass = styles.statusMixed;
  }

  // Determine unique reactor types
  const reactorTypes =
    Array.from(
      new Set(
        facility.units
          .map((u: { reactorType: string }) => u.reactorType)
          .filter(Boolean),
      ),
    ).join(", ") || "Nuclear Reactor";

  const operatingUnits = facility.units.filter(
    (u: { status: string }) => u.status === "operating",
  ).length;

  return (
    <div
      className={styles.facilityPopup}
      role="region"
      aria-label={`Facility details for ${facility.name}`}
    >
      <div className={styles.popupHeader}>
        <div className={styles.popupTitleGroup}>
          <span className={`${styles.statusBadge} ${statusBadgeClass}`}>
            {statusLabel}
          </span>
          <h4 className={styles.popupName}>{facility.name}</h4>
          {(facility.city || facility.stateProvince) && (
            <span className={styles.popupCityState}>
              📍{" "}
              {[facility.city, facility.stateProvince]
                .filter(Boolean)
                .join(", ")}
            </span>
          )}
          <span className={styles.popupCountry}>
            {facility.countryName} ({facility.countryCode})
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            className={styles.popupCloseBtn}
            onClick={onClose}
            aria-label="Close details popup"
          >
            ✕
          </button>
        )}
      </div>

      <div className={styles.popupMetrics}>
        <div className={styles.popupMetric}>
          <span className={styles.popupMetricLabel}>Total Net Capacity</span>
          <span className={styles.popupMetricValue}>
            {facility.totalCapacityMw !== null
              ? `${facility.totalCapacityMw.toLocaleString()} MWe`
              : "Unknown"}
          </span>
        </div>

        <div className={styles.popupMetric}>
          <span className={styles.popupMetricLabel}>
            Geographic Coordinates
          </span>
          <span className={styles.popupMetricCoordinates}>
            {latStr}, {lonStr}
          </span>
        </div>

        <div className={styles.popupMetric}>
          <span className={styles.popupMetricLabel}>Fleet Units & Design</span>
          <span className={styles.popupMetricValueSub}>
            {facility.reactorCount}{" "}
            {facility.reactorCount === 1 ? "unit" : "units"} ({operatingUnits}{" "}
            operating) · {reactorTypes}
          </span>
        </div>
      </div>

      <div className={styles.popupFooter}>
        <span className={styles.popupSourceNotice}>
          Verified Fleet Registry
        </span>
        {onInspect && (
          <button
            type="button"
            className={styles.popupInspectBtn}
            onClick={onInspect}
          >
            View Unit Breakdown ↓
          </button>
        )}
      </div>
    </div>
  );
}
