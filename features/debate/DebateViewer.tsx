"use client";

import React, { useState } from "react";
import type {
  DebateTopic,
  ArgumentRelationship,
} from "../../lib/debate/schemas";
import {
  getArgumentRelationship,
  normalizeAttributableStatement,
} from "../../lib/debate/schemas";
import {
  getNarrativelyOrderedArguments,
  resolveArgumentCitations,
} from "../../lib/debate/debate-model";
import styles from "./DebateViewer.module.css";

export interface DebateViewerProps {
  topic: DebateTopic;
}

export function DebateViewer({ topic }: DebateViewerProps) {
  const [filter, setFilter] = useState<ArgumentRelationship | "all">("all");
  const [expandedCitations, setExpandedCitations] = useState<
    Record<string, boolean>
  >({});

  const toggleCitation = (argId: string) => {
    setExpandedCitations((prev) => ({
      ...prev,
      [argId]: !prev[argId],
    }));
  };

  const consensus = normalizeAttributableStatement(topic.consensus);
  const uncertainty = normalizeAttributableStatement(topic.uncertainty);

  const activeRelationship = filter === "all" ? undefined : filter;
  const orderedArguments = getNarrativelyOrderedArguments(
    topic,
    activeRelationship,
  );

  const relationshipClass = (rel: ArgumentRelationship) => {
    switch (rel) {
      case "supporting":
        return styles.relationshipSupporting;
      case "disputing":
        return styles.relationshipDisputing;
      case "contextualizing":
        return styles.relationshipContextualizing;
    }
  };

  const badgeClass = (rel: ArgumentRelationship) => {
    switch (rel) {
      case "supporting":
        return styles.badgeSupporting;
      case "disputing":
        return styles.badgeDisputing;
      case "contextualizing":
        return styles.badgeContextualizing;
    }
  };

  return (
    <article
      className={styles.container}
      aria-labelledby={`debate-question-${topic.id}`}
    >
      <header className={styles.header}>
        <h1 id={`debate-question-${topic.id}`} className={styles.question}>
          {topic.question}
        </h1>
        <p className={styles.summary}>{topic.summary}</p>
      </header>

      {/* Attributable Consensus Box */}
      {consensus && (
        <aside
          className={styles.consensusBox}
          aria-label="Attributable Consensus"
        >
          <div className={styles.consensusHeader}>
            <span aria-hidden="true">⚖️</span>
            <h2 className={styles.consensusTitle}>
              State of Scientific Consensus
            </h2>
          </div>
          <p className={styles.consensusBody}>{consensus.statement}</p>
          <div className={styles.basisMeta}>
            <span>
              <strong>Attributable Basis:</strong> {consensus.basis}
            </span>
            <span>
              <strong>As of:</strong> {consensus.asOf}
            </span>
          </div>
        </aside>
      )}

      {/* Attributable Uncertainty Box */}
      {uncertainty && (
        <aside className={styles.uncertaintyBox} aria-label="Key Uncertainties">
          <h2 className={styles.uncertaintyTitle}>
            Key Uncertainties & Open Questions
          </h2>
          <p className={styles.uncertaintyBody}>{uncertainty.statement}</p>
          <div className={styles.basisMeta}>
            <span>
              <strong>Basis:</strong> {uncertainty.basis}
            </span>
            <span>
              <strong>As of:</strong> {uncertainty.asOf}
            </span>
          </div>
        </aside>
      )}

      {/* Relationship Filter Bar */}
      <nav
        className={styles.filterBar}
        aria-label="Argument relationship filter"
      >
        <span className={styles.filterLabel}>Filter Arguments:</span>
        <button
          type="button"
          className={`${styles.filterButton} ${filter === "all" ? styles.filterButtonActive : ""}`}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          All ({topic.arguments.length})
        </button>
        <button
          type="button"
          className={`${styles.filterButton} ${filter === "supporting" ? styles.filterButtonActive : ""}`}
          onClick={() => setFilter("supporting")}
          aria-pressed={filter === "supporting"}
        >
          Supporting (
          {
            topic.arguments.filter(
              (a) => getArgumentRelationship(a) === "supporting",
            ).length
          }
          )
        </button>
        <button
          type="button"
          className={`${styles.filterButton} ${filter === "disputing" ? styles.filterButtonActive : ""}`}
          onClick={() => setFilter("disputing")}
          aria-pressed={filter === "disputing"}
        >
          Disputing (
          {
            topic.arguments.filter(
              (a) => getArgumentRelationship(a) === "disputing",
            ).length
          }
          )
        </button>
        <button
          type="button"
          className={`${styles.filterButton} ${filter === "contextualizing" ? styles.filterButtonActive : ""}`}
          onClick={() => setFilter("contextualizing")}
          aria-pressed={filter === "contextualizing"}
        >
          Contextual (
          {
            topic.arguments.filter(
              (a) => getArgumentRelationship(a) === "contextualizing",
            ).length
          }
          )
        </button>
      </nav>

      {/* Narrative Order Arguments List */}
      <section className={styles.argumentsList} aria-label="Debate Arguments">
        {orderedArguments.map((arg) => {
          const rel = getArgumentRelationship(arg);
          const citations = resolveArgumentCitations(topic, arg);
          const isExpanded = !!expandedCitations[arg.id];

          return (
            <div
              key={arg.id}
              className={`${styles.argumentCard} ${relationshipClass(rel)}`}
              data-relationship={rel}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.argTitle}>{arg.title}</h3>
                <div className={styles.badges}>
                  <span className={`${styles.badge} ${badgeClass(rel)}`}>
                    {rel}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeStrength}`}>
                    {arg.strength}
                  </span>
                </div>
              </div>

              <p className={styles.argBody}>{arg.body}</p>

              {citations.length > 0 && (
                <div className={styles.citationsSection}>
                  <button
                    type="button"
                    className={styles.citationsToggle}
                    onClick={() => toggleCitation(arg.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`citations-${arg.id}`}
                  >
                    <span>
                      {isExpanded ? "▼ Hide Sources" : "▶ View Sources"} (
                      {citations.length})
                    </span>
                  </button>

                  {isExpanded && (
                    <ul
                      id={`citations-${arg.id}`}
                      className={styles.citationsList}
                    >
                      {citations.map((cit) => (
                        <li key={cit.id} className={styles.citationItem}>
                          <strong>
                            {cit.publisher} ({cit.year}):
                          </strong>{" "}
                          {cit.url ? (
                            <a
                              href={cit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.citationLink}
                            >
                              {cit.title}
                            </a>
                          ) : (
                            <span>{cit.title}</span>
                          )}
                          {cit.locator && <em> — {cit.locator}</em>}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Missing Evidence Transparency Callout */}
      {topic.missingEvidenceNote && (
        <aside
          className={styles.missingEvidenceCallout}
          aria-label="Missing Evidence Limitation"
        >
          <h4 className={styles.missingEvidenceTitle}>
            Evidence Boundary & Gaps
          </h4>
          <p>{topic.missingEvidenceNote}</p>
        </aside>
      )}
    </article>
  );
}
