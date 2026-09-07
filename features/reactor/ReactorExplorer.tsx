import React from "react";
import type { ReactorSystem } from "../../lib/reactor/schemas";

export function ReactorExplorer({ system }: { system: ReactorSystem }) {
  return (
    <section aria-labelledby={`reactor-title-${system.id}`}>
      <h2 id={`reactor-title-${system.id}`}>{system.name}</h2>
      <p>{system.summary}</p>

      <div className="reactor-diagram-placeholder">
        {/* Interactive canvas / SVG will go here */}
      </div>

      <div className="components-list">
        <h3>System Components</h3>
        <dl>
          {system.components.map((component) => (
            <div key={component.id}>
              <dt>
                {component.name} ({component.type})
              </dt>
              <dd>{component.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
