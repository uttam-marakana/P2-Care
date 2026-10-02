import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FaSpinner } from "react-icons/fa6";
import { SEO } from '@/components/seo';

export default function RequireAdmin() {
  const { session, profile, loading, configured, mockMode } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center"><FaSpinner className="animate-spin" /></div>;
  if (!configured) return <div className="grid min-h-screen place-items-center p-6 text-center"><div><h1 className="font-display text-4xl">Admin backend not configured</h1><p className="mt-3 max-w-lg text-sm text-muted-foreground">Enable VITE_USE_MOCK_DATA=true for local admin-panel development, or configure Firebase Authentication and the Firebase-backed API for real authentication and persistent data.</p></div></div>;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!profile || !['admin', 'staff'].includes(profile.role)) return <Navigate to="/admin/login" replace />;
  return <><SEO title="Admin" noindex /><Outlet /></>;
}
