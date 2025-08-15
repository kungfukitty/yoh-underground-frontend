import { useEffect, useState } from "react";

export default function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const handler = (e: Event) => setMsg((e as CustomEvent<string>).detail);
    window.addEventListener("toast", handler as any);
    const t = setTimeout(() => setMsg(null), 3000);
    return () => { window.removeEventListener("toast", handler as any); clearTimeout(t); };
  }, [msg]);
  if (!msg) return null;
  return <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50">{msg}</div>;
}

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("toast", { detail: message } as any));
}
