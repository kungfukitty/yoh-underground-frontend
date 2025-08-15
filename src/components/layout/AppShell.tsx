import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 grid grid-rows-[auto_1fr]">
        <Topbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
