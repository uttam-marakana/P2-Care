import React from "react";
import SpecialistCard from "./SpecialistCard";

const SpecialistList = ({ specialists }) => {
  return (
    <div className="card-grid">
      {specialists.map((item, index) => (
        <SpecialistCard key={index} {...item} />
      ))}
    </div>
  );
};

export default SpecialistList;
