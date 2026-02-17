import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import Logo from "../../assets/img/logo1.png";

const FooterMain = () => {
  return (
    <div className="container footer-container">
      <div className="footer-left">
        <img src={Logo} alt="logo" className="footer-logo" />

        <p className="footer-text">
          We connect patients with trusted healthcare professionals, providing
          reliable consultations and better access to care.
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

      <div className="footer-links">
        <ul className="fcont">
          <p className="fw-bold">Quick Links</p>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/dr-list">Doctors</Link>
          </li>
          <li>
            <Link to="/hospital">Contact</Link>
          </li>
        </ul>

        <ul className="fcont">
          <p className="fw-bold">Useful Links</p>
          <li>
            <Link to="#">Privacy Policy</Link>
          </li>
          <li>
            <Link to="#">Terms & Conditions</Link>
          </li>
          <li>
            <Link to="#">Disclaimer</Link>
          </li>
          <li>
            <Link to="#">FAQ</Link>
          </li>
        </ul>
      </div>

      <div className="footer-call">
        <div className="call-box">
          <div className="call-icon">
            <IoCall />
          </div>
          <div className="call-text">
            <h6>Call Us Today</h6>
            <p>+91 3256523561</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMain;
