import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceList = ({ services }) => {
  return (
    <div className="card-grid">
      {services.map((service, index) => (
        <ServiceCard key={index} {...service} />
      ))}
    </div>
  );
};

export default ServiceList;
