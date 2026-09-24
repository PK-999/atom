import type { ComplexityLevel } from "@/lib/preferences/complexity-preference";
/** Explanation depth changes the reading, never the underlying experiment. */
export const EXHIBIT_EXPLANATIONS: Record<
  "atom" | "fuel" | "fission" | "decay",
  Record<ComplexityLevel, string>
> = {
  atom: {
    beginner:
      "An atom has a tiny center called a nucleus, with electrons around it. Select each part to take a closer look.",
    explorer:
      "Protons and neutrons are in the nucleus. The electron cloud illustrates where electrons may be found, rather than a solid shell.",
    curious:
      "The proton count identifies an element. Changing neutron count changes the isotope. The drawing enlarges the nucleus so both regions can be inspected.",
    "deep-dive":
      "Atomic number Z counts protons; mass number A counts protons plus neutrons. A neutral atom has Z electrons. These quantities describe identity; this geometry does not predict stability.",
    geeky:
      "The displayed cloud is conceptual, not a computed wavefunction or radial probability density. Neither its points nor the nucleus arrangement represents measured particle positions. A physical orbital model would need a specified quantum state.",
  },
  fuel: {
    beginner:
      "Small fuel pieces fit inside tubes. A bundle of tubes forms a fuel assembly. Explode the model to see the pieces.",
    explorer:
      "The model separates three parts: pellets, the surrounding rods, and the grids that hold the rods in place.",
    curious:
      "Fuel heats the surrounding coolant through its cladding. Spacer grids maintain the arrangement and coolant passages; the model is an illustrative assembly, not a particular plant specification.",
    "deep-dive":
      "Exploding the geometry changes the display only. It does not model deformation, coolant flow, cladding temperature, or a change in reactor power.",
    geeky:
      "This inspection model has no thermal-hydraulic solver, material properties, burnup history, or engineering tolerances. Its component identities remain the same in 2D and 3D; no performance estimate can be inferred from the spacing.",
  },
  fission: {
    beginner:
      "Follow one neutron toward a nucleus, then watch one possible split. Step moves the story forward.",
    explorer:
      "A captured neutron can lead to a split that releases energy and more neutrons. Not every capture causes fission.",
    curious:
      "This replay follows one event. Released neutrons may escape, be absorbed, or cause further fissions, but those branches are not calculated here.",
    "deep-dive":
      "The stage counter records one physical event per replay. Returning to an earlier visual stage does not create a second event. Fragment species, yields and incident neutron energy are unspecified.",
    geeky:
      "This is an event storyboard, not a Monte Carlo transport calculation. It has no cross-section library, neutron energy distribution, spatial leakage model or multiplication-factor calculation. The fixed visual sequence must not be interpreted as a probability distribution.",
  },
  decay: {
    beginner:
      "Watch the parent atoms disappear from the sample. The crossed cells mark atoms that have decayed.",
    explorer:
      "A half-life describes how quickly a population decreases on average. A small sample will not always lose exactly half its atoms at each step.",
    curious:
      "Expected remaining fraction is 2 raised to minus the number of elapsed half-lives. The seeded sample shows one possible population history beside that expectation.",
    "deep-dive":
      "For independent atoms with constant decay probability per unit time, N(t) = N₀ exp(−λt), with λ = ln(2)/T½. Expected population is continuous; the observed count is an integer.",
    geeky:
      "The seeded uniform thresholds generate a reproducible survival sample using the exponential survival function. Population variance is binomial under the independent-atom assumption. Daughter decays, mixtures, detector response and radiation dose are outside this model.",
  },
};
