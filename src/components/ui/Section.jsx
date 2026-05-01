import React from "react";

const Section = ({
  children,
  title,
  subtitle,
  center = false,
  className = "",
}) => {
  return (
    <section className={`section ${className}`}>
      <div className="container">
        {(title || subtitle) && (
          <div className={`section-header ${center ? "text-center" : ""}`}>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}

        {children}
      </div>
    </section>
  );
};

export default Section;
