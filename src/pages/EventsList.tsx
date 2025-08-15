import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { db } from "@/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import type { EventDoc } from "@/types/models";
import { Link } from "react-router-dom";

export default function EventsList() {
  const [events, setEvents] = useState<(EventDoc & { id: string })[]>([]);
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    return onSnapshot(q, snap => setEvents(snap.docs.map(d => ({ id: d.id, ...(d.data() as EventDoc) }))));
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.map(ev => (
        <Card key={ev.id}>
          <div className="text-lg font-semibold">{ev.title}</div>
          <div className="text-sm text-gray-500 mb-2">{ev.date?.seconds ? new Date(ev.date.seconds*1000).toLocaleString() : ""}</div>
          <div className="text-sm mb-3">{ev.venue}</div>
          <Link to={`/events/${ev.id}`}><Button>View</Button></Link>
        </Card>
      ))}
    </div>
  );
}
