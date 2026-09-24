import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { usePlayback } from "./use-playback";
vi.mock("@/lib/accessibility/motion", () => ({
  useMotionPreferences: () => ({
    shouldAnimate: true,
    prefersReducedMotion: false,
  }),
}));
afterEach(() => vi.useRealTimers());
it("continues through multiple elapsed steps and stops on pause or completion", () => {
  vi.useFakeTimers();
  const step = vi.fn();
  const { result, rerender } = renderHook(
    ({ complete }) => usePlayback(step, complete),
    { initialProps: { complete: false } },
  );
  act(() => result.current.setPlaying(true));
  act(() => vi.advanceTimersByTime(4200));
  expect(step).toHaveBeenCalledTimes(3);
  act(() => result.current.setPlaying(false));
  act(() => vi.advanceTimersByTime(4200));
  expect(step).toHaveBeenCalledTimes(3);
  act(() => result.current.setPlaying(true));
  rerender({ complete: true });
  act(() => vi.advanceTimersByTime(4200));
  expect(step).toHaveBeenCalledTimes(3);
});
