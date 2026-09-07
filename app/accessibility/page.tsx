import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "ATOM accessibility commitments, capabilities, standards compliance (WCAG 2.1 AA), and known limitations.",
};

export default function AccessibilityPage() {
  return (
    <AppShell>
      <div
        style={{
          maxWidth: "52rem",
          margin: "0 auto",
          padding: "2.5rem 1.5rem 6rem",
        }}
      >
        <header
          style={{
            marginBottom: "2.5rem",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Accessibility Statement
          </h1>
          <p
            style={{
              color: "#4b5563",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            ATOM is engineered to ensure scientific energy information is
            accessible to every learner, regardless of ability or assistive
            device.
          </p>
        </header>

        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Standards & Capabilities
          </h2>
          <p
            style={{ color: "#374151", lineHeight: 1.7, marginBottom: "1rem" }}
          >
            We target Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
            conformance across all public routes. Core accessibility features
            include:
          </p>
          <ul
            style={{
              color: "#374151",
              lineHeight: 1.7,
              paddingLeft: "1.25rem",
            }}
          >
            <li>
              <strong>Keyboard Navigation:</strong> All interactive controls
              (complexity selectors, checkpoint radios, sliders, and navigation
              menus) are fully operable via keyboard with clear focus rings.
            </li>
            <li>
              <strong>Data Visualization Fallbacks:</strong> Every chart
              provides a screen-reader-accessible summary and an interactive
              tabular fallback. Color is never the sole conduit of quantitative
              meaning.
            </li>
            <li>
              <strong>Reduced Motion:</strong> Animated transitions and
              simulations respect the user&apos;s{" "}
              <code>prefers-reduced-motion</code> operating system preference,
              substituting static step-by-step progressions.
            </li>
            <li>
              <strong>Semantic Structure:</strong> Standard HTML5 landmark
              elements (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
              <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>,{" "}
              <code>&lt;footer&gt;</code>) and ARIA live regions ensure smooth
              screen reader navigation.
            </li>
            <li>
              <strong>High Contrast & Themes:</strong> Both Light and Dark modes
              are engineered to exceed minimum WCAG AA 4.5:1 text contrast
              ratios.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            Known Limitations & Roadmap
          </h2>
          <p style={{ color: "#374151", lineHeight: 1.7 }}>
            Certain complex interactive simulations (such as advanced reactor
            core schematics planned for R15) are currently optimized for pointer
            and keyboard tab navigation. We are actively developing
            audio-descriptive and enhanced braille-display friendly text
            transcriptions.
          </p>
        </section>

        <section
          style={{ paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Feedback & Assistance
          </h2>
          <p
            style={{
              color: "#4b5563",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            If you encounter any barrier or have suggestions for improvement,
            please submit an issue or correction via our public repository.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
