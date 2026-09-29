export type ExperimentId =
  "fission" | "atom" | "fuel" | "decay" | "reactor" | "grid";

export interface ExperimentDefinition {
  id: ExperimentId;
  title: string;
  shortTitle: string;
  kicker: string;
  description: string;
  outcome: string;
  icon: string;
  released: true;
}

export const EXPERIMENTS = [
  {
    id: "fission",
    title: "Follow one fission",
    shortTitle: "Fission",
    kicker: "A chain reaction, one event at a time",
    description:
      "Predict what a neutron will do, trigger a split, and watch energy leave the nucleus as motion and heat.",
    outcome: "Learn why control is about probability, geometry, and feedback.",
    icon: "✦",
    released: true,
  },
  {
    id: "atom",
    title: "Meet the atom",
    shortTitle: "Inside the atom",
    kicker: "Scale changes the question",
    description:
      "Zoom from an electron cloud to the compact nucleus and compare the pieces that make an element.",
    outcome:
      "See why most of an atom is space without treating a diagram as a photograph.",
    icon: "⚛",
    released: true,
  },
  {
    id: "fuel",
    title: "Inspect a fuel assembly",
    shortTitle: "Fuel assembly",
    kicker: "From ceramic pellet to reactor core",
    description:
      "Peel back a fuel rod, find the pellets and spacer grids, and trace where heat starts.",
    outcome: "Connect a material object to the coolant loops it serves.",
    icon: "▥",
    released: true,
  },
  {
    id: "decay",
    title: "Replay radioactive decay",
    shortTitle: "Radioactive decay",
    kicker: "Half-life is a population pattern",
    description:
      "Run a seeded sample forward, pause it, and compare the expected curve with the noisy individual events.",
    outcome:
      "Separate what is predictable for a population from what is unknowable for one nucleus.",
    icon: "◌",
    released: true,
  },
  {
    id: "reactor",
    title: "Tune reactor controls",
    shortTitle: "Reactor controls",
    kicker: "Feedback keeps a system in bounds",
    description:
      "Move control inputs through a conceptual reactor model and inspect the heat-to-electricity pathway.",
    outcome:
      "Understand why a display control is an educational model, not a plant operating procedure.",
    icon: "◈",
    released: true,
  },
  {
    id: "grid",
    title: "Balance a town's annual grid",
    shortTitle: "Annual grid balance",
    kicker: "Annual energy is not hourly reliability",
    description:
      "Add generation to a bounded town scenario and compare annual demand, surplus, and shortfall.",
    outcome: "Keep capacity, energy, and reliability as separate questions.",
    icon: "⌁",
    released: true,
  },
] as const satisfies readonly ExperimentDefinition[];

export type PrimaryNavigationId = "learn" | "play" | "myths" | "india";

export interface NavigationItem {
  id: PrimaryNavigationId;
  label: string;
  href: string;
  released: boolean;
}

const NAVIGATION_CATALOG: readonly NavigationItem[] = [
  { id: "learn", label: "Learn", href: "/learn", released: true },
  { id: "play", label: "Play", href: "/explore", released: true },
  { id: "myths", label: "Myths", href: "/myths", released: true },
  { id: "india", label: "India", href: "/india", released: false },
];

export function getPrimaryNavigation(
  options: { indiaReleased?: boolean } = {},
) {
  return NAVIGATION_CATALOG.filter(
    (item) => item.released || (item.id === "india" && options.indiaReleased),
  );
}

export function getExperiment(id: string | null | undefined) {
  return EXPERIMENTS.find((experiment) => experiment.id === id);
}

export function parseExperimentId(
  value: string | null | undefined,
):
  { id: ExperimentId } | { id: ExperimentId; fallback: true; message: string } {
  if (!value) return { id: "fission" };
  if (getExperiment(value)) return { id: value as ExperimentId };
  return {
    id: "fission",
    fallback: true,
    message: "That experiment is not available yet. Showing Fission instead.",
  };
}

export function toExperimentHref(id: ExperimentId) {
  return `/simulations?experiment=${id}`;
}
