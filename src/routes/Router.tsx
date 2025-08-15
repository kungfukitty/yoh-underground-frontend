import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ResetPassword from "@/pages/ResetPassword";
import NDA from "@/pages/NDA";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import EventsList from "@/pages/EventsList";
import EventDetail from "@/pages/EventDetail";
import Resources from "@/pages/Resources";
import NetworkList from "@/pages/NetworkList";
import NetworkDetail from "@/pages/NetworkDetail";
import Account from "@/pages/Account";
import RequireAuth from "@/hooks/useRequireAuth";
import RequireInvite from "@/hooks/useRequireInvite";
import RequireNDA from "@/hooks/useRequireNDA";
import AppShell from "@/components/layout/AppShell";

export default function AppRouter(){
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<RequireAuth />}>
        <Route path="/nda" element={<NDA />} />
        <Route element={<RequireInvite />}>
          <Route element={<RequireNDA />}>
            <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
            <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
            <Route path="/events" element={<AppShell><EventsList /></AppShell>} />
            <Route path="/events/:id" element={<AppShell><EventDetail /></AppShell>} />
            <Route path="/resources" element={<AppShell><Resources /></AppShell>} />
            <Route path="/network" element={<AppShell><NetworkList /></AppShell>} />
            <Route path="/network/:uid" element={<AppShell><NetworkDetail /></AppShell>} />
            <Route path="/account" element={<AppShell><Account /></AppShell>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
