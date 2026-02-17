import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ id, img, name, specialty }) => {
  return (
    <div className="card card-center">
      <img src={img} alt={name} className="mx-auto mb-md" />

      <h5 className="card-title">{name}</h5>
      <p className="card-desc">{specialty}</p>

      <Link to={`/doctor/${id}`} className="app-btn app-btn-primary btn-sm">
        View Profile
      </Link>
    </div>
  );
};

export default DoctorCard;
