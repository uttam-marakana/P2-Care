import React from "react";

const Newsletter = () => {
  return (
    <div className="container newsletter">
      <div>
        <h4 className="mb-4">Subscribe Our Newsletter</h4>
        <p>
          Stay updated with health tips, medical articles, and service updates
          from our expert team.
        </p>
      </div>

      <div className="email-sect">
        <form className="d-flex">
          <input
            type="email"
            className="email-btn p-2"
            placeholder="Your Email"
          />
          <button type="submit" className="subscribe-btn">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
