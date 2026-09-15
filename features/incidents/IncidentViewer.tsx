"use client";

import React, { useState, useMemo } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  type ComplexityLevel,
  COMPLEXITY_LEVELS,
} from "@/lib/preferences/complexity-preference";
import {
  INCIDENTS_DATA,
  INCIDENT_FAQS,
  type IncidentData,
  type InesLevel,
} from "@/content/incidents/incidents-data";
import styles from "./IncidentViewer.module.css";

type ViewMode = "incidents" | "faqs";
type IncidentSubTab = "analysis" | "timeline" | "health" | "lessons";

export function IncidentViewer() {
  const [userLevel] = useComplexityPreference("curious");
  const [mode, setMode] = useState<ViewMode>("incidents");
  const [selectedIncidentId, setSelectedIncidentId] =
    useState<string>("chernobyl");
  const [subTab, setSubTab] = useState<IncidentSubTab>("analysis");
  const [customLevel, setCustomLevel] = useState<ComplexityLevel | null>(null);

  // FAQ state
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string>("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(
    "faq-bomb-explosion",
  );

  const effectiveLevel = customLevel ?? userLevel;

  const currentIncident: IncidentData = useMemo(() => {
    return (
      INCIDENTS_DATA.find((i) => i.id === selectedIncidentId) ??
      INCIDENTS_DATA[0]
    );
  }, [selectedIncidentId]);

  const filteredFaqs = useMemo(() => {
    return INCIDENT_FAQS.filter((faq) => {
      if (faqCategory !== "all" && faq.category !== faqCategory) {
        return false;
      }
      if (faqSearch.trim()) {
        const q = faqSearch.toLowerCase().trim();
        const matchQ = faq.question.toLowerCase().includes(q);
        const matchA = faq.answer[effectiveLevel].toLowerCase().includes(q);
        if (!matchQ && !matchA) return false;
      }
      return true;
    });
  }, [faqCategory, faqSearch, effectiveLevel]);

  const inesClass = (level: InesLevel) => {
    if (level === 7) return styles.inesLevel7;
    if (level === 6) return styles.inesLevel6;
    return styles.inesLevel5;
  };

  return (
    <article className={styles.container} aria-labelledby="incidents-heading">
      <header className={styles.header}>
        <div className={styles.badge}>
          <span>⚠️</span> Technical Post-Mortems & Empirical Data
        </div>
        <h1 id="incidents-heading" className={styles.title}>
          Nuclear Incidents & Forensics
        </h1>
        <p className={styles.subtitle}>
          Rigorous post-mortems of history&apos;s major nuclear accidents.
          Inspect root causes, radiological release inventories, independent
          health studies (UNSCEAR / WHO), and the engineering safeguards born
          from them.
        </p>
      </header>

      {/* Mode Switcher: Major Incidents vs FAQs */}
      <div
        className={styles.modeSwitcher}
        role="tablist"
        aria-label="Incident Sections"
      >
        <button
          role="tab"
          aria-selected={mode === "incidents"}
          className={`${styles.modeButton} ${mode === "incidents" ? styles.modeButtonActive : ""}`}
          onClick={() => setMode("incidents")}
        >
          <span>🔥</span> Major Accident Case Studies
        </button>
        <button
          role="tab"
          aria-selected={mode === "faqs"}
          className={`${styles.modeButton} ${mode === "faqs" ? styles.modeButtonActive : ""}`}
          onClick={() => setMode("faqs")}
        >
          <span>❓</span> Fact Checks & FAQs
        </button>
      </div>

      {mode === "incidents" && (
        <>
          {/* Incident Selector Grid */}
          <div
            className={styles.incidentSelector}
            role="tablist"
            aria-label="Select Incident"
          >
            {INCIDENTS_DATA.map((inc) => {
              const isSelected = inc.id === currentIncident.id;
              return (
                <button
                  key={inc.id}
                  role="tab"
                  aria-selected={isSelected}
                  className={`${styles.incidentTab} ${isSelected ? styles.incidentTabSelected : ""}`}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setSubTab("analysis");
                  }}
                >
                  <div className={styles.incidentTabHeader}>
                    <span className={styles.incidentYear}>{inc.year}</span>
                    <span
                      className={`${styles.inesBadge} ${inesClass(inc.inesLevel)}`}
                    >
                      INES {inc.inesLevel}
                    </span>
                  </div>
                  <h3 className={styles.incidentName}>{inc.name}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                    {inc.location}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Incident Detail Card */}
          <section
            className={styles.incidentDetailCard}
            aria-labelledby="detail-title"
          >
            <div className={styles.detailHeader}>
              <div className={styles.detailTitleRow}>
                <div>
                  <span
                    className={`${styles.inesBadge} ${inesClass(currentIncident.inesLevel)}`}
                    style={{ marginBottom: "0.5rem", display: "inline-block" }}
                  >
                    INES Level {currentIncident.inesLevel}:{" "}
                    {currentIncident.inesLabel}
                  </span>
                  <h2 id="detail-title" className={styles.detailTitle}>
                    {currentIncident.name} ({currentIncident.year})
                  </h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.35rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    Depth:
                  </span>
                  {COMPLEXITY_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: "1px solid",
                        cursor: "pointer",
                        background:
                          effectiveLevel === lvl
                            ? "#38bdf8"
                            : "rgba(30, 41, 59, 0.6)",
                        color: effectiveLevel === lvl ? "#0f172a" : "#94a3b8",
                        borderColor:
                          effectiveLevel === lvl
                            ? "#38bdf8"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                      onClick={() => setCustomLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.detailMeta}>
                <span>
                  <strong>Location:</strong> {currentIncident.location},{" "}
                  {currentIncident.country}
                </span>
                <span>
                  <strong>Reactor Architecture:</strong>{" "}
                  {currentIncident.reactorType}
                </span>
                <span>
                  <strong>Design:</strong> {currentIncident.reactorModel}
                </span>
              </div>

              <div className={styles.detailSummary}>
                {currentIncident.summary}
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div
              className={styles.subTabs}
              role="tablist"
              aria-label="Incident Information Tabs"
            >
              <button
                role="tab"
                aria-selected={subTab === "analysis"}
                className={`${styles.subTabButton} ${subTab === "analysis" ? styles.subTabButtonActive : ""}`}
                onClick={() => setSubTab("analysis")}
              >
                🔬 Technical Analysis & Physics
              </button>
              <button
                role="tab"
                aria-selected={subTab === "timeline"}
                className={`${styles.subTabButton} ${subTab === "timeline" ? styles.subTabButtonActive : ""}`}
                onClick={() => setSubTab("timeline")}
              >
                ⏱️ Chronological Timeline
              </button>
              <button
                role="tab"
                aria-selected={subTab === "health"}
                className={`${styles.subTabButton} ${subTab === "health" ? styles.subTabButtonActive : ""}`}
                onClick={() => setSubTab("health")}
              >
                📊 Radiological Release & Health
              </button>
              <button
                role="tab"
                aria-selected={subTab === "lessons"}
                className={`${styles.subTabButton} ${subTab === "lessons" ? styles.subTabButtonActive : ""}`}
                onClick={() => setSubTab("lessons")}
              >
                🛡️ Engineering Safeguards Enacted
              </button>
            </div>

            {/* Sub-Tab 1: Technical Analysis */}
            {subTab === "analysis" && (
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                  <span>⚙️</span> Root Cause Breakdown
                </h3>
                <div
                  style={{
                    background: "rgba(15, 23, 42, 0.7)",
                    padding: "1rem 1.25rem",
                    borderRadius: "8px",
                    borderLeft: "3px solid #f43f5e",
                    marginBottom: "1.25rem",
                    fontSize: "0.95rem",
                    color: "#fca5a5",
                  }}
                >
                  <strong>Fundamental Trigger:</strong>{" "}
                  {currentIncident.rootCause}
                </div>
                <h3 className={styles.sectionTitle}>
                  <span>📖</span> Detailed Explanation (
                  {effectiveLevel.toUpperCase()} Level)
                </h3>
                <div className={styles.explanationBox}>
                  {currentIncident.explanations[effectiveLevel]}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Timeline */}
            {subTab === "timeline" && (
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                  <span>⏱️</span> Sequence of Events
                </h3>
                <div className={styles.timeline}>
                  {currentIncident.timeline.map((item, idx) => (
                    <div key={idx} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineTime}>{item.time}</div>
                      <div className={styles.timelineTitle}>{item.title}</div>
                      <p className={styles.timelineDesc}>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Radiological Release & Health */}
            {subTab === "health" && (
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                  <span>☢️</span> Radiological Release & Independent Health
                  Audits
                </h3>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <div className={styles.statValue}>
                      {currentIncident.healthImpacts.immediateFatalities}
                    </div>
                    <div className={styles.statLabel}>Immediate Fatalities</div>
                  </div>
                  <div className={styles.statItem}>
                    <div
                      className={styles.statValue}
                      style={{ color: "#fb923c" }}
                    >
                      {currentIncident.radiologicalRelease.totalActivityPBq}
                    </div>
                    <div className={styles.statLabel}>
                      Total Atmospheric Activity
                    </div>
                  </div>
                  {currentIncident.radiologicalRelease.iodine131PBq && (
                    <div className={styles.statItem}>
                      <div
                        className={styles.statValue}
                        style={{ color: "#38bdf8" }}
                      >
                        {currentIncident.radiologicalRelease.iodine131PBq}
                      </div>
                      <div className={styles.statLabel}>Iodine-131 Release</div>
                    </div>
                  )}
                  {currentIncident.radiologicalRelease.cesium137PBq && (
                    <div className={styles.statItem}>
                      <div
                        className={styles.statValue}
                        style={{ color: "#a855f7" }}
                      >
                        {currentIncident.radiologicalRelease.cesium137PBq}
                      </div>
                      <div className={styles.statLabel}>Cesium-137 Release</div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      color: "#f8fafc",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    UNSCEAR & World Health Organization Findings
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "#cbd5e1",
                      margin: 0,
                    }}
                  >
                    {currentIncident.healthImpacts.whoUnscearSummary}
                  </p>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      color: "#f8fafc",
                      margin: "0 0 0.5rem 0",
                    }}
                  >
                    Evacuation and Socioeconomic Impacts
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      color: "#cbd5e1",
                      margin: 0,
                    }}
                  >
                    {currentIncident.healthImpacts.evacuationImpact}
                  </p>
                </div>
              </div>
            )}

            {/* Sub-Tab 4: Engineering Lessons */}
            {subTab === "lessons" && (
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                  <span>🛠️</span> Engineering & Regulatory Changes Implemented
                </h3>
                <ul className={styles.lessonsList}>
                  {currentIncident.keyEngineeringLessons.map((lesson, idx) => (
                    <li key={idx} className={styles.lessonItem}>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sources Attribution */}
            <div className={styles.sourcesSection}>
              <div className={styles.sourcesTitle}>
                Peer-Reviewed & Official Records
              </div>
              <div className={styles.sourcesList}>
                {currentIncident.sources.map((src, idx) => (
                  <div key={idx}>
                    • <strong>{src.title}</strong> — {src.organization} (
                    {src.year}). <em>{src.citation}</em>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {mode === "faqs" && (
        <section
          className={styles.faqSection}
          aria-label="Frequently Asked Questions & Fact Checks"
        >
          <div className={styles.faqControls}>
            <input
              type="text"
              placeholder="Search questions (e.g. bomb, meltdown, fukushima deaths)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className={styles.faqSearch}
              aria-label="Search incident questions"
            />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(
                [
                  "all",
                  "physics",
                  "health",
                  "engineering",
                  "environment",
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.categoryPill} ${faqCategory === cat ? styles.categoryPillActive : ""}`}
                  onClick={() => setFaqCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.faqList}>
            {filteredFaqs.length === 0 ? (
              <p style={{ color: "#94a3b8", padding: "1.5rem 0" }}>
                No fact-checks match your search. Try broadening your query.
              </p>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <article key={faq.id} className={styles.faqCard}>
                    <h3
                      className={styles.faqQuestion}
                      onClick={() =>
                        setExpandedFaqId(isExpanded ? null : faq.id)
                      }
                      tabIndex={0}
                      role="button"
                      aria-expanded={isExpanded}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setExpandedFaqId(isExpanded ? null : faq.id);
                        }
                      }}
                    >
                      <span>{faq.question}</span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#38bdf8",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        ▼
                      </span>
                    </h3>

                    {isExpanded && (
                      <div>
                        <p className={styles.faqAnswer}>
                          {faq.answer[effectiveLevel]}
                        </p>
                        <div className={styles.faqSource}>
                          <strong>Source:</strong> {faq.source.title} (
                          {faq.source.organization}, {faq.source.year}) —{" "}
                          <em>{faq.source.citation}</em>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}
    </article>
  );
}
