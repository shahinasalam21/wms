import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeTable.css"; // Ensure this file contains necessary styles

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/employees", {
          headers: { Authorization: `Bearer ${token}` },

        });
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employees. Are you logged in as a manager?");
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employee-container">
      <div className="employee-card">
        <h2 className="text-center">All Registered Employees</h2>
        {error && <p className="text-danger">{error}</p>}
        
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;