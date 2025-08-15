import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export default function Landing() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}
