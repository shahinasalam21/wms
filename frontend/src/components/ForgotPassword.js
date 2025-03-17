import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setMessage("");
      } else {
        setMessage("Check your email for the reset link!");
        setError("");
      }
    } catch (err) {
      setError("Something went wrong! Please try again.");
      setMessage("");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border-0 shadow-lg rounded-3 p-4" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock fs-1 text-primary"></i>
          <h2 className="fw-bold mt-3 mb-0">Forgot Password</h2>
          <p className="text-muted small mt-2">Enter your email to receive a reset link</p>
        </div>
        
        {message && <div className="alert alert-success d-flex align-items-center">
          <i className="bi bi-check-circle-fill me-2"></i>
          <div>{message}</div>
        </div>}
        
        {error && <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                id="email"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 mb-3 fw-bold"
            style={{ borderRadius: "8px" }}
          >
            Send Reset Link
          </button>
        </form>
        
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none text-primary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;