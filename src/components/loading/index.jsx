import React from "react";

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-card">
        {/* Medical Icon + Spinner */}
        <div className="loader-visual">
          <div className="pulse-ring"></div>
          <div className="medical-icon">+</div>
        </div>

        {/* Messaging */}
        <div className="loading-content">
          <h2>Preparing Your Care Experience</h2>
          <p>
            We are securely loading your information. This will only take a
            moment.
          </p>

          {/* Progress indicator */}
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <span className="loading-note">🔒 Your data is safe & encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
