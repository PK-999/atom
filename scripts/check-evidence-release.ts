import { execFileSync } from "node:child_process";
import {
  PUBLISHED_EVIDENCE_SNAPSHOT,
  ReleaseRecordsSchema,
  EvidenceCatalogSchema,
} from "../lib/evidence/published-evidence";
import { LocalEvidenceRepository } from "../lib/evidence/local-repository";
import { appendEvidenceSnapshot } from "../lib/evidence/release-provenance";

const snapshot = PUBLISHED_EVIDENCE_SNAPSHOT;
const base =
  process.env.EVIDENCE_BASE_REF || process.env.VERCEL_GIT_PREVIOUS_SHA;
const path = "data/evidence/release-records.json";
if (base && !/^0+$/.test(base)) {
  // Git arguments are passed directly; do not interpolate a ref into a shell command.
  execFileSync("git", ["rev-parse", "--verify", `${base}^{commit}`], {
    stdio: "pipe",
  });
  const exists = execFileSync(
    "git",
    ["ls-tree", "--name-only", base, "--", path],
    { encoding: "utf8" },
  ).trim();
  if (exists) {
    const previous = ReleaseRecordsSchema.parse(
      JSON.parse(
        execFileSync("git", ["show", `${base}:${path}`], { encoding: "utf8" }),
      ),
    );
    const previousCatalog = EvidenceCatalogSchema.parse(
      JSON.parse(
        execFileSync("git", ["show", `${base}:data/evidence/catalog.json`], {
          encoding: "utf8",
        }),
      ),
    );
    appendEvidenceSnapshot({ ...previousCatalog, ...previous }, snapshot);
    console.log("Evidence history preserved against", base);
  } else
    console.log(
      "Baseline predates the reviewed-record ledger; no approved versions to migrate.",
    );
} else
  console.log(
    "Checking current release records; history comparison uses EVIDENCE_BASE_REF or VERCEL_GIT_PREVIOUS_SHA.",
  );

const repository = new LocalEvidenceRepository(snapshot);
const configured = snapshot.metricReleases.filter(
  (r) => r.featureEnabled && r.availabilityStatus === "supported",
);
const active = await repository.listMetricReleases();
if (configured.length !== active.length)
  throw new Error(
    "A configured release lacks exact-version review provenance.",
  );
for (const release of active) {
  const observations = await repository.getPublishedObservations({
    metricId: release.metricId,
  });
  const declared = snapshot.observations.filter(
    (o) =>
      snapshot.observationDatasetVersionIds[o.id] ===
        release.activeDatasetVersionId &&
      o.metricId === release.metricId &&
      o.publicationStatus === "published" &&
      release.technologyIds.includes(o.technologyId) &&
      release.geographyIds.includes(o.geographyId),
  );
  if (!observations.length || observations.length !== declared.length)
    throw new Error(
      `Release ${release.metricId} includes observations that cannot be served publicly.`,
    );
}
console.log(
  `Evidence release check passed: ${active.length} active numerical releases. Metadata validation is not scientific approval.`,
);
