import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeTasks.css";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const employeeId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
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
      }
    };

    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  return (
    <div className="employee-tasks-container">
      <h2 className="section-title">🧾 Assigned Tasks</h2>

      {error && <p className="error-message">{error}</p>}

      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span>Status: {task.status}</span>
                  <span>Priority: {task.priority}</span>
                </div>
              </div>
              <button
                className="upload-btn"
                onClick={() => navigate(`/upload-document`)}
              >
                📤 Upload
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-tasks">No assigned tasks.</p>
      )}
    </div>
  );
};

export default EmployeeTasks;
