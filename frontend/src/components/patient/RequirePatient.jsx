import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";

export default function RequirePatient() {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <FaSpinner className="animate-spin" />
      </div>
    );
  }
  if (!session) return <Navigate to="/account/login" replace state={{ from: location.pathname }} />;
  if (profile?.role !== "patient") return <Navigate to="/account/login" replace />;
  return <Outlet />;
}
