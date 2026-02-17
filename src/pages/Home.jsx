import React from "react";
import HeroSection from "../features/home/HeroSection";
import SearchSection from "../features/home/SearchSection";
import DoctorSection from "../features/home/DoctorSection";

import Services from "./Services";
import About from "./About";
import Appointment from "./Appointment";
import FeedBack from "./FeedBack";
import Blogs from "./Blogs";

const Home = () => {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <Services />
      <DoctorSection />
      <About />
      <Appointment />
      <FeedBack />
      <Blogs />
    </>
  );
};

export default Home;
