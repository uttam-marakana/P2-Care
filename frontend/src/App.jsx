import { BrowserRouter, useLocation } from "react-router-dom";
import { CmsProvider } from "@/context/CmsContext";
import { AuthProvider } from "@/context/AuthContext";
import { PublicRoutes } from "@/routes/AppRoutes";
import AdminRoutes from "@/routes/AdminRoutes";

function AppContent() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? <AdminRoutes /> : <PublicRoutes />;
}

export default function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
    >
      <AuthProvider>
        <CmsProvider>
          <AppContent />
        </CmsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
