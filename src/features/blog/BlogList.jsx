import React from "react";
import BlogCard from "./BlogCard";

const BlogList = ({ blogs }) => {
  return (
    <div className="row">
      {blogs.map((blog, index) => (
        <div key={index} className="col-md-6 mb-4">
          <BlogCard {...blog} />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
