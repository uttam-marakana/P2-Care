import React from "react";

function DoctorAbout() {
  return (
    <>
      <div className="container">
        <div className="p-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </p>
          <div className="mt-5">
            <div className="d-flex">
              <div className="left_box">
                <h6>Dept. Name: </h6>
                <p>Department</p>
                <h6>Designation:</h6>
                <p>Dentist</p>
                <h6>Qualification:</h6>
                <p>
                  MDS - Prosthodontist And Crown Bridge - <br /> SDM College of
                  Dental Sciences, Dharwad, 2000
                </p>
                <p>BDS - SDM College of Dental Sciences, Dharwad, 1997</p>
                <h6>Expertise:</h6>
                <p>Implantologist</p>
                <p>Prosthodontist</p>
              </div>
              <div className="right_box">
                <h6>Fellowship Membership</h6>
                <p>Indian Dental Association</p>
                <p>Indian Prosthodontic Society</p>
                <p>
                  Member of American Academy of Implant <br /> Dentistry (USA)
                </p>
                <p>International Congress of Oral Implantologists (ICOI)</p>
                <h6>Awards Achievements</h6>
                <p>
                  Fellow International Congress Of Oral Implantologist - 2014
                </p>
                <h6>Languages Spoken:</h6>
                <p>Hindi, English</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorAbout;
