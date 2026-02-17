import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Hero_img from "../../assets/img/group124.png";

const HeroSection = () => {
  return (
    <section className="hero-sect">
      <div className="img-banner">
        <img src={Hero_img} className="hero-img img-fluid" alt="hero" />
      </div>

      <div className="hero-text">
        <h3>Welcome to P2Care</h3>
        <h1>Best Platform For Patients</h1>
        <h5>Give our best to save patients</h5>

        <div className="hero-info">
          <h3 className="hero-doc">
            <p>400+</p>
            <span>Doctors</span>
          </h3>
          <h3 className="hero-doc">
            <p>50+</p>
            <span>Specialist</span>
          </h3>
          <h3 className="hero-doc" style={{ borderRight: "none" }}>
            <p>45+</p>
            <span>Cities</span>
          </h3>
        </div>

        <div className="btn-space">
          <Link to="/appointment" className="app-btn app-btn-primary">
            Book Now
          </Link>
        </div>

        <div className="hero-msg">
          <h4>Book Appointments With Expert Doctors Near You</h4>

          <div className="hero-msg-point">
            <h6>
              <FaCheckCircle /> Consultation for 50+ diseases
            </h6>
            <h6>
              <FaCheckCircle /> Online & in-person consultation
            </h6>
            <h6>
              <FaCheckCircle /> Complete treatment assistance
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
