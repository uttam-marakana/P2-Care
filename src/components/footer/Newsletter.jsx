import React from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Newsletter = () => {
  return (
    <section className="section">
      <div className="container newsletter-box card">
        <div className="newsletter-content">
          <h2>Stay Informed. Stay Healthy.</h2>
          <p>
            Get expert health tips, appointment updates, and trusted medical
            insights directly to your inbox.
          </p>
        </div>

        <form className="newsletter-form">
          <Input type="email" placeholder="Enter your email address" />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
