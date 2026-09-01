import {
  canPrepublishObservation,
  type PublicationContext,
} from "@/lib/evidence/governance";
import type { Observation } from "@/lib/evidence/schemas";

export type ReviewRole = "scientific" | "editorial" | "licensing";

export interface ReviewRecord {
  readonly datasetVersionId: string;
  readonly id: string;
  readonly reviewerId: string;
  readonly role: ReviewRole;
  readonly status: "approved";
}

export interface PublicationCandidate {
  readonly context: PublicationContext;
  readonly observation: Observation;
}

export interface PublicationStore {
  inTransaction<T>(
    operation: (store: PublicationStore) => Promise<T>,
  ): Promise<T>;
  recordReview(input: {
    readonly datasetVersionId: string;
    readonly reviewerId: string;
    readonly role: ReviewRole;
  }): Promise<ReviewRecord>;
  listReviews(datasetVersionId: string): Promise<readonly ReviewRecord[]>;
  getPublicationCandidates(
    datasetVersionId: string,
  ): Promise<readonly PublicationCandidate[]>;
  publishDraftVersion(datasetVersionId: string): Promise<void>;
  recordLifecycleEvent(
    datasetVersionId: string,
    type: "review" | "publication",
  ): Promise<void>;
  /** Calls private.activate_metric_release through a server/direct-DB connection. */
  activateMetricRelease(input: {
    readonly datasetVersionId: string;
    readonly metricId: string;
    readonly reason: string;
  }): Promise<ReleaseActivationResult>;
}

export interface ReviewDatasetVersionInput {
  readonly datasetVersionId: string;
  readonly reviewerId: string;
  readonly role: ReviewRole;
}

export interface PublishDatasetVersionInput {
  readonly datasetVersionId: string;
}

export interface PublicationResult {
  readonly datasetVersionId: string;
  readonly observationCount: number;
  readonly status: "published";
}

export interface RollbackMetricReleaseInput {
  readonly datasetVersionId: string;
  readonly metricId: string;
  readonly reason: string;
}

export interface ReleaseActivationResult {
  readonly datasetVersionId: string;
  readonly metricId: string;
  readonly status: "activated";
}

export async function reviewDatasetVersion(
  input: ReviewDatasetVersionInput,
  dependencies: { readonly store: PublicationStore },
): Promise<ReviewRecord> {
  assertNonEmpty(input.datasetVersionId, "dataset version");
  assertNonEmpty(input.reviewerId, "reviewer");
  return dependencies.store.inTransaction(async (store) => {
    const review = await store.recordReview(input);
    await store.recordLifecycleEvent(input.datasetVersionId, "review");
    return review;
  });
}

export async function publishDatasetVersion(
  input: PublishDatasetVersionInput,
  dependencies: { readonly store: PublicationStore },
): Promise<PublicationResult> {
  assertNonEmpty(input.datasetVersionId, "dataset version");
  return dependencies.store.inTransaction(async (store) => {
    const reviews = await store.listReviews(input.datasetVersionId);
    assertRequiredReviews(reviews);

    const candidates = await store.getPublicationCandidates(
      input.datasetVersionId,
    );
    if (!candidates.length) {
      throw new Error(
        "A dataset version requires at least one eligible observation before publication.",
      );
    }
    for (const candidate of candidates) {
      const eligibility = canPrepublishObservation(
        candidate.observation,
        candidate.context,
      );
      if (!eligibility.eligible) {
        throw new Error(
          `Observation ${candidate.observation.id} is not eligible for publication: ${eligibility.reasons.join(", ")}.`,
        );
      }
    }

    await store.publishDraftVersion(input.datasetVersionId);
    await store.recordLifecycleEvent(input.datasetVersionId, "publication");
    return {
      datasetVersionId: input.datasetVersionId,
      observationCount: candidates.length,
      status: "published",
    };
  });
}

export async function rollbackMetricRelease(
  input: RollbackMetricReleaseInput,
  dependencies: { readonly store: PublicationStore },
): Promise<ReleaseActivationResult> {
  assertNonEmpty(input.datasetVersionId, "dataset version");
  assertNonEmpty(input.metricId, "metric");
  assertNonEmpty(input.reason, "rollback reason");
  return dependencies.store.inTransaction((store) =>
    store.activateMetricRelease(input),
  );
}

function assertRequiredReviews(reviews: readonly ReviewRecord[]): void {
  const approvedRoles = new Set(
    reviews
      .filter((review) => review.status === "approved")
      .map((review) => review.role),
  );
  for (const role of ["scientific", "editorial", "licensing"] as const) {
    if (!approvedRoles.has(role)) {
      throw new Error(`Publication requires an approved ${role} review.`);
    }
  }
}

function assertNonEmpty(value: string, label: string): void {
  if (!value.trim()) throw new Error(`${label} is required.`);
}
