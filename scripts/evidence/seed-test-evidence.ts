import postgres from "postgres";

const databaseUrl =
  process.env.ATOM_TEST_DATABASE_URL ??
  process.env.SUPABASE_DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:55322/postgres";

export async function seedTestEvidence() {
  const sql = postgres(databaseUrl, { max: 1 });

  try {
    const meta = {
      reviewed_by: "synthetic-parent-review",
      reviewed_at: new Date("2026-09-01T00:00:00Z"),
      published_at: new Date("2026-09-01T00:00:00Z"),
    };

    const versionId = "ipcc-ar5-v1";

    // 1. Technologies
    const technologies = [
      {
        id: "nuclear",
        name: "Nuclear",
        description: "Nuclear fission electricity generation",
      },
      {
        id: "solar",
        name: "Solar",
        description: "Solar photovoltaic electricity generation",
      },
      {
        id: "wind",
        name: "Wind",
        description: "Onshore and offshore wind turbine electricity generation",
      },
      {
        id: "gas",
        name: "Gas",
        description: "Natural gas combined-cycle power generation",
      },
      {
        id: "coal",
        name: "Coal",
        description: "Coal-fired thermal electricity generation",
      },
      {
        id: "hydro",
        name: "Hydro",
        description: "Conventional hydroelectric power generation",
      },
      {
        id: "storage",
        name: "Storage",
        description: "Grid energy storage technologies",
      },
      {
        id: "biomass",
        name: "Biomass",
        description: "Biomass-fired electricity generation",
      },
      {
        id: "geothermal",
        name: "Geothermal",
        description: "Geothermal electricity generation",
      },
    ];

    for (const tech of technologies) {
      await sql`
        insert into public.technologies (id, name, description, lifecycle_status, publication_status, reviewed_by, reviewed_at, published_at)
        values (${tech.id}, ${tech.name}, ${tech.description}, 'active', 'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at})
        on conflict (id) do update set
          name = excluded.name,
          description = excluded.description,
          publication_status = excluded.publication_status,
          reviewed_by = excluded.reviewed_by,
          reviewed_at = excluded.reviewed_at,
          published_at = excluded.published_at
      `;
    }

    // 2. Geographies
    const geographies = [
      { id: "global", name: "Global", scope: "global" as const },
      { id: "india", name: "India", scope: "country" as const },
    ];

    for (const geo of geographies) {
      await sql`
        insert into public.geographies (id, name, scope, publication_status, reviewed_by, reviewed_at, published_at)
        values (${geo.id}, ${geo.name}, ${geo.scope}, 'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at})
        on conflict (id) do update set
          name = excluded.name,
          scope = excluded.scope,
          publication_status = excluded.publication_status
      `;
    }

    // 3. Metrics
    const metrics = [
      {
        id: "lifecycle-ghg",
        canonical_unit: "gCO2e/kWh",
        supported_units: ["gCO2e/kWh", "kgCO2e/MWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Lifecycle greenhouse gas emissions per unit of electricity generated.",
        explanation_content:
          "Reviewed lifecycle greenhouse-gas emissions estimates.",
        registry_category: "environment",
      },
      {
        id: "land-use",
        canonical_unit: "m2/MWh",
        supported_units: ["m2/MWh", "ha/TWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region", "facility"],
        definition:
          "Direct and indirect land area required per unit of energy.",
        explanation_content: "Direct and indirect lifecycle land footprints.",
        registry_category: "environment",
      },
    ];

    for (const metric of metrics) {
      await sql`
        insert into public.metrics (
          id, canonical_unit, supported_units, value_kind, range_semantics,
          representative_rule, geography_support, definition, explanation_content,
          registry_category, publication_status, reviewed_by, reviewed_at, published_at
        )
        values (
          ${metric.id}, ${metric.canonical_unit}, ${metric.supported_units}, ${metric.value_kind},
          ${metric.range_semantics}, ${metric.representative_rule}, ${metric.geography_support},
          ${metric.definition}, ${metric.explanation_content}, ${metric.registry_category},
          'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
        )
        on conflict (id) do update set
          canonical_unit = excluded.canonical_unit,
          supported_units = excluded.supported_units,
          definition = excluded.definition,
          publication_status = excluded.publication_status,
          reviewed_by = excluded.reviewed_by,
          reviewed_at = excluded.reviewed_at,
          published_at = excluded.published_at
      `;
    }

    // 4. Source, Dataset, Study
    await sql`
      insert into public.sources (
        id, source_tier, title, publisher, url, conflict_disclosure,
        licence_name, redistribution, published_on, accessed_on, last_verified_on,
        publication_status, reviewed_by, reviewed_at, published_at
      )
      values (
        'ipcc-ar5-wg3', 'A', 'IPCC Working Group III Fifth Assessment Report, Annex III',
        'Intergovernmental Panel on Climate Change', 'https://www.ipcc.ch/report/ar5/wg3/',
        'United Nations intergovernmental body; independent peer-reviewed assessment.',
        'Creative Commons Attribution', 'allowed',
        '2014-04-13', '2026-08-30', '2026-08-30',
        'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
      )
      on conflict (id) do nothing
    `;

    await sql`
      insert into public.studies (
        id, source_id, title, methodology, system_boundary,
        period_start_year, period_end_year, publication_label,
        publication_status, reviewed_by, reviewed_at, published_at
      )
      values (
        'ipcc-ar5-annex-iii', 'ipcc-ar5-wg3',
        'Technology-specific Cost and Performance Parameters',
        'Harmonized lifecycle assessment synthesis of electricity supply options.',
        'Full lifecycle: fuel cycle, plant construction, operation, decommissioning.',
        2014, 2014, 'IPCC AR5 Annex III Table A.III.2',
        'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
      )
      on conflict (id) do nothing
    `;

    await sql`
      insert into public.datasets (
        id, source_id, title, publisher, licence_name, redistribution,
        raw_access, publication_status, reviewed_by, reviewed_at, published_at
      )
      values (
        'ipcc-lifecycle-dataset', 'ipcc-ar5-wg3',
        'IPCC AR5 Electricity Supply Lifecycle Emissions Synthesis',
        'IPCC Working Group III', 'Creative Commons Attribution', 'allowed',
        'permitted', 'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
      )
      on conflict (id) do nothing
    `;

    // 5. Check if version already published
    const existingVersion = await sql`
      select id, publication_status from public.dataset_versions where id = ${versionId}
    `;

    if (!existingVersion.length) {
      // Insert dataset_version in 'in-review'
      await sql`
        insert into public.dataset_versions (
          id, dataset_id, checksum_algorithm, checksum_digest, acquired_on, transformation_version, source_version,
          publication_status, reviewed_by, reviewed_at, published_at
        )
        values (
          ${versionId}, 'ipcc-lifecycle-dataset', 'sha256',
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          '2026-08-30',
          '1.0.0', '2014-ar5',
          'in-review', ${meta.reviewed_by}, ${meta.reviewed_at}, null
        )
      `;

      // 6. Insert observations in 'in-review'
      const ghgObservations = [
        { tech: "nuclear", value: 12 },
        { tech: "solar", value: 40 },
        { tech: "wind", value: 11 },
        { tech: "gas", value: 490 },
        { tech: "coal", value: 820 },
        { tech: "hydro", value: 24 },
        { tech: "storage", value: 30 },
        { tech: "biomass", value: 230 },
        { tech: "geothermal", value: 38 },
      ];

      for (const obs of ghgObservations) {
        const obsId = `obs-ghg-v1-${obs.tech}`;
        await sql`
          insert into public.observations (
            id, metric_id, technology_id, geography_id, study_id, source_id, dataset_version_id,
            value_kind, value_semantics, value, unit, representative_kind,
            methodology, system_boundary, period_start_year, period_end_year,
            uncertainty, last_verified_on, raw_access, redistribution,
            publication_status, reviewed_by, reviewed_at, published_at
          )
          values (
            ${obsId}, 'lifecycle-ghg', ${obs.tech}, 'global', 'ipcc-ar5-annex-iii', 'ipcc-ar5-wg3', ${versionId},
            'numeric', 'point', ${obs.value}, 'gCO2e/kWh', 'median',
            'Harmonized lifecycle assessment synthesis of electricity supply options.',
            'Full lifecycle: fuel cycle, plant construction, operation, decommissioning.',
            2014, 2014,
            'Interquartile and min-max distribution across published LCA literature.',
            '2026-08-30', 'permitted', 'allowed',
            'in-review', ${meta.reviewed_by}, ${meta.reviewed_at}, null
          )
        `;

        await sql`
          insert into public.observation_transformations (
            id, observation_id, step_order, operation_name, input_unit, output_unit, parameters, software_version, explanatory_note
          )
          values (
            ${`trans-ghg-v1-${obs.tech}`}, ${obsId}, 1, 'identity', 'gCO2e/kWh', 'gCO2e/kWh', '{}', '1.0.0', 'Harmonized central estimate.'
          )
        `;
      }

      const landObservations = [
        { tech: "nuclear", value: 0.3 },
        { tech: "solar", value: 19 },
        { tech: "wind", value: 72 },
        { tech: "gas", value: 1.0 },
        { tech: "coal", value: 12 },
        { tech: "hydro", value: 54 },
        { tech: "storage", value: 0.1 },
        { tech: "biomass", value: 500 },
        { tech: "geothermal", value: 2.5 },
      ];

      for (const obs of landObservations) {
        const obsId = `obs-land-v1-${obs.tech}`;
        await sql`
          insert into public.observations (
            id, metric_id, technology_id, geography_id, study_id, source_id, dataset_version_id,
            value_kind, value_semantics, value, unit, representative_kind,
            methodology, system_boundary, period_start_year, period_end_year,
            uncertainty, last_verified_on, raw_access, redistribution,
            publication_status, reviewed_by, reviewed_at, published_at
          )
          values (
            ${obsId}, 'land-use', ${obs.tech}, 'global', 'ipcc-ar5-annex-iii', 'ipcc-ar5-wg3', ${versionId},
            'numeric', 'point', ${obs.value}, 'm2/MWh', 'median',
            'Direct and indirect lifecycle land transformation and occupation footprint.',
            'Total land footprint including fuel extraction and plant footprint.',
            2014, 2014,
            'Literature survey of published spatial requirements.',
            '2026-08-30', 'permitted', 'allowed',
            'in-review', ${meta.reviewed_by}, ${meta.reviewed_at}, null
          )
        `;

        await sql`
          insert into public.observation_transformations (
            id, observation_id, step_order, operation_name, input_unit, output_unit, parameters, software_version, explanatory_note
          )
          values (
            ${`trans-land-v1-${obs.tech}`}, ${obsId}, 1, 'identity', 'm2/MWh', 'm2/MWh', '{}', '1.0.0', 'Harmonized spatial requirement.'
          )
        `;
      }

      // 7. Update observations from 'in-review' to 'published'
      await sql`
        update public.observations set
          publication_status = 'published',
          published_at = ${meta.published_at}
        where dataset_version_id = ${versionId}
      `;

      // 8. Update dataset_versions from 'in-review' to 'published'
      await sql`
        update public.dataset_versions set
          publication_status = 'published',
          published_at = ${meta.published_at}
        where id = ${versionId}
      `;
    }

    // 9. Metric Releases
    const allTechIds = technologies.map((t) => t.id);
    const allGeoIds = geographies.map((g) => g.id);

    await sql`
      insert into public.metric_releases (
        metric_id, availability_status, active_dataset_version_id,
        technology_ids, geography_ids, period_start_year, period_end_year,
        typical_mode, range_mode, raw_mode, redistribution_decision,
        message, feature_enabled, publication_status,
        reviewed_by, reviewed_at, published_at
      )
      values (
        'lifecycle-ghg', 'supported', ${versionId},
        ${allTechIds}, ${allGeoIds}, 2014, 2014,
        'available', 'available', 'available', 'allowed',
        'Lifecycle greenhouse gas emissions reviewed and released.',
        true, 'published',
        ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
      )
      on conflict (metric_id) do update set
        availability_status = excluded.availability_status,
        active_dataset_version_id = excluded.active_dataset_version_id,
        technology_ids = excluded.technology_ids,
        geography_ids = excluded.geography_ids,
        typical_mode = excluded.typical_mode,
        range_mode = excluded.range_mode,
        raw_mode = excluded.raw_mode,
        feature_enabled = excluded.feature_enabled,
        publication_status = excluded.publication_status,
        reviewed_by = excluded.reviewed_by,
        reviewed_at = excluded.reviewed_at,
        published_at = excluded.published_at
    `;

    await sql`
      insert into public.metric_releases (
        metric_id, availability_status, active_dataset_version_id,
        technology_ids, geography_ids, period_start_year, period_end_year,
        typical_mode, range_mode, raw_mode, redistribution_decision,
        message, feature_enabled, publication_status,
        reviewed_by, reviewed_at, published_at
      )
      values (
        'land-use', 'supported', ${versionId},
        ${allTechIds}, ${allGeoIds}, 2014, 2014,
        'available', 'available', 'available', 'allowed',
        'Lifecycle land-use footprint reviewed and released.',
        true, 'published',
        ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
      )
      on conflict (metric_id) do update set
        availability_status = excluded.availability_status,
        active_dataset_version_id = excluded.active_dataset_version_id,
        technology_ids = excluded.technology_ids,
        geography_ids = excluded.geography_ids,
        typical_mode = excluded.typical_mode,
        range_mode = excluded.range_mode,
        raw_mode = excluded.raw_mode,
        feature_enabled = excluded.feature_enabled,
        publication_status = excluded.publication_status,
        reviewed_by = excluded.reviewed_by,
        reviewed_at = excluded.reviewed_at,
        published_at = excluded.published_at
    `;

    console.log(
      "Successfully seeded test evidence for technologies, metrics, transformations, and observations.",
    );
  } finally {
    await sql.end();
  }
}

if (process.argv[1]?.endsWith("seed-test-evidence.ts")) {
  seedTestEvidence().catch((err) => {
    console.error("Failed to seed test evidence:", err);
    process.exit(1);
  });
}
