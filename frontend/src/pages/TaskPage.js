import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeTasks.css";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const employeeId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/assigned/${employeeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setTasks(data);
        } else {
          setError(data.message || "Failed to fetch tasks.");
        }
      } catch (error) {
        setError("Error fetching tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  // Get CSS class for status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase() || "default") {
      case "completed":
        return "status-completed";
      case "in progress":
        return "status-in-progress";
      case "pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  // Get CSS class for priority
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase() || "default") {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-default";
    }
  };

  return (
    <div className="employee-tasks-container">
      <div className="emp-tasks-header">
        <h2 className="section-title">
          <span className="header-icon">📋</span> My Assigned Tasks
        </h2>
      </div>

      {error && (
        <div className="error-banner">
          <i className="error-icon">⚠️</i>
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your tasks...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task, index) => (
            <div key={task.id || `task-${index}`} className="task-card">
              <div className="task-header">
                <h3 className="task-title">
                  {task.title || "Untitled Task"}
                </h3>
                <div className="task-badges">
                  <span className={`status-badge ${getStatusColor(task.status)}`}>
                    {task.status || "Status"}
                  </span>
                  <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                    {task.priority || "Priority"}
                  </span>
                </div>
              </div>

              <div className="task-body">
                <p className="task-description">
                  {task.description || "No description provided."}
                </p>

                <div className="task-footer">
                  <div className="task-meta">
                    {task.dueDate && (
                      <div className="due-date">
                        <i className="date-icon">📅</i>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {task.assignedBy && (
                      <div className="assigned-by">
                        <i className="user-icon">👤</i>
                        <span>From: {task.assignedBy}</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="upload-document-btn"
                    onClick={() =>
                      navigate("/upload-document", {
                        state: { taskId: task.id, taskTitle: task.title },
                      })
                    }
                  >
                    <i className="upload-icon">📤</i> Upload Document
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Tasks Assigned</h3>
          <p>You currently don't have any assigned tasks.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
