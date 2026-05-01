import React from "react";
import { Link } from "react-router-dom";

const MobileDrawer = ({ open, setOpen }) => {
  return (
    <>
      <div
        className={`drawer-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setOpen(false)}>
          ✕
        </button>

        <ul className="drawer-links">
          <li>
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/dr-list" onClick={() => setOpen(false)}>
              Doctors
            </Link>
          </li>
          <li>
            <Link to="/services" onClick={() => setOpen(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/blogs" onClick={() => setOpen(false)}>
              Blog
            </Link>
          </li>
          <li>
            <Link to="/hospital" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/book-appointment"
              className="nav-cta"
              onClick={() => setOpen(false)}
            >
              Book Appointment
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileDrawer;
