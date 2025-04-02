import axios from "axios";
import { useEffect, useState } from "react";
import "./Profile.css";

const EmployeeProfile = () => {
    const [profile, setProfile] = useState({ name: "", email: "" });

    useEffect(() => {
        axios.get("http://localhost:5000/api/employee-profile", { withCredentials: true }) // Ensure it hits the correct backend
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error("Error fetching employee profile data:", error);
            });
    }, []);

    const handleDelete = () => {
        axios.delete("http://localhost:5000/api/delete-employee-profile", { withCredentials: true })
            .then(() => {
                alert("Employee profile deleted successfully");
            })
            .catch((error) => {
                console.error("Error deleting employee profile:", error);
            });
    };

    return (
        <div>
            <h2>Employee Profile</h2>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <button onClick={() => alert("Navigate to Edit Employee Profile")}>Edit Profile</button>
            <button onClick={handleDelete}>Delete Profile</button>
        </div>
    );
};

export default EmployeeProfile;
