import React from "react";

const AppointmentStepCard = ({ no, tag, detail }) => {
  return (
    <div className="appointment-list-card">
      <div className="appointment-list-no">{no}</div>

      <div className="appointment-list-detail">
        <h6>{tag}</h6>
        <p>{detail}</p>
      </div>
    </div>
  );
};

export default AppointmentStepCard;
