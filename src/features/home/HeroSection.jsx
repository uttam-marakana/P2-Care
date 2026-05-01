import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Hero_img from "../../assets/images/group124.png";

const HeroSection = () => {
  return (
    <section className="relative w-full">
      {/* HERO IMAGE */}
      <div className="w-full h-[520px] md:h-[650px] lg:h-[750px] overflow-hidden">
        <img src={Hero_img} alt="hero" className="w-full h-full object-cover" />
      </div>

      {/* HERO CONTENT */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl text-white space-y-5">
            <h3 className="text-lg md:text-xl font-semibold">
              Welcome to P2Care
            </h3>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Best Platform For Patients
            </h1>

            <h5 className="text-base md:text-lg opacity-90">
              Give our best to save patients
            </h5>

            {/* STATS */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="pr-6 border-r border-white/40">
                <p className="text-2xl md:text-3xl font-bold">400+</p>
                <span className="text-sm">Doctors</span>
              </div>

              <div className="pr-6 border-r border-white/40">
                <p className="text-2xl md:text-3xl font-bold">50+</p>
                <span className="text-sm">Specialist</span>
              </div>

              <div>
                <p className="text-2xl md:text-3xl font-bold">45+</p>
                <span className="text-sm">Cities</span>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                to="/appointment"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Book Now
              </Link>
            </div>

            {/* MESSAGE */}
            <div className="pt-3 space-y-2">
              <h4 className="text-lg md:text-xl font-semibold">
                Book Appointments With Expert Doctors Near You
              </h4>

              <div className="space-y-1 text-sm md:text-base">
                <p className="flex items-center gap-2">
                  <FaCheckCircle /> Consultation for 50+ diseases
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle /> Online & in-person consultation
                </p>
                <p className="flex items-center gap-2">
                  <FaCheckCircle /> Complete treatment assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
