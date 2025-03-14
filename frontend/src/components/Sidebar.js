import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaClipboardList, FaUsers, FaChartBar, FaPlus, FaSignOutAlt } from "react-icons/fa";
import "./Dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="text-center">DASHBOARD</h2>
      <nav>
        <li><Link to="/home"><FaHome /> Home</Link></li>
        <li><Link to="/workflows"><FaClipboardList /> Workflows</Link></li>
        <li><Link to="/tasks"><FaClipboardList /> Tasks</Link></li>
        <li><Link to="/employees"><FaUsers /> Employees</Link></li>
        <li><Link to="/reports"><FaChartBar /> Reports</Link></li>

        <li>
          <button className="btn btn-success w-100" onClick={() => navigate("/create-workflow")}>
            <FaPlus /> Create Workflow
          </button>
        </li>

        <li>
          <button className="btn btn-danger w-100" onClick={() => navigate("/login")}>
            <FaSignOutAlt /> Sign Out
          </button>
        </li>
      </nav>
    </div>
  );
};

export default Sidebar;
