import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
        setError("Please complete reCAPTCHA verification.");
        return;
    }
    //api call for login
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, recaptchaToken }),
        });

        const data = await response.json();
        if (data.error) {
            setError(data.error);
        } else {
            alert("Login successful!");
            
            
            localStorage.setItem("userId", data.user.id);  // access user ID
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            
            navigate(data.redirectURL);
        }
    } catch (error) {
        setError("Login failed. Please try again.");
    }
};


  return (
    <div className="outer-container">
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <div className="recaptcha-container">
              <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} />
            </div>
            <button type="submit">Login</button>
          </form>
          <p><a href="/forgot-password">Forgot Password?</a></p>
          <div className="auth-footer">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
