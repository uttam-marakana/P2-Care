import React from "react";
import Newsletter from "./Newsletter";
import FooterMain from "./FooterMain";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <div className="footer">
      <Newsletter />
      <div className="borderLine"></div>

      <FooterMain />
      <div className="borderLine"></div>

      <Copyright />
    </div>
  );
};

export default Footer;
