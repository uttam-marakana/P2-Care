import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosMail } from "react-icons/io";
import { MdAddCall } from "react-icons/md";
import Logo from "../../assets/images/logo2.png";
import MobileDrawer from "./MobileDrawer";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      {/* TOPBAR */}
      <div className="topbar">
        <div className="container topbar-content">
          <span>support@yourhospital.com</span>
          <span>Emergency: +91 98765 43210</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="container header-main">
        <img src={Logo} alt="logo" className="nav-logo" />

        <div className="header-contact">
          <div className="contact-item">
            <IoIosMail />
            <span>support@yourhospital.com</span>
          </div>

          <div className="contact-item">
            <MdAddCall />
            <span>+91 98765 43210</span>
          </div>
        </div>

        <button className="menu-toggle" onClick={() => setOpen(true)}>
          ☰
        </button>
      </div>

      {/* NAVBAR */}
      <div className="navbar">
        <div className="container nav-content">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/dr-list">Doctors</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/blogs">Blog</Link>
            </li>
            <li>
              <Link to="/hospital">Contact</Link>
            </li>
          </ul>

          <Link to="/book-appointment" className="nav-cta">
            Book Appointment
          </Link>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <MobileDrawer open={open} setOpen={setOpen} />
    </header>
  );
};

export default Header;
