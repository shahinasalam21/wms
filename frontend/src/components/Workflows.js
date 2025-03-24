import React, { useState, useEffect } from "react";
import './Workflows.css';

const Workflows = () => {
    const [workflows, setWorkflows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredWorkflows = workflows.filter((workflow) =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="workflows-container">
            <h2>Workflows</h2>
            <input
                type="text"
                placeholder="Search Workflows..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="workflow-search-input"
            />
            <div className="workflow-list">
                {filteredWorkflows.length > 0 ? (
                    filteredWorkflows.map((workflow, index) => (
                        <div key={index} className="workflow-item">
                            <h3>{workflow.name}</h3>
                            <p>{workflow.description || "No description available."}</p>
                            {workflow.tasks && workflow.tasks.length > 0 ? (
                                <>
                                    <h4>Tasks:</h4>
                                    <ul>
                                        {workflow.tasks.map((task, idx) => (
                                            <li key={idx}>
                                                <strong>{task.taskName}</strong> — Assigned to <em>{task.assignee}</em> ({task.priority})
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
