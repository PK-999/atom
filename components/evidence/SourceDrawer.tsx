import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut";

import { OverlayPanel } from "@/components/ui/OverlayPanel";

import type { EvidenceSourceViewModel } from "./evidence-view-model";
import styles from "./evidence.module.css";

export function SourceDrawer({
  sources,
  trigger,
}: {
  sources: ReadonlyArray<EvidenceSourceViewModel>;
  trigger: string;
}) {
  return (
    <OverlayPanel
      description="Open the original or canonical references used by this view."
      title="Sources"
      trigger={trigger}
      variant="drawer"
    >
      {sources.length > 0 ? (
        <ul className={styles.sourceList}>
          {sources.map((source) => (
            <li key={`${source.title}-${source.url ?? "unavailable"}`}>
              {source.url ? (
                <a href={source.url} rel="noreferrer" target="_blank">
                  {source.title}
                  <ArrowSquareOut aria-hidden size={18} />
                </a>
              ) : (
                <span>{source.title} — source link unavailable</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviewed sources are available.</p>
      )}
    </OverlayPanel>
  );
}
