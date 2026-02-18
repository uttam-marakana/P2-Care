import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Error_Page() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <div className="error-animation">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 300"
          width="400"
          height="300"
          aria-label="404 Error illustration"
        >
          <rect width="400" height="300" fill="#f0f4f8" rx="20" />
          <text
            x="200"
            y="140"
            textAnchor="middle"
            fontSize="100"
            fontWeight="bold"
            fill="#1ca39c"
            opacity="0.15"
          >
            404
          </text>
          <text
            x="200"
            y="155"
            textAnchor="middle"
            fontSize="72"
            fontWeight="bold"
            fill="#215262"
          >
            404
          </text>
          <circle cx="200" cy="230" r="30" fill="#3ebaff" opacity="0.3" />
          <circle cx="200" cy="230" r="18" fill="#1ca39c" opacity="0.6" />
        </svg>
      </div>

      <h1 className="mt-4 text-danger fw-bold">Oops! Page Not Found</h1>
      <p className="lead text-muted">
        The page you're looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Link to="/" className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
}

export default Error_Page;
