import React from "react";
import BlogList from "./BlogList";
import FeaturedBlog from "./FeaturedBlog";

import Blog1 from "../../assets/images/blog1.png";
import Blog2 from "../../assets/images/blog2.png";
import Blog3 from "../../assets/images/blog3.png";
import Blog4 from "../../assets/images/blog4.png";
import Blog5 from "../../assets/images/blog5.png";

const blogsData = [
  {
    img: Blog1,
    tag: "Common Diseases You Should Know",
    detail: "Understanding symptoms and prevention methods.",
    more: "/",
  },
  {
    img: Blog2,
    tag: "Healthy Lifestyle Tips",
    detail: "Daily habits that improve long-term health.",
    more: "/",
  },
  {
    img: Blog3,
    tag: "Mental Health Awareness",
    detail: "Importance of mental wellness in modern life.",
    more: "/",
  },
  {
    img: Blog4,
    tag: "Child Health Care Guide",
    detail: "Essential care tips for growing children.",
    more: "/",
  },
];

const featuredBlog = {
  img: Blog5,
  title: "6 Tips For Maintaining Children’s Mental Health When Sick",
  detail: "Simple practices parents can follow to support mental wellbeing.",
  link: "/",
};

const BlogSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-lg">
          <h4 className="heading-xl">Latest News</h4>
          <h2 className="heading-lg">News & Article</h2>
        </div>

        <div className="row">
          <div className="col-md-8">
            <BlogList blogs={blogsData} />
          </div>

          <div className="col-md-4">
            <FeaturedBlog {...featuredBlog} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
