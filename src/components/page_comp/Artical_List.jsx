import React from "react";
import PropTypes from "prop-types";

const Artical_List = ({ img, title, details, more }) => {
  return (
    <div className="card">
      <img src={img} alt={title} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{details}</p>
        <a href="#" className="btn btn-link">
          {more}
        </a>
      </div>
    </div>
  );
};

Artical_List.propTypes = {
  img: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  more: PropTypes.string.isRequired,
};

export default Artical_List;