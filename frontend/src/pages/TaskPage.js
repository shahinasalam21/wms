import React, { useEffect, useState } from "react";

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const employeeId = localStorage.getItem("userId"); // Get the logged-in user ID

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/assigned/${employeeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send auth token
          },
        });

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
    <div>
      <h2>Assigned Tasks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.description} <br />
              <span>Status: {task.status}</span> | <span>Priority: {task.priority}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No assigned tasks.</p>
      )}
    </div>
  );
};

export default EmployeeTasks;
