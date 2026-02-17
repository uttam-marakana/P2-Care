import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ img, tag, detail, more }) => {
  return (
    <div className="card">
      <img src={img} alt={tag} className="img-fluid" />

      <div className="p-md">
        <h6 className="card-title">{tag}</h6>
        <p className="card-desc">{detail}</p>

        <Link to={more} className="btn btn-outline-primary">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
