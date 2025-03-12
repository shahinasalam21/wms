import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CreateWorkflow from "./components/CreateWorkflow";
import Workflows from "./components/Workflows";
import { Carousel } from "react-bootstrap";
import "./App.css";

const App = () => {
  const [workflows, setWorkflows] = useState([]);

  return (
    <Router>
      
        {/* ✅ Navbar is conditionally rendered */}
        <NavBar />

        {/* ✅ Page Content */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/create-workflow" element={<CreateWorkflow setWorkflows={setWorkflows} />} />
            <Route path="/workflows" element={<Workflows workflows={workflows} />} />
          </Routes>
        </main>
      
    </Router>
  );
};

/* ✅ Updated NavBar Component */
const NavBar = () => {
  const location = useLocation();
  
  // ✅ Hide Navbar on Home, Login, Signup, and Manager Dashboard
  if (["/", "/login", "/signup", "/manager-dashboard"].includes(location.pathname)) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">Workflow Management</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/manager-dashboard">Manager Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/workflows">Workflows</Link></li>
        </ul>
      </div>
    </nav>
  );
};

/* ✅ Updated Home Component */
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
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-success">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default App;