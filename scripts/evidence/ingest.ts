import type { IngestionManifest } from "@/data/schemas/ingestion-manifest";
import type {
  IngestionInput,
  IngestionResult,
} from "@/data/ingestion/pipeline";
import type {
  PublicationResult,
  ReleaseActivationResult,
  ReviewDatasetVersionInput,
  ReviewRecord,
  RollbackMetricReleaseInput,
} from "@/data/ingestion/publication";

type CliCommand =
  | { artifactPath: string; manifestPath: string; name: "ingest" }
  | {
      datasetVersionId: string;
      name: "review";
      reviewerId: string;
      role: ReviewDatasetVersionInput["role"];
      artifactChecksum: string;
      manifestDigest: string;
    }
  | { datasetVersionId: string; name: "publish" }
  | { datasetVersionId: string; name: "withdraw"; reason: string }
  | {
      datasetVersionId: string;
      metricId: string;
      name: "rollback" | "activate";
      reason: string;
    };

export interface EvidenceCliDependencies {
  readonly files: { readFile(path: string): Promise<string> };
  readonly ingest: (input: IngestionInput) => Promise<IngestionResult>;
  readonly review: (input: ReviewDatasetVersionInput) => Promise<ReviewRecord>;
  readonly publish: (input: {
    datasetVersionId: string;
  }) => Promise<PublicationResult>;
  readonly rollback: (
    input: RollbackMetricReleaseInput,
  ) => Promise<ReleaseActivationResult>;
  readonly activate: (
    input: RollbackMetricReleaseInput,
  ) => Promise<ReleaseActivationResult>;
  readonly withdraw: (input: {
    datasetVersionId: string;
    reason: string;
  }) => Promise<{ datasetVersionId: string; status: "withdrawn" }>;
}

export function parseEvidenceCliArgs(args: readonly string[]): CliCommand {
  const [name, ...tokens] = args;
  if (
    name !== "ingest" &&
    name !== "review" &&
    name !== "publish" &&
    name !== "rollback" &&
    name !== "activate" &&
    name !== "withdraw"
  ) {
    throw new Error(
      "A supported evidence command is required: ingest, review, publish, activate, rollback, or withdraw.",
    );
  }
  const flags = parseFlags(tokens);
  switch (name) {
    case "ingest":
      assertFlagSet(flags, ["manifest", "artifact"]);
      return {
        artifactPath: required(flags, "artifact"),
        manifestPath: required(flags, "manifest"),
        name,
      };
    case "review": {
      assertFlagSet(flags, [
        "dataset-version",
        "role",
        "reviewer",
        "artifact-checksum",
        "manifest-digest",
      ]);
      const role = required(flags, "role");
      if (
        role !== "scientific" &&
        role !== "editorial" &&
        role !== "licensing"
      ) {
        throw new Error(
          "Review role must be scientific, editorial, or licensing.",
        );
      }
      return {
        datasetVersionId: required(flags, "dataset-version"),
        name,
        reviewerId: required(flags, "reviewer"),
        role,
        artifactChecksum: required(flags, "artifact-checksum"),
        manifestDigest: required(flags, "manifest-digest"),
      };
    }
    case "publish":
      assertFlagSet(flags, ["dataset-version"]);
      return { datasetVersionId: required(flags, "dataset-version"), name };
    case "withdraw":
      assertFlagSet(flags, ["dataset-version", "reason"]);
      return {
        datasetVersionId: required(flags, "dataset-version"),
        reason: required(flags, "reason"),
        name,
      };
    case "rollback":
    case "activate":
      assertFlagSet(flags, ["metric", "dataset-version", "reason"]);
      return {
        datasetVersionId: required(flags, "dataset-version"),
        metricId: required(flags, "metric"),
        name,
        reason: required(flags, "reason"),
      };
  }
}

export async function runEvidenceCli(
  args: readonly string[],
  dependencies: EvidenceCliDependencies,
): Promise<string> {
  const command = parseEvidenceCliArgs(args);
  switch (command.name) {
    case "ingest": {
      const manifest = JSON.parse(
        await dependencies.files.readFile(command.manifestPath),
      ) as IngestionManifest;
      return serializeSummary(
        await dependencies.ingest({
          artifactPath: command.artifactPath,
          manifest,
        }),
      );
    }
    case "review": {
      const review = await dependencies.review(command);
      return serializeSummary({
        datasetVersionId: review.datasetVersionId,
        status: review.status,
      });
    }
    case "publish":
      return serializeSummary(await dependencies.publish(command));
    case "rollback":
      return serializeSummary(await dependencies.rollback(command));
    case "activate":
      return serializeSummary(await dependencies.activate(command));
    case "withdraw":
      return serializeSummary(await dependencies.withdraw(command));
  }
}

function parseFlags(tokens: readonly string[]): Map<string, string> {
  if (tokens.length % 2 !== 0)
    throw new Error("Every evidence flag requires a value.");
  const flags = new Map<string, string>();
  for (let index = 0; index < tokens.length; index += 2) {
    const flag = tokens[index];
    const value = tokens[index + 1];
    if (!flag?.startsWith("--") || !value || value.startsWith("--")) {
      throw new Error("Every evidence flag requires a non-empty value.");
    }
    const name = flag.slice(2);
    if (flags.has(name)) throw new Error(`Duplicate flag: ${flag}.`);
    flags.set(name, value);
  }
  return flags;
}

function assertFlagSet(
  flags: ReadonlyMap<string, string>,
  allowed: readonly string[],
): void {
  for (const flag of flags.keys()) {
    if (!allowed.includes(flag)) throw new Error(`Unknown flag: --${flag}.`);
  }
  for (const flag of allowed) required(flags, flag);
}

function required(flags: ReadonlyMap<string, string>, name: string): string {
  const value = flags.get(name)?.trim();
  if (!value) throw new Error(`Missing required flag: --${name}.`);
  return value;
}

function serializeSummary(value: object): string {
  const allowedKeys = new Set([
    "acceptedRecordCount",
    "checksum",
    "datasetVersionId",
    "observationCount",
    "rejectedRecordCount",
    "runId",
    "sourceRecordCount",
    "status",
  ]);
  const summary = Object.fromEntries(
    Object.entries(value).filter(([key]) => allowedKeys.has(key)),
  );
  return JSON.stringify(summary);
}

if (process.argv[1]?.endsWith("scripts/evidence/ingest.ts")) {
  void runFromProcess(process.argv.slice(2));
}

async function runFromProcess(args: readonly string[]): Promise<void> {
  let adapter:
    | Awaited<
        ReturnType<
          typeof import("./server-adapter").createEvidenceCliDependencies
        >
      >
    | undefined;
  try {
    parseEvidenceCliArgs(args);
    const { createEvidenceCliDependencies } = await import("./server-adapter");
    adapter = await createEvidenceCliDependencies();
    process.stdout.write(`${await runEvidenceCli(args, adapter)}\n`);
  } catch {
    process.stderr.write("Evidence ingestion command failed.\n");
    process.exitCode = 1;
  } finally {
    await adapter?.close();
  }
}
