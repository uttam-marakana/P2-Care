import React from "react";
import AppointmentStepCard from "./AppointmentStepCard";

const AppointmentStepList = ({ steps }) => {
  return (
    <div className="appointment-list">
      {steps.map((step, index) => (
        <AppointmentStepCard key={index} {...step} />
      ))}
    </div>
  );
};

export default AppointmentStepList;
