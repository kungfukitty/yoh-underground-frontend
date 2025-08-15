import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { NetworkProfile } from "@/types/models";

export default function NetworkDetail() {
  const { uid } = useParams();
  const [p, setP] = useState<(NetworkProfile & { id: string }) | null>(null);
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "networkProfiles", uid)).then(s => s.exists() && setP({ id: s.id, ...(s.data() as NetworkProfile) }));
  }, [uid]);
  if (!p) return null;
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="text-2xl font-semibold mb-2">{p.headline}</div>
        <div className="text-sm text-gray-500">{p.location}</div>
        <div className="text-sm mt-3">Skills: {p.skills.join(", ")}</div>
      </Card>
    </div>
  );
}
