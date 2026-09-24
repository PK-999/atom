/** Learning order is independent of explanation depth. Only existing released lessons are linked. */
export const LEARNING_PATHS = [
  {
    id: "fundamentals",
    title: "Start with the fundamentals",
    description:
      "Build a foundation, from energy and atoms to safety and waste.",
    lessons: [
      "energy",
      "atom",
      "fission",
      "reactor",
      "electricity-generation",
      "safety",
      "waste",
    ],
  },
  {
    id: "inside-reactor",
    title: "Look inside a reactor",
    description: "Follow the parts, the reaction and the transfer of heat.",
    lessons: ["atom", "fission", "reactor", "electricity-generation"],
  },
  {
    id: "risk-and-responsibility",
    title: "Explore safety and waste",
    description:
      "Start with atomic structure, then examine barriers and spent fuel.",
    lessons: ["atom", "fission", "safety", "waste"],
  },
] as const;
export function getLearningPath(id: string | undefined) {
  return LEARNING_PATHS.find((path) => path.id === id) ?? LEARNING_PATHS[0];
}
