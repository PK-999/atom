"use client";
import { useState } from "react";
import Link from "next/link";
import { OverlayPanel } from "@/components/ui/OverlayPanel";
import { getPrimaryNavigation } from "@/lib/navigation/catalog";
import styles from "./AppShell.module.css";
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.mobileMenu}>
      <OverlayPanel
        title="Explore ATOM"
        description="Choose a place to learn, experiment, or inspect the evidence."
        variant="drawer"
        trigger="Menu"
        open={open}
        onOpenChange={setOpen}
      >
        <nav aria-label="Mobile navigation" className={styles.drawerNavigation}>
          {getPrimaryNavigation().map((item) => (
            <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <span className={styles.drawerSectionLabel}>Utilities</span>
          {[
            ["/search", "Search"],
            ["/compare", "Comparison Lab"],
            ["/evidence", "Evidence"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <span className={styles.drawerSectionLabel}>More to explore</span>
          {[
            ["/reactors", "Reactors"],
            ["/radiation", "Radiation"],
            ["/incidents", "Incidents"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </OverlayPanel>
    </div>
  );
}
