import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert, Badge, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 

import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errMsg = await response.text();
          throw new Error(errMsg || "Failed to fetch tasks.");
        }

        const data = await response.json();
        setTasks(data);
        setError("");
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getPriorityBadge = (priority) => {
    const variant =
      priority?.toLowerCase() === "high"
        ? "danger"
        : priority?.toLowerCase() === "medium"
        ? "warning"
        : "info";

    return (
      <Badge bg={variant} className="priority-badge">
        {priority}
      </Badge>
    );
  };


  const handleViewDocuments = (taskId) => {
    navigate(`/view-documents/${taskId}`);
  };
  return (
    <div className="tasks-page bg-light min-vh-100">
      <Container className="py-4">
        {error && (
          <Alert variant="danger" className="shadow-sm">
            <i className="bi bi-exclamation-circle-fill me-2"></i> {error}
          </Alert>
        )}

        <Card className="border-0 shadow-sm">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Loading tasks...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table tasks-table">
                  <thead>
                    <tr>
                      <th className="bg-primary text-white">Title</th>
                      <th className="bg-primary text-white">Description</th>
                      <th className="bg-primary text-white">Priority</th>
                      <th className="bg-primary text-white">Employee Name</th>
                      <th className="bg-primary text-white">Due Date</th>
                      <th className="bg-primary text-white">Created At</th>
                      <th className="bg-primary text-white">Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <tr key={task.id} className="task-row">
                          <td className="fw-bold text-primary">{task.title}</td>
                          <td className="text-muted description-cell">
                            {task.description}
                          </td>
                          <td>{getPriorityBadge(task.priority)}</td>
                          <td>{task.assigned_to_name || "Unassigned"}</td>
                          <td>
                            {new Date(task.due_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            {new Date(task.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleViewDocuments(task.id)}
                            >
                              View Documents
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                          <p className="text-muted">No tasks available</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Tasks;
