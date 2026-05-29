import { useEffect, useState } from "react";
import { X, Send } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export function MessageModal({
  open,
  onClose,
  recipient,
}: {
  open: boolean;
  onClose: () => void;
  recipient: string | null;
}) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  useEffect(() => {
    if (open) { setText(""); setSent([]); }
  }, [open, recipient]);

  if (!open || !recipient) return null;

  function send() {
    if (!text.trim()) return;
    setSent((s) => [...s, text.trim()]);
    setText("");
  }

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" />
      <div
        className="relative w-full max-w-[400px] mx-2 mb-4 rounded-3xl bg-background overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
        style={{ height: "60%" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Avatar seed={recipient} size={32} />
            <p className="text-sm font-bold text-primary">{recipient}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 h-[calc(100%-110px)] bg-background">
          {sent.length === 0 && (
            <p className="text-center text-xs text-muted-foreground mt-4">iMessage · Say hi to {recipient}</p>
          )}
          {sent.map((m, i) => (
            <div key={i} className="self-end max-w-[75%] rounded-2xl bg-[#0a84ff] text-white px-3.5 py-2 text-sm">
              {m}
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-card border-t border-border flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="iMessage"
            className="flex-1 rounded-full bg-background border border-border px-4 py-2 text-sm outline-none text-primary"
            autoFocus
          />
          <button
            onClick={send}
            className="size-9 rounded-full bg-[#0a84ff] text-white grid place-items-center disabled:opacity-40"
            disabled={!text.trim()}
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
