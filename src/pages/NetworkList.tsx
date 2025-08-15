import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { db } from "@/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { NetworkProfile } from "@/types/models";
import { Link } from "react-router-dom";

export default function NetworkList() {
  const [profiles, setProfiles] = useState<(NetworkProfile & { id: string })[]>([]);
  const [qtext, setQtext] = useState("");
  useEffect(() => {
    const q = query(collection(db, "networkProfiles"), where("isVisible", "==", true));
    return onSnapshot(q, snap => setProfiles(snap.docs.map(d => ({ id: d.id, ...(d.data() as NetworkProfile) }))));
  }, []);
  const filtered = qtext? profiles.filter(p => (p.headline+" "+(p.skills||[]).join(" ")).toLowerCase().includes(qtext.toLowerCase())) : profiles;
  return (
    <div>
      <div className="max-w-md mb-4"><Input placeholder="Search skills or headline" value={qtext} onChange={e=>setQtext(e.target.value)} /></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id}>
            <div className="font-semibold">{p.headline}</div>
            <div className="text-sm text-gray-500">{p.location}</div>
            <div className="text-xs mt-2 flex flex-wrap gap-1">{p.skills?.map(s => <span key={s} className="border rounded px-2 py-0.5">{s}</span>)}</div>
            <div className="mt-2"><Link to={`/network/${p.id}`}>View profile</Link></div>
          </Card>
        ))}
      </div>
    </div>
  );
}
