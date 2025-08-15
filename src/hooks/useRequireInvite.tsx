import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/providers/UserDocProvider";

export default function RequireInvite() {
  const { me, loading } = useMe();
  if (loading) return null;
  return me?.isInvited ? <Outlet /> : <Navigate to="/signup" replace />;
}
