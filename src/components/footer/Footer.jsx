import React from "react";
import Newsletter from "./Newsletter";
import FooterMain from "./FooterMain";
import Copyright from "./Copyright";

const Footer = () => {
  return (
    <footer className="footer">
      <Newsletter />

      <div className="footer-divider"></div>

      <FooterMain />

      <div className="footer-divider"></div>

      <Copyright />
    </footer>
  );
};

export default Footer;
