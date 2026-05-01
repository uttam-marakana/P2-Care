import React from "react";
import HeroSection from "../features/home/HeroSection";
import SearchSection from "../features/home/SearchSection";
import DoctorSection from "../features/home/DoctorSection";
import ServicesSection from "../features/service/ServicesSection";
import AboutSection from "../features/about/AboutSection";

import Appointment from "./Appointment";
import FeedBack from "./FeedBack";
import Blogs from "./Blogs";

const Home = () => {
  return (
    <>
      <HeroSection />

      {/* search overlaps hero visually */}
      <div className="-mt-16 md:-mt-20 relative z-20">
        <SearchSection />
      </div>

      <section className="py-14 md:py-20">
        <ServicesSection />
      </section>

      <section className="py-14 md:py-20 bg-gray-50">
        <DoctorSection />
      </section>

      <section className="py-14 md:py-20">
        <AboutSection />
      </section>

      <Appointment />

      <section className="py-14 md:py-20 bg-gray-50">
        <FeedBack />
      </section>

      <section className="py-14 md:py-20">
        <Blogs />
      </section>
    </>
  );
};

export default Home;
