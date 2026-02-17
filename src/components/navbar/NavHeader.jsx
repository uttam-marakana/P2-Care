import React from "react";
import { MdAddCall } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import LogoFull from "../../assets/img/logo2.png";

const NavHeader = () => {
  return (
    <div className="nav-sect">
      <img src={LogoFull} alt="logo" width="163" height="90" />

      <div className="contact">
        <div className="contact_info">
          <div className="text-center">
            <p>Send Us Mail</p>
            <a href="mailto:contact123@gmail.com" className="text-dark">
              <IoIosMail className="contact-icon me-2" />
              contact123@gmail.com
            </a>
          </div>

          <div className="text-center">
            <p>Call To Us</p>
            <a href="tel:+911234569872" className="text-dark">
              <MdAddCall className="contact-icon me-2" />
              +91 1234569872
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavHeader;
