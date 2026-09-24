export type ExhibitKind = "atom" | "fuel" | "fission";
export const EXHIBIT_PARTS = {
  atom: [
    {
      id: "nucleus",
      label: "Nucleus",
      text: "Protons and neutrons form the nucleus. The drawing greatly enlarges it relative to the atom.",
    },
    {
      id: "electrons",
      label: "Electron cloud",
      text: "Electrons are described by quantum states, not tiny planets on fixed orbital tracks. The cloud is conceptual.",
    },
  ],
  fuel: [
    {
      id: "pellets",
      label: "Fuel pellets",
      text: "Ceramic fuel pellets sit inside metal cladding. The central rod is shown as a cutaway.",
    },
    {
      id: "rods",
      label: "Cladding and rods",
      text: "Cladding separates fuel from coolant. Rods are arranged into an assembly; geometry differs among reactor designs.",
    },
    {
      id: "spacers",
      label: "Spacer grids",
      text: "Spacer grids help hold the rods in position and maintain coolant passages.",
    },
  ],
  fission: [
    {
      id: "nucleus",
      label: "Nucleus and fragments",
      text: "This storyboard follows one fission event. Fragment identities and neutron yields vary between real events.",
    },
    {
      id: "neutrons",
      label: "Neutrons",
      text: "An incoming neutron can initiate fission. Released neutrons may cause further fissions, be absorbed, or escape.",
    },
  ],
} as const;
