import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateWorkflow.css";

const CreateWorkflow = () => {
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

  const handleWorkflowChange = (e) => {
    setWorkflow({ ...workflow, [e.target.name]: e.target.value });
  };

  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (newTask.taskName && newTask.assignedTo) {
      setWorkflow({
        ...workflow,
        tasks: [...workflow.tasks, newTask],
      });

      // Reset task input fields
      setNewTask({
        taskName: "",
        assignedTo: "",
        priority: "Medium",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Workflow Created:", workflow);
    navigate("/manager-dashboard"); //  Redirect after submission
  };

  return (
    <div className="create-workflow-container">
      <h2>Create Workflow</h2>
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

        {/* Task Section */}
        <h3>Add Tasks</h3>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            name="taskName"
            value={newTask.taskName}
            onChange={handleTaskChange}
          />
        </div>

        <div className="form-group">
          <label>Assign to Employee</label>
          <input
            type="text"
            name="assignedTo"
            value={newTask.assignedTo}
            onChange={handleTaskChange}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={newTask.priority} onChange={handleTaskChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="button" onClick={addTask}>Add Task</button>

        {/* Display Added Tasks */}
        {workflow.tasks.length > 0 && (
          <div className="task-list">
            <h4>Tasks:</h4>
            <ul>
              {workflow.tasks.map((task, index) => (
                <li key={index}>
                  <strong>{task.taskName}</strong> - {task.assignedTo} ({task.priority} Priority)
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit">Create Workflow</button>
      </form>
    </div>
  );
};

export default CreateWorkflow;
