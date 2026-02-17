import React, { lazy } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DoctorList from "../doctor/DoctorList";

const Dr_img = lazy(() => import("../../assets/img/doctor.png"));


function DoctorSection() {
  return (
    <div className="container">
      <div className="dr-sect">
        <div className="text-center">
          <h4>Doctors</h4>
          <p>Select Your Doctor</p>
        </div>
        <div className="">
          <button className="dr-btn">
            <FaChevronLeft />
          </button>
          <button className="dr-btn">
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="dr-list">
        <DoctorList
          img={Dr_img}
          title="Dr. Julius"
          sec="Dentist"
          profile="/dr-profile"
        />
        <DoctorList
          img={Dr_img}
          title="Dr. Yami"
          sec="surgen"
          profile="/dr-profile"
        />
        <DoctorList
          img={Dr_img}
          title="Dr. Clark"
          sec="authopedic"
          profile="/dr-profile"
        />
        <DoctorList
          img={Dr_img}
          title="Dr. Mark"
          sec="TB specialist"
          profile="/dr-profile"
        />
        <DoctorList
          img={Dr_img}
          title="Dr. Smith"
          sec="cancer specialist"
          profile="/dr-profile"
        />
      </div>
    </div>
  );
}

export default DoctorSection;
