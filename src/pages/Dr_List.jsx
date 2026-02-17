import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DoctorHero from "../features/doctor/DoctorHero";
import DoctorSearch from "../features/doctor/DoctorSearch";
import DoctorList from "../features/doctor/DoctorList";
import SpecialistList from "../features/doctor/SpecialistList";
import Feedback from "./Feedback";

import Psychiatry from "../assets/img/psychiatry.png";
import General from "../assets/img/general.png";
import Dentist from "../assets/img/dentist.png";
import Baby from "../assets/img/baby.png";

import { doctors } from "../features/doctor/data/doctors";

const specialists = [
  { img: Psychiatry, name: "Psychiatry" },
  { img: General, name: "Child Care" },
  { img: Dentist, name: "Dentist" },
  { img: Baby, name: "Pediatrics" },
];

const DOCTORS_PER_PAGE = 12;
const page = Number(searchParams.get("page")) || 1;

const startIndex = (page - 1) * DOCTORS_PER_PAGE;
const paginatedDoctors = filteredDoctors.slice(
  startIndex,
  startIndex + DOCTORS_PER_PAGE,
);

const [searchParams, setSearchParams] = useSearchParams();
const [filteredDoctors, setFilteredDoctors] = useState(doctors);

useEffect(() => {
  const specialty = searchParams.get("specialty");
  const doctorName = searchParams.get("doctor");

  let filtered = doctors;

  if (specialty) {
    filtered = filtered.filter(
      (doc) => doc.specialty.toLowerCase() === specialty.toLowerCase(),
    );
  }

  if (doctorName) {
    filtered = filtered.filter((doc) =>
      doc.name.toLowerCase().includes(doctorName.toLowerCase()),
    );
  }

  setFilteredDoctors(filtered);
}, [searchParams]);

const Dr_List = () => {
  return (
    <>
      <DoctorHero />
      <DoctorSearch doctors={doctors} setSearchParams={setSearchParams} />

      <section className="section">
        <div className="container">
          <SpecialistList specialists={specialists} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h3 className="heading-lg text-center mb-lg">
            Specialist Doctors in Your Area
          </h3>

          {/* dynamic data */}
          <DoctorList doctors={paginatedDoctors} />
        </div>
      </section>

      <Feedback />
    </>
  );
};

export default Dr_List;
