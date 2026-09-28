import type { ExplanationContent } from "@/lib/education/schemas";
import styles from "./Explanation.module.css";

/** Native details keep focus and the surrounding experiment's state intact. */
export function Explanation({ content }: { content: ExplanationContent }) {
  return (
    <div className={styles.explanation}>
      <p>{content.summary}</p>
      {content.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <ExplanationDetails details={content.details} />
    </div>
  );
}

export function ExplanationDetails({
  details,
}: {
  details: ExplanationContent["details"];
}) {
  return details?.map((detail) => (
    <details className={styles.details} key={detail.id}>
      <summary>{detail.title}</summary>
      <p>{detail.body}</p>
    </details>
  ));
}
