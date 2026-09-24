"use client";
import { useEffect, useState } from "react";
import { useMotionPreferences } from "@/lib/accessibility/motion";

/** Teaching steps use elapsed time. Visibility pauses work, not the learner's play choice. */
export function usePlayback(step: () => void, complete: boolean) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visible, setVisible] = useState(true);
  const { shouldAnimate, prefersReducedMotion } = useMotionPreferences();
  useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  useEffect(() => {
    if (!playing || !visible || !shouldAnimate || complete) return;
    const timer = window.setInterval(step, 1400 / speed);
    return () => window.clearInterval(timer);
  }, [playing, visible, shouldAnimate, complete, speed, step]);
  return {
    target: setElement,
    playing,
    setPlaying,
    speed,
    setSpeed,
    prefersReducedMotion,
    suspended: playing && (!visible || !shouldAnimate),
  };
}
