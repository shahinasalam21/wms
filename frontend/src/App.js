import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import DashboardLayout from "./components/DashboardLayout";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CreateWorkflow from "./components/CreateWorkflow";
import Workflows from "./components/Workflows";

const App = () => {
  const [workflows, setWorkflows] = useState([]);

  return (
    <Router>
      <Routes>
        {/* ✅ Pages without Layout (No Sidebar) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Dashboard Pages with Static Sidebar */}
        <Route element={<DashboardLayout />}>
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/create-workflow" element={<CreateWorkflow setWorkflows={setWorkflows} />} />
          <Route path="/workflows" element={<Workflows workflows={workflows} />} />
        </Route>
      </Routes>
    </Router>
  );
};

/* ✅ Home Component (Kept Inside App.js) */
const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Workflow Management System</h1>
        <p className="description">
          Manage tasks efficiently, track progress, and collaborate seamlessly with your team.
        </p>
        <Carousel className="carousel-container">
          <Carousel.Item>
            <img className="d-block w-100" src="https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&h=500" alt="Teamwork" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=500" alt="Office Collaboration" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&h=500" alt="Business Meeting" />
          </Carousel.Item>
        </Carousel>
        <div className="button-group">
          <a href="/login" className="btn btn-primary">Login</a>
          <a href="/signup" className="btn btn-success">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default App;
