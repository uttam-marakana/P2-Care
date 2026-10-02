import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import RequireAdmin from "@/components/admin/RequireAdmin";
import AdminLogin from "@/pages/Admin/Login/Login";
import Dashboard from "@/pages/Admin/Dashboard/Dashboard";
import AdminAppointments from "@/pages/Admin/Appointments/Appointments";
import AdminDoctors from "@/pages/Admin/Doctors/Doctors";
import AdminServices from "@/pages/Admin/Services/Services";
import AdminArticles from "@/pages/Admin/Articles/Articles";
import AdminFAQs from "@/pages/Admin/FAQs/FAQs";
import AdminMedia from "@/pages/Admin/Media/Media";
import AdminCommunications from "@/pages/Admin/Communications/Communications";
import AdminSecurity from "@/pages/Admin/Security/Security";
import { SEO } from "@/components/seo";

export default function AdminRoutes() {
  return (
    <>
      <SEO title="Admin" noindex />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/faqs" element={<AdminFAQs />} />
            <Route path="/admin/media" element={<AdminMedia />} />
            <Route
              path="/admin/communications"
              element={<AdminCommunications />}
            />
            <Route path="/admin/security" element={<AdminSecurity />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
