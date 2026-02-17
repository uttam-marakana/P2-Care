import React from "react";
import FeedbackCard from "./FeedbackCard";

const FeedbackList = ({ feedbacks }) => {
  return (
    <div className="card-grid">
      {feedbacks.map((item, index) => (
        <FeedbackCard key={index} {...item} />
      ))}
    </div>
  );
};

export default FeedbackList;
