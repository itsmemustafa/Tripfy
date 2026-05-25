import React from "react";
import "./landingPage.css";
import "./section6.css";

const Section6 = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Contact Us</span>
          <h2 className="heading-2">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="section-description">
            Have questions about your next trip to Iraq? We're here to
            help.
          </p>
        </div>

        <div className="contact-wrapper">
          {/* Left Column: Contact Info */}

          {/* Right Column: Contact Form */}
          <div className="contact-form-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-input"
                    placeholder="mostafa"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="mostafa@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="form-input"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  className="form-textarea"
                  placeholder="Tell us about your travel plans..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section6;
