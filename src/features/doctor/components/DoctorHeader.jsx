import React from "react";
import { FaChevronRight, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";


const DoctorHeader = ({ doctor }) => {
  return (
    <>
      <div className="bg-dark py-3">
        <div className="container d-flex align-items-center">
          <Link to="/" className="text-white fw-bold me-2">
            Home
          </Link>
          <FaChevronRight className="text-white" />
          <span className="text-white fw-bold ms-2">{doctor.name}</span>
        </div>
      </div>

      <div className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-3 text-center">
            <img
              src={doctor.profileImg}
              alt={doctor.name}
              className="img-fluid rounded"
            />
          </div>

          <div className="col-md-9">
            <div className="row">
              <div className="col-md-6">
                <h5 className="fw-bold">{doctor.name}</h5>
                <p>Dr. Code: {doctor.doctorCode}</p>
                <p>Dept. Code: {doctor.deptCode}</p>
              </div>

              <div className="col-md-6 text-center">
                <div className="text-warning">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="fw-bold">
                  {doctor.rating} ({doctor.reviews}) Reviews
                </p>
              </div>
            </div>

            <div className="text-end mt-3">
              <button className="btn btn-primary">Book An Appointment</button>
            </div>

            <div className="mt-3">
              <p className="fw-bold">Specialties:</p>
              <div className="d-flex flex-wrap gap-2">
                {doctor.specialties.map((sp, i) => (
                  <span key={i} className="badge bg-secondary">
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorHeader;
