import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateWorkflow.css";

const CreateWorkflow = ({ setWorkflows, onClose }) => {
  const navigate = useNavigate();
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

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(newTask.assignedTo)) {
      alert("Please enter a valid email address.");
      return;
    }

    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      tasks: [...prevWorkflow.tasks, newTask],
    }));

    setNewTask({ taskName: "", assignedTo: "", priority: "medium", description: "", duedate: "" });
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

    // Get the manager ID from local storage
    const managerId = localStorage.getItem("userId");

    if (!managerId) {
        alert("Manager ID not found. Please log in again.");
        navigate("/login"); 
        return;
    }

    try {
        // Create workflow
        const response = await fetch("http://localhost:5000/api/workflows/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: workflow.name,
                description: workflow.description,
                manager_id: managerId,  // Use dynamic manager ID
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create workflow");
        }

        const workflowData = await response.json();
        const workflowId = workflowData.workflowId; 

        // Create tasks
        for (const task of workflow.tasks) {
            await fetch("http://localhost:5000/api/tasks/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

        // Fetch updated workflows
        const fetchUpdatedWorkflows = await fetch("http://localhost:5000/api/workflows");
        const updatedData = await fetchUpdatedWorkflows.json();

        setWorkflows(updatedData.workflows);
        alert("Workflow created successfully!");
        navigate("/manager-dashboard");
    } catch (error) {
        console.error("Error creating workflow:", error);
        alert("Error creating workflow");
    }
};

  return (
    <div className="create-workflow-container">
      <h2>Create Workflow</h2>
      <form className="create-workflow-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Workflow Name</label>
          <input type="text" name="name" value={workflow.name} onChange={handleWorkflowChange} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={workflow.description} onChange={handleWorkflowChange} required></textarea>
        </div>

        <h3>Add Tasks</h3>
        <div className="task-form">
          <input type="text" name="taskName" placeholder="Task Name" value={newTask.taskName} onChange={handleTaskChange} />
          <input type="email" name="assignedTo" placeholder="Assign to Employee" value={newTask.assignedTo} onChange={handleTaskChange} />
          <select name="priority" value={newTask.priority} onChange={handleTaskChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="text" name="description" placeholder="Task Description" value={newTask.description} onChange={handleTaskChange} />
          <input type="date" name="duedate" value={newTask.duedate} onChange={handleTaskChange} />
          <button type="button" className="btn-add" onClick={addTask}>Add Task</button>
        </div>

        {workflow.tasks.length > 0 && (
          <div className="task-list">
            <h4>Tasks Added:</h4>
            <ul>
              {workflow.tasks.map((task, index) => (
                <li key={index} className="task-item">
                  <span>{task.taskName} - {task.assignedTo} ({task.priority})</span>
                  <button type="button" className="btn-remove" onClick={() => removeTask(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="btn-create">Create Workflow</button>
      </form>
    </div>
  );
};

export default CreateWorkflow;
