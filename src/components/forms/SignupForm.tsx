import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile, deleteUser } from "firebase/auth";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "@/providers/Toaster";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const inviteRef = doc(db, "invites", code.trim());
      const snap = await getDoc(inviteRef);
      if (!snap.exists()) throw new Error("Invalid access code");
      const data: any = snap.data();
      if (data.status !== "active") throw new Error("Access code is not active");
      if (typeof data.maxUses === "number" && typeof data.uses === "number" && data.uses >= data.maxUses) throw new Error("Access code exhausted");

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      await runTransaction(db, async (tx) => {
        const invSnap = await tx.get(inviteRef);
        if (!invSnap.exists()) throw new Error("Access code invalid");
        const inv = invSnap.data() as any;
        if (inv.status !== "active") throw new Error("Access code inactive");
        if (typeof inv.maxUses === "number" && typeof inv.uses === "number" && inv.uses >= inv.maxUses) throw new Error("Access code exhausted");
        tx.update(inviteRef, { uses: (inv.uses || 0) + 1 });
        const redemptionRef = doc(db, `invites/${inviteRef.id}/redemptions/${cred.user.uid}`);
        tx.set(redemptionRef, { uid: cred.user.uid, redeemedAt: serverTimestamp() });
        const userRef = doc(db, "users", cred.user.uid);
        tx.set(userRef, {
          email,
          displayName: name,
          isInvited: true,
          inviteCode: inviteRef.id,
          isNDAAccepted: false,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      });

      toast("Account created — continue to NDA");
    } catch (err: any) {
      if (auth.currentUser) { try { await deleteUser(auth.currentUser); } catch {} }
      toast(err.message || "Signup failed");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
      <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <Input placeholder="Access code" value={code} onChange={e=>setCode(e.target.value)} required />
      <Button disabled={loading}>{loading?"Creating…":"Create account"}</Button>
    </form>
  );
}
