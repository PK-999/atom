"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getMotionMediaQuery() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
    ? window.matchMedia(REDUCED_MOTION_QUERY)
    : null;
}

export function subscribeReducedMotion(listener: () => void) {
  const media = getMotionMediaQuery();
  if (!media) return () => undefined;
  if (media.addEventListener) media.addEventListener("change", listener);
  else media.addListener?.(listener);
  return () => {
    if (media.removeEventListener)
      media.removeEventListener("change", listener);
    else media.removeListener?.(listener);
  };
}

export function getReducedMotionSnapshot() {
  return getMotionMediaQuery()?.matches ?? false;
}

export function subscribeDocumentVisibility(listener: () => void) {
  if (typeof document === "undefined") return () => undefined;
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}

export function getDocumentVisibilitySnapshot() {
  return (
    typeof document === "undefined" || document.visibilityState === "visible"
  );
}

export function useMotionPreferences() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const isDocumentVisible = useSyncExternalStore(
    subscribeDocumentVisibility,
    getDocumentVisibilitySnapshot,
    () => true,
  );

  return {
    prefersReducedMotion,
    isDocumentVisible,
    shouldAnimate: !prefersReducedMotion && isDocumentVisible,
  };
}
