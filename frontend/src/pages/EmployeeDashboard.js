import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaClock } from "react-icons/fa";
import "./EmployeeDashboard.css";

const API_BASE_URL = "http://your-backend-url.com/api"; 

const EmployeeHeader = () => (
  <header className="employee-header align-items-center p-3">
    <div className="employee-search-container">
      <input
        type="text"
        placeholder="Search..."
        className="form-control employee-search-input"
      />
    </div>
  </header>
);

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateTaskStatus = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "In Progress" }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      fetchTasks(); 
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

 
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      fetchTasks(); 
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="employee-dashboard-content p-4">
      <EmployeeHeader />
      <h1 className="mb-4">Task Overview</h1>

      <div className="employee-task-board d-flex justify-content-between">
        {["To Do", "In Progress", "Completed"].map((status) => (
          <div key={status} className="employee-task-column p-3 border rounded">
            <h3>{status}</h3>
            {tasks.filter((task) => task.status === status).length > 0 ? (
              tasks.filter((task) => task.status === status).map((task) => (
                <div
                  key={task.id}
                  className="employee-task-item p-2 border mt-2 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{task.name}</strong>
                    <p>{task.description}</p>
                    <small>
                      <FaClock /> Deadline: {task.deadline}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => updateTaskStatus(task.id)}
                    >
                      <FaEdit /> Update Task
                    </button>
                    <button
                      className="employee-btn-danger"
                      onClick={() => deleteTask(task.id)}
                    >
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

      <div className="employee-deadline-overview mt-5 p-3 border rounded">
        <h2>Deadline Overview</h2>
        {tasks.length > 0 ? (
          <ul className="list-unstyled">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <span>
                  <strong>{task.name}</strong> - {task.deadline}
                </span>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => updateTaskStatus(task.id)}
                >
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
  );
};

export default EmployeeDashboard;