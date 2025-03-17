import React, { useState, useEffect } from "react";
import { FaSearch, FaProjectDiagram } from "react-icons/fa";
import "./Dashboard.css";

const Header = () => (
  <div className="manager-header">
    <div className="manager-search-container">
      <FaSearch className="manager-search-icon" />
      <input type="text" placeholder="Search workflows, tasks or employees..." className="manager-search-input" />
    </div>
  </div>
);

const ManagerDashboard = () => {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
    // Filter out empty workflows (dots or empty names)
    const validWorkflows = savedWorkflows.filter(workflow => workflow.name && workflow.name.trim() !== ".");
    setWorkflows(validWorkflows);
  }, []);

  return (
    <>
      <div className="main-content">
        <Header />
        <div className="workflow-container">
          <h2>Workflows</h2>
          {workflows.length > 0 ? (
            <ul className="workflow-list">
              {workflows.map((workflow, index) => (
                <li key={workflow.id || index} className="workflow-item">
                  <FaProjectDiagram className="workflow-icon" />
                  <span className="workflow-name">{workflow.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-center">No workflows available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;