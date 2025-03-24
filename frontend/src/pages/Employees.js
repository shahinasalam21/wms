import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeTable from "./EmployeeTable";  


const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/auth/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch employees. Are you logged in as a manager?");
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="employee-container">
      <div className="employee-card">
        <h2 className="text-center">All Registered Employees</h2>
        {error && <p className="text-danger">{error}</p>}
        <EmployeeTable employees={employees} />
      </div>
    </div>
  );
};

export default Employees;