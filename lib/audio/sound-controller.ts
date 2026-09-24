"use client";
import { useSyncExternalStore } from "react";
let enabled = false;
let generation = 0;
let context: AudioContext | null = null;
const voices = new Set<OscillatorNode>();
const listeners = new Set<() => void>();
function stop() {
  voices.forEach((voice) => {
    try {
      voice.stop();
    } catch {}
  });
  voices.clear();
}
export function muteSound() {
  generation += 1;
  enabled = false;
  stop();
  void context?.suspend();
  listeners.forEach((fn) => fn());
}
export async function enableSound() {
  const request = ++generation;
  try {
    context ??= new AudioContext();
    const requestedContext = context;
    await requestedContext.resume();
    if (
      request !== generation ||
      requestedContext !== context ||
      document.hidden
    )
      return;
    enabled = true;
    listeners.forEach((fn) => fn());
  } catch {
    muteSound();
  }
}
export function playCue(complete = false) {
  if (!enabled || !context || document.hidden) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(complete ? 660 : 440, now);
  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  oscillator.connect(gain).connect(context.destination);
  voices.add(oscillator);
  oscillator.onended = () => {
    voices.delete(oscillator);
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.start();
  oscillator.stop(now + 0.12);
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const visibility = () => {
    if (document.hidden) muteSound();
  };
  document.addEventListener("visibilitychange", visibility);
  return () => {
    listeners.delete(listener);
    document.removeEventListener("visibilitychange", visibility);
    if (listeners.size === 0) {
      muteSound();
      void context?.close();
      context = null;
    }
  };
}
export function useSound() {
  return useSyncExternalStore(
    subscribe,
    () => enabled,
    () => false,
  );
}
