"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConfirmationDialogProps = { open: boolean; title: string; description: string; confirmLabel: string; isPending?: boolean; onConfirm: () => void; onOpenChange: (open: boolean) => void };

export function ConfirmationDialog({ open, title, description, confirmLabel, isPending = false, onConfirm, onOpenChange }: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return <dialog ref={dialogRef} aria-describedby="confirmation-dialog-description" aria-labelledby="confirmation-dialog-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-border bg-card p-0 text-foreground shadow-lg backdrop:bg-foreground/20" onCancel={(event) => { event.preventDefault(); if (!isPending) onOpenChange(false); }}>
    <div className="space-y-6 p-6">
      <div className="space-y-2"><h2 id="confirmation-dialog-title" className="text-lg font-semibold text-foreground">{title}</h2><p id="confirmation-dialog-description" className="text-sm leading-6 text-muted-foreground">{description}</p></div>
      <div className="grid gap-2 sm:grid-cols-2"><Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}><X className="size-4" />Cancel</Button><Button type="button" disabled={isPending} onClick={onConfirm}>{isPending ? "Saving..." : confirmLabel}</Button></div>
    </div>
  </dialog>;
}
