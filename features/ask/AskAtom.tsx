import React from "react";
import type { AskQuery, AskResponse } from "../../lib/ask/schemas";

export function AskAtom({
  query,
  response,
}: {
  query: AskQuery;
  response: AskResponse | null;
}) {
  return (
    <section aria-labelledby={`ask-title-${query.id}`}>
      <h2 id={`ask-title-${query.id}`}>Ask ATOM</h2>

      <div className="query-box">
        <p>
          <strong>You asked:</strong> {query.prompt}
        </p>
      </div>

      {response ? (
        <div className="response-box">
          <div className="answer-markdown">
            {/* React Markdown will render here */}
            <p>{response.answerMarkdown}</p>
          </div>

          <div className="citations-list">
            <h3>Sources</h3>
            <ul>
              {response.citationIds.map((id) => (
                <li key={id}>Citation {id}</li>
              ))}
            </ul>
          </div>

          {response.caveats && response.caveats.length > 0 && (
            <div className="caveats-box">
              <h3>Caveats</h3>
              <ul>
                {response.caveats.map((caveat, index) => (
                  <li key={index}>{caveat}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Retrieving evidence...</p>
      )}
    </section>
  );
}
