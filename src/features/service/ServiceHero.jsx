import React, { lazy } from "react";
// const HeroImage = lazy(() => import("../../assets/images/serviceHero.png"));
import HeroImage from "../../assets/images/serviceHero.png";



const ServiceHero = () => {
  return (
    <section className="position-relative">
      <img
        src="../../assets/images/serviceHero.png"
        className="w-full"
        alt="Services"
      />

      <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
        <h1 className="heading-xl fw-bold">Our Medical Services</h1>
        <p className="text-lg">
          Comprehensive healthcare services designed for every patient.
        </p>
      </div>
    </section>
  );
};

export default ServiceHero;
