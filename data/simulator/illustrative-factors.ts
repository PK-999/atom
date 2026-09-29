/**
 * Educational-only inputs for the annual grid exhibit.
 *
 * These values are deliberately kept outside the pure model and are not a
 * reviewed evidence release. The simulator labels the resulting output as
 * illustrative and shows unavailable when a source has no factor.
 */
export const ILLUSTRATIVE_LIFECYCLE_FACTORS = {
  nuclear: 12,
  wind: 12,
  solar: 45,
  hydro: 24,
  geothermal: 38,
  gas: 490,
  coal: 820,
  oil: 720,
  biomass: 230,
} as const;
