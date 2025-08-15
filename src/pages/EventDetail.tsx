import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot, setDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/providers/AuthProvider";
import type { EventDoc } from "@/types/models";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<(EventDoc & { id: string }) | null>(null);
  const [isRSVP, setRSVP] = useState(false);

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "events", id);
    getDoc(ref).then(s => s.exists() && setEvent({ id: s.id, ...(s.data() as EventDoc) }));
    if (!user) return;
    const attRef = doc(db, "events", id, "attendees", user.uid);
    return onSnapshot(attRef, s => setRSVP(s.exists()));
  }, [id, user]);

  async function toggleRSVP() {
    if (!id || !user || !event) return;
    const attRef = doc(db, "events", id, "attendees", user.uid);
    if (isRSVP) await deleteDoc(attRef);
    else await setDoc(attRef, { uid: user.uid, name: user.displayName || user.email, email: user.email, rsvpAt: serverTimestamp() });
  }

  if (!event) return null;
  return (
    <div className="max-w-2xl">
      <Card>
        <div className="text-2xl font-semibold mb-1">{event.title}</div>
        <div className="text-sm text-gray-500 mb-3">{event.date?.seconds ? new Date(event.date.seconds*1000).toLocaleString() : ""} • {event.venue}</div>
        <Button onClick={toggleRSVP}>{isRSVP ? "Cancel RSVP" : "RSVP"}</Button>
      </Card>
    </div>
  );
}
