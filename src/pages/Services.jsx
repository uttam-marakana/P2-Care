import React from "react";
import ServiceHero from "../features/service/ServiceHero";
import ServiceList from "../features/service/ServiceList";

import General from "../assets/img/general.png";
import Psychiatry from "../assets/img/psychiatry.png";
import Dentist from "../assets/img/dentist.png";
import Baby from "../assets/img/baby.png";

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
