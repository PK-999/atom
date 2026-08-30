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

## Full Catalog

| Category | Metric identifier | Scientific unit contract | Required review | Initial status |
| --- | --- | --- | --- | --- |
| Environment | `lifecycle-emissions` | `gCO2e/kWh` | Lifecycle boundary, central/range meaning, geography | unreviewed |
| Environment | `land-use` | `m2/GWh` | Direct versus lifecycle land, facility lifetime | unreviewed |
| Environment | `water-withdrawal` | `L/MWh` | Withdrawal definition, cooling technology, region | unreviewed |
| Environment | `water-consumption` | `L/MWh` | Consumption definition, cooling technology, region | unreviewed |
| Environment | `material-intensity` | `t/TWh` | Included materials, lifetime, recycling boundary | unreviewed |
| Environment | `mining-intensity` | Source-defined pending normalization review | Ore grade, fuel cycle, included materials | unreviewed |
| Environment | `waste-volume` | Source-defined pending normalization review | Waste class, conditioning, lifecycle boundary | unreviewed |
| Environment | `waste-persistence` | No single canonical unit until method review | Hazard definition, timescale, toxicity model | unreviewed |
| Reliability | `capacity-factor` | `%` | Fleet versus plant, period, outage treatment | unreviewed |
| Reliability | `dispatchability` | Categorical evidence contract | Operational definition and system context | unreviewed |
| Reliability | `variability` | Source-defined pending normalization review | Temporal resolution and geographic aggregation | unreviewed |
| Reliability | `capacity-credit` | `%` | Penetration, system, method, scenario | unreviewed |
| Reliability | `storage-dependence` | Scenario-specific | Demand, generation mix, reliability target | unreviewed |
| Economics | `capital-cost` | `USD/kW` with currency year | Overnight/total cost, region, project vintage | unreviewed |
| Economics | `operating-cost` | `USD/MWh` with currency year | Fixed/variable boundary and utilization | unreviewed |
| Economics | `fuel-cost` | `USD/MWh` with currency year | Fuel-cycle boundary and price period | unreviewed |
| Economics | `lcoe` | `USD/MWh` with currency year | Discount rate, lifetime, capacity factor, system costs | unreviewed |
| Economics | `construction-duration` | `years` | Start/end definition and project population | unreviewed |
| Economics | `plant-lifetime` | `years` | Design, licensed, or observed lifetime | unreviewed |
| Economics | `decommissioning-cost` | Source-defined with currency year | Scope, funding method, waste inclusion | unreviewed |
| Economics | `financing-sensitivity` | Model output | Discount rate and all scenario assumptions | unreviewed |
| Human impact | `mortality` | `deaths/TWh` | Direct, modeled, air-pollution, accident boundaries | unreviewed |
| Human impact | `air-pollution-impact` | Source-defined pending method review | Pollutants, exposure model, geography | unreviewed |
| Human impact | `occupational-impact` | Source-defined pending method review | Injury/fatality definition and supply-chain boundary | unreviewed |
| Human impact | `accident-risk` | Source-defined pending method review | Frequency, severity, confirmed versus modeled effects | unreviewed |
| Human impact | `displacement` | `people` or `person-years`, kept distinct | Cause, duration, policy versus hazard | unreviewed |
| Energy security | `fuel-energy-density` | `MJ/kg` | Thermal/electric basis and usable fuel fraction | unreviewed |
| Energy security | `stockpiling-potential` | Source-defined pending method review | Processing stage, duration, storage assumptions | unreviewed |
| Energy security | `import-dependency` | `%` | Country, period, fuel-cycle stage | unreviewed |
| Energy security | `supply-chain-concentration` | Source-defined pending method review | Market stage, concentration method, period | unreviewed |
| Technical | `power-density` | `W/m2` | Site/system boundary and capacity/generation basis | unreviewed |
| Technical | `thermal-efficiency` | `%` | Gross/net and operating conditions | unreviewed |
| Technical | `refueling-cycle` | `months` | Reactor/plant design and outage definition | unreviewed |
| Technical | `typical-unit-capacity` | `MW` | Nameplate/net and technology variant | unreviewed |

For each metric, the evidence release record must separately declare supported technologies, geography, period, Typical/Range/Raw availability, and redistribution license.
