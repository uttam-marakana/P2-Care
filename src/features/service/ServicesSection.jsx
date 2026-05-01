import React from "react";
import { Link } from "react-router-dom";
import ServiceList from "./ServiceList";

import General from "../../assets/images/general.png";
import Psychiatry from "../../assets/images/psychiatry.png";
import Dentist from "../../assets/images/dentist.png";
import Baby from "../../assets/images/baby.png";

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

const ServicesSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="flex-between mb-lg">
          <div>
            <h4 className="heading-xl">Services</h4>
            <p className="heading-lg">Our Specialities</p>
          </div>

          <Link to="/services" className="app-btn app-btn-primary">
            View All
          </Link>
        </div>

        <ServiceList services={servicesData} />
      </div>
    </section>
  );
};

export default ServicesSection;
