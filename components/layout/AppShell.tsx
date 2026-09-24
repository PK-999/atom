import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeControl } from "@/components/settings/ThemeControl";

import { MobileMenu } from "./MobileMenu";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
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
            <Link href="/learn">Learn</Link>
            <Link href="/explore">Explore</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/evidence">Evidence</Link>
          </nav>
          <MobileMenu />
          <div className={styles.preferences}>
            <Link
              href="/search"
              className={styles.searchUtility}
              aria-label="Search ATOM"
            >
              <MagnifyingGlass size={20} aria-hidden />
            </Link>
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
              ATOM through its sources, methods, and stated limitations.
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
            © ATOM Energy Literacy Project. Explore the sources and limitations
            behind the science.
          </p>
        </div>
      </footer>
    </div>
  );
}
