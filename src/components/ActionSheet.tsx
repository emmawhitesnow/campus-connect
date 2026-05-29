import { useEffect } from "react";

export function ActionSheet({
  open,
  onClose,
  title,
  description,
  primaryLabel,
  onPrimary,
  destructive,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  primaryLabel: string;
  onPrimary: () => void;
  destructive?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/30 animate-in fade-in" />
      <div
        className="relative w-full px-3 pb-3 animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl bg-background/95 backdrop-blur overflow-hidden">
          <div className="px-5 pt-4 pb-3 text-center border-b border-border">
            <p className="text-sm font-semibold text-primary">{title}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <button
            onClick={() => { onPrimary(); onClose(); }}
            className={`w-full py-3.5 text-sm font-semibold ${destructive ? "text-destructive" : "text-primary"}`}
          >
            {primaryLabel}
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-2 w-full py-3.5 rounded-2xl bg-background/95 backdrop-blur text-sm font-bold text-primary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
