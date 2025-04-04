import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "/login";
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/employees/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setError("Unauthorized! Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      });
  }, [userId]);

  const handleEdit = () => {
    setEditName(profile.name);
    setEditPassword("");
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/api/employees/${userId}`,
        { name: editName, password: editPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully.");
      setShowModal(false);
      setProfile({ ...profile, name: editName });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action is irreversible!")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/employees/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profile deleted successfully.");
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert(error.response?.data?.message || "Failed to delete profile.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 border-0 rounded-3">
        <h2 className="text-center mb-3 text-success">Employee Profile</h2>
        <div className="card-body">
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
          <p><strong>Role:</strong> {profile?.role}</p>
        </div>
        <div className="text-center">
          <button className="btn btn-outline-success me-2" onClick={handleEdit}>Edit Profile</button>
          <button className="btn btn-outline-danger" onClick={handleDelete}>Delete Profile</button>
        </div>
      </div>

      {/* Bootstrap Modal for Editing Profile */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content border-0 rounded-3">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default EmployeeProfile;
