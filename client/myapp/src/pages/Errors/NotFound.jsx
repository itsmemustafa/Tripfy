import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <h1 style={{ marginBottom: "0.75rem" }}>404</h1>
      <p style={{ marginBottom: "1.5rem" }}>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
