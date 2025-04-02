import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeeProfilePage = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the employee profile data when the component mounts
    axios.get('http://localhost:5000/api/employee-profile', { withCredentials: true })
      .then(response => {
        setEmployeeData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching employee profile data', error);
        setLoading(false);
      });
  }, []);

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        await axios.delete('http://localhost:5000/api/delete-employee-profile', { withCredentials: true });
        alert('Profile deleted successfully');
        window.location.href = '/logout'; // Or redirect to another page after deleting
      } catch (error) {
        console.error('Error deleting employee profile', error);
        alert('Error deleting profile');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employeeData) {
    return <div>Employee not found</div>;
  }

  return (
    <div className="employee-profile-page">
      <header className="empprofile-header">
        <h2>EMPLOYEE PROFILE</h2>
      </header>
      <p><strong>Name:</strong> {employeeData.name}</p>
      <p><strong>Email:</strong> {employeeData.email}</p>

      <button onClick={() => navigate('/edit-employee-profile')}>Edit Profile</button>
      <button onClick={handleDeleteProfile}>Delete Profile</button>
    </div>
  );
};

export default EmployeeProfilePage;
