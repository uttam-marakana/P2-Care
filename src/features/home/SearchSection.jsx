import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ FIX: Replaced Formik (unnecessary here), defined all state and handlers,
//         replaced garbage placeholder options with real medical specialties.

const SPECIALTIES = [
  "All Specialists",
  "Cardiologist",
  "Dentist",
  "Dermatologist",
  "General Physician",
  "Gynecologist",
  "Neurologist",
  "Orthopedist",
  "Pediatrician",
  "Psychiatrist",
  "Urologist",
];

const SEARCH_BY = ["Doctor Name", "Disease / Symptom", "Specialty"];

function SearchSection() {
  const navigate = useNavigate();
  const [selectDisease, setSelectDisease] = useState("");
  const [selectDoctor, setSelectDoctor] = useState("");
  const [location, setLocation] = useState("");

  // ✅ FIX: locationHandler is now properly defined inside the component
  const locationHandler = (values) => {
    const params = new URLSearchParams();
    if (values.selectDisease && values.selectDisease !== "All Specialists") {
      params.set("specialty", values.selectDisease);
    }
    if (values.selectDoctor) {
      params.set("searchBy", values.selectDoctor);
    }
    if (values.location) {
      params.set("location", values.location);
    }
    navigate(`/dr-list?${params.toString()}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    locationHandler({ selectDisease, selectDoctor, location });
    // Reset form
    setSelectDisease("");
    setSelectDoctor("");
    setLocation("");
  };

  return (
    <div className="search-sect">
      <div className="search">
        <form onSubmit={handleSubmit}>
          <div className="search-form">
            <div className="search-input">
              <label className="search-label" htmlFor="selectDisease">
                Specialist
              </label>
              <select
                id="selectDisease"
                className="selector"
                value={selectDisease}
                onChange={(e) => setSelectDisease(e.target.value)}
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-input">
              <label className="search-label" htmlFor="selectDoctor">
                Search by
              </label>
              <select
                id="selectDoctor"
                className="selector"
                value={selectDoctor}
                onChange={(e) => setSelectDoctor(e.target.value)}
              >
                <option value="">Select</option>
                {SEARCH_BY.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-input">
              <label className="search-label" htmlFor="location">
                Locations
              </label>
              <input
                type="text"
                id="location"
                className="selector"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="search-btn-container">
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchSection;
