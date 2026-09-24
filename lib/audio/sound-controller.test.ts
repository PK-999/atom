import { expect, it, vi } from "vitest";
it("does not undo mute when an earlier audio resume resolves", async () => {
  let resumed!: () => void;
  const resume = new Promise<void>((resolve) => {
    resumed = resolve;
  });
  const createOscillator = vi.fn();
  vi.stubGlobal(
    "AudioContext",
    class {
      resume = () => resume;
      suspend = () => Promise.resolve();
      createOscillator = createOscillator;
    },
  );
  const sound = await import("./sound-controller");
  const enabling = sound.enableSound();
  sound.muteSound();
  resumed();
  await enabling;
  sound.playCue();
  expect(createOscillator).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
});
