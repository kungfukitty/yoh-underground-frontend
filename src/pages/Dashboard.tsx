import Card from "@/components/ui/Card";
import { useMe } from "@/providers/UserDocProvider";

export default function Dashboard() {
  const { me } = useMe();
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <div className="text-sm text-gray-500">Member</div>
        <div className="text-xl font-semibold">{me?.displayName || me?.email}</div>
      </Card>
      <Card>
        <div className="text-sm text-gray-500">NDA</div>
        <div>{me?.isNDAAccepted ? `Accepted v${me.ndaVersion}` : "Pending"}</div>
      </Card>
      <Card>
        <div className="text-sm text-gray-500">Invite Code</div>
        <div>{me?.inviteCode || "—"}</div>
      </Card>
    </div>
  );
}
