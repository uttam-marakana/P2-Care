import React, { useState } from "react";

const DoctorSearch = ({ doctors, setSearchParams }) => {
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleSearch = () => {
    const params = {};

    if (selectedSpecialist) {
      params.specialty = selectedSpecialist;
    }

    if (selectedDoctor) {
      params.doctor = selectedDoctor;
    }

    setSearchParams(params);
  };

  return (
    <section className="section-sm">
      <div className="container">
        <div className="row justify-content-center">
          {/* Specialist */}
          <div className="col-md-4">
            <label className="fw-bold">Specialist</label>
            <select
              className="form-select"
              onChange={(e) => setSelectedSpecialist(e.target.value)}
            >
              <option value="">All Specialists</option>
              {[...new Set(doctors.map((d) => d.specialty))].map(
                (spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Doctor */}
          <div className="col-md-4">
            <label className="fw-bold">Doctor</label>
            <select
              className="form-select"
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctors.map((doc, index) => (
                <option key={index} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorSearch;
