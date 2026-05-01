import React from "react";
import ServiceHero from "../features/service/ServiceHero";
import ServiceList from "../features/service/ServiceList";

import General from "../assets/images/general.png";
import Psychiatry from "../assets/images/psychiatry.png";
import Dentist from "../assets/images/dentist.png";
import Baby from "../assets/images/baby.png";

const servicesData = [
  {
    img: General,
    tag: "Child Care",
    detail: "Specialized healthcare focused on children's growth.",
  },
  {
    img: Psychiatry,
    tag: "Psychiatry",
    detail: "Professional mental health consultation.",
  },
  {
    img: Dentist,
    tag: "Dentist",
    detail: "Complete dental care and treatments.",
  },
  {
    img: Baby,
    tag: "Pediatrics",
    detail: "Medical care for infants and adolescents.",
  },
];

const Services = () => {
  return (
    <>
      <ServiceHero />

      <section className="section">
        <div className="container">
          <ServiceList services={servicesData} />
        </div>
      </section>
    </>
  );
};

export default Services;
