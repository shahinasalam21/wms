import React from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { 
  FaHome, FaClipboardList, FaUsers, FaChartBar, 
  FaPlus, FaSignOutAlt, FaCalendarAlt 
} from "react-icons/fa";
import "../pages/Dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { managerId } = useParams(); // Get managerId from URL

  const linkBase = `/manager/${managerId}`; // Base path for all routes

  const handleSignOut = () => {
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2 className="text-center">DASHBOARD</h2>
      <nav>
        <ul className="list-unstyled">
        <li>
  <NavLink to={`${linkBase}/home`} className={({ isActive }) => isActive ? "active-link" : ""}>
    <FaHome /> Home
  </NavLink>
</li>

          <li>
            <NavLink to={`${linkBase}/profile`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaHome /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink to={`${linkBase}/workflows`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaClipboardList /> Workflows
            </NavLink>
          </li>
          <li>
            <NavLink to={`${linkBase}/tasks`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaClipboardList /> Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to={`${linkBase}/employees`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaUsers /> Employees
            </NavLink>
          </li>
          <li>
            <NavLink to={`${linkBase}/reports`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaChartBar /> Reports
            </NavLink>
          </li>
          <li>
            <NavLink to={`${linkBase}/schedule-meeting`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaCalendarAlt /> Schedule Meeting
            </NavLink>
          </li>
          <li>
            <NavLink to={`${linkBase}/manager-meetings`} className={({ isActive }) => isActive ? "active-link" : ""}>
              <FaCalendarAlt /> My Meetings
            </NavLink>
          </li>
          <li>
            <button className="create-button" onClick={() => navigate(`${linkBase}/create-workflow`)}>
              <FaPlus /> Create Workflow
            </button>
          </li>
          <li>
            <button className="signout-btn" onClick={handleSignOut}>
              <FaSignOutAlt /> Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
