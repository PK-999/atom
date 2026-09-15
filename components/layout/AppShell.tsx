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
            <span className={styles.atomSymbol} aria-hidden="true">
              ⚛
            </span>
            <span className={styles.brandName}>ATOM</span>
          </Link>
          <nav aria-label="Primary navigation" className={styles.navigation}>
            <Link href="/explore">Explore</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/reactors">Reactors</Link>
            <Link href="/simulations">Simulations</Link>
            <Link href="/radiation">Radiation</Link>
            <Link href="/incidents">Incidents</Link>
            <Link href="/myths">Myths</Link>
            <Link href="/debates">Debate</Link>
            <Link href="/learn">Learn</Link>
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
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.atomSymbol} aria-hidden="true">
              ⚛
            </span>
            <strong>ATOM</strong>
            <p>
              An evidence-first interactive energy-literacy platform. Verify
              ATOM through its sources, methods, and peer-reviewed data.
            </p>
          </div>
          <div className={styles.footerLinksGrid}>
            <div>
              <span className={styles.footerHeading}>Learn & Explore</span>
              <nav aria-label="Footer learning navigation">
                <Link href="/explore">Explore Hub</Link>
                <Link href="/how-it-works">How It Works</Link>
                <Link href="/learn">Curriculum</Link>
                <Link href="/myths">Myth Busting</Link>
                <Link href="/incidents">Incidents & FAQs</Link>
              </nav>
            </div>
            <div>
              <span className={styles.footerHeading}>Tools & Data</span>
              <nav aria-label="Footer tools navigation">
                <Link href="/compare">Comparison Lab</Link>
                <Link href="/reactors">Reactor Directory</Link>
                <Link href="/simulations">Simulators</Link>
                <Link href="/radiation">Radiation Dose</Link>
                <Link href="/debates">Debate Engine</Link>
              </nav>
            </div>
            <div>
              <span className={styles.footerHeading}>Integrity</span>
              <nav aria-label="Footer navigation">
                <Link href="/methodology">Evidence Policy</Link>
                <Link href="/glossary">Glossary</Link>
                <Link href="/about">About & Sources</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>
            © ATOM Energy Literacy Project. All scientific claims inspectable
            with citations.
          </p>
        </div>
      </footer>
    </div>
  );
}
