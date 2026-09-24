import { calculateRemainingFraction } from "@/lib/simulator/decay-model";
/** Fixed independent lifetimes, sampled once per seed. Playback speed cannot change outcomes. */
export function sampleDecayPopulation(
  count: number,
  halfLives: number,
  seed = 42,
): boolean[] {
  if (
    !Number.isInteger(count) ||
    count < 0 ||
    count > 10000 ||
    !Number.isFinite(halfLives) ||
    halfLives < 0 ||
    !Number.isInteger(seed)
  )
    throw new Error("Invalid population inputs");
  let randomState = seed >>> 0;
  const survival = calculateRemainingFraction(halfLives);
  return Array.from({ length: count }, () => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return (randomState + 0.5) / 4294967296 < survival;
  });
}
