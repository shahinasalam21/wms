import React, { useState, useEffect } from "react";
import "./Workflows.css";

const Workflows = () => {
    const [workflows, setWorkflows] = useState([]);

    useEffect(() => {
        const fetchWorkflows = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/workflows"); 
                if (!response.ok) {
                    throw new Error("Failed to fetch workflows");
                }
                const data = await response.json();
                console.log("Fetched Workflows:", data); 
                setWorkflows(data);
            } catch (error) {
                console.error("Error fetching workflows:", error);
            }
        };

        fetchWorkflows();
    }, []);

    return (
        <div className="workflows-container">
            <h2>Workflows</h2>
            <div className="workflow-list">
                {workflows.length > 0 ? (
                    workflows.map((workflow) => (
                        <div key={workflow.id} className="workflow-item">
                            <h3>{workflow.name}</h3>
                            <p>{workflow.description || "No description available."}</p>
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
