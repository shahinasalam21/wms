import React, { useState, useEffect } from "react";
import './Workflows.css';

const Workflows = () => {
    const [workflows, setWorkflows] = useState([]);

    useEffect(() => {
        const fetchWorkflows = () => {
            const savedWorkflows = JSON.parse(localStorage.getItem("workflows")) || [];
            setWorkflows(savedWorkflows);
        };

       
        fetchWorkflows();

        
        window.addEventListener("storage", fetchWorkflows);

        return () => {
            window.removeEventListener("storage", fetchWorkflows);
        };
    }, []);

    return (
        <div className="workflows-container">
            <h2>Workflows</h2>
            <div className="workflow-list">
                {workflows.length > 0 ? (
                    workflows.map((workflow, index) => (
                        <div key={index} className="workflow-item">
                            <h3>{workflow.name}</h3>
                            <p>{workflow.description || "No description available."}</p>
                            {workflow.tasks && workflow.tasks.length > 0 ? (
                                <>
                                    <h4>Tasks:</h4>
                                    <ul>
                                        {workflow.tasks.map((task, idx) => (
                                            <li key={idx}>
                                                {task.taskName} - {task.assignee} ({task.priority})
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p>No tasks added.</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-workflows">No workflows available.</p>
                )}
            </div>
        </div>
    );
};

export default Workflows;