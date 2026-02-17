import React from "react";

const FeedbackCard = ({ img, name, role, message }) => {
  return (
    <div className="card card-center">
      <img src={img} alt={name} className="img-fluid mb-md" />

      <div className="feedback-details">
        <h5 className="text-primary mt-md">{name}</h5>
        <p className="text-sm">{role}</p>
        <p className="text-md">{message}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
