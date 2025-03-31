import React from "react";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { FaHome, FaClipboardList, FaUsers, FaChartBar, FaPlus, FaSignOutAlt } from "react-icons/fa";
import "../pages/Dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
 
  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <div className="sidebar">
      <h2 className="text-center">DASHBOARD</h2>
      <nav>
        <li className={isActive("/Profile")}><Link to="/Profile"><FaHome /> Profile</Link></li>
        <li className={isActive("/workflows")}><Link to="/workflows"><FaClipboardList /> Workflows</Link></li>
        <li className={isActive("/tasks")}><Link to="/tasks"><FaClipboardList /> Tasks</Link></li>
        <li className={isActive("/employees")}><Link to="/employees"><FaUsers /> Employees</Link></li>
        <li className={isActive("/reports")}><Link to="/reports"><FaChartBar /> Reports</Link></li>
        <li className={isActive("/schedule-meeting")}><Link to="/schedule-meeting"><FaChartBar /> Schedule Meeting</Link></li>
        <li className={isActive("/manager-meetings")}><Link to="/manager-meetings"><FaChartBar /> My Meetings</Link></li>

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