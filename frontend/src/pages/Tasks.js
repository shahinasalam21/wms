import React, { useState, useEffect } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
    
        const response = await fetch("http://localhost:5000/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach token in headers
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.statusText}`);

        }
    
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    

    fetchTasks();
  }, []);

  return (
    <div style={{ width: "100%", padding: "120px" }}>
      <h1>Tasks</h1>
      <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "20px" }}>
      <thead>
        <tr>
        <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Title</th>
        <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Description</th>
        <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Priority</th>
        <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Assigned To</th>
        <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Due Date</th>
        <th style={{ backgroundColor: "#1E90FF", color: "white" }}>Created At</th>
        </tr>
      </thead>

        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td>{task.assigned_to}</td>
                
                <td>{new Date(task.due_date).toLocaleDateString()}</td>
                <td>{new Date(task.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No tasks available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;