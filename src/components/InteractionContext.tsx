import { createContext, useContext, useState, type ReactNode } from "react";
import { MessageModal } from "./MessageModal";
import { ActionSheet } from "./ActionSheet";

type Ctx = {
  message: (name: string) => void;
  call: (name: string) => void;
};

const InteractionContext = createContext<Ctx | null>(null);

function fakePhone(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const n = Math.abs(h);
  const a = 200 + (n % 700);
  const b = 100 + ((n / 1000) | 0) % 900;
  const c = 1000 + ((n / 1000000) | 0) % 9000;
  return `(${a}) ${b}-${c}`;
}

export function InteractionProvider({ children }: { children: ReactNode }) {
  const [msgTo, setMsgTo] = useState<string | null>(null);
  const [callTo, setCallTo] = useState<string | null>(null);

  return (
    <InteractionContext.Provider
      value={{
        message: (name) => setMsgTo(name),
        call: (name) => setCallTo(name),
      }}
    >
      {children}
      <MessageModal open={!!msgTo} onClose={() => setMsgTo(null)} recipient={msgTo} />
      <ActionSheet
        open={!!callTo}
        onClose={() => setCallTo(null)}
        title={`Call ${callTo ?? ""}?`}
        description={callTo ? fakePhone(callTo) : undefined}
        primaryLabel="Call"
        onPrimary={() => {}}
      />
    </InteractionContext.Provider>
  );
}

export function useInteractions() {
  const ctx = useContext(InteractionContext);
  if (!ctx) throw new Error("useInteractions must be used inside InteractionProvider");
  return ctx;
}
