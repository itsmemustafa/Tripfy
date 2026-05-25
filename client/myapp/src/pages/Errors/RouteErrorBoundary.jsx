import React from "react";
import { Link, useRouteError } from "react-router-dom";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const message =
    error?.statusText || error?.message || "Something went wrong while loading this page.";

  return (
    <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <h2 style={{ marginBottom: "0.75rem" }}>Unexpected Error</h2>
      <p style={{ marginBottom: "1.5rem" }}>{message}</p>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
};

export default RouteErrorBoundary;
