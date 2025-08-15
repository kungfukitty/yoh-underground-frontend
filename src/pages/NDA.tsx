import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useMe } from "@/providers/UserDocProvider";
import { auth, db, storage } from "@/firebase";
import { doc, serverTimestamp, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState, useMemo } from "react";
import { sha256Hex } from "@/lib/crypto";

const NDA_VERSION = "1.0";
const NDA_TEXT = `CONFIDENTIALITY & NON‑DISCLOSURE AGREEMENT (Members Portal)

1) You agree to keep all content, events, communications and media accessed through YOH Underground strictly confidential.
2) No redistribution, screenshots, forwarding, or recordings without written consent.
3) Breach may result in immediate termination of access and potential legal remedies.
4) This NDA survives termination of membership and access.
`;

export default function NDA() {
  const { me } = useMe();
  const [accepting, setAccepting] = useState(false);
  const userAgent = useMemo(() => navigator.userAgent, []);

  async function accept() {
    if (!me || !auth.currentUser || me.isNDAAccepted) return;
    setAccepting(true);
    try {
      const uid = auth.currentUser.uid;
      const hash = await sha256Hex(NDA_TEXT);

      await setDoc(doc(db, `users/${uid}/agreements/nda`), {
        uid,
        version: NDA_VERSION,
        textHash: hash,
        textPreview: NDA_TEXT.slice(0, 256),
        acceptedAt: serverTimestamp(),
        inviteCode: me.inviteCode ?? null,
        name: me.displayName || me.email,
        email: me.email,
        userAgent,
      });

      const pdfBlob = new Blob([
        `NDA Version: ${NDA_VERSION}\nUser: ${me.displayName || me.email}\nEmail: ${me.email}\nDate: ${new Date().toISOString()}\nInvite: ${me.inviteCode || ""}\nHash: ${hash}\n\n--- NDA TEXT ---\n${NDA_TEXT}`
      ], { type: "application/pdf" });
      const path = `agreements/${uid}/nda-v${NDA_VERSION}.pdf`;
      const sref = ref(storage, path);
      await uploadBytes(sref, pdfBlob);
      const url = await getDownloadURL(sref);

      await updateDoc(doc(db, "users", uid), {
        isNDAAccepted: true,
        ndaAcceptedAt: serverTimestamp(),
        ndaVersion: NDA_VERSION,
        ndaHash: hash,
        ndaPdfUrl: url,
      });
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <h2 className="text-xl font-semibold mb-2">Non‑Disclosure Agreement</h2>
        <pre className="text-sm bg-gray-50 p-3 rounded max-h-80 overflow-y-auto whitespace-pre-wrap">{NDA_TEXT}</pre>
        <Button className="mt-4" onClick={accept} disabled={accepting}>
          {accepting ? "Recording acceptance…" : "I Agree"}
        </Button>
      </Card>
    </div>
  );
}
