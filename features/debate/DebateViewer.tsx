import React from "react";
import type { DebateTopic } from "../../lib/debate/schemas";

export function DebateViewer({ topic }: { topic: DebateTopic }) {
  return (
    <section aria-labelledby={`debate-question-${topic.id}`}>
      <h2 id={`debate-question-${topic.id}`}>{topic.question}</h2>
      <p className="lead">{topic.summary}</p>

      <div className="arguments-grid">
        <div className="arguments-for">
          <h3>Strongest Arguments For</h3>
          {topic.arguments
            .filter((arg) => arg.side === "for")
            .map((arg) => (
              <article key={arg.id}>
                <h4>{arg.title}</h4>
                <p>{arg.body}</p>
              </article>
            ))}
        </div>

        <div className="arguments-against">
          <h3>Strongest Arguments Against</h3>
          {topic.arguments
            .filter((arg) => arg.side === "against")
            .map((arg) => (
              <article key={arg.id}>
                <h4>{arg.title}</h4>
                <p>{arg.body}</p>
              </article>
            ))}
        </div>
      </div>

      {topic.consensus && (
        <aside className="consensus-box">
          <h3>Consensus</h3>
          <p>{topic.consensus}</p>
        </aside>
      )}
    </section>
  );
}
