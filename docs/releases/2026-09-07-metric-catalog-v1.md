# Metric Catalog V1 Release Record (R08)

**Date:** 2026-09-07  
**Scope:** Initial multi-category evidence release across all 6 core categories.

## Summary

This release activates reviewed baseline evidence datasets and 5-level educational interpretations across all six core categories in ATOM:
1. **Environment (`atom-env-v1`):** Lifecycle GHG emissions, land use, water withdrawal, water consumption.
2. **Reliability (`atom-rel-v1`):** Capacity factor, firm capacity.
3. **Economics (`atom-econ-v1`):** Capital cost, levelized cost of electricity (LCOE), construction duration, plant lifetime.
4. **Human Impact (`atom-hum-v1`):** Mortality rate per TWh.
5. **Security (`atom-sec-v1`):** Fuel energy density.
6. **Technical (`atom-tech-v1`):** Surface power density, thermal efficiency, typical unit capacity.

## Key Invariants Verified

- Non-thermal generation options (solar PV, wind) have no thermal efficiency records.
- Water withdrawal is distinguished from water consumption.
- Capacity factor is distinguished from dependable firm capacity.
- All 34 canonical metrics have 5-level progressive educational narratives (Kid, Simple, Curious, Technical, Expert) with explicit limitations and system boundaries.
- Uncatalogued or unreviewed metrics gracefully render honest fallback notices without hallucinating editorial interpretation or data values.
