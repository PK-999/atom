"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react/X";
import type { ReactNode } from "react";

import styles from "./ui.module.css";

interface OverlayPanelProps {
  children: ReactNode;
  description: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  title: string;
  trigger: ReactNode;
  variant?: "dialog" | "drawer" | "sheet";
}

export function OverlayPanel({
  children,
  description,
  onOpenChange,
  open,
  title,
  trigger,
  variant = "dialog",
}: OverlayPanelProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Trigger asChild>
        <button className={styles.overlayTrigger} type="button">
          {trigger}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlayBackdrop} />
        <Dialog.Content className={styles.overlayContent} data-variant={variant}>
          <header className={styles.overlayHeader}>
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button aria-label={`Close ${title}`} className={styles.iconButton} type="button">
                <X aria-hidden size={20} />
              </button>
            </Dialog.Close>
          </header>
          <div className={styles.overlayBody}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
