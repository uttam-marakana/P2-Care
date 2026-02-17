import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-light">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center"
          id="mainNavbar"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/dr-profile">
                Doctor
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/services">
                Service Areas
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/blogs">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/book-appointment">
                Book Appointment
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/hospital">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
