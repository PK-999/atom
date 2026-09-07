import { getAdminClient } from "../lib/ingestion/pipeline";
import { METRICS } from "../lib/evidence/metrics";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const supabase = getAdminClient();

  console.log("Seeding metrics...");

  const insertPrereqs = async (
    table: string,
    data: Record<string, unknown>[],
  ) => {
    const { error } = await supabase
      .from(table)
      .upsert(data, { onConflict: "id" });
    if (error) {
      throw new Error(`Failed to insert into ${table}: ${error.message}`);
    }
  };

  const dbMetrics = METRICS.map((m) => {
    if (m.valueKind === "numeric") {
      return {
        id: m.id,
        category: m.category,
        definition: m.definition,
        value_kind: m.valueKind,
        canonical_unit: m.canonicalUnit,
        range_semantics: m.rangeSemantics,
        geography_support: m.geographySupport,
        supported_units: m.supportedUnits,
      };
    } else {
      return {
        id: m.id,
        category: m.category,
        definition: m.definition,
        value_kind: m.valueKind,
        range_semantics: m.rangeSemantics,
        geography_support: m.geographySupport,
      };
    }
  });

  await insertPrereqs("metrics", dbMetrics);
  console.log(`Successfully seeded ${dbMetrics.length} metrics.`);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
