import React from "react";
import { MdGroups, MdLibraryAddCheck } from "react-icons/md";
import { Link } from "react-router-dom";
import about_img from "../../assets/img/group110.png";

const AboutSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="about-cont">
          <div className="about-left">
            <h4 className="heading-xl">About Us</h4>

            <h2 className="heading-lg">
              We Provide Best Doctor Consultation For You
            </h2>

            <p className="text-md mt-md">
              We connect patients with experienced healthcare professionals
              through reliable consultation services designed for comfort,
              accessibility, and trust.
            </p>

            <div className="about-icon-group mt-lg">
              <div>
                <div className="about-icon-sect">
                  <MdLibraryAddCheck className="abt-i" />
                  <h5>All Types of Doctors</h5>
                </div>
                <p className="text-sm">
                  Access specialists across multiple medical fields.
                </p>
              </div>

              <div>
                <div className="about-icon-sect">
                  <MdLibraryAddCheck className="abt-i" />
                  <h5>Quick Appointment</h5>
                </div>
                <p className="text-sm">
                  Book consultations easily with minimal waiting time.
                </p>
              </div>
            </div>

            <Link to="/appointment" className="app-btn app-btn-primary mt-lg">
              Book Now
            </Link>
          </div>

          <div className="about-right">
            <div className="about-img-group">
              <img src={about_img} alt="About" />

              <div className="about-patients">
                <MdGroups />
                <h5>2,200+</h5>
                <p className="text-dark">Satisfied Patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
