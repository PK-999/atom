"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import styles from "./ui.module.css";

interface TabItem {
  content: ReactNode;
  id: string;
  label: string;
}

interface TabsProps {
  items: ReadonlyArray<TabItem>;
  label: string;
}

export function Tabs({ items, label }: TabsProps) {
  const instanceId = useId();
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  function moveSelection(event: KeyboardEvent, index: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const next = items[nextIndex];
    if (!next) return;
    setSelectedId(next.id);
    buttonRefs.current[nextIndex]?.focus();
  }

  if (!selected) return null;

  return (
    <div className={styles.tabs}>
      <div aria-label={label} className={styles.tabList} role="tablist">
        {items.map((item, index) => (
          <button
            aria-controls={`${instanceId}-${item.id}-panel`}
            aria-selected={item.id === selected.id}
            id={`${instanceId}-${item.id}-tab`}
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            onKeyDown={(event) => moveSelection(event, index)}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            role="tab"
            tabIndex={item.id === selected.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`${instanceId}-${selected.id}-tab`}
        className={styles.tabPanel}
        id={`${instanceId}-${selected.id}-panel`}
        role="tabpanel"
      >
        {selected.content}
      </div>
    </div>
  );
}
