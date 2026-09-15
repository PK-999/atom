"use client";

import { useState, useMemo } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import {
  COMPLEXITY_LABELS,
  type ComplexityLevel,
} from "@/lib/preferences/complexity-preference";
import {
  MYTHS_DATA,
  type MythCategory,
  type MythItem,
} from "@/content/myths/myths-data";
import styles from "./MythViewer.module.css";

const CATEGORIES: { id: "all" | MythCategory; label: string }[] = [
  { id: "all", label: "All Myths (8)" },
  { id: "safety", label: "Safety & Explosions" },
  { id: "waste", label: "Nuclear Waste" },
  { id: "radiation", label: "Radiation Exposure" },
  { id: "environment", label: "Emissions & Land" },
  { id: "economics", label: "Cost & Renewables" },
  { id: "proliferation", label: "Weapons & Proliferation" },
];

export function MythViewer() {
  const [level, setLevel] = useComplexityPreference("curious");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | MythCategory>(
    "all",
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([MYTHS_DATA[0].id]), // default first myth expanded
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredMyths = useMemo(() => {
    return MYTHS_DATA.filter((myth) => {
      const matchesCategory =
        activeCategory === "all" || myth.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        myth.claim.toLowerCase().includes(q) ||
        myth.quickReality.toLowerCase().includes(q) ||
        myth.explanations[level].toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, level]);

  const getVerdictBadgeClass = (verdict: MythItem["verdict"]) => {
    switch (verdict) {
      case "False":
      case "Debunked":
        return styles.verdictBadgeFalse;
      case "Nuanced":
        return styles.verdictBadgeNuanced;
      case "Context Dependent":
        return styles.verdictBadgeContext;
      default:
        return styles.verdictBadgeNuanced;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>Fact-Checking & Science</span>
          <h1 className={styles.title}>Nuclear Myth Busting</h1>
          <p className={styles.subtitle}>
            Popular claims examined against peer-reviewed physics,
            epidemiological data, and international oversight reports.
          </p>
        </div>
      </header>

      {/* Toolbar: Search and Category Filter */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon} aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            aria-label="Search myths"
            placeholder="Search claims, keywords (e.g. bomb, waste, cost, radiation)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div
          className={styles.categoryPills}
          role="group"
          aria-label="Myth categories"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryBtn} ${
                activeCategory === cat.id ? styles.categoryBtnActive : ""
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Myths List */}
      <div className={styles.mythsList}>
        {filteredMyths.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No matching myths found</h3>
            <p>Try refining your search query or switching categories.</p>
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredMyths.map((myth) => {
            const isExpanded = expandedIds.has(myth.id);
            const explanation = myth.explanations[level];

            return (
              <article
                key={myth.id}
                className={`${styles.mythCard} ${
                  isExpanded ? styles.mythCardExpanded : ""
                }`}
              >
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleExpand(myth.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(myth.id);
                    }
                  }}
                >
                  <div className={styles.cardHeaderMain}>
                    <div className={styles.badgesRow}>
                      <span className={getVerdictBadgeClass(myth.verdict)}>
                        Verdict: {myth.verdict}
                      </span>
                      <span className={styles.categoryTag}>
                        {myth.category.toUpperCase()}
                      </span>
                    </div>

                    <h2 className={styles.claimText}>“{myth.claim}”</h2>
                    <p className={styles.quickReality}>{myth.quickReality}</p>
                  </div>

                  <div
                    className={`${styles.expandToggle} ${
                      isExpanded ? styles.expandToggleRotated : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.cardBody}>
                    <div className={styles.detailedEvidenceHeader}>
                      <strong>Detailed Evidence Analysis</strong>
                      <span className={styles.levelTag}>
                        Tailored for: {COMPLEXITY_LABELS[level]}
                      </span>
                    </div>

                    <p className={styles.fullExplanation}>{explanation}</p>

                    <div className={styles.citationsBox}>
                      <span className={styles.citationsHeading}>
                        Peer-Reviewed & Official Sources
                      </span>
                      <ul className={styles.citationsList}>
                        {myth.evidenceSources.map((source) => (
                          <li
                            key={source.title}
                            className={styles.citationItem}
                          >
                            <span className={styles.citationOrg}>
                              {source.organization} ({source.year}):
                            </span>{" "}
                            <em>{source.title}</em> — {source.citation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
