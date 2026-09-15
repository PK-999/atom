"use client";

import React, { useState, useMemo } from "react";
import {
  SCIENTIFIC_SOURCES,
  type ScientificSource,
} from "@/content/sources/sources-data";
import styles from "./SourcesViewer.module.css";

const CATEGORIES = [
  { id: "all", label: "All Literature" },
  { id: "climate-emissions", label: "Emissions & Climate" },
  { id: "radiation-health", label: "Radiation & Health" },
  { id: "reactor-safety", label: "Reactor Safety & Forensics" },
  { id: "economics", label: "Economics & Costs" },
  { id: "global-fleet", label: "Global Fleet Operations" },
];

export function SourcesViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredSources = useMemo(() => {
    return SCIENTIFIC_SOURCES.filter((src) => {
      // Category filter
      if (selectedCategory !== "all" && src.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = src.title.toLowerCase().includes(q);
        const matchOrg =
          src.organization.toLowerCase().includes(q) ||
          src.shortOrg.toLowerCase().includes(q);
        const matchScope = src.scope.toLowerCase().includes(q);
        const matchCitation = src.citation.toLowerCase().includes(q);
        const matchUsedIn = src.usedInAtomFor.some((u) =>
          u.toLowerCase().includes(q),
        );
        if (
          !matchTitle &&
          !matchOrg &&
          !matchScope &&
          !matchCitation &&
          !matchUsedIn
        ) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <article className={styles.container} aria-labelledby="sources-heading">
      <header className={styles.header}>
        <div className={styles.badge}>
          <span>📚</span> Open Evidence & Literature Registry
        </div>
        <h1 id="sources-heading" className={styles.title}>
          Scientific Sources & Bibliography
        </h1>
        <p className={styles.subtitle}>
          ATOM is built on peer-reviewed consensus and official records from
          authoritative international bodies. Every quantitative claim,
          radiation threshold, and lifecycle metric links directly to its
          original source.
        </p>

        <div className={styles.principleCallout}>
          <strong>Primary Product Principle:</strong> ATOM should never ask
          users to trust ATOM. ATOM should give users enough information to
          verify ATOM.
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className={styles.controlsBar} aria-label="Sources Filter Bar">
        <div className={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by publication, agency, metric, or keyword (e.g. UNSCEAR, emissions, Chernobyl, LCOE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search scientific sources"
          />
        </div>

        <div
          className={styles.categoryPills}
          role="group"
          aria-label="Filter by research domain"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.pill} ${selectedCategory === cat.id ? styles.pillActive : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Sources Grid */}
      <section aria-label="Scientific Sources List">
        {filteredSources.length === 0 ? (
          <p
            style={{ color: "#94a3b8", padding: "2rem 0", textAlign: "center" }}
          >
            No scientific sources match your search. Try broadening your
            criteria.
          </p>
        ) : (
          <div className={styles.sourceGrid}>
            {filteredSources.map((source: ScientificSource) => (
              <article key={source.id} className={styles.sourceCard}>
                <div>
                  <div className={styles.cardHeader}>
                    <span className={styles.orgBadge}>{source.shortOrg}</span>
                    <span className={styles.year}>{source.year}</span>
                  </div>

                  <h2 className={styles.cardTitle}>{source.title}</h2>
                  <div className={styles.orgFullName}>
                    {source.organization}
                  </div>
                  <div className={styles.citation}>{source.citation}</div>

                  <p className={styles.scopeText}>{source.scope}</p>

                  <div className={styles.usedInList}>
                    <div className={styles.usedInHeading}>Grounds in ATOM:</div>
                    {source.usedInAtomFor.map((item, idx) => (
                      <div key={idx} className={styles.usedInItem}>
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <a
                    href={source.doiOrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.doiLink}
                    aria-label={`Open primary document for ${source.shortOrg} ${source.year}`}
                  >
                    <span>View Primary Record</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                  <span className={styles.peerBadge}>
                    {source.peerReviewType}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
