import React from "react";
import { Link } from "react-router-dom";

const FeaturedBlog = ({ img, title, detail, link }) => {
  return (
    <div className="position-relative">
      <img src={img} className="img-fluid w-100" alt={title} />

      <div className="p-3 bg-white shadow rounded mt-3">
        <h6 className="mb-3">{title}</h6>
        <p className="mb-2">{detail}</p>

        <Link to={link} className="btn btn-outline-primary">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default FeaturedBlog;
