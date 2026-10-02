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
              title="Hospital care in Mohali"
              description="Patient-first hospital care, specialists, appointments and emergency services in Mohali, Punjab."
            />
            <Home />
          </>
        }
      />
      <Route
        path="/services"
        element={page(
          Services,
          "Hospital services in Mohali",
          "Explore specialist hospital services and care teams at P2Care Hospital Mohali.",
        )}
      />
      <Route
        path="/doctors"
        element={page(
          Doctors,
          "Doctors and specialists in Mohali",
          "Meet P2Care Hospital doctors and specialists in Mohali and find the right care team.",
        )}
      />
      <Route
        path="/doctors/:id"
        element={page(
          DoctorDetail,
          "Doctor profile",
          "View specialist credentials, availability and appointment information at P2Care Hospital Mohali.",
        )}
      />
      <Route
        path="/appointment"
        element={page(
          Appointment,
          "Book a hospital appointment",
          "Request an appointment with P2Care Hospital Mohali and our care team will confirm your visit.",
        )}
      />
      <Route
        path="/hospital"
        element={
          <>
            <HospitalSchema
              title="About P2Care Hospital Mohali"
              description="Plan your visit to P2Care Hospital at Silver Oaks Hospital in Mohali, Punjab."
            />
            <Hospital />
          </>
        }
      />
      <Route
        path="/emergency"
        element={page(
          Emergency,
          "Emergency care in Mohali",
          "24/7 emergency care information and patient guidance for P2Care Hospital Mohali.",
        )}
      />
      <Route
        path="/articles"
        element={page(
          Articles,
          "Health stories and guidance",
          "Practical health guidance and stories from the P2Care Hospital care team.",
        )}
      />
      <Route
        path="/contact"
        element={
          <>
            <HospitalSchema
              title="Contact P2Care Hospital Mohali"
              description="Find P2Care Hospital Mohali, contact the patient helpline and send a message to the care team."
            />
            <Contact />
          </>
        }
      />
      <Route
        path="/faq"
        element={page(
          FAQ,
          "P2Care Hospital patient FAQs",
          "Answers to common questions about appointments, hospital visits and emergency care.",
        )}
      />
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
