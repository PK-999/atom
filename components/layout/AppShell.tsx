import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeControl } from "@/components/settings/ThemeControl";

import { GlobalComplexityControl } from "./GlobalComplexityControl";
import styles from "./AppShell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link aria-label="ATOM home" className={styles.wordmark} href="/">
            ATOM
          </Link>
          <nav aria-label="Primary navigation" className={styles.navigation}>
            <Link href="/learn">Learn</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/topics">Topics</Link>
            <Link href="/search">Search</Link>
            <Link href="/methodology">Evidence</Link>
          </nav>
          <div className={styles.preferences}>
            <GlobalComplexityControl />
            <ThemeControl />
          </div>
        </div>
      </header>
      <main className={styles.content} id="main-content">
        {children}
      </main>
      <footer className={styles.footer}>
        <p>Verify ATOM through its sources, methods, and correction history.</p>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link>
          <Link href="/glossary">Glossary</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/corrections">Corrections</Link>
          <Link href="/methodology">Evidence policy</Link>
          <Link href="/compare">Comparison Lab</Link>
        </nav>
      </footer>
    </div>
  );
}
