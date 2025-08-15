import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { db } from "@/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import type { ResourceDoc } from "@/types/models";

export default function Resources() {
  const [items, setItems] = useState<(ResourceDoc & { id: string })[]>([]);
  useEffect(() => {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    return onSnapshot(q, snap => setItems(snap.docs.map(d => ({ id: d.id, ...(d.data() as ResourceDoc) }))));
  }, []);

  return (
    <div className="grid gap-4">
      {items.map(r => (
        <Card key={r.id}>
          <a className="font-semibold" href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
          <div className="text-xs text-gray-500">{r.type}</div>
        </Card>
      ))}
    </div>
  );
}
