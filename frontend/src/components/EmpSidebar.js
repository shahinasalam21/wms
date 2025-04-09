import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { 
  FaHome, FaUser, FaTasks, FaChartLine, FaClipboardList, FaSignOutAlt 
} from "react-icons/fa"; // Added FaHome icon
import "../pages/EmployeeDashboard.css"; 

const EmpSidebar = () => {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const linkBase = `/employee/${employeeId}`;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="employee-sidebar d-flex flex-column p-3">
      <h2 className="mb-4 text-center">EMPLOYEE DASHBOARD</h2>
      <nav>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li className="mb-3">
            <NavLink 
              to={`${linkBase}/home`} 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <FaHome className="me-2" /> Home
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink 
              to={`${linkBase}/employee-profile`} 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <FaUser className="me-2" /> Profile
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink 
              to={`${linkBase}/employee-tasks`} 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <FaTasks className="me-2" /> Tasks
            </NavLink>
          </li>
          
          <li className="mb-3">
            <NavLink 
              to={`${linkBase}/performance`} 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <FaChartLine className="me-2" /> Performance Report
            </NavLink>
          </li>
          <li className="mb-3">
            <NavLink 
              to={`${linkBase}/employee-meetings`} 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              <FaClipboardList className="me-2" /> Meetings
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="mt-auto text-center">
        <button className="employee-btn-danger" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default EmpSidebar;
