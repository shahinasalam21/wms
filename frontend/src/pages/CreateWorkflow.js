import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateWorkflow.css";

const CreateWorkflow = ({ setWorkflows}) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [workflow, setWorkflow] = useState({
    name: "",
    description: "",
    tasks: [],
  });

  const [newTask, setNewTask] = useState({
    taskName: "",
    assignedTo: "",
    priority: "medium",
    description: "",
    duedate: "",
  });

  // Load employees
  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employees`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data || []); // Fix here
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);
  
  useEffect(() => {
    const savedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
    if (setWorkflows) {
      setWorkflows(savedWorkflows);
    }
  }, [setWorkflows]);

  const handleWorkflowChange = (e) => {
    setWorkflow({ ...workflow, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!newTask.taskName.trim() || !newTask.assignedTo.trim()) {
      alert("Please provide both task name and assignee.");
      return;
    }

    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      tasks: [...prevWorkflow.tasks, newTask],
    }));

    setNewTask({
      taskName: "",
      assignedTo: "",
      priority: "medium",
      description: "",
      duedate: "",
    });
  };

  const removeTask = (index) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      tasks: prevWorkflow.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!workflow.name.trim()) {
      alert("Workflow name is required.");
      return;
    }

    const managerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!managerId) {
      alert("Manager ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      // Create workflow
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/workflows/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description,
          manager_id: managerId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create workflow");

      const { workflowId } = await response.json();

      // Create tasks
      for (const task of workflow.tasks) {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: task.taskName,
            description: task.description || "",
            priority: task.priority,
            assignedTo: task.assignedTo,
            workflow_id: workflowId,
            due_date: task.duedate || null,
          }),
        });
      }

      // Refresh workflows
      const updatedRes = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/workflows/manager/${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedData = await updatedRes.json();
      setWorkflows(updatedData.workflows);

      alert("Workflow created successfully!");
      navigate(`/manager-dashboard/${managerId}`);
    } catch (error) {
      console.error("Error creating workflow:", error);
      alert("Error creating workflow");
    }
  };

  return (
    <div className="create-workflow-container">
      <h2>Create Workflow</h2>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <form className="create-workflow-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Workflow Name</label>
            <input
              type="text"
              name="name"
              value={workflow.name}
              onChange={handleWorkflowChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={workflow.description}
              onChange={handleWorkflowChange}
              required
            ></textarea>
          </div>

          <h3>Add Tasks</h3>
          <div className="task-form">
            <input
              type="text"
              name="taskName"
              placeholder="Task Name"
              value={newTask.taskName}
              onChange={handleTaskChange}
            />

            <select
              name="assignedTo"
              value={newTask.assignedTo}
              onChange={handleTaskChange}
            >
              <option value="">Assign to Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.email}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>

            <select name="priority" value={newTask.priority} onChange={handleTaskChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="text"
              name="description"
              placeholder="Task Description"
              value={newTask.description}
              onChange={handleTaskChange}
            />

            <input
              type="date"
              name="duedate"
              value={newTask.duedate}
              onChange={handleTaskChange}
            />

            <button type="button" className="btn-add" onClick={addTask}>
              Add Task
            </button>
          </div>

          {workflow.tasks.length > 0 && (
            <div className="task-list">
              <h4>Tasks Added:</h4>
              <ul>
                {workflow.tasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <span>
                      {task.taskName} - {task.assignedTo} ({task.priority})
                    </span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeTask(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="btn-create">
            Create Workflow
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateWorkflow;
