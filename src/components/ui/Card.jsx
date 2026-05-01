import React from "react";

const Card = ({ children, className = "", hover = true }) => {
  return (
    <div
      className={`card ${hover ? "hover:translate-y-[-6px]" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
