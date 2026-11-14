import { BrowserRouter, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import { CmsProvider } from "@/context/CmsContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { PublicRoutes } from "@/routes/AppRoutes";
import AdminRoutes from "@/routes/AdminRoutes";

function AppContent() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return pathname.startsWith("/admin") ? <AdminRoutes /> : <PublicRoutes />;
}

export default function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, "") || undefined}
    >
      <AuthProvider>
        <LanguageProvider>
          <CmsProvider>
            <AppContent />
          </CmsProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
