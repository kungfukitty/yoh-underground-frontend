import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "@/providers/UserDocProvider";

export default function RequireNDA() {
  const { me, loading } = useMe();
  if (loading) return null;
  if (!me?.isInvited) return <Navigate to="/signup" replace />;
  return me.isNDAAccepted ? <Outlet /> : <Navigate to="/nda" replace />;
}
