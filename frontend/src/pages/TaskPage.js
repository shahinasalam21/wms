import React, { useState, useEffect } from 'react';
import '../pages/TaskPage.css'; // Style your page as needed

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the tasks assigned to the employee
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/assigned", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`, // JWT token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data); // Here we expect the response to be an array
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <h2>My Assigned Tasks</h2>
      <ul className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks assigned yet.</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Due Date:</strong> {task.due_date}</p>
              <p><strong>Status:</strong> {task.status || 'Not Started'}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskPage;
