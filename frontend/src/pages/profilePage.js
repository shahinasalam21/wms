// ProfilePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ProfilePage = () => {
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    // Fetch the profile data when the component mounts
    axios.get('/api/profile')
      .then(response => {
        setManagerData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile data', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!managerData) {
    return <div>Manager not found</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p><strong>Name:</strong> {managerData.name}</p>
      <p><strong>Email:</strong> {managerData.email}</p>

      <button onClick={() => history.push('/edit-profile')}>Edit Profile</button>
      <button onClick={handleDeleteProfile}>Delete Profile</button>
    </div>
  );
};

const handleDeleteProfile = async () => {
  if (window.confirm('Are you sure you want to delete your profile?')) {
    try {
      await axios.delete('/api/profile');
      alert('Profile deleted successfully');
      window.location.href = '/logout'; 
    } catch (error) {
      console.error('Error deleting profile', error);
      alert('Error deleting profile');
    }
  }
};

export default ProfilePage;
