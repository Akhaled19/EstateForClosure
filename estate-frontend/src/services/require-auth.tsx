import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth.ts";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}