import React from "react";
import { useSearchParams } from "react-router-dom";

const SpecialistCard = ({ img, name }) => {
  const [, setSearchParams] = useSearchParams();

  const handleClick = () => {
    setSearchParams({ specialty: name });
  };

  return (
    <div
      className="card card-center cursor-pointer"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img src={img} width="45" height="45" alt={name} />
      <p className="card-title mt-sm">{name}</p>
    </div>
  );
};

export default SpecialistCard;
