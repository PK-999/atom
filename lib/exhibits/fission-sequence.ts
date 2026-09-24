/** Conceptual single-event storyboard, not a transport or reactor kinetics model. */
export interface FissionSequence {
  stage: number;
  events: number;
}
export const FISSION_STAGES = [
  {
    name: "Approach",
    text: "A neutron approaches a uranium-235 nucleus. Not every neutron encounter causes fission.",
  },
  {
    name: "Capture",
    text: "The nucleus absorbs the neutron, forming an excited uranium-236 nucleus.",
  },
  {
    name: "Deformation",
    text: "In this selected fission pathway, the excited nucleus deforms before separating.",
  },
  {
    name: "Split",
    text: "Two fragments move apart and neutrons are released. Their energy is transferred to surrounding material as heat. Other fission pathways produce different fragments.",
  },
] as const;
export function createFissionSequence(): FissionSequence {
  return { stage: 0, events: 0 };
}
export function selectFissionStage(
  state: FissionSequence,
  stage: number,
): FissionSequence {
  if (!Number.isInteger(stage) || stage < 0 || stage >= FISSION_STAGES.length)
    return state;
  return { stage, events: Math.max(state.events, stage === 3 ? 1 : 0) };
}
export function stepFissionSequence(state: FissionSequence): FissionSequence {
  return selectFissionStage(state, Math.min(3, state.stage + 1));
}
