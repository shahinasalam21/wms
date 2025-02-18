import React from "react"; 
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { FaTasks, FaChartBar, FaBell, FaFileAlt, FaComments, FaUsers, FaSignOutAlt } from "react-icons/fa";
import "./Dashboard.css";

const DashboardHome = () => (
  <div className="dashboard-overview">
    <h2>Welcome to Workflow Management</h2>
    <div className="widgets">
      <div className="widget"><FaTasks /><p>5 Pending Tasks</p></div>
      <div className="widget"><FaChartBar /><p>3 Reports Generated</p></div>
      <div className="widget"><FaBell /><p>2 New Notifications</p></div>
      <div className="widget"><FaUsers /><p>10 Active Users</p></div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from storage
    navigate("/login"); // Redirect to Login page
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Workflow Management</h2>
        <ul>
          <li><Link to="/dashboard"><FaChartBar /> Dashboard</Link></li>
          <li><Link to="/dashboard/tasks"><FaTasks /> Tasks</Link></li>
          <li><Link to="/dashboard/reports"><FaChartBar /> Reports</Link></li>
          <li><Link to="/dashboard/notifications"><FaBell /> Notifications</Link></li>
          <li><Link to="/dashboard/documents"><FaFileAlt /> Documents</Link></li>
          <li><Link to="/dashboard/communication"><FaComments /> Communication</Link></li>
          <li><Link to="/dashboard/users"><FaUsers /> Users</Link></li>
        </ul>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="tasks" element={<h2>Task Management</h2>} />
          <Route path="reports" element={<h2>Reports & Analytics</h2>} />
          <Route path="notifications" element={<h2>Notifications</h2>} />
          <Route path="documents" element={<h2>Document Management</h2>} />
          <Route path="communication" element={<h2>Communication Hub</h2>} />
          <Route path="users" element={<h2>User Management</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
