import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FeedbackList from "./FeedbackList";
import FeedBack_img from "../../assets/img/testimonial.png";

const feedbackData = [
  {
    img: FeedBack_img,
    name: "Leela Rogers",
    role: "Businessman",
    message:
      "The consultation process was smooth and professional. Highly recommended for quick and reliable medical support.",
  },
];

const FeedbackSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-lg">
          <h4 className="heading-xl">Patients Feedback</h4>
          <h2 className="heading-lg">Positive Feedback From Our Patients</h2>
          <p className="text-md">
            Real experiences shared by patients who trusted our services.
          </p>
        </div>

        <div className="feedback-btn">
          <button className="dr-btn">
            <FaChevronLeft />
          </button>
          <button className="dr-btn">
            <FaChevronRight />
          </button>
        </div>

        <FeedbackList feedbacks={feedbackData} />
      </div>
    </section>
  );
};

export default FeedbackSection;
