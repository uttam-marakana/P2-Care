import React from "react";
import HeroImage from "../../assets/images/femaledoc.png";

const DoctorHero = () => {
  return (
    <section className="position-relative">
      <img src={HeroImage} className="w-full" alt="Doctors" />

      <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
        <h1 className="heading-xl fw-bold">
          Search Best Doctors <br /> at Best Locations
        </h1>

        <div className="flex-center gap-lg mt-lg">
          <h3>
            400+ <span className="text-dark">Doctors</span>
          </h3>
          <h3>
            50+ <span className="text-dark">Specialists</span>
          </h3>
          <h3>
            45+ <span className="text-dark">Cities</span>
          </h3>
        </div>
      </div>
    </section>
  );
};

export default DoctorHero;
