import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Added basic validation for password match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();
    setMessage(data.message || data.error);
      
    if (data.message) {
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card border-0 shadow-lg rounded-3 p-4" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="text-center mb-4">
          <i className="bi bi-key-fill fs-1 text-primary"></i>
          <h2 className="fw-bold mt-3 mb-0">Reset Password</h2>
          <p className="text-muted small mt-2">Create a new password for your account</p>
        </div>
        
        {message && <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} d-flex align-items-center`}>
          <i className={`bi ${message.includes("success") ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
          <div>{message}</div>
        </div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock-fill text-muted"></i>
              </span>
              <input
                type="password"
                id="newPassword"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-shield-lock text-muted"></i>
              </span>
              <input
                type="password"
                id="confirmPassword"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <small className="text-danger mt-1 d-block">Passwords don't match</small>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 mb-3 fw-bold"
            style={{ borderRadius: "8px" }}
          >
            Reset Password
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

export default ResetPassword;