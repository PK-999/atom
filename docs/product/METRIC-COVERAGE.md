# Comparison Lab Metric Coverage Register

## Status Vocabulary

- `unreviewed`: no publication decision has been made.
- `supported`: reviewed comparable evidence is publishable.
- `partial`: evidence is publishable for only some technologies, regions, periods, or modes.
- `incompatible`: credible evidence exists but cannot be compared fairly under one view.
- `unavailable`: reliable comparable evidence has not been identified.
- `restricted`: licensing prevents observation-level publication.

All metrics begin as `unreviewed`. A release changes status only after source, methodology, transformation, licensing, and editorial review. `unavailable`, `incompatible`, and `restricted` are valid final outcomes.

## Technology Register

Initial coverage assessment includes nuclear, solar, wind, gas, coal, hydro, storage, biomass, and geothermal. Technology variants must be separated when aggregation would hide material design or operating differences.
Non-thermal technologies (solar, wind, hydro) are explicitly barred from receiving thermal efficiency observations.

## Metric Catalog Status (R08 Multi-Category Synthesis)

| Category | Metric identifier | Scientific unit contract | Active dataset version | Supported technologies | Status |
| --- | --- | --- | --- | --- | --- |
| Environment | `lifecycle-ghg` | `gCO2e/kWh` | `atom-env-v1` | All 9 technologies | `supported` |
| Environment | `land-use` | `m2/MWh` | `atom-env-v1` | All 9 technologies | `supported` |
| Environment | `water-withdrawal` | `L/MWh` | `atom-env-v1` | nuclear, gas, coal, solar, wind, hydro | `supported` |
| Environment | `water-consumption` | `L/MWh` | `atom-env-v1` | nuclear, gas, coal, solar, wind, hydro | `supported` |
| Environment | `material-requirements` | `t/TWh` | pending | — | `partial` |
| Environment | `mining-intensity` | Source-defined | pending | — | `unreviewed` |
| Environment | `waste-volume` | `m3/TWh` | pending | — | `unreviewed` |
| Environment | `waste-persistence` | No single canonical unit | pending | — | `incompatible` |
| Reliability | `capacity-factor` | `%` | `atom-rel-v1` | nuclear, solar, wind, gas, coal, hydro, geothermal | `supported` |
| Reliability | `firm-capacity` | `%` | `atom-rel-v1` | nuclear, gas, coal, hydro, solar, wind | `supported` |
| Reliability | `dispatchability` | Categorical | pending | — | `partial` |
| Reliability | `variability` | Source-defined | pending | — | `unreviewed` |
| Reliability | `storage-dependence` | Scenario-specific | pending | — | `partial` |
| Economics | `capital-cost` | `USD/kW` (2024 USD) | `atom-econ-v1` | nuclear, solar, wind, gas, coal, hydro | `supported` |
| Economics | `lcoe` | `USD/MWh` (2024 USD) | `atom-econ-v1` | nuclear, solar, wind, gas, coal, hydro | `supported` |
| Economics | `construction-duration` | `years` | `atom-econ-v1` | nuclear, solar, wind, gas, coal, hydro | `supported` |
| Economics | `plant-lifetime` | `years` | `atom-econ-v1` | nuclear, solar, wind, gas, coal, hydro | `supported` |
| Economics | `operating-cost` | `USD/MWh` | pending | — | `unreviewed` |
| Economics | `fuel-cost` | `USD/MWh` | pending | — | `unreviewed` |
| Economics | `decommissioning-cost` | `USD/kW` | pending | — | `unreviewed` |
| Economics | `financing-sensitivity` | Model output | pending | — | `partial` |
| Human impact | `mortality-rate` | `deaths/TWh` | `atom-hum-v1` | nuclear, solar, wind, hydro, gas, coal, biomass | `supported` |
| Human impact | `air-pollution` | Source-defined | pending | — | `unreviewed` |
| Human impact | `occupational-hazard` | Source-defined | pending | — | `unreviewed` |
| Human impact | `accident-risk` | Source-defined | pending | — | `partial` |
| Human impact | `displacement` | `people` or `person-years` | pending | — | `partial` |
| Security | `fuel-energy-density` | `MJ/kg` | `atom-sec-v1` | nuclear, gas, coal, biomass | `supported` |
| Security | `stockpiling-potential` | Source-defined | pending | — | `unreviewed` |
| Security | `import-dependence` | `%` | pending | — | `partial` |
| Security | `supply-chain-concentration` | HHI / market share | pending | — | `unreviewed` |
| Technical | `power-density` | `W/m2` | `atom-tech-v1` | nuclear, gas, coal, solar, wind, hydro | `supported` |
| Technical | `thermal-efficiency` | `%` | `atom-tech-v1` | nuclear, gas, coal, biomass, geothermal (thermal only) | `supported` |
| Technical | `unit-capacity` | `MW` | `atom-tech-v1` | nuclear, gas, coal, hydro, wind, solar | `supported` |
| Technical | `refueling-cycle` | `months` | pending | — | `unreviewed` |

For each metric, the evidence release record separately declares supported technologies, geography, period, Typical/Range/Raw availability, and redistribution license.
