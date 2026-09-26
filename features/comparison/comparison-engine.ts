import { assessComparability } from "@/lib/evidence/comparability";
import { METRICS } from "@/lib/evidence/metrics";
import type { EvidenceRepository } from "@/lib/evidence/repository";
import { selectRepresentative } from "@/lib/evidence/representative";
import type { NumericObservation, Observation } from "@/lib/evidence/schemas";
import { normalizeObservation } from "@/lib/evidence/units";
import type { ComparisonState } from "./comparison-types";
import type {
  AvailableComparisonEntry,
  ComparisonEntry,
  ComparisonResult,
  ComparisonStatus,
} from "./comparison-result";

export async function getComparisonResult(
  state: ComparisonState,
  repository: EvidenceRepository | null,
): Promise<ComparisonResult> {
  if (!repository) {
    return {
      state,
      status: "unavailable",
      entries: state.sources.map((technologyId) => ({
        kind: "missing",
        technologyId,
        message: "Evidence repository is currently unavailable.",
      })),
      effectiveGeographyId: null,
      datasetVersionIds: [],
      warnings: ["Evidence repository is currently unavailable."],
    };
  }

  try {
    // 1. Resolve Metric
    const metric = await repository.getMetricDefinition(state.metric);
    if (!metric) {
      const knownMetric = METRICS.find((m) => m.id === state.metric);
      const message = knownMetric
        ? `Metric '${state.metric}' is known but not yet released in the catalog.`
        : `Unknown metric '${state.metric}'.`;

      return {
        state,
        status: "unavailable",
        entries: state.sources.map((technologyId) => ({
          kind: "missing",
          technologyId,
          message,
        })),
        effectiveGeographyId: null,
        datasetVersionIds: [],
        warnings: [message],
      };
    }

    // 2. Check Metric Releases
    const releases = await repository.listMetricReleases();
    const release = releases.find((r) => r.metricId === state.metric);
    if (
      !release ||
      !release.featureEnabled ||
      release.availabilityStatus === "unavailable"
    ) {
      return {
        state,
        status: "unavailable",
        entries: state.sources.map((technologyId) => ({
          kind: "missing",
          technologyId,
          message: `Metric '${state.metric}' is not currently enabled for comparison.`,
        })),
        effectiveGeographyId: null,
        datasetVersionIds: [],
        warnings: [
          `Metric '${state.metric}' release is disabled or unavailable.`,
        ],
      };
    }

    // 3. Resolve Technologies
    const allTechnologies = await repository.listTechnologies();
    const techMap = new Map(allTechnologies.map((t) => [t.id, t]));

    // 4. Geography Filtering & Global Fallback
    let effectiveGeographyId: string | null = null;
    const warnings: string[] = [];

    let observations: readonly Observation[] =
      await repository.getPublishedObservations({
        metricId: state.metric,
        geographyIds: [state.region],
        technologyIds: state.sources,
      });

    if (observations.length > 0) {
      effectiveGeographyId = state.region;
    } else {
      const allowsGlobalFallback =
        metric.geographySupport.includes("global") &&
        state.region.toLowerCase() !== "global";

      if (allowsGlobalFallback) {
        const globalObservations = await repository.getPublishedObservations({
          metricId: state.metric,
          geographyIds: ["global"],
          technologyIds: state.sources,
        });

        if (globalObservations.length > 0) {
          observations = globalObservations;
          effectiveGeographyId = "global";
          warnings.push(
            `Requested geography '${state.region}' has no published data for this metric. Showing Global estimates instead.`,
          );
        }
      }
    }

    if (state.sources.length === 0) {
      return {
        state,
        status: "empty",
        entries: [],
        effectiveGeographyId,
        datasetVersionIds: [],
        warnings,
      };
    }

    // 5. Process entries per requested source
    const entries: ComparisonEntry[] = [];
    const datasetVersionIds = new Set<string>();

    for (const technologyId of state.sources) {
      const techName = techMap.get(technologyId)?.name ?? technologyId;
      const techObservations = observations.filter(
        (obs) => obs.technologyId === technologyId,
      );

      if (techObservations.length === 0) {
        entries.push({
          kind: "missing",
          technologyId,
          message: `No published observation found for technology '${techName}'.`,
        });
        continue;
      }

      // Check licensing restrictions for raw mode
      if (state.mode === "raw") {
        const hasRestrictedRaw = techObservations.some(
          (obs) =>
            obs.rawAccess !== "permitted" ||
            obs.license.redistribution !== "allowed",
        );
        if (hasRestrictedRaw) {
          entries.push({
            kind: "restricted",
            technologyId,
            message: `Raw observation access is restricted under licensing terms for '${techName}'.`,
          });
          continue;
        }
      }

      // Check system boundary comparability
      if (techObservations.length > 1) {
        const assessment = assessComparability(techObservations);
        const blocker = assessment.issues.find(
          (issue) =>
            issue.severity === "blocker" && issue.code !== "convertible-units",
        );
        if (blocker) {
          warnings.push(
            `Incompatible boundaries for '${techName}': ${blocker.message}`,
          );
          entries.push({
            kind: "incompatible",
            technologyId,
            message: `Incompatible observation boundaries: ${blocker.message}`,
          });
          continue;
        }

        for (const issue of assessment.issues) {
          if (
            issue.severity === "warning" &&
            issue.code !== "convertible-units"
          ) {
            warnings.push(`${techName}: ${issue.message}`);
          }
        }
      }

      // Deterministic sort by observation ID so shuffled retrieval order yields identical results
      const sortedObservations = [...techObservations].sort((left, right) =>
        left.id.localeCompare(right.id),
      );

      datasetVersionIds.add(release.activeDatasetVersionId);

      if (metric.valueKind === "categorical") {
        const obs = sortedObservations[0];
        if (obs.kind !== "categorical") {
          entries.push({
            kind: "incompatible",
            technologyId,
            message: "Expected categorical observation for categorical metric.",
          });
          continue;
        }

        const availableEntry: AvailableComparisonEntry = {
          kind: "available",
          technologyId,
          observationIds: sortedObservations.map((o) => o.id),
          scientificLabel: `${techName} (categorical)`,
          displayLabel: techName,
          evidenceId: obs.id,
          valueKind: "categorical",
          value: obs.value,
          numericValue: null,
          unit: "categorical",
          range: null,
          source: obs.sourceId ? { name: obs.sourceId, url: null } : null,
          verifiedAt: obs.lastVerifiedAt,
          datasetVersionId: release.activeDatasetVersionId,
          methodology: obs.methodology,
          systemBoundary: obs.systemBoundary,
          uncertainty: obs.uncertainty,
        };
        entries.push(availableEntry);
      } else {
        // Numeric Metric
        const targetUnit = metric.canonicalUnit;
        const normalizedObservations = sortedObservations.map((obs) => {
          if (obs.kind === "numeric") {
            return normalizeObservation(obs, targetUnit);
          }
          return obs;
        });

        if (normalizedObservations.some((obs) => obs.kind !== "numeric")) {
          entries.push({
            kind: "incompatible",
            technologyId,
            message: "Non-numeric observation found for numeric metric.",
          });
          continue;
        }

        const numericList =
          normalizedObservations as readonly NumericObservation[];

        if (numericList.length === 1) {
          const obs = numericList[0];
          let value: number;
          let numericVal: number;
          let range: AvailableComparisonEntry["range"] = null;

          if (obs.valueSemantics === "point") {
            value = obs.value;
            numericVal = obs.value;
          } else {
            value = obs.range.representative;
            numericVal = obs.range.representative;
            range = {
              min: obs.range.lower,
              max: obs.range.upper,
              semantics:
                obs.range.kind === "min-max"
                  ? "min-max"
                  : "confidence-interval",
            };
          }

          const availableEntry: AvailableComparisonEntry = {
            kind: "available",
            technologyId,
            observationIds: [obs.id],
            scientificLabel: `${techName} (${targetUnit})`,
            displayLabel: techName,
            evidenceId: obs.id,
            valueKind: "numeric",
            value,
            numericValue: numericVal,
            unit: targetUnit,
            range,
            source: obs.sourceId ? { name: obs.sourceId, url: null } : null,
            verifiedAt: obs.lastVerifiedAt,
            datasetVersionId: release.activeDatasetVersionId,
            methodology: obs.methodology,
            systemBoundary: obs.systemBoundary,
            uncertainty: obs.uncertainty,
          };
          entries.push(availableEntry);
        } else {
          // Multiple observations: select representative
          const explicitKind = numericList.find(
            (o) =>
              o.representativeKind === "central-estimate" ||
              o.representativeKind === "regulator-value" ||
              o.representativeKind === "model-default",
          )?.representativeKind as
            | "central-estimate"
            | "regulator-value"
            | "model-default"
            | undefined;

          const repResult = explicitKind
            ? selectRepresentative(numericList, explicitKind)
            : selectRepresentative(numericList, "mean");

          if (!repResult.ok) {
            entries.push({
              kind: "incompatible",
              technologyId,
              message: repResult.message,
            });
            continue;
          }

          // Preserve range across observations if range records exist
          let range: AvailableComparisonEntry["range"] = null;
          const rangeRecords = numericList.filter(
            (
              o,
            ): o is Extract<NumericObservation, { valueSemantics: "range" }> =>
              o.valueSemantics === "range",
          );
          if (rangeRecords.length > 0) {
            const min = Math.min(...rangeRecords.map((o) => o.range.lower));
            const max = Math.max(...rangeRecords.map((o) => o.range.upper));
            range = {
              min,
              max,
              semantics: "min-max",
            };
          }

          const primaryObs = numericList[0];
          const availableEntry: AvailableComparisonEntry = {
            kind: "available",
            technologyId,
            observationIds: repResult.observationIds,
            scientificLabel: `${techName} (${targetUnit})`,
            displayLabel: techName,
            evidenceId: primaryObs.id,
            valueKind: "numeric",
            value: repResult.value,
            numericValue: repResult.value,
            unit: targetUnit,
            range,
            source: primaryObs.sourceId
              ? { name: primaryObs.sourceId, url: null }
              : null,
            verifiedAt: primaryObs.lastVerifiedAt,
            datasetVersionId: release.activeDatasetVersionId,
            methodology: primaryObs.methodology,
            systemBoundary: primaryObs.systemBoundary,
            uncertainty: primaryObs.uncertainty,
          };
          entries.push(availableEntry);
        }
      }
    }

    // 6. Determine overall status
    const availableCount = entries.filter((e) => e.kind === "available").length;
    let status: ComparisonStatus = "ready";

    if (availableCount === 0) {
      status = "empty";
    } else if (availableCount < entries.length) {
      status = "partial";
    }

    return {
      state,
      status,
      entries,
      effectiveGeographyId,
      datasetVersionIds: [...datasetVersionIds].sort(),
      warnings,
    };
  } catch {
    return {
      state,
      status: "error",
      entries: state.sources.map((technologyId) => ({
        kind: "missing",
        technologyId,
        message: "An unexpected error occurred while loading comparison data.",
      })),
      effectiveGeographyId: null,
      datasetVersionIds: [],
      warnings: ["Failed to retrieve comparison evidence from repository."],
    };
  }
}
