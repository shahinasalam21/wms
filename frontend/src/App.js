import React, { useState } from "react"; 
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel} from "react-bootstrap";
import "./App.css";
import logo from './workflow-logo.svg';

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import DashboardLayout from "./components/DashboardLayout";
import EmpDashboardLayout from "./components/EmpDashboardLayout";

import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import CreateWorkflow from "./pages/CreateWorkflow";
import Workflows from "./components/Workflows";

import ScheduleMeeting from "./pages/ScheduleMeeting"; 
import EmployeeMeetings from "./pages/EmployeeMeetings";
import ManagerMeetings from "./pages/ManagerMeetings";

import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";

import Profile from "./pages/ManagerProfile"; 

import Employees from "./pages/Employees";
import TaskPage from "./pages/TaskPage";
import Notifications from "./pages/Notifications";
import Performance from "./pages/Performance";

import UploadDocument from "./pages/UploadDocument";

import Employeeprofile from "./pages/Employeeprofile";
import ViewDocuments from './pages/ViewDocuments';

const App = () => {
  const [workflows, setWorkflows] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      <Route element={<DashboardLayout />}>
        <Route path="/manager-dashboard/:managerId" element={<ManagerDashboard />} />

        <Route path="/manager/:managerId/create-workflow" element={<CreateWorkflow setWorkflows={setWorkflows} />} />
        <Route path="/manager/:managerId/workflows" element={<Workflows workflows={workflows} />} />
        <Route path="/manager/:managerId/reports" element={<Reports />} />
        <Route path="/manager/:managerId/profile" element={<Profile userId={localStorage.getItem("userId")} />} />
          
        <Route path="/manager/:managerId/tasks" element={<Tasks />} />
        <Route path="/manager/:managerId/employees" element={<Employees />} />
        <Route path="/manager/:managerId/schedule-meeting" element={<ScheduleMeeting />} />
        <Route path="/manager/:managerId/manager-meetings" element={<ManagerMeetings />} />
      </Route>

      <Route element={<EmpDashboardLayout />}>
        <Route path="/employee-dashboard/:employeeId" element={<EmployeeDashboard />} />
        <Route path="/employee/:employeeId/employee-profile" element={<Employeeprofile />} />
        <Route path="/employee/:employeeId/employee-tasks" element={<TaskPage />} />
        <Route path="/employee/:employeeId/performance" element={<Performance />} />
        <Route path="/employee/:employeeId/notifications" element={<Notifications />} />
        <Route path="/employee/:employeeId/upload-document" element={<UploadDocument />} />
        <Route path="/employee/:employeeId/employee-meetings" element={
          <EmployeeMeetings employeeId={localStorage.getItem("userId")} />
        } />
        <Route path="/view-documents/:taskId" element={<ViewDocuments />} />
      </Route>

    </Routes>
  );
};

// Enhanced Home Component
const Home = () => {
  return (
    <div className="home-container animate-fade">
      <div className="home-content">
        <div className="logo-container">
          <img
            className="logo"
            src={logo}
            alt="Workflow Management System Logo"
          />
          <span className="logo-text"></span>
        </div>
        
        <h1>Transform Your Team's Productivity!</h1>
        <p className="description">
          Streamline workflows, track progress, and collaborate seamlessly with your team using our 
          intuitive management system designed for the modern workplace.
        </p>
        
        <Carousel className="carousel-container" indicators={true} pause="hover">
          <Carousel.Item>
            <img className="d-block w-100" src="https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&h=500" alt="Team Collaboration" />
            
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&h=500" alt="Task Tracking" />
            
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&h=500" alt="Performance Analytics" />
            
          </Carousel.Item>
        </Carousel>
        
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-title">Task Management</h3>
            <p className="feature-description">Create, assign and track tasks with ease.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">Workflow Automation</h3>
            <p className="feature-description">Automate repetitive processes and save time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Performance Tracking</h3>
            <p className="feature-description">Monitor team performance with detailed analytics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3 className="feature-title">Meeting Scheduler</h3>
            <p className="feature-description">Schedule and manage meetings efficiently.</p>
          </div>
        </div>
        
        <div className="button-group">
          <a href="/login" className="btn btn-primary">Get Started</a>
          <a href="/signup" className="btn btn-outline-primary">Create Account</a>
        </div>
      </div>
    </div>
  );
};

export default App;