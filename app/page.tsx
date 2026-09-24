import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingHero } from "@/components/onboarding/OnboardingHero";
import styles from "./HomePage.module.css";
export const metadata: Metadata = {
  title: "ATOM — Small atoms. Big questions.",
  description:
    "Explore nuclear energy, try the science, and inspect the evidence. Interactive learning from your first atom to electricity systems.",
};
const questions = [
  {
    number: "01",
    title: "How does it work?",
    text: "Look inside an atom. Follow the energy, step by step.",
    href: "/learn",
  },
  {
    number: "02",
    title: "What are the trade-offs?",
    text: "Compare energy sources and inspect the assumptions.",
    href: "/compare",
  },
  {
    number: "03",
    title: "What does the evidence say?",
    text: "Investigate familiar claims, their context and their limits.",
    href: "/myths",
  },
];
export default function HomePage() {
  return (
    <AppShell>
      <OnboardingHero />
      <section
        className={styles.questions}
        aria-label="Choose your next question"
      >
        {questions.map((q) => (
          <Link key={q.number} href={q.href}>
            <span>{q.number}</span>
            <div>
              <h2>{q.title}</h2>
              <p>{q.text}</p>
            </div>
            <span aria-hidden>↗</span>
          </Link>
        ))}
      </section>
      <section className={styles.feature}>
        <div>
          <span className={styles.eyebrow}>Make your own comparison</span>
          <h2>
            Good questions deserve
            <br />
            more than one number.
          </h2>
          <p>
            Climate impact, land, cost and safety answer different questions.
            Explore the available estimates, their ranges, and what is missing.
          </p>
          <Link href="/compare">Open the Comparison Lab →</Link>
        </div>
        <div className={styles.evidence}>
          <span className={styles.eyebrow}>The ATOM approach</span>
          <h3>
            Curiosity comes first.
            <br />
            Evidence follows every step.
          </h3>
          <p>
            Change the explanation depth whenever you like. Look for the model
            limits, read a source, and come to your own conclusion.
          </p>
          <Link href="/methodology">How we handle evidence →</Link>
        </div>
      </section>
      <section className={styles.next}>
        <h2>Learn by trying.</h2>
        <p>
          Inspect a fuel assembly in 3D, replay a fission, or experiment with an
          annual electricity mix.
        </p>
        <Link href="/simulations">Visit the interactive collection →</Link>
      </section>
    </AppShell>
  );
}
