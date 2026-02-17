import React from "react";
import DoctorCard from "./components/DoctorCard";

const DoctorList = ({ doctors = [] }) => {
  if (!doctors.length) {
    return (
      <div className="text-center py-5">
        <p>No doctors found.</p>
      </div>
    );
  }

  return (
    <div className="card-grid">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} {...doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
