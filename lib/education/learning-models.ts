/** Unit identity: constant power in kW × duration in hours = energy in kWh. */
export function energyFromPower(powerKw: number, hours: number): number | null {
  if (
    !Number.isFinite(powerKw) ||
    !Number.isFinite(hours) ||
    powerKw < 0 ||
    hours < 0
  )
    return null;
  const energy = powerKw * hours;
  return Number.isFinite(energy) ? energy : null;
}
const ELEMENTS: Record<number, string> = {
  1: "Hydrogen",
  2: "Helium",
  6: "Carbon",
  8: "Oxygen",
  26: "Iron",
  92: "Uranium",
};
/** Atomic identity only. Stability and fission probability require separate nuclear data. */
export function atomIdentity(protons: number, neutrons: number) {
  if (
    !Number.isInteger(protons) ||
    !Number.isInteger(neutrons) ||
    protons < 1 ||
    protons > 118 ||
    neutrons < 0 ||
    neutrons > 200
  )
    return null;
  return {
    name: ELEMENTS[protons] ?? `Element with atomic number ${protons}`,
    massNumber: protons + neutrons,
    electrons: protons,
  };
}
