import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Profile.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = ({ userId: propUserId }) => {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  const userId = propUserId || localStorage.getItem("userId");

  useEffect(() => {
    const fetchManagerDetails = async () => {
      const token = localStorage.getItem("token");

      if (!userId) {
        setError("User ID is missing! Please log in.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("No token found! Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setManager(response.data);
      } catch (error) {
        console.error("Error fetching manager details:", error);
        setError(error.response?.data?.message || "Failed to fetch manager details.");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerDetails();
  }, [userId]);

  const handleEdit = () => {
    setEditName(manager.name);
    setEditPassword("");
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    setSavingChanges(true);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/api/users/${userId}`,
        { name: editName, password: editPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      setManager({ ...manager, name: editName });
      
      // Show success message
      const alertElement = document.createElement('div');
      alertElement.className = 'position-fixed top-0 start-50 translate-middle-x p-3 success-alert';
      alertElement.style.zIndex = 1070;
      alertElement.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="bi bi-check-circle-fill me-2"></i> Profile updated successfully!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      document.body.appendChild(alertElement);
      
      // Remove alert after 3 seconds
      setTimeout(() => {
        alertElement.remove();
      }, 3000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSavingChanges(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action is irreversible!")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show success message before redirecting
      alert("Profile deleted successfully.");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error deleting profile:", error);
      setError(error.response?.data?.message || "Failed to delete profile.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading profile data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container py-5">
      <Card className="profile-card shadow border-0">
        <div className="profile-header text-center text-white p-4">
          <div className="profile-avatar-container">
            <div className="profile-avatar d-flex justify-content-center align-items-center bg-white text-primary">
              {manager?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <h2 className="mt-4 mb-1">{manager?.name}</h2>
          <p className="text-white-50">{manager?.role}</p>
        </div>
        
        <Card.Body className="p-4">
          <div className="profile-details">
            <div className="detail-item">
              <div className="detail-icon">
                <i className="bi bi-envelope"></i>
              </div>
              <div className="detail-info">
                <p className="detail-label">Email</p>
                <p className="detail-value">{manager?.email}</p>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <i className="bi bi-person-badge"></i>
              </div>
              <div className="detail-info">
                <p className="detail-label">Role</p>
                <p className="detail-value">{manager?.role}</p>
              </div>
            </div>
          </div>
          
          <div className="profile-actions d-flex justify-content-center gap-3 mt-4">
            <Button variant="outline-primary" onClick={handleEdit} className="px-4 py-2">
              <i className="bi bi-pencil-square me-2"></i>Edit Profile
            </Button>
            <Button variant="outline-danger" onClick={handleDelete} className="px-4 py-2">
              <i className="bi bi-trash me-2"></i>Delete Profile
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>Edit Profile</Modal.Title>
          <Button variant="link" className="text-white close-button" onClick={() => setShowModal(false)}>
            <i className="bi bi-x-lg"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
              
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleSaveChanges}
            disabled={savingChanges}
          >
            {savingChanges ? (
              <>
                <Spinner 
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              <>Save Changes</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;