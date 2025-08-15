import { useMe } from "@/providers/UserDocProvider";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { NetworkProfile } from "@/types/models";
import { useState, useEffect } from "react";

export default function Profile() {
  const { me } = useMe();
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState<string>("");
  const [location, setLocation] = useState("");
  const [isVisible, setVisible] = useState(true);

  useEffect(() => {
    if (!me) return;
    setHeadline(me.displayName ? `${me.displayName} — Member` : "Member");
  }, [me]);

  async function save() {
    if (!me) return;
    const profile: NetworkProfile = {
      uid: me.id,
      headline,
      skills: skills.split(",").map(s=>s.trim()).filter(Boolean),
      location,
      isVisible,
      socials: {}
    };
    await setDoc(doc(db, "networkProfiles", me.id), profile);
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <div className="text-xl font-semibold mb-4">My Profile</div>
        <div className="space-y-3">
          <Input placeholder="Headline" value={headline} onChange={e=>setHeadline(e.target.value)} />
          <Input placeholder="Skills (comma separated)" value={skills} onChange={e=>setSkills(e.target.value)} />
          <Input placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isVisible} onChange={e=>setVisible(e.target.checked)} />Visible in Network</label>
          <Button onClick={save}>Save profile</Button>
        </div>
      </Card>
    </div>
  );
}
