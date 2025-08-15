export default function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  return <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand text-white text-sm font-semibold">{initials}</div>;
}
