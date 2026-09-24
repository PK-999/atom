/** Teaching prompts and direct background reading; not scientific sign-off records. */
const nrc =
  "https://www.nrc.gov/education-regulatory-research/the-student-corner/science-101/";
export const LESSON_GUIDES: Record<
  string,
  {
    question: string;
    prediction: string;
    source: { title: string; url: string };
  }
> = {
  energy: {
    question: "Can the same power produce different amounts of energy?",
    prediction: "What changes if a device runs for twice as long?",
    source: {
      title: "EIA: Measuring electricity",
      url: "https://www.eia.gov/energyexplained/electricity/measuring-electricity.php",
    },
  },
  atom: {
    question: "What makes one element different from another?",
    prediction: "Will changing the number of neutrons change the element?",
    source: { title: "NRC: What is an atom?", url: nrc + "what-is-an-atom" },
  },
  fission: {
    question: "How can a neutron start a fission event?",
    prediction: "What might happen after a nucleus absorbs a neutron?",
    source: {
      title: "NRC: What is a chain reaction?",
      url: nrc + "what-is-a-chain-reaction",
    },
  },
  reactor: {
    question: "How are fuel and control systems arranged?",
    prediction: "What would you expect when more control rods enter the core?",
    source: {
      title: "NRC: What is nuclear fuel?",
      url: nrc + "what-is-nuclear-fuel",
    },
  },
  "electricity-generation": {
    question: "How does heat become electricity?",
    prediction: "Which step turns heat into motion?",
    source: {
      title: "NRC: How does a nuclear power plant make electricity?",
      url: nrc + "how-does-a-nuclear-power-plant-make-electricity",
    },
  },
  safety: {
    question: "Why use several barriers instead of just one?",
    prediction:
      "What can one barrier protect against, and what else is needed?",
    source: {
      title: "NRC: Backgrounder on nuclear reactor risk",
      url: "https://www.nrc.gov/regulations-legislation/fact-sheets-brochures/backgrounder-on-nuclear-reactor-risk",
    },
  },
  waste: {
    question: "Does one half-life mean all the atoms have decayed?",
    prediction: "How many parent atoms do you expect after two half-lives?",
    source: {
      title: "NRC: Radioactive waste",
      url: "https://www.nrc.gov/waste",
    },
  },
};
