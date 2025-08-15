import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "@/providers/Toaster";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast("Welcome back");
    } catch (e: any) {
      toast(e.message || "Login failed");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <Button disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}
