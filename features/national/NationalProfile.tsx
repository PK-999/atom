import React from "react";
import type { NationalProfile } from "../../lib/national/schemas";
import styles from "./NationalProfile.module.css";

export function NationalProfile({ profile }: { profile: NationalProfile }) {
  const { mix, threeStageProgram, fleetStatus, scenarios2050, citations } =
    profile;

  return (
    <article className={styles.container} aria-labelledby="profile-heading">
      <header className={styles.header}>
        <span className={styles.countryBadge}>
          National Profile · {profile.countryCode}
        </span>
        <h1 id="profile-heading" className={styles.title}>
          {profile.countryName} Energy & Nuclear Profile
        </h1>
        <p className={styles.overview}>{profile.overview}</p>
        <div className={styles.metaBar}>
          <span>
            <strong>Data Period:</strong> {mix.reportingPeriod}
          </span>
          <span>
            <strong>Primary Source:</strong> {mix.source.publisher}
          </span>
          <span>
            <strong>Updated:</strong> {mix.source.asOf}
          </span>
        </div>
      </header>

      {/* Section 1: Domestic Context & Policy */}
      <section className={styles.section} aria-labelledby="policy-heading">
        <h2 id="policy-heading" className={styles.sectionTitle}>
          Strategic Context & Resource Endowment
        </h2>
        <p className={styles.sectionLead}>{profile.domesticPolicy}</p>
      </section>

      {/* Section 2: Fleet Status */}
      <section className={styles.section} aria-labelledby="fleet-heading">
        <h2 id="fleet-heading" className={styles.sectionTitle}>
          Commercial Reactor Fleet Status
        </h2>
        <p className={styles.sectionLead}>{profile.reactorFleetSummary}</p>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {fleetStatus.operatingReactors}
            </div>
            <div className={styles.statLabel}>Operating Reactors</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {fleetStatus.operatingCapacityMw.toLocaleString()} MWe
            </div>
            <div className={styles.statLabel}>Operating Capacity</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {fleetStatus.underConstructionReactors}
            </div>
            <div className={styles.statLabel}>Under Construction</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {fleetStatus.underConstructionCapacityMw.toLocaleString()} MWe
            </div>
            <div className={styles.statLabel}>Capacity Under Build</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>
              {fleetStatus.plannedSanctionedReactors}
            </div>
            <div className={styles.statLabel}>Sanctioned Fleet PHWRs</div>
          </div>
        </div>
      </section>

      {/* Section 3: Electricity Mix - Capacity vs Generation */}
      <section className={styles.section} aria-labelledby="mix-heading">
        <h2 id="mix-heading" className={styles.sectionTitle}>
          Electricity Mix: Capacity vs. Generation
        </h2>
        <div
          className={styles.insightBox}
          role="region"
          aria-label="Capacity versus generation insight"
        >
          <div className={styles.insightTitle}>
            <span>⚡</span>
            <span>
              Energy Literacy Insight: Installed Capacity ≠ Actual Generation
            </span>
          </div>
          <p>
            Installed capacity (GW) measures potential peak power rating, while
            actual generation (TWh) measures electricity produced over the year.
            Technologies operate at vastly different capacity factors. For
            example, nuclear comprises{" "}
            <strong>
              {
                mix.entries.find((e) => e.source === "Nuclear")
                  ?.capacitySharePercent
              }
              %
            </strong>{" "}
            of India&apos;s installed capacity but generates{" "}
            <strong>
              {
                mix.entries.find((e) => e.source === "Nuclear")
                  ?.generationSharePercent
              }
              %
            </strong>{" "}
            of its electricity due to continuous base-load operation (~75–85%
            capacity factor). In contrast, solar PV represents{" "}
            <strong>
              {
                mix.entries.find((e) => e.source.includes("Solar"))
                  ?.capacitySharePercent
              }
              %
            </strong>{" "}
            of nameplate capacity but delivers{" "}
            <strong>
              {
                mix.entries.find((e) => e.source.includes("Solar"))
                  ?.generationSharePercent
              }
              %
            </strong>{" "}
            of annual generation (~18–20% capacity factor).
          </p>
        </div>

        <div className={styles.mixTableCard}>
          <table
            className={styles.table}
            aria-label="India Electricity Capacity and Generation Breakdown"
          >
            <thead>
              <tr>
                <th scope="col">Energy Source</th>
                <th scope="col">Capacity (GW)</th>
                <th scope="col">Capacity Share (%)</th>
                <th scope="col">Generation (TWh)</th>
                <th scope="col">Generation Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {mix.entries.map((entry) => (
                <tr key={entry.source}>
                  <td>
                    <span
                      className={styles.sourcePill}
                      style={{ backgroundColor: entry.color || "#64748b" }}
                      aria-hidden="true"
                    />
                    <strong>{entry.source}</strong>
                  </td>
                  <td>{entry.capacityGw.toFixed(1)}</td>
                  <td>{entry.capacitySharePercent.toFixed(2)}%</td>
                  <td>{entry.generationTwh.toFixed(1)}</td>
                  <td>{entry.generationSharePercent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <strong>Total Grid</strong>
                </td>
                <td>
                  <strong>{mix.totalCapacityGw.toFixed(1)}</strong>
                </td>
                <td>
                  <strong>100.00%</strong>
                </td>
                <td>
                  <strong>{mix.totalGenerationTwh.toFixed(1)}</strong>
                </td>
                <td>
                  <strong>100.00%</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Section 4: Three-Stage Fuel Cycle */}
      <section className={styles.section} aria-labelledby="threestage-heading">
        <h2 id="threestage-heading" className={styles.sectionTitle}>
          Bhabha Three-Stage Nuclear Programme
        </h2>
        <p className={styles.sectionLead}>
          Conceived by Dr. Homi J. Bhabha in the 1950s, this closed fuel cycle
          roadmap is designed to transition India from scarce domestic uranium
          to abundant domestic thorium reserves (&gt;300,000 tonnes of
          monazite).
        </p>

        <div className={styles.stagesGrid}>
          {threeStageProgram.map((stage) => {
            const cardClass =
              stage.stageNumber === 1
                ? styles.stage1Card
                : stage.stageNumber === 2
                  ? styles.stage2Card
                  : styles.stage3Card;

            return (
              <div
                key={stage.stageNumber}
                className={`${styles.stageCard} ${cardClass}`}
              >
                <div>
                  <div className={styles.stageNumber}>
                    Stage 0{stage.stageNumber}
                  </div>
                  <h3 className={styles.stageName}>{stage.name}</h3>
                  <div className={styles.stageStatus}>{stage.status}</div>
                  <p className={styles.stageProse}>{stage.description}</p>
                  <div className={styles.fuelFlowBox}>
                    <div>
                      <strong>Reactor Tech:</strong> {stage.reactorTech}
                    </div>
                    <div>
                      <strong>Input Fuel:</strong> {stage.inputFuel}
                    </div>
                    <div>
                      <strong>Output / Breeding:</strong> {stage.outputFuel}
                    </div>
                  </div>
                </div>
                <div className={styles.milestoneBox}>
                  <strong>Key Milestone:</strong> {stage.keyMilestone}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 5: Future Scenarios */}
      <section className={styles.section} aria-labelledby="scenarios-heading">
        <h2 id="scenarios-heading" className={styles.sectionTitle}>
          Long-Term Capacity Targets & Net Zero Scenarios
        </h2>
        <p className={styles.sectionLead}>
          Projections and official targets established by the Department of
          Atomic Energy (DAE) and Bhabha Atomic Research Centre (BARC).
        </p>

        {scenarios2050.map((scenario) => (
          <div key={scenario.targetYear} className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>
              <h3 className={styles.scenarioTitle}>
                {scenario.targetYear} Horizon: {scenario.targetCapacityGw} GW
                Nuclear Target
              </h3>
              <span className={styles.scenarioBadge}>
                ~{scenario.projectedGenerationSharePercent}% Projected
                Generation
              </span>
            </div>
            <p className={styles.scenarioBody}>
              {scenario.basisAndAssumptions}
            </p>
            <div className={styles.scenarioSource}>
              <strong>Source / Study:</strong> {scenario.source}
            </div>
          </div>
        ))}
      </section>

      {/* Section 6: Citations and Verification */}
      <footer className={styles.footer} aria-labelledby="citations-heading">
        <h3 id="citations-heading">Primary Official Sources</h3>
        <ul>
          {citations.map((cite) => (
            <li key={cite.id}>
              <a
                href={cite.url}
                target="_blank"
                rel="noreferrer noopener"
                className={styles.citationLink}
              >
                {cite.title}
              </a>{" "}
              — {cite.publisher} ({cite.asOf})
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
