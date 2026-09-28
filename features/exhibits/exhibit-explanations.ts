import type { ExplanationContent } from "@/lib/education/schemas";

export const EXHIBIT_EXPLANATIONS: Record<
  "atom" | "fuel" | "fission" | "decay",
  ExplanationContent
> = {
  atom: {
    summary:
      "An atom has a tiny nucleus, with electrons around it. Select each part to take a closer look.",
    body: [
      "Protons identify the element; changing the neutron count changes the isotope. The nucleus is enlarged here so both regions can be inspected.",
    ],
    details: [
      {
        id: "identity",
        title: "Atomic number and mass number",
        body: "Atomic number Z counts protons; mass number A counts protons plus neutrons. A neutral atom has Z electrons. These quantities describe identity, not stability.",
      },
      {
        id: "cloud",
        title: "What does the cloud show?",
        body: "The cloud is conceptual, not a computed wavefunction or measured particle positions. A physical orbital model would need a specified quantum state.",
      },
    ],
    citationIds: [],
  },
  fuel: {
    summary:
      "Fuel pellets fit inside rods. A bundle of rods forms a fuel assembly.",
    body: [
      "Separate the pieces to inspect the pellets, cladding and spacer grids. Fuel transfers heat through its cladding to the coolant; grids maintain the arrangement and coolant passages.",
    ],
    details: [
      {
        id: "geometry",
        title: "Does separating the pieces change the physics?",
        body: "No. This illustrative assembly has no thermal-hydraulic solver, material properties, burnup history or engineering tolerances. Changing the display does not calculate deformation, flow, temperature or power.",
      },
    ],
    citationIds: [],
  },
  fission: {
    summary:
      "Follow one neutron toward a nucleus, then watch one possible split.",
    body: [
      "Neutron capture can lead to fission, releasing energy and more neutrons. Not every capture causes a split. Released neutrons may escape, be absorbed or cause further fissions; those branches are not calculated here.",
    ],
    details: [
      {
        id: "event",
        title: "What does the event counter count?",
        body: "The counter records one event per replay. Revisiting a stage does not create a second event. Fragment species, yields and incident neutron energy are unspecified.",
      },
      {
        id: "probability",
        title: "Does this predict a chain reaction?",
        body: "This is a storyboard, not a neutron-transport calculation. It has no cross-section library, energy distribution, leakage model or multiplication-factor calculation. The fixed sequence is not a probability distribution.",
      },
    ],
    citationIds: [],
  },
  decay: {
    summary:
      "Watch parent atoms decay. The crossed cells mark atoms that have changed.",
    body: [
      "A half-life describes how a population decreases on average. A small sample will not always lose exactly half its atoms at each step. The seeded sample shows one possible history beside the expected remaining fraction.",
    ],
    details: [
      {
        id: "equation",
        title: "The decay equation",
        body: "For independent atoms with a constant decay probability per unit time, N(t) = N₀ exp(−λt), where λ = ln(2)/T½. The expected remaining fraction is 2 raised to minus the elapsed half-lives. The expected population is continuous; a sample count is an integer.",
      },
      {
        id: "sample",
        title: "Why does the sample vary?",
        body: "Seeded uniform thresholds produce a reproducible sample using exponential survival. Population variance is binomial under the independent-atom assumption. Daughter decays, mixtures, detector response and radiation dose are outside this model.",
      },
    ],
    citationIds: [],
  },
};
