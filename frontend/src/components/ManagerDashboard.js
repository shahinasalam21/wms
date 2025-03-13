import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateWorkflow from "./CreateWorkflow";
import { FaCheckCircle } from "react-icons/fa";

const ManagerDashboard = () => {
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [workflows, setWorkflows] = useState([
    { id: 1, name: "Website Redesign", progress: 60 },
    { id: 2, name: "Mobile App Development", progress: 30 },
  ]);
  const [pendingTasks] = useState([
    { id: 1, task: "UI Design Review", employee: "John Doe" },
    { id: 2, task: "API Testing", employee: "Jane Smith" },
  ]);

  const navigate = useNavigate();

  const handleCreateWorkflow = (workflow) => {
    setWorkflows((prev) => [...prev, workflow]);
    setShowCreateWorkflow(false);
    navigate("/dashboard");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="main-content flex-grow-1 p-4">
        <h2>Manager Dashboard</h2>

        {showCreateWorkflow ? (
          <CreateWorkflow onCreate={handleCreateWorkflow} />
        ) : (
          <>
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
