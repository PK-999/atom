"use client";
import { useState } from "react";
import Link from "next/link";
import { OverlayPanel } from "@/components/ui/OverlayPanel";
import { GlobalComplexityControl } from "./GlobalComplexityControl";
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
        <GlobalComplexityControl />
        <nav aria-label="Mobile navigation" className={styles.drawerNavigation}>
          {[
            ["/learn", "Learn"],
            ["/explore", "Explore"],
            ["/compare", "Compare"],
            ["/evidence", "Evidence"],
            ["/search", "Search"],
            ["/simulations", "Simulations"],
            ["/reactors", "Reactors"],
            ["/globe", "Globe"],
            ["/radiation", "Radiation"],
            ["/incidents", "Incidents"],
            ["/myths", "Claims and myths"],
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
