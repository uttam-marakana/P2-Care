import React from "react";
import { FaChevronRight, FaStar, FaAmbulance } from "react-icons/fa";
import { Link } from "react-router-dom";
import About_Hosp from "./About_Hosp";

import { faqs } from "./hospitalFaqs";

const Hospital = () => {
  return (
    <div className="head">
      <div className="pageindi py-3">
        <div className="container">
          <div className="d-flex">
            <Link to="/" className="text-white fw-bold me-2">
              Home
            </Link>
            <FaChevronRight className="text-white" />
            <Link to="/err" className="text-white fw-bold ms-2">
              Shalby Hospital Mohali
            </Link>
          </div>
        </div>
      </div>

      <div className="hospital_mohali mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="hs_box d-flex">
                <img
                  src="assets/img/sshalby.png"
                  className="hos_img"
                  height={200}
                  width={200}
                  alt="Hospital"
                />
                <div className="ms-3">
                  <h5>Shalby Hospital Mohali</h5>
                  <p>
                    Silver Oaks Hospital, Phase-IX, <br /> Sector-63, SAS Nagar,
                    Mohali, <br /> Punjab, 160062, India
                  </p>
                  <button type="submit" className="btn btn-primary">
                    View Direction
                  </button>
                </div>
                <div className="text-center ms-auto">
                  <div className="ratingstar mb-2">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <p className="fw-bold">5 (125) Reviews</p>
                </div>
              </div>

              <div className="hsinfobox mt-5">
                <Link to="/abouthos" className="text-dark fw-bold mx-3">
                  Overview
                </Link>
                <Link to="/docselect" className="text-dark fw-bold mx-3">
                  Doctors
                </Link>
                <Link to="/review" className="text-dark fw-bold mx-3">
                  Reviews
                </Link>
                <Link to="/articles" className="text-dark fw-bold mx-3">
                  Articles
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="req_box mb-4">
                <button type="submit" className="btn btn-danger w-100">
                  Request Callback
                </button>
              </div>
              <div className="ser_box p-3 border rounded">
                <p className="fw-bolder">Available Services</p>
                <hr />
                <ul className="fw-bold list-unstyled">
                  <li>
                    <FaAmbulance /> Ambulance
                  </li>
                  <li>
                    <i className="fa-solid fa-truck-medical"></i> ICU
                  </li>
                  <li>
                    <i className="fa-solid fa-truck-medical"></i> Reception
                  </li>
                  <li>
                    <i className="fa-solid fa-truck-medical"></i> Operation
                    Theatres
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <About_Hosp />

          <div className="mt-5">
            <h2 className="faq">FAQs</h2>
            {faqs.map((faq, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                  >
                    {index + 1}. {faq.question}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospital;
