# Multi-Category Evidence Synthesis Review Record

**Date:** 2026-09-07  
**Dataset IDs:**  
- `atom-dataset-environment` (Version: `atom-env-v1`)
- `atom-dataset-reliability` (Version: `atom-rel-v1`)
- `atom-dataset-economics` (Version: `atom-econ-v1`)
- `atom-dataset-human-impact` (Version: `atom-hum-v1`)
- `atom-dataset-security` (Version: `atom-sec-v1`)
- `atom-dataset-technical` (Version: `atom-tech-v1`)

**Primary Sources:**
- IPCC AR5 WG3 Annex III (Lifecycle Emissions, Land Use, Water Intensity)
- NREL Life Cycle Assessment Harmonization Project
- Lazard / IEA Projected Costs of Generating Electricity (2024 Synthesis)
- Our World in Data / Markandya & Wilkinson (Energy Safety & Mortality per TWh)
- USGS / World Nuclear Association Energy Density & Technical Database

## Scientific & Methodological Review

1. **Category Boundaries:**
   - **Environment:** Water withdrawal and consumption are tracked separately. Water withdrawal encompasses total flow drawn through cooling systems, while water consumption strictly tracks evaporative losses not returned to the local catchment.
   - **Reliability:** Capacity factor (annualized energy output over theoretical nameplate maximum) is separated from firm capacity (dependable capacity credit during peak net demand). Intermittent renewables receive realistic firm capacity credits (8–12%) distinct from capacity factor (24–36%).
   - **Economics:** Capital costs (overnight turnkey cost in 2024 USD/kW) and LCOE (unsubsidized levelized cost of electricity) are harmonized to 2024 real dollars. Construction duration and operational lifetime bounds are preserved.
   - **Human Impact:** Mortality rates (deaths per TWh generated) incorporate lifecycle accidents, mining hazards, and air pollution exposure models.
   - **Security:** Fuel energy density (MJ/kg thermal equivalent) documents physical material energy content across nuclear, gas, coal, and biomass.
   - **Technical:** Power density (W/m2 surface output) and typical unit capacities are established. Thermal efficiency (gross thermal to electric efficiency) is strictly restricted to thermal generation sources; non-thermal systems (solar PV, wind, hydro) are explicitly omitted to prevent scientific category errors.

2. **Licensing & Redistribution:**
   - Source data is synthesised from publicly accessible peer-reviewed literature and institutional databases under Creative Commons Attribution licenses. Raw and aggregated point metrics are permitted for redistribution.

3. **Publication Status:**
   - Status: `published`
   - Reviewed by: `synthetic-reviewer-r08`
   - Verified on: `2026-09-07`
