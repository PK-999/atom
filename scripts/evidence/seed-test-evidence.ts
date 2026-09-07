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

    // 3. Metric Catalog Definitions across 6 Categories
    const metrics = [
      // Environment (R08-E)
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
      {
        id: "water-withdrawal",
        canonical_unit: "L/MWh",
        supported_units: ["L/MWh", "m3/MWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region", "facility"],
        definition: "Volume of water removed from a source per unit of energy.",
        explanation_content: "Operational water intake volume.",
        registry_category: "environment",
      },
      {
        id: "water-consumption",
        canonical_unit: "L/MWh",
        supported_units: ["L/MWh", "m3/MWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region", "facility"],
        definition: "Volume of water withdrawn and not returned to the source.",
        explanation_content: "Unreturned evaporative cooling water loss.",
        registry_category: "environment",
      },
      {
        id: "material-requirements",
        canonical_unit: "t/TWh",
        supported_units: ["t/TWh", "kg/MWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Total mass of critical materials required for plant construction and operation.",
        explanation_content: "Concrete, steel, copper, and critical minerals.",
        registry_category: "environment",
      },
      // Reliability (R08-R)
      {
        id: "capacity-factor",
        canonical_unit: "%",
        supported_units: ["%"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region", "facility"],
        definition:
          "Ratio of actual electrical output to maximum possible output over a period.",
        explanation_content: "Annual capacity factor percentage.",
        registry_category: "reliability",
      },
      {
        id: "firm-capacity",
        canonical_unit: "%",
        supported_units: ["%"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Fraction of nameplate capacity dependable during peak net load hours.",
        explanation_content:
          "Effective load carrying capability / capacity credit.",
        registry_category: "reliability",
      },
      // Economics (R08-C)
      {
        id: "capital-cost",
        canonical_unit: "USD/kW",
        supported_units: ["USD/kW"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Overnight capital expenditure per kilowatt of electrical capacity.",
        explanation_content: "Overnight capital costs in constant 2024 USD.",
        registry_category: "economics",
      },
      {
        id: "lcoe",
        canonical_unit: "USD/MWh",
        supported_units: ["USD/MWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Levelized cost of electricity over expected asset lifetime.",
        explanation_content:
          "Levelized plant-level generation costs in USD/MWh.",
        registry_category: "economics",
      },
      {
        id: "construction-duration",
        canonical_unit: "years",
        supported_units: ["years", "months"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Elapsed time from first construction milestone to commercial operation.",
        explanation_content: "Median construction lead time in years.",
        registry_category: "economics",
      },
      {
        id: "plant-lifetime",
        canonical_unit: "years",
        supported_units: ["years"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Certified design and operational lifetime before final retirement.",
        explanation_content: "Operational asset longevity in years.",
        registry_category: "economics",
      },
      // Human Impact (R08-H)
      {
        id: "mortality-rate",
        canonical_unit: "deaths/TWh",
        supported_units: ["deaths/TWh"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global", "country", "region"],
        definition:
          "Mortality rate per terawatt-hour from air pollution and historical accidents.",
        explanation_content: "Public health mortality per TWh generated.",
        registry_category: "human-impact",
      },
      // Security (R08-S)
      {
        id: "fuel-energy-density",
        canonical_unit: "MJ/kg",
        supported_units: ["MJ/kg"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global"],
        definition:
          "Specific energy content per kilogram of unprocessed or enriched fuel.",
        explanation_content: "Energy density of primary fuel form in MJ/kg.",
        registry_category: "security",
      },
      // Technical (R08-T)
      {
        id: "power-density",
        canonical_unit: "W/m2",
        supported_units: ["W/m2"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global"],
        definition:
          "Annual average electrical power output per unit of facility boundary area.",
        explanation_content: "Spatial electrical power density in W/m².",
        registry_category: "technical",
      },
      {
        id: "thermal-efficiency",
        canonical_unit: "%",
        supported_units: ["%"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global"],
        definition:
          "Ratio of net electrical output to thermal heat input for thermal cycle power plants.",
        explanation_content:
          "Thermodynamic heat-to-electricity conversion efficiency.",
        registry_category: "technical",
      },
      {
        id: "unit-capacity",
        canonical_unit: "MW",
        supported_units: ["MW", "GW"],
        value_kind: "numeric" as const,
        range_semantics: "point-or-range" as const,
        representative_rule: "source-observation",
        geography_support: ["global"],
        definition:
          "Typical net electrical capacity of a single commercial turbine, generator, or reactor unit.",
        explanation_content:
          "Nameplate rating of a single generation unit in MW.",
        registry_category: "technical",
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

    // 4. Source and Study Definitions
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

    // 5. Seed category datasets and versions
    const categories = [
      {
        id: "environment",
        datasetId: "atom-dataset-environment",
        versionId: "atom-env-v1",
      },
      {
        id: "reliability",
        datasetId: "atom-dataset-reliability",
        versionId: "atom-rel-v1",
      },
      {
        id: "economics",
        datasetId: "atom-dataset-economics",
        versionId: "atom-econ-v1",
      },
      {
        id: "human-impact",
        datasetId: "atom-dataset-human-impact",
        versionId: "atom-hum-v1",
      },
      {
        id: "security",
        datasetId: "atom-dataset-security",
        versionId: "atom-sec-v1",
      },
      {
        id: "technical",
        datasetId: "atom-dataset-technical",
        versionId: "atom-tech-v1",
      },
    ];

    for (const cat of categories) {
      await sql`
        insert into public.datasets (
          id, source_id, title, publisher, licence_name, redistribution,
          raw_access, publication_status, reviewed_by, reviewed_at, published_at
        )
        values (
          ${cat.datasetId}, 'ipcc-ar5-wg3',
          ${`ATOM Verified ${cat.id} Dataset`},
          'IPCC / IAEA / Peer-Reviewed Synthesis', 'Creative Commons Attribution', 'allowed',
          'permitted', 'published', ${meta.reviewed_by}, ${meta.reviewed_at}, ${meta.published_at}
        )
        on conflict (id) do nothing
      `;

      await sql`
        insert into public.dataset_versions (
          id, dataset_id, checksum_algorithm, checksum_digest, acquired_on, transformation_version, source_version,
          publication_status, reviewed_by, reviewed_at, published_at
        )
        values (
          ${cat.versionId}, ${cat.datasetId}, 'sha256',
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          '2026-08-30', '1.0.0', '2024-synthesis',
          'in-review', ${meta.reviewed_by}, ${meta.reviewed_at}, null
        )
        on conflict (id) do nothing
      `;
    }

    // 6. Multi-Category Observations Mapping
    const observationsData: Array<{
      metricId: string;
      category: string;
      versionId: string;
      tech: string;
      value: number;
      unit: string;
    }> = [
      // Environment
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "nuclear",
        value: 12,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "solar",
        value: 40,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "wind",
        value: 11,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "gas",
        value: 490,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "coal",
        value: 820,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "hydro",
        value: 24,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "storage",
        value: 30,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "biomass",
        value: 230,
        unit: "gCO2e/kWh",
      },
      {
        metricId: "lifecycle-ghg",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "geothermal",
        value: 38,
        unit: "gCO2e/kWh",
      },

      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "nuclear",
        value: 0.3,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "solar",
        value: 19,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "wind",
        value: 72,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "gas",
        value: 1.0,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "coal",
        value: 12,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "hydro",
        value: 54,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "storage",
        value: 0.1,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "biomass",
        value: 500,
        unit: "m2/MWh",
      },
      {
        metricId: "land-use",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "geothermal",
        value: 2.5,
        unit: "m2/MWh",
      },

      {
        metricId: "water-withdrawal",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "nuclear",
        value: 120000,
        unit: "L/MWh",
      },
      {
        metricId: "water-withdrawal",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "gas",
        value: 30000,
        unit: "L/MWh",
      },
      {
        metricId: "water-withdrawal",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "coal",
        value: 80000,
        unit: "L/MWh",
      },
      {
        metricId: "water-withdrawal",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "solar",
        value: 10,
        unit: "L/MWh",
      },
      {
        metricId: "water-withdrawal",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "wind",
        value: 1,
        unit: "L/MWh",
      },
      {
        metricId: "water-withdrawal",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "hydro",
        value: 1000,
        unit: "L/MWh",
      },

      {
        metricId: "water-consumption",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "nuclear",
        value: 1800,
        unit: "L/MWh",
      },
      {
        metricId: "water-consumption",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "gas",
        value: 800,
        unit: "L/MWh",
      },
      {
        metricId: "water-consumption",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "coal",
        value: 2000,
        unit: "L/MWh",
      },
      {
        metricId: "water-consumption",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "solar",
        value: 10,
        unit: "L/MWh",
      },
      {
        metricId: "water-consumption",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "wind",
        value: 1,
        unit: "L/MWh",
      },
      {
        metricId: "water-consumption",
        category: "environment",
        versionId: "atom-env-v1",
        tech: "hydro",
        value: 4500,
        unit: "L/MWh",
      },

      // Reliability
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "nuclear",
        value: 92,
        unit: "%",
      },
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "solar",
        value: 24,
        unit: "%",
      },
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "wind",
        value: 36,
        unit: "%",
      },
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "gas",
        value: 55,
        unit: "%",
      },
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "coal",
        value: 60,
        unit: "%",
      },
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "hydro",
        value: 44,
        unit: "%",
      },
      {
        metricId: "capacity-factor",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "geothermal",
        value: 85,
        unit: "%",
      },

      {
        metricId: "firm-capacity",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "nuclear",
        value: 90,
        unit: "%",
      },
      {
        metricId: "firm-capacity",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "gas",
        value: 95,
        unit: "%",
      },
      {
        metricId: "firm-capacity",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "coal",
        value: 85,
        unit: "%",
      },
      {
        metricId: "firm-capacity",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "hydro",
        value: 50,
        unit: "%",
      },
      {
        metricId: "firm-capacity",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "solar",
        value: 8,
        unit: "%",
      },
      {
        metricId: "firm-capacity",
        category: "reliability",
        versionId: "atom-rel-v1",
        tech: "wind",
        value: 12,
        unit: "%",
      },

      // Economics
      {
        metricId: "capital-cost",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "nuclear",
        value: 6500,
        unit: "USD/kW",
      },
      {
        metricId: "capital-cost",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "solar",
        value: 950,
        unit: "USD/kW",
      },
      {
        metricId: "capital-cost",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "wind",
        value: 1350,
        unit: "USD/kW",
      },
      {
        metricId: "capital-cost",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "gas",
        value: 1100,
        unit: "USD/kW",
      },
      {
        metricId: "capital-cost",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "coal",
        value: 3000,
        unit: "USD/kW",
      },
      {
        metricId: "capital-cost",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "hydro",
        value: 3500,
        unit: "USD/kW",
      },

      {
        metricId: "lcoe",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "nuclear",
        value: 75,
        unit: "USD/MWh",
      },
      {
        metricId: "lcoe",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "solar",
        value: 42,
        unit: "USD/MWh",
      },
      {
        metricId: "lcoe",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "wind",
        value: 38,
        unit: "USD/MWh",
      },
      {
        metricId: "lcoe",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "gas",
        value: 70,
        unit: "USD/MWh",
      },
      {
        metricId: "lcoe",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "coal",
        value: 95,
        unit: "USD/MWh",
      },
      {
        metricId: "lcoe",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "hydro",
        value: 62,
        unit: "USD/MWh",
      },

      {
        metricId: "construction-duration",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "nuclear",
        value: 7.5,
        unit: "years",
      },
      {
        metricId: "construction-duration",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "solar",
        value: 0.8,
        unit: "years",
      },
      {
        metricId: "construction-duration",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "wind",
        value: 1.5,
        unit: "years",
      },
      {
        metricId: "construction-duration",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "gas",
        value: 2.5,
        unit: "years",
      },
      {
        metricId: "construction-duration",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "coal",
        value: 4.5,
        unit: "years",
      },
      {
        metricId: "construction-duration",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "hydro",
        value: 8.0,
        unit: "years",
      },

      {
        metricId: "plant-lifetime",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "nuclear",
        value: 60,
        unit: "years",
      },
      {
        metricId: "plant-lifetime",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "solar",
        value: 25,
        unit: "years",
      },
      {
        metricId: "plant-lifetime",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "wind",
        value: 25,
        unit: "years",
      },
      {
        metricId: "plant-lifetime",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "gas",
        value: 30,
        unit: "years",
      },
      {
        metricId: "plant-lifetime",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "coal",
        value: 40,
        unit: "years",
      },
      {
        metricId: "plant-lifetime",
        category: "economics",
        versionId: "atom-econ-v1",
        tech: "hydro",
        value: 80,
        unit: "years",
      },

      // Human Impact
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "nuclear",
        value: 0.03,
        unit: "deaths/TWh",
      },
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "solar",
        value: 0.02,
        unit: "deaths/TWh",
      },
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "wind",
        value: 0.04,
        unit: "deaths/TWh",
      },
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "hydro",
        value: 1.3,
        unit: "deaths/TWh",
      },
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "gas",
        value: 2.8,
        unit: "deaths/TWh",
      },
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "coal",
        value: 24.6,
        unit: "deaths/TWh",
      },
      {
        metricId: "mortality-rate",
        category: "human-impact",
        versionId: "atom-hum-v1",
        tech: "biomass",
        value: 4.6,
        unit: "deaths/TWh",
      },

      // Security
      {
        metricId: "fuel-energy-density",
        category: "security",
        versionId: "atom-sec-v1",
        tech: "nuclear",
        value: 500000,
        unit: "MJ/kg",
      },
      {
        metricId: "fuel-energy-density",
        category: "security",
        versionId: "atom-sec-v1",
        tech: "gas",
        value: 55,
        unit: "MJ/kg",
      },
      {
        metricId: "fuel-energy-density",
        category: "security",
        versionId: "atom-sec-v1",
        tech: "coal",
        value: 24,
        unit: "MJ/kg",
      },
      {
        metricId: "fuel-energy-density",
        category: "security",
        versionId: "atom-sec-v1",
        tech: "biomass",
        value: 16,
        unit: "MJ/kg",
      },

      // Technical (Note: Non-thermal sources solar/wind have NO thermal efficiency)
      {
        metricId: "power-density",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "nuclear",
        value: 2000,
        unit: "W/m2",
      },
      {
        metricId: "power-density",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "gas",
        value: 1000,
        unit: "W/m2",
      },
      {
        metricId: "power-density",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "coal",
        value: 500,
        unit: "W/m2",
      },
      {
        metricId: "power-density",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "solar",
        value: 10,
        unit: "W/m2",
      },
      {
        metricId: "power-density",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "wind",
        value: 3,
        unit: "W/m2",
      },
      {
        metricId: "power-density",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "hydro",
        value: 2,
        unit: "W/m2",
      },

      {
        metricId: "thermal-efficiency",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "nuclear",
        value: 34,
        unit: "%",
      },
      {
        metricId: "thermal-efficiency",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "gas",
        value: 60,
        unit: "%",
      },
      {
        metricId: "thermal-efficiency",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "coal",
        value: 38,
        unit: "%",
      },
      {
        metricId: "thermal-efficiency",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "biomass",
        value: 30,
        unit: "%",
      },
      {
        metricId: "thermal-efficiency",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "geothermal",
        value: 15,
        unit: "%",
      },

      {
        metricId: "unit-capacity",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "nuclear",
        value: 1000,
        unit: "MW",
      },
      {
        metricId: "unit-capacity",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "gas",
        value: 500,
        unit: "MW",
      },
      {
        metricId: "unit-capacity",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "coal",
        value: 600,
        unit: "MW",
      },
      {
        metricId: "unit-capacity",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "hydro",
        value: 800,
        unit: "MW",
      },
      {
        metricId: "unit-capacity",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "wind",
        value: 4,
        unit: "MW",
      },
      {
        metricId: "unit-capacity",
        category: "technical",
        versionId: "atom-tech-v1",
        tech: "solar",
        value: 50,
        unit: "MW",
      },
    ];

    for (const obs of observationsData) {
      const obsId = `obs-${obs.metricId}-${obs.tech}`;

      // Check if observation exists
      const existing = await sql`
        select id from public.observations where id = ${obsId}
      `;

      if (!existing.length) {
        await sql`
          insert into public.observations (
            id, metric_id, technology_id, geography_id, study_id, source_id, dataset_version_id,
            value_kind, value_semantics, value, unit, representative_kind,
            methodology, system_boundary, period_start_year, period_end_year,
            uncertainty, last_verified_on, raw_access, redistribution,
            publication_status, reviewed_by, reviewed_at, published_at
          )
          values (
            ${obsId}, ${obs.metricId}, ${obs.tech}, 'global', 'ipcc-ar5-annex-iii', 'ipcc-ar5-wg3', ${obs.versionId},
            'numeric', 'point', ${obs.value}, ${obs.unit}, 'median',
            'Harmonized lifecycle assessment synthesis of electricity supply options.',
            'Full lifecycle: fuel cycle, plant construction, operation, decommissioning.',
            2014, 2014,
            'Standard peer-reviewed comparative dataset benchmark.',
            '2026-08-30', 'permitted', 'allowed',
            'in-review', ${meta.reviewed_by}, ${meta.reviewed_at}, null
          )
        `;

        await sql`
          insert into public.observation_transformations (
            id, observation_id, step_order, operation_name, input_unit, output_unit, parameters, software_version, explanatory_note
          )
          values (
            ${`trans-${obs.metricId}-${obs.tech}`}, ${obsId}, 1, 'identity', ${obs.unit}, ${obs.unit}, '{}', '1.0.0', 'Harmonized benchmark estimate.'
          )
          on conflict (id) do nothing
        `;
      }
    }

    // 7. Transition seeded observations and dataset versions to published
    for (const cat of categories) {
      await sql`
        update public.observations set
          publication_status = 'published',
          published_at = ${meta.published_at}
        where dataset_version_id = ${cat.versionId} and publication_status = 'in-review'
      `;

      await sql`
        update public.dataset_versions set
          publication_status = 'published',
          published_at = ${meta.published_at}
        where id = ${cat.versionId} and publication_status = 'in-review'
      `;
    }

    // 8. Metric Releases across all seeded metrics
    const allGeoIds = geographies.map((g) => g.id);
    const releasedMetricIds = [
      ...new Set(observationsData.map((o) => o.metricId)),
    ];

    for (const mId of releasedMetricIds) {
      const matchingObs = observationsData.filter((o) => o.metricId === mId);
      const metricObsTechs = matchingObs.map((o) => o.tech);
      const targetVersionId = matchingObs[0].versionId;

      await sql`
        insert into public.metric_releases (
          metric_id, availability_status, active_dataset_version_id,
          technology_ids, geography_ids, period_start_year, period_end_year,
          typical_mode, range_mode, raw_mode, redistribution_decision,
          message, feature_enabled, publication_status,
          reviewed_by, reviewed_at, published_at
        )
        values (
          ${mId}, 'supported', ${targetVersionId},
          ${metricObsTechs}, ${allGeoIds}, 2014, 2014,
          'available', 'available', 'available', 'allowed',
          ${`Reviewed and released ${mId} evidence benchmark.`},
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
    }

    console.log(
      `Successfully seeded test evidence for ${releasedMetricIds.length} metrics across all 6 categories.`,
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
