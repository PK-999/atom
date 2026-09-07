# ATOM unit derivations

This record explains the factors used by `lib/evidence/unit-registry.ts`. The
registry converts within a physical dimension using each unit's
`factorToBase`:

```text
converted = value × source.factorToBase ÷ target.factorToBase
```

The factors are arithmetic conversions only. They do not make observations
methodologically comparable, adjust currencies across years or markets, or
replace a source's stated system boundary.

## Intensity conversions

### Area per energy

The canonical registry unit is `m2/MWh`:

```text
1 ha = 10,000 m2
1 TWh = 1,000,000 MWh
1 ha/TWh = 10,000 m2 / 1,000,000 MWh
          = 0.01 m2/MWh
```

Therefore:

| Conversion | Result |
| --- | ---: |
| `1 ha/TWh` → `m2/MWh` | `0.01` |
| `1 m2/MWh` → `ha/TWh` | `100` |

The registry stores `m2/MWh` with factor `1` and `ha/TWh` with factor
`0.01`.

### Mass per energy

The canonical registry unit is `kg/MWh`:

```text
1 t = 1,000 kg
1 TWh = 1,000,000 MWh
1 t/TWh = 1,000 kg / 1,000,000 MWh
          = 0.001 kg/MWh
```

Therefore:

| Conversion | Result |
| --- | ---: |
| `1 t/TWh` → `kg/MWh` | `0.001` |
| `1 kg/MWh` → `t/TWh` | `1,000` |

The registry stores `kg/MWh` with factor `1` and `t/TWh` with factor
`0.001`. The metric catalogue may still name `t/TWh` as a canonical display
unit for a metric; that catalogue choice does not change this dimensional
arithmetic.

## Other registry families checked in R02

| Family | Registry base and factors | Review note |
| --- | --- | --- |
| Energy | `Wh=1`, `kWh=1,000`, `MWh=1,000,000`, `GWh=1,000,000,000` | SI prefixes are consistent. |
| Power | `W=1`, `kW=1,000`, `MW=1,000,000`, `GW=1,000,000,000` | SI prefixes are consistent. |
| Duration | `days=1`, `months=30.4375`, `years=365.25` | Calendar averages are explicit assumptions, not fixed month lengths. |
| Emissions intensity | `gCO2e/kWh=1`, `kgCO2e/MWh=1`, `tCO2e/GWh=1` | These three ratios are dimensionally equivalent. |
| Volume intensity | `L/MWh=1`, `m3/MWh=1,000` | `1 m3=1,000 L`. |
| Mortality intensity | `deaths/TWh=1`, `deaths/PWh=0.001` | `1 PWh=1,000 TWh`. |
| Ratio | `ratio=1`, `% = 0.01` | Percentages are represented as unitless ratios. |
| Energy density | `MJ/kg=1` | No alternate unit is currently registered. |
| Power density | `W/m2=1` | No alternate unit is currently registered. |
| Currency denominators | `USD/kW=1`, `USD/MWh=1` | Power and energy are separate dimensions; currency-year and market adjustments are contextual transformations, not generic scale conversions. |

Cross-dimension conversions remain errors. A finite number and two known units
are not sufficient: `MW` cannot be converted to `MWh`, for example.

## Lineage and correction policy

`normalizeObservation` converts point values and every range endpoint on a
deep clone, appending a `unit-conversion` transformation without mutating the
source observation. The source observation remains the authoritative record.

R02 searched the current callers, metric catalogue, source data, ingestion
records, and database fixtures for the affected area and mass intensity units.
No published derived records were found in this checkout. The prior factors
were nevertheless scientifically wrong, so any future dataset that was
generated with them must be corrected by creating a new immutable dataset or
observation version, recording the correction and transformation version, and
reviewing it before release. Existing source observations must never be
silently overwritten.
