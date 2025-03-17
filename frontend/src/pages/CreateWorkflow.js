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
    priority: "Medium",
  });

  // Load existing workflows from localStorage
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

    setNewTask({ taskName: "", assignedTo: "", priority: "Medium" });
  };

  const removeTask = (index) => {
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      tasks: prevWorkflow.tasks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!workflow.name.trim()) {
      alert("Workflow name is required.");
      return;
    }

    const newWorkflow = {
      id: Date.now(),
      name: workflow.name,
      description: workflow.description,
      progress: 0,
      tasks: workflow.tasks,
    };

    const updatedWorkflows = [...(JSON.parse(localStorage.getItem("workflows")) || []), newWorkflow];

    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));

    if (setWorkflows) {
      setWorkflows(updatedWorkflows);
    }

   
    setWorkflow({ name: "", description: "", tasks: [] });

    if (onClose) {
      onClose();
    }

    navigate("/manager-dashboard");
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
          <input type="text" name="assignedTo" placeholder="Assign to Employee" value={newTask.assignedTo} onChange={handleTaskChange} />
          <select name="priority" value={newTask.priority} onChange={handleTaskChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
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