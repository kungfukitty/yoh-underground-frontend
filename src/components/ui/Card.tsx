export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-xl border p-4 shadow-sm">{children}</div>;
}
