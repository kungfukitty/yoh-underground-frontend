import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { db } from "@/firebase";
import { doc, onSnapshot, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import type { UserDoc } from "@/types/models";

const Ctx = createContext<{ me: (UserDoc & { id: string }) | null; loading: boolean }>({ me: null, loading: true });
export const useMe = () => useContext(Ctx);

export default function UserDocProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [me, setMe] = useState<(UserDoc & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setMe(null); setLoading(false); return; }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, async snap => {
      if (!snap.exists()) {
        await setDoc(ref, {
          email: user.email,
          displayName: user.displayName ?? "",
          isInvited: false,
          isNDAAccepted: false,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        } as UserDoc);
        const final = await getDoc(ref);
        setMe({ id: user.uid, ...(final.data() as UserDoc) });
      } else {
        setMe({ id: user.uid, ...(snap.data() as UserDoc) });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  return <Ctx.Provider value={{ me, loading }}>{children}</Ctx.Provider>;
}
