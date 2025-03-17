import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTasks, FaBell, FaChartLine, FaSignOutAlt } from "react-icons/fa";
import "../pages/EmployeeDashboard.css"; 

const EmpSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  return (
    <div className="employee-sidebar d-flex flex-column p-3">
      <h2 className="mb-4 text-center">EMPLOYEE DASHBOARD</h2>
      <nav>
        <ul style={{listStyle:"none"}}>
          <li className="mb-3">
            <Link to="/employee-tasks">
              <FaTasks className="me-2" /> Tasks
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/notifications" >
              <FaBell className="me-2" /> Notifications
            </Link>
          </li>
          <li className="mb-3">
            <Link to="/performance" >
              <FaChartLine className="me-2" /> Performance Report
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto text-center">
        <button className="employee-btn-danger " onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default EmpSidebar;