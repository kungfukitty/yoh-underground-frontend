import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";
import { ensureEmailVerification } from "@/firebase";

export default function Account() {
  const { user } = useAuth();
  return (
    <div className="max-w-xl">
      <Card>
        <div className="text-xl font-semibold mb-2">Account</div>
        <div className="text-sm">Email: {user?.email}</div>
        <div className="text-sm">Verified: {user?.emailVerified ? "Yes" : "No"}</div>
        {!user?.emailVerified && <Button className="mt-3" onClick={ensureEmailVerification}>Send verification email</Button>}
      </Card>
    </div>
  );
}
