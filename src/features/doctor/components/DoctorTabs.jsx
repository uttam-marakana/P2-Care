import React from "react";

const DoctorTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-bottom mb-4">
      <div className="d-flex justify-content-center gap-4">
        <button
          className={`btn ${activeTab === "about" ? "btn-primary" : "btn-light"}`}
          onClick={() => setActiveTab("about")}
        >
          Overview
        </button>

        <button
          className={`btn ${activeTab === "reviews" ? "btn-primary" : "btn-light"}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>

        <button
          className={`btn ${activeTab === "articles" ? "btn-primary" : "btn-light"}`}
          onClick={() => setActiveTab("articles")}
        >
          Articles
        </button>
      </div>
    </div>
  );
};

export default DoctorTabs;
