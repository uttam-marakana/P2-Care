import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/* ================= LAYOUTS ================= */

const FullLayout = lazy(() => import("./layouts/FullLayout"));
const BlankLayout = lazy(() => import("./layouts/BlankLayout"));

/* ================= PUBLIC PAGES ================= */

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const About_Hosp = lazy(() => import("./pages/About_Hosp"));

const Appointment = lazy(() => import("./pages/Appointment"));
const Book_Appointment = lazy(() => import("./pages/Book_Appointment"));
const Clinic_Appointment = lazy(() => import("./pages/Clinic_Appointment"));

const Articles = lazy(() => import("./pages/Articles"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Services = lazy(() => import("./pages/Services"));

const Dr_List = lazy(() => import("./pages/Dr_List"));
const Dr_Profile = lazy(() => import("./pages/Dr_Profile"));

const FeedBack = lazy(() => import("./pages/FeedBack"));
const Hospital = lazy(() => import("./pages/Hospital"));
const Patients_Details = lazy(() => import("./pages/Patients_Details"));
const Reviews = lazy(() => import("./pages/Reviews"));

/* ================= AUTH ================= */

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

/* ================= LOADING ================= */

const Loading = lazy(() => import("./components/loading/Loading"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<FullLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-hosp" element={<About_Hosp />} />

            <Route path="/appointment" element={<Appointment />} />
            <Route path="/book-appointment" element={<Book_Appointment />} />
            <Route
              path="/clinic-appointment"
              element={<Clinic_Appointment />}
            />

            <Route path="/articles" element={<Articles />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/services" element={<Services />} />

            {/* DOCTOR MODULE */}
            <Route path="/dr-list" element={<Dr_List />} />
            <Route path="/doctor/:id" element={<Dr_Profile />} />

            <Route path="/feedback" element={<FeedBack />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/patient-details" element={<Patients_Details />} />
            <Route path="/reviews" element={<Reviews />} />
          </Route>

          {/* AUTH ROUTES */}
          <Route element={<BlankLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
