import React, { useState } from "react"; 
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import "./App.css";

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import DashboardLayout from "./components/DashboardLayout";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import CreateWorkflow from "./pages/CreateWorkflow";
import Workflows from "./components/Workflows";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile"; // Make sure Profile page is imported
import EditProfile from "./pages/EditProfile"; // EditProfile page import
import Tasks from "./pages/Tasks";
import Employees from "./pages/Employees";
import TaskPage from "./pages/TaskPage";
import Notifications from "./pages/Notifications";
import Performance from "./pages/Performance";
import EmpDashboardLayout from "./components/EmpDashboardLayout";
import UploadDocument from "./pages/UploadDocument";
import ScheduleMeeting from "./pages/ScheduleMeeting"; 
import EmployeeMeetings from "./pages/EmployeeMeetings";
import ManagerMeetings from "./pages/ManagerMeetings";
import Employeeprofile from "./pages/Employeeprofile";
import EditEmployeePage from "./pages/EditEmployeePage";


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
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route path="/create-workflow" element={<CreateWorkflow setWorkflows={setWorkflows} />} />
        <Route path="/workflows" element={<Workflows workflows={workflows} />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />  {/* Profile Page */}
        <Route path="/edit-profile" element={<EditProfile />} />  {/* Edit Profile Page */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
        <Route path="/manager-meetings" element={<ManagerMeetings />} />
      </Route>

      <Route element={<EmpDashboardLayout />}>
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee-profile" element={<Employeeprofile/>}/>
        <Route path="/update-employee-profile" element={<EditEmployeePage/>}/>
        <Route path="/employee-tasks" element={<TaskPage />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/upload-document" element={<UploadDocument />} />
        <Route
          path="/employee-meetings"
          element={<EmployeeMeetings employeeId={localStorage.getItem("employeeId")} />}
        />
      </Route>
    </Routes>
  );
};

// Home Component x
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
          <a href="/signup" className="btn btn-primary">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default App;
