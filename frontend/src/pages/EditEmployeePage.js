import React, { useState } from 'react';
import axios from 'axios';
import "./EditEmployeePage.css";

const EditEmployeePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:5000/api/update-employee-profile', { name, email }, { withCredentials: true })
      .then(() => {
        alert('Employee profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating employee profile:', error);
      });
  };

  return (
    <div>
      <header className="employee-profilee-header">
        <h2>EDIT EMPLOYEE PROFILE</h2>
      </header>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEmployeePage;
