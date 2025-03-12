import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaHome, FaPlus, FaClipboardList, FaUsers, FaChartBar, 
  FaCheckCircle, FaSignOutAlt 
} from "react-icons/fa";
import "./Dashboard.css";
import CreateWorkflow from "./CreateWorkflow"; 

const Sidebar = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => navigate("/login");
  const handleCreateWorkflow = () => navigate("/create-workflow"); 

  return (
    <div className="sidebar p-3 d-flex flex-column align-items-center">
      <h2 className="mb-4 text-center">MANAGER</h2>
      <nav className="w-100">
        <ul className="list-unstyled w-100">
          <li className="mb-3 text-center"><Link to="/home"><FaHome /> Home</Link></li>
          <li className="mb-3 text-center"><Link to="/workflows"><FaClipboardList /> Workflows</Link></li>
          <li className="mb-3 text-center"><Link to="/tasks"><FaClipboardList /> Tasks</Link></li>
          <li className="mb-3 text-center"><Link to="/employees"><FaUsers /> Employees</Link></li>
          <li className="mb-3 text-center"><Link to="/reports"><FaChartBar /> Reports</Link></li>
          
          {/* Use handleCreateWorkflow to navigate */}
          <li className="mt-4 d-flex justify-content-center">
            <button className="btn btn-success w-75 text-center" onClick={handleCreateWorkflow}>
              <FaPlus /> Create Workflow
            </button>
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
    <h2>Manager Dashboard</h2>
    <input type="text" placeholder="Search..." className="form-control w-25" />
  </header>
);

const ManagerDashboard = () => {
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [workflows, setWorkflows] = useState([
    { id: 1, name: "Website Redesign", progress: 60 },
    { id: 2, name: "Mobile App Development", progress: 30 }
  ]);

  const [pendingTasks, setPendingTasks] = useState([
    { id: 1, task: "UI Design Review", employee: "John Doe" },
    { id: 2, task: "API Testing", employee: "Jane Smith" }
  ]);

  return (
    <div className="container-fluid d-flex">
      <Sidebar onCreateWorkflow={() => setShowCreateWorkflow(!showCreateWorkflow)} />
      <div className="main-content flex-grow-1 p-4">
        <Header />

        {showCreateWorkflow ? (
          <CreateWorkflow />
        ) : (
          <>
            {/* Workflows Section */}
            <div className="workflow-section mb-4">
              <h2>Workflows</h2>
              {workflows.length > 0 ? (
                <ul className="list-group">
                  {workflows.map((workflow) => (
                    <li key={workflow.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {workflow.name}
                      <span className="badge bg-primary">{workflow.progress}% Completed</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No workflows available</p>
              )}
            </div>

            {/* Pending Task Approvals Section */}
            <div className="pending-tasks">
              <h2>Pending Task Approvals</h2>
              {pendingTasks.length > 0 ? (
                <ul className="list-group">
                  {pendingTasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {task.task} - <strong>{task.employee}</strong>
                      <button className="btn btn-success"><FaCheckCircle /> Approve</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending tasks</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
