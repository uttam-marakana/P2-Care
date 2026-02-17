import React from "react";
import { IoIosMail } from "react-icons/io";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import { AiFillInstagram } from "react-icons/ai";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="banner-full">
      <div className="content-container">
        <div className="mail">
          <a href="mailto:contact123@gmail.com">
            <IoIosMail className="icon me-2" />
            <p>contact123@gmail.com</p>
          </a>
        </div>

        <div className="social">
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
    </div>
  );
};

export default TopBar;
