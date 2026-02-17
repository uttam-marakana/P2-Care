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
      <SearchSection />
      <ServicesSection />
      <DoctorSection />
      <AboutSection />
      <Appointment />
      <FeedBack />
      <Blogs />
    </>
  );
};

export default Home;
