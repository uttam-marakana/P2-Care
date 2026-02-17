import React from "react";
import HeroImage from "../../assets/img/service-banner.png";

const ServiceHero = () => {
  return (
    <section className="position-relative">
      <img src={HeroImage} className="w-full" alt="Services" />

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
