import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Services from "@/pages/Services/Services";
import Doctors from "@/pages/Doctors/Doctors";
import DoctorDetail from "@/pages/DoctorDetail/DoctorDetail";
import Appointment from "@/pages/Appointment/Appointment";
import Hospital from "@/pages/Hospital/Hospital";
import Emergency from "@/pages/Emergency/Emergency";
import Articles from "@/pages/Articles/Articles";
import Contact from "@/pages/Contact/Contact";
import FAQ from "@/pages/FAQ/FAQ";
import NotFound from "@/pages/NotFound/NotFound";
import PatientLogin from "@/pages/Patient/Login";
import PatientSignup from "@/pages/Patient/Signup";
import PatientDashboard from "@/pages/Patient/Dashboard";
import PatientNotifications from "@/pages/Patient/Notifications";
import PatientReports from "@/pages/Patient/Reports";
import NewsletterUnsubscribe from "@/pages/Patient/NewsletterUnsubscribe";
import Policies from "@/pages/Policies/Policies";
import PatientLayout from "@/components/patient/PatientLayout";
import RequirePatient from "@/components/patient/RequirePatient";
import { HospitalSchema, SEO } from "@/components/seo";

const page = (Component, title, description) => (
  <>
    <SEO title={title} description={description} />
    <Component />
  </>
);

export function PublicRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <HospitalSchema
              title="Patient-first hospital care"
              description="Patient-first hospital care, specialist services, appointment booking and support from the P2Care Hospital care team."
            />
            <Home />
          </>
        }
      />
      <Route
        path="/services"
        element={page(
          Services,
          "Hospital services and specialties",
          "Explore cardiology, orthopedics, neurology, pediatrics, women's health and general medicine services.",
        )}
      />
      <Route
        path="/doctors"
        element={page(
          Doctors,
          "Find a doctor",
          "Meet P2Care Hospital doctors, review their specialties and experience, and find a care professional for your needs.",
        )}
      />
      <Route
        path="/doctors/:id"
        element={<DoctorDetail />}
      />
      <Route
        path="/appointment"
        element={page(
          Appointment,
          "Book an appointment",
          "Request a hospital appointment online. A P2Care care coordinator will contact you to confirm your visit.",
        )}
      />
      <Route
        path="/hospital"
        element={
          <>
            <HospitalSchema
              title="Plan your hospital visit"
              description="Plan your visit to P2Care Hospital, including location, patient support, accessibility and what to bring."
            />
            <Hospital />
          </>
        }
      />
      <Route
        path="/emergency"
        element={page(
          Emergency,
          "Emergency care and patient guidance",
          "Find P2Care Hospital emergency care information and 24/7 patient guidance. For life-threatening emergencies, contact local emergency services.",
        )}
      />
      <Route
        path="/articles"
        element={page(
          Articles,
          "Health articles and patient guidance",
          "Read practical health articles, patient guidance and stories from the P2Care Hospital care team.",
        )}
      />
      <Route
        path="/contact"
        element={
          <>
            <HospitalSchema
              title="Contact P2Care Hospital"
              description="Find hospital directions, call the patient helpline or send a message to the P2Care Hospital care team."
            />
            <Contact />
          </>
        }
      />
      <Route
        path="/faq"
        element={page(
          FAQ,
          "Hospital patient FAQs",
          "Get answers about appointments, preparing for a hospital visit, patient support and emergency care.",
        )}
      />
      <Route path="/account/login" element={<PatientLogin />} />
      <Route path="/account/signup" element={<PatientSignup />} />
      <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
      <Route path="/policies/:slug" element={<Policies />} />
      <Route element={<RequirePatient />}>
        <Route element={<PatientLayout />}>
          <Route path="/account" element={<PatientDashboard />} />
          <Route path="/account/notifications" element={<PatientNotifications />} />
          <Route path="/account/reports" element={<PatientReports />} />
        </Route>
      </Route>
      <Route
        path="*"
        element={
          <>
            <SEO title="Page not found" noindex />
            <NotFound />
          </>
        }
      />
    </Routes>
  );
}
