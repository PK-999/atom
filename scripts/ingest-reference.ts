import { getAdminClient, ingestObservation } from "../lib/ingestion/pipeline";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const supabase = getAdminClient();

  console.log("Inserting reference data...");

  const license = {
    id: "cc-by-4",
    name: "Creative Commons Attribution 4.0 International",
    redistribution: "allowed",
    url: "https://creativecommons.org/licenses/by/4.0/",
  };

  const technology = {
    id: "nuclear-pwr",
    name: "Pressurized Water Reactor",
    description: "A type of light-water nuclear reactor.",
    variant: "Gen III+",
  };

  const geography = {
    id: "global-avg",
    name: "Global Average",
    scope: "global",
  };

  const source = {
    id: "ipcc-ar6-wg3",
    title: "IPCC AR6 WGIII",
    publisher: "Intergovernmental Panel on Climate Change",
    url: "https://www.ipcc.ch/report/ar6/wg3/",
    accessed_at: "2023-01-01",
    published_at: "2022-04-04",
    conflict_disclosure: "None declared.",
    source_tier: "A",
    license_id: license.id,
  };

  const study = {
    id: "ipcc-lca-2022",
    title: "IPCC Lifecycle Emissions Assessment",
    system_boundary: "Cradle to grave",
    methodology: "Lifecycle Assessment",
    period_start_year: 2010,
    period_end_year: 2020,
  };

  const dataset = {
    id: "ipcc-emissions-dataset",
    title: "IPCC Emissions Factors",
    version: "1.0",
    checksum: "abc123xyz",
    last_verified_at: "2023-01-02",
    license_id: license.id,
  };

  const metric = {
    id: "lifecycle-ghg",
    category: "environment",
    definition:
      "Lifecycle greenhouse gas emissions per unit of electricity generated.",
    value_kind: "numeric",
    canonical_unit: "gCO2e/kWh",
    range_semantics: "point-or-range",
    geography_support: ["global", "country", "region"],
    supported_units: ["gCO2e/kWh", "kgCO2e/MWh"],
  };

  const insertPrereqs = async (
    table: string,
    data: Record<string, unknown>,
  ) => {
    const { error } = await supabase.from(table).upsert(data);
    if (error)
      throw new Error(`Failed to insert into ${table}: ${error.message}`);
  };

  await insertPrereqs("licenses", license);
  await insertPrereqs("technologies", technology);
  await insertPrereqs("geographies", geography);
  await insertPrereqs("sources", source);
  await insertPrereqs("studies", study);
  await insertPrereqs("datasets", dataset);
  await insertPrereqs("metrics", metric);

  await insertPrereqs("dataset_sources", {
    dataset_id: dataset.id,
    source_id: source.id,
  });
  await insertPrereqs("dataset_studies", {
    dataset_id: dataset.id,
    study_id: study.id,
  });

  console.log("Reference data inserted.");

  // The observation to ingest
  const observationData = {
    id: "obs-ipcc-nuclear-ghg",
    kind: "numeric",
    valueSemantics: "point",
    datasetId: dataset.id,
    metricId: metric.id,
    geographyId: geography.id,
    geographyScope: "global",
    technologyId: technology.id,
    sourceId: source.id,
    studyId: study.id,
    license: {
      id: license.id,
      name: license.name,
      redistribution: license.redistribution,
      url: license.url,
    },
    lastVerifiedAt: "2023-01-02",
    publicationStatus: "published",
    rawAccess: "permitted",
    systemBoundary: "Cradle to grave",
    methodology: "Literature review of LCA studies.",
    uncertainty: "Medium",
    period: {
      startYear: 2010,
      endYear: 2020,
    },
    transformation: [
      {
        kind: "identity",
        description: "Direct extraction from report Annex.",
      },
    ],
    representativeKind: "median",
    unit: "gCO2e/kWh",
    value: 12,
  };

  console.log("Ingesting observation...");
  try {
    await ingestObservation(observationData);
    console.log("Successfully ingested the licensed reference observation!");
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(
        `❌ Validation failed for ${observationData.metricId}: ${e.message}`,
      );
    }
  }
}

main().catch(console.error);
