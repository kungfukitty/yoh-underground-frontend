import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

type AuthCtx = { user: User | null; loading: boolean };
const Ctx = createContext<AuthCtx>({ user: null, loading: true });
export const useAuth = () => useContext(Ctx);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setLoading(false); }), []);
  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>;
}
