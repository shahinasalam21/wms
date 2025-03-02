import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaClock, FaSearch, FaCog, FaUsers, FaProjectDiagram, FaFlag, FaPlus, FaSignOutAlt, FaTrash } from "react-icons/fa";
import "./Dashboard.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  return (
    <div className="sidebar p-3 d-flex flex-column align-items-center">
      <h2 className="mb-4 text-center">MINIPROJECT</h2>
      <nav className="w-100">
        <ul className="list-unstyled w-100">
          <li className="mb-3 text-center"><Link to="/home"><FaHome /> Home</Link></li>
          <li className="mb-3 text-center"><Link to="/timeline"><FaClock /> Timeline</Link></li>
          <li className="mb-3 text-center"><Link to="/search"><FaSearch /> Search</Link></li>
          <li className="mb-3 text-center"><Link to="/settings"><FaCog /> Settings</Link></li>
          <li className="mb-3 text-center"><Link to="/users"><FaUsers /> Users</Link></li>
          <li className="mb-3 text-center"><Link to="/teams"><FaUsers /> Teams</Link></li>
          <li className="mb-3 text-center"><Link to="/project"><FaProjectDiagram /> Project</Link></li>
          <li className="mb-3 text-center"><Link to="/priority"><FaFlag /> Priority</Link></li>
          <li className="mt-4 d-flex justify-content-center">
            <Link to="/create-task" className="btn btn-success w-75 text-center">
              <FaPlus /> Create Task
            </Link>
          </li>
          <li className="mt-3 d-flex justify-content-center">
            <button className="btn btn-danger w-75 text-center" onClick={handleLogout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const Header = () => (
  <header className="header d-flex justify-content-between align-items-center p-3">
    <input type="text" placeholder="Search..." className="form-control w-25" />
  </header>
);

const Dashboard = ({ tasks = [], deleteTask }) => (
  <div className="container-fluid d-flex">
    <Sidebar />
    
    <div className="main-content flex-grow-1 p-4">
      <Header />
      
      <h1 className="mb-4">Product Design Development</h1>
      <div className="task-board d-flex justify-content-between">
        <div className="task-column p-3 border rounded">
          <h3>To Do</h3>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index} className="task-item p-2 border mt-2 d-flex justify-content-between align-items-center">
                <div>
                  <strong>{task.name}</strong>
                  <p>{task.description}</p>
                  <small>Deadline: {task.deadline}</small>
                </div>
                <button className="btn btn-danger" onClick={() => deleteTask(index)}>
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p>No tasks available</p>
          )}
        </div>
        <div className="task-column p-3 border rounded">Work in Progress</div>
        <div className="task-column p-3 border rounded">Under Review</div>
        <div className="task-column p-3 border rounded">Completed</div>
      </div>
    </div>
  </div>
);

export default Dashboard;
