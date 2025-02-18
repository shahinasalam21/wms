import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { Carousel } from "react-bootstrap";
import "./App.css"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
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
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
