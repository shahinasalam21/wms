import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaClipboardList, FaUsers, FaChartBar, FaPlus, FaSignOutAlt } from "react-icons/fa";
import "../pages/Dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="text-center">DASHBOARD</h2>
      <nav>
        <li><Link to="/Profile"><FaHome /> Profile</Link></li>
        <li><Link to="/workflows"><FaClipboardList /> Workflows</Link></li>
        <li><Link to="/tasks"><FaClipboardList /> Tasks</Link></li>
        <li><Link to="/employees"><FaUsers /> Employees</Link></li>
        <li><Link to="/reports"><FaChartBar /> Reports</Link></li>
        

        <li>
          <button className="create-button" onClick={() => navigate("/create-workflow")}>
            <FaPlus /> Create Workflow
          </button>
        </li>

        <li>
          <button className="signout-btn" onClick={() => navigate("/login")}>
            <FaSignOutAlt /> Sign Out
          </button>
        </li>
      </nav>
    </div>
  );
};

export default Sidebar;