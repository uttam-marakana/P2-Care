import React from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const DoctorReviews = () => {
  return (
    <div className="container my-5">
      <div className="text-center">
        <h4>Patients Feedback</h4>
        <h2 className="mb-3">Positive Feedback From Our Patients</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <br /> Donec vel dignissim lectus. Pellentesque
        </p>
      </div>

      <div className="text-end me-5 mt-4">
        <button className="btn btn-outline-secondary me-3">
          <FaChevronLeft />
        </button>
        <button className="btn btn-outline-secondary">
          <FaChevronRight />
        </button>
      </div>

      <div className="row justify-content-center mt-4">
        <div className="col-md-6 text-center">
          <img
            src="assets/img/testimonial.png"
            width="77px"
            height="77px"
            alt="Testimonial"
          />
          <h5 className="text-info mt-3">Leela Rogers</h5>
          <p className="fs-6">Businessman</p>
          <p className="test_text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            <br />
            sed do eiusmod tempor incididunt ut labore et <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorReviews;
