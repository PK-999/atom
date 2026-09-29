import Link from "next/link";

import { EXPERIMENTS, toExperimentHref } from "@/lib/navigation/catalog";

import styles from "./ExploreHub.module.css";

export function ExploreHub() {
  return (
    <div className={styles.hubContainer}>
      <header className={styles.hubHeader}>
        <div className={styles.headerText}>
          <span className={styles.eyebrow}>The ATOM playground</span>
          <h1 className={styles.hubTitle}>Play with the science</h1>
          <p className={styles.hubSubtitle}>
            Six small experiments take you from a nucleus to an electricity
            system. Each one gives you a prediction, a model to inspect, and a
            next question to carry forward.
          </p>
        </div>
      </header>

      <section
        className={styles.recommendedTrack}
        aria-labelledby="start-heading"
      >
        <div className={styles.trackInfo}>
          <h2 id="start-heading">Start with a question. Try an experiment.</h2>
          <p>
            Begin with one fission, then follow the heat through a reactor and
            out to the grid.
          </p>
        </div>
        <Link href={toExperimentHref("fission")} className={styles.trackCta}>
          <span>Start with fission</span>
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section
        className={styles.sectionBlock}
        aria-labelledby="experiments-heading"
      >
        <div className={styles.sectionHeading}>
          <h2 id="experiments-heading">Choose an experiment</h2>
          <span>{EXPERIMENTS.length} playable exhibits</span>
        </div>
        <div className={styles.grid3}>
          {EXPERIMENTS.map((experiment) => (
            <Link
              href={toExperimentHref(experiment.id)}
              className={styles.hubCard}
              key={experiment.id}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon} aria-hidden="true">
                  {experiment.icon}
                </span>
                <span className={styles.cardBadge}>{experiment.kicker}</span>
              </div>
              <h3 className={styles.cardTitle}>{experiment.title}</h3>
              <p className={styles.cardDesc}>{experiment.description}</p>
              <div className={styles.cardFooter}>
                <span>{experiment.outcome}</span>
                <span aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className={styles.sectionBlock}
        aria-labelledby="continue-heading"
      >
        <div className={styles.sectionHeading}>
          <h2 id="continue-heading">Continue with the evidence</h2>
          <span>Keep your question in view</span>
        </div>
        <div className={styles.grid3}>
          <Link href="/learn" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ◎
              </span>
              <span className={styles.cardBadge}>Learn</span>
            </div>
            <h3 className={styles.cardTitle}>Build the full picture</h3>
            <p className={styles.cardDesc}>
              Follow the guided lessons from energy and atoms to safety, waste,
              and electricity systems.
            </p>
            <div className={styles.cardFooter}>
              <span>Open the learning path</span>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
          <Link href="/myths" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ◇
              </span>
              <span className={styles.cardBadge}>Claims</span>
            </div>
            <h3 className={styles.cardTitle}>Test a claim</h3>
            <p className={styles.cardDesc}>
              Make a prediction, reveal the strongest available evidence, and
              read the limits before deciding what you think.
            </p>
            <div className={styles.cardFooter}>
              <span>Open myth investigations</span>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
          <Link href="/compare" className={styles.hubCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon} aria-hidden="true">
                ▤
              </span>
              <span className={styles.cardBadge}>Evidence</span>
            </div>
            <h3 className={styles.cardTitle}>Compare what is known</h3>
            <p className={styles.cardDesc}>
              Inspect units, ranges, boundaries, and missing observations in the
              Comparison Lab.
            </p>
            <div className={styles.cardFooter}>
              <span>Open the Comparison Lab</span>
              <span aria-hidden="true">↗</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
