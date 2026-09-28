"use client";
import type { ReactNode } from "react";
import { Explanation } from "@/components/education/Explanation";
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
        <aside aria-label="About this experiment">
          <h3>Look a little closer</h3>
          <Explanation content={EXHIBIT_EXPLANATIONS[exhibit]} />
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
