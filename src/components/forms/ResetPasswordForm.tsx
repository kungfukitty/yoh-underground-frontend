import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "@/providers/Toaster";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast("Reset email sent");
    } catch (e: any) {
      toast(e.message || "Failed to send email");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <Button disabled={loading}>{loading ? "Sending…" : "Send reset link"}</Button>
    </form>
  );
}
