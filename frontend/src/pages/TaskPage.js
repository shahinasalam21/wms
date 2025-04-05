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
      <h1 className="section-title">🧾 My Assigned Tasks</h1>

      {error && <p className="error-message">{error}</p>}

      {tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-details">
                <div className="task-title-box">
                  <strong>Title:</strong>
                  <p>{task.title}</p>
                </div>

                <div className="task-desc-box">
                  <strong>Description:</strong>
                  <p>{task.description}</p>
                </div>

                <div className="task-meta">
                  <div className="meta-block">
                    <strong>Status:</strong>
                    <span>{task.status}</span>
                  </div>
                  <div className="meta-block">
                    <strong>Priority:</strong>
                    <span>{task.priority}</span>
                  </div>
                  <button className="upload-btn" onClick={() => navigate(`/upload-document`)}>📤 Upload Document</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-tasks">No assigned tasks at the moment.</p>
      )}
    </div>
  );
};

export default EmployeeTasks;
