import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTasks, FaBell, FaChartLine, FaSearch, FaSignOutAlt, FaTrash, FaEdit, FaClock } from "react-icons/fa";
import "./EmployeeDashboard.css";

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/login");

  return (
    <div className="employee-sidebar p-3 d-flex flex-column align-items-center">
      <h2 className="mb-4 text-center">EMPLOYEE DASHBOARD</h2>
      <nav className="w-100">
        <ul className="list-unstyled w-100">
          <li className="mb-3 text-center"><Link to="/tasks"><FaTasks /> Tasks</Link></li>
          <li className="mb-3 text-center"><Link to="/notifications"><FaBell /> Notifications</Link></li>
          <li className="mb-3 text-center"><Link to="/performance"><FaChartLine /> Performance Report</Link></li>
          <li className="mt-3 d-flex justify-content-center">
            <button className="employee-btn-danger w-75 text-center" onClick={handleLogout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const EmployeeHeader = () => (
  <header className="employee-header d-flex justify-content-between align-items-center p-3">
    <div className="employee-search-container">
      <FaSearch className="employee-search-icon" />
      <input type="text" placeholder="Search..." className="form-control employee-search-input" />
    </div>
  </header>
);

const EmployeeDashboard = ({ tasks = [], updateTaskStatus, deleteTask }) => {
  return (
    <div className="container-fluid d-flex">
      <EmployeeSidebar />
      <div className="employee-main-content flex-grow-1 p-4">
        <EmployeeHeader />
        <h1 className="mb-4">Task Overview</h1>

        {/* Task Board */}
        <div className="employee-task-board d-flex justify-content-between">
          {["To Do", "In Progress", "Completed"].map((status) => (
            <div key={status} className="employee-task-column p-3 border rounded">
              <h3>{status}</h3>
              {tasks.filter((task) => task.status === status).length > 0 ? (
                tasks.filter((task) => task.status === status).map((task) => (
                  <div key={task.id} className="employee-task-item p-2 border mt-2 d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{task.name}</strong>
                      <p>{task.description}</p>
                      <small><FaClock /> Deadline: {task.deadline}</small>
                    </div>
                    <div>
                      <button className="btn btn-primary me-2" onClick={() => updateTaskStatus(task.id)}>
                        <FaEdit /> Update Task
                      </button>
                      <button className="employee-btn-danger" onClick={() => deleteTask(task.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks available</p>
              )}
            </div>
          ))}
        </div>

        {/* Deadline Overview Section */}
        <div className="employee-deadline-overview mt-5 p-3 border rounded">
          <h2>Deadline Overview</h2>
          {tasks.length > 0 ? (
            <ul className="list-unstyled">
              {tasks.map((task) => (
                <li key={task.id} className="d-flex justify-content-between border-bottom py-2">
                  <span><strong>{task.name}</strong> - {task.deadline}</span>
                  <button className="btn btn-sm btn-warning" onClick={() => updateTaskStatus(task.id)}>
                    <FaEdit /> Update Deadline
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming deadlines.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;