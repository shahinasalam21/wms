import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Employeeprofile.css";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employee data from API
    fetch("http://localhost:5000/api/employee-profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleDelete = () => {
    alert("Profile deleted! (Add API call here)");
    // Call API to delete profile
  };

  return (
    <div>
      <header className="employee-profile-header">
        <h2>EMPLOYEE PROFILE</h2>
      </header>

      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>

      <button onClick={() => navigate("/update-employee-profile")}>Edit Profile</button>
      <button onClick={handleDelete}>Delete Profile</button>
    </div>
  );
};

export default EmployeeProfile;
