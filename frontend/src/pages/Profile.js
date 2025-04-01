import axios from "axios";
import { useEffect, useState } from "react";
import "./Profile.css";


const Profile = () => {
    const [profile, setProfile] = useState({ name: "", email: "" });

    useEffect(() => {
        axios.get("http://localhost:5000/api/manager-profile", { withCredentials: true }) // Ensure it hits the correct backend
            .then((response) => {
                setProfile(response.data);
            })
            .catch((error) => {
                console.error("Error fetching profile data:", error);
            });
    }, []);

    const handleDelete = () => {
        axios.delete("http://localhost:5000/api/delete-profile", { withCredentials: true })
            .then(() => {
                alert("Profile deleted successfully");
            })
            .catch((error) => {
                console.error("Error deleting profile:", error);
            });
    };

    return (
        <div>
            <h2>Profile</h2>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <button onClick={() => alert("Navigate to Edit Profile")}>Edit Profile</button>
            <button onClick={handleDelete}>Delete Profile</button>
        </div>
    );
};

export default Profile;
