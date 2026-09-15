"use client";

import React, { useState } from "react";
import type {
  AskResponse,
  AskExplanationLevel,
  AskQuery,
} from "../../lib/ask/schemas";
import { askAtom, listSupportedTopics } from "../../lib/ask/retrieval-engine";
import styles from "./AskAtom.module.css";

let querySequence = 0;
function createClientQuery(
  prompt: string,
  level: AskExplanationLevel,
): AskQuery {
  querySequence += 1;
  return {
    id: `q-client-${querySequence}`,
    prompt: prompt.trim(),
    timestamp: new Date().toISOString(),
    level,
  };
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function AskAtom({ initialQuery = "" }: { initialQuery?: string }) {
  const mounted = useIsClient();
  const [prompt, setPrompt] = useState(initialQuery);
  const [level, setLevel] = useState<AskExplanationLevel>("standard");
  const [response, setResponse] = useState<AskResponse | null>(() => {
    if (initialQuery.trim()) {
      try {
        return askAtom({
          id: "q-initial",
          prompt: initialQuery.trim(),
          timestamp: "2025-01-01T00:00:00.000Z",
          level: "standard",
        });
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (
    e?: React.FormEvent,
    customPrompt?: string,
    customLevel?: AskExplanationLevel,
  ) => {
    if (e) e.preventDefault();
    const queryPrompt = customPrompt !== undefined ? customPrompt : prompt;
    const queryLevel = customLevel !== undefined ? customLevel : level;

    if (!queryPrompt.trim()) return;

    setIsSubmitting(true);
    try {
      const query = createClientQuery(queryPrompt, queryLevel);
      const res = askAtom(query);
      setResponse(res);
    } catch {
      setResponse(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopicClick = (topicText: string) => {
    setPrompt(topicText);
    handleSubmit(undefined, topicText, level);
  };

  const handleLevelChange = (newLevel: AskExplanationLevel) => {
    setLevel(newLevel);
    if (response && prompt.trim()) {
      handleSubmit(undefined, prompt, newLevel);
    }
  };

  const suggestedTopics = listSupportedTopics();

  return (
    <article
      className={styles.container}
      aria-labelledby="ask-heading"
      data-hydrated={mounted}
    >
      <header className={styles.header}>
        <span className={styles.badge}>Evidence Engine · Grounded Q&A</span>
        <h1 id="ask-heading" className={styles.title}>
          Ask ATOM
        </h1>
        <p className={styles.lead}>
          Direct questions answered exclusively from peer-reviewed scientific
          literature, IPCC assessments, and official nuclear data. ATOM abstains
          from ungrounded speculation or unverified claims.
        </p>

        {/* Search Input Form */}
        <div className={styles.searchCard}>
          <form onSubmit={handleSubmit} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about emissions, radiation, waste storage, safety, or India's program..."
                className={styles.input}
                aria-label="Ask a question about nuclear energy"
              />
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Searching..." : "Ask"}
              </button>
            </div>

            <div className={styles.controlsRow}>
              <div className={styles.levelGroup}>
                <span className={styles.levelLabel}>Explanation Level:</span>
                <button
                  type="button"
                  onClick={() => handleLevelChange("explorer")}
                  className={`${styles.levelBtn} ${level === "explorer" ? styles.levelBtnActive : ""}`}
                >
                  Simple
                </button>
                <button
                  type="button"
                  onClick={() => handleLevelChange("standard")}
                  className={`${styles.levelBtn} ${level === "standard" ? styles.levelBtnActive : ""}`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => handleLevelChange("deep-dive")}
                  className={`${styles.levelBtn} ${level === "deep-dive" ? styles.levelBtnActive : ""}`}
                >
                  Technical
                </button>
              </div>
            </div>

            <div className={styles.quickQuestions}>
              <span className={styles.quickLabel}>Suggested questions:</span>
              {suggestedTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicClick(topic)}
                  className={styles.chipBtn}
                >
                  {topic}
                </button>
              ))}
            </div>
          </form>
        </div>
      </header>

      {/* Answer & Results Section */}
      <section
        className={styles.resultSection}
        aria-live="polite"
        role="region"
        aria-label="Answer & Evidence"
      >
        {response ? (
          response.state === "answered" ? (
            <div className={styles.answerBox}>
              <div className={styles.answerHeader}>
                <h2 className={styles.answerTitle}>
                  Synthesized Evidence Answer
                </h2>
                <span className={styles.answerBadge}>
                  Level: {response.explanationLevel.toUpperCase()}
                </span>
              </div>

              <div className={styles.answerProse}>
                <p>{response.answerText}</p>
              </div>

              {response.limitations && response.limitations.length > 0 && (
                <div className={styles.caveatsBox}>
                  <div className={styles.caveatsTitle}>
                    Scientific Caveats & Scope Boundaries
                  </div>
                  <ul>
                    {response.limitations.map((limitation, i) => (
                      <li key={i}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {response.citations.length > 0 && (
                <div className={styles.citationsSection}>
                  <h3 className={styles.citationsTitle}>
                    Resolved Citations ({response.citations.length})
                  </h3>
                  <div className={styles.citationsList}>
                    {response.citations.map((cite) => (
                      <div key={cite.id} className={styles.citationCard}>
                        {cite.url ? (
                          <a
                            href={cite.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={styles.citationTitle}
                          >
                            {cite.title}
                          </a>
                        ) : (
                          <span className={styles.citationTitle}>
                            {cite.title}
                          </span>
                        )}
                        <div className={styles.citationMeta}>
                          {cite.publisher} {cite.year ? `(${cite.year})` : ""}{" "}
                          {cite.asOf ? `· Updated ${cite.asOf}` : ""}
                        </div>
                        <p className={styles.citationSummary}>{cite.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.abstentionBox}>
              <h2 className={styles.abstentionTitle}>
                Evidence Boundary Abstention
              </h2>
              <p className={styles.abstentionText}>{response.answerText}</p>
              {response.limitations && response.limitations.length > 0 && (
                <ul>
                  {response.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔬</div>
            <h2 className={styles.emptyTitle}>Peer-Reviewed Evidence Q&A</h2>
            <p className={styles.emptyDesc}>
              Ask a question above or choose a suggested topic to explore
              peer-reviewed energy science. Every claim includes full
              publication citations and explicit boundary assumptions.
            </p>
          </div>
        )}
      </section>
    </article>
  );
}
