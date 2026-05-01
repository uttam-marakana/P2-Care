import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import Logo from "../../assets/images/logo1.png";

const FooterMain = () => {
  return (
    <div className="container footer-grid">
      {/* LEFT */}
      <div className="footer-brand">
        <img src={Logo} alt="Hospital Logo" className="footer-logo" />

        <p>
          Providing trusted healthcare services with certified doctors, modern
          facilities, and patient-first care. Your health is our priority.
        </p>

        <div className="social-icons">
          <Link to="#" className="icon">
            <FaFacebook />
          </Link>
          <Link to="#" className="icon">
            <AiFillInstagram />
          </Link>
          <Link to="#" className="icon">
            <FaXTwitter />
          </Link>
        </div>
      </div>

      {/* LINKS */}
      <div className="footer-links">
        <div>
          <h4>Services</h4>
          <ul>
            <li>
              <Link to="/services">Medical Services</Link>
            </li>
            <li>
              <Link to="/dr-list">Find Doctors</Link>
            </li>
            <li>
              <Link to="/appointment">Book Appointment</Link>
            </li>
            <li>
              <Link to="/reviews">Patient Reviews</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Information</h4>
          <ul>
            <li>
              <Link to="/about">About Hospital</Link>
            </li>
            <li>
              <Link to="/hospital">Contact Us</Link>
            </li>
            <li>
              <Link to="#">Privacy Policy</Link>
            </li>
            <li>
              <Link to="#">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* CONTACT */}
      <div className="footer-contact card">
        <div className="call-box">
          <IoCall className="call-icon" />

          <div>
            <h5>24/7 Emergency Support</h5>
            <p>+91 9876xxxxxx</p>
          </div>
        </div>

        <p className="footer-address">
          Rajkot, Gujarat, India
          <br />
          Mon - Sun | 24 Hours Service
        </p>
      </div>
    </div>
  );
};

export default FooterMain;
