import React, { useState } from "react";
import DoctorHeader from "../components/DoctorHeader";
import DoctorTabs from "../components/DoctorTabs";

import { useParams } from "react-router-dom";
import { doctors } from "../data/doctors";

import DoctorAbout from "./DoctorAbout";
import DoctorReviews from "./DoctorReviews";
import DoctorArticles from "./DoctorArticles";

const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState("about");
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === Number(id));

  const renderTab = () => {
    switch (activeTab) {
      case "reviews":
        return <DoctorReviews />;
      case "articles":
        return <DoctorArticles />;
      default:
        return <DoctorAbout />;
    }
  };

  return (
    <>
      <DoctorHeader doctor={doctor} />
      <div className="container my-4">
        <DoctorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {renderTab()}
      </div>
      if (!doctor) return <div className="container">Doctor not found</div>;
    </>
  );
};

export default DoctorProfile;
