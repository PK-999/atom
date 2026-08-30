"use client";

import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { useMemo, useState } from "react";

import { OverlayPanel } from "./OverlayPanel";
import styles from "./ui.module.css";

export interface CommandItem {
  description?: string;
  id: string;
  label: string;
}

interface CommandMenuProps {
  items: ReadonlyArray<CommandItem>;
  label: string;
  onSelect: (item: CommandItem) => void;
  trigger: string;
}

export function CommandMenu({
  items,
  label,
  onSelect,
  trigger,
}: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return items;
    return items.filter((item) =>
      `${item.label} ${item.description ?? ""}`
        .toLocaleLowerCase()
        .includes(normalized),
    );
  }, [items, query]);

  return (
    <OverlayPanel
      description="Search the available options, then choose one."
      onOpenChange={setOpen}
      open={open}
      title={label}
      trigger={trigger}
    >
      <label className={styles.commandSearch}>
        <MagnifyingGlass aria-hidden size={19} />
        <span className={styles.srOnly}>Search {label}</span>
        <input
          aria-label={`Search ${label}`}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          type="search"
          value={query}
        />
      </label>
      <div className={styles.commandResults}>
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item);
                setOpen(false);
                setQuery("");
              }}
              type="button"
            >
              <strong>{item.label}</strong>
              {item.description ? <span>{item.description}</span> : null}
            </button>
          ))
        ) : (
          <p>No matching options.</p>
        )}
      </div>
    </OverlayPanel>
  );
}
