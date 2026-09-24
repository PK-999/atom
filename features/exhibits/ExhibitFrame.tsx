"use client";
import type { ReactNode } from "react";
import { useComplexityPreference } from "@/components/settings/ComplexitySelector";
import { EXHIBIT_EXPLANATIONS } from "./exhibit-explanations";
import Link from "next/link";
import { useSound, enableSound, muteSound } from "@/lib/audio/sound-controller";
import styles from "./ExhibitFrame.module.css";
export function ExhibitFrame({
  title,
  children,
  limitation,
  exhibit,
}: {
  title: string;
  children: ReactNode;
  limitation: string;
  exhibit?: keyof typeof EXHIBIT_EXPLANATIONS;
}) {
  const sound = useSound();
  const [level] = useComplexityPreference("curious");
  return (
    <section className={styles.frame} aria-label={title}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>The hands-on collection</span>
          <h2>{title}</h2>
        </div>
        <button
          type="button"
          aria-pressed={sound}
          onClick={() => (sound ? muteSound() : void enableSound())}
        >
          Sound {sound ? "on" : "off"}
        </button>
      </header>
      {children}
      {exhibit && (
        <aside aria-label="Explanation at your reading depth">
          <h3>Look a little closer</h3>
          <p>{EXHIBIT_EXPLANATIONS[exhibit][level]}</p>
        </aside>
      )}
      <details className={styles.limit}>
        <summary>What this model represents</summary>
        <p>{limitation}</p>
        <Link href="/methodology">Evidence and model limitations</Link>
      </details>
    </section>
  );
}
