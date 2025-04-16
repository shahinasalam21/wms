import React, { useState, useEffect } from "react";
import { FaSearch, FaProjectDiagram, FaTasks, FaUsers} from "react-icons/fa";
import { useParams } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css"; 
import "./Dashboard.css";

const Header = () => (
  <div className="manager-header p-3 bg-light">
    <div className="manager-search-container d-flex align-items-center">
      <FaSearch className="me-2" />
      <input
        type="text"
        placeholder="Search workflows, tasks, or employees..."
        className="form-control"
      />
    </div>
  </div>
);

const ManagerDashboard = () => {
  const [workflows, setWorkflows] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const { managerId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1 . Fetch workflows for this manager
        const workflowResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/workflows/manager/${managerId}`);

        if (!workflowResponse.ok) throw new Error("Failed to fetch workflows");
        const workflowData = await workflowResponse.json();
        setWorkflows(Array.isArray(workflowData) ? workflowData : []);
  
        // 2. Fetch employee count under this manager
        const employeesResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/employees/count?managerId=${managerId}`);
        if (!employeesResponse.ok) throw new Error("Failed to fetch employee count");
        const employeesData = await employeesResponse.json();
        setTotalEmployees(employeesData.count || 0);
  
        // 3. Fetch active tasks under this manager
        const tasksResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/active?managerId=${managerId}`);
        if (!tasksResponse.ok) throw new Error("Failed to fetch active tasks");
        const tasksData = await tasksResponse.json();
        setActiveTasks(tasksData.count || 0);
  
      } catch (error) {
        console.error("Dashboard Data Fetch Error:", error);
      }
    };
  
    if (managerId) {
      fetchData();
    }
  }, [managerId]);
  
  
  return (
    <div className="container-fluid">
      <Header />

      {/* Dashboard Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center p-3 shadow">
            <FaProjectDiagram size={30} className="text-primary" />
            <h5 className="mt-2">Total Workflows</h5>
            <h3>{workflows.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3 shadow">
            <FaUsers size={30} className="text-success" />
            <h5 className="mt-2">Employees</h5>
            <h3>{totalEmployees}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3 shadow">
            <FaTasks size={30} className="text-warning" />
            <h5 className="mt-2">Active Tasks</h5>
            <h3>{activeTasks}</h3>
          </div>
        </div>
      </div>

      {/* Workflows List */}
      <div className="mt-4">
        <h2>Workflows</h2>
        {workflows.length > 0 ? (
          <ul className="list-group">
            {workflows.map((workflow, index) => (
              <li key={workflow.id || index} className="list-group-item d-flex align-items-center">
                <FaProjectDiagram className="me-2 text-primary" />
                <span>{workflow.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center">No workflows available</p>
        )}
      </div>

      
    </div>
  );
};

export default ManagerDashboard;
