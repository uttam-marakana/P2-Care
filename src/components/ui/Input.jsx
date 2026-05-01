import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}

      <input
        type={type}
        placeholder={placeholder}
        className={`input-field ${error ? "input-error" : ""}`}
        {...props}
      />

      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;
