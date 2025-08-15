import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import Avatar from "@/components/ui/Avatar";
import { useMe } from "@/providers/UserDocProvider";

export default function Topbar() {
  const { me } = useMe();
  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4">
      <div className="font-semibold">Welcome {me?.displayName || "Member"}</div>
      <div className="flex items-center gap-3">
        <Avatar name={me?.displayName || me?.email || "U"} />
        <button onClick={() => signOut(auth)} className="text-sm text-red-600">Logout</button>
      </div>
    </header>
  );
}
