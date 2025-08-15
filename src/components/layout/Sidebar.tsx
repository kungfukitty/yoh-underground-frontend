import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/events", label: "Events" },
  { to: "/network", label: "Network" },
  { to: "/resources", label: "Resources" },
  { to: "/profile", label: "Profile" },
  { to: "/account", label: "Account" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="w-64 border-r bg-white hidden md:block">
      <div className="p-4 font-bold text-xl">YOH</div>
      <nav className="space-y-1 p-2">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`block px-3 py-2 rounded hover:bg-gray-100 ${pathname===l.to?"bg-gray-100":""}`}>{l.label}</Link>
        ))}
      </nav>
    </aside>
  );
}
