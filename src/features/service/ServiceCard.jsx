import React from "react";

const ServiceCard = ({ img, tag, detail }) => {
  return (
    <div className="card card-center">
      <img
        src={img}
        alt={tag}
        width="80"
        height="80"
        className="mx-auto mb-md"
      />

      <h5 className="card-title">{tag}</h5>
      <p className="card-desc">{detail}</p>
    </div>
  );
};

export default ServiceCard;
