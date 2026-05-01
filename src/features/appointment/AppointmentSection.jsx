import React from "react";
import AppointmentStepList from "./AppointmentStepList";
import AppointmentImg from "../../assets/images/doctor.png";

const steps = [
  {
    no: "1",
    tag: "Search Your Disease",
    detail: "Find doctors based on your symptoms or condition.",
  },
  {
    no: "2",
    tag: "Choose Specialist",
    detail: "Select from verified healthcare professionals.",
  },
  {
    no: "3",
    tag: "Book Appointment",
    detail: "Schedule consultation at your preferred time.",
  },
  {
    no: "4",
    tag: "Get Consultation",
    detail: "Receive professional medical advice easily.",
  },
];

const AppointmentSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="appointment-cont text-center">
          <h4 className="heading-xl">Easy Appointment</h4>
          <h2 className="heading-lg">Easy Steps To Booking</h2>
          <p className="text-md">
            Book consultations quickly through a simple and guided process.
          </p>
        </div>

        <div className="appointment-card">
          <div className="appointment-pos">
            <div className="appointment-img">
              <img src={AppointmentImg} alt="Appointment" />
            </div>

            <div className="appointment-booking">
              <AppointmentStepList steps={steps} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
