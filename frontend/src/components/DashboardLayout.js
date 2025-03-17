import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="container-fluid d-flex" style={{ minHeight: "100vh" }}>
      {/* Static Sidebar */}
      <Sidebar />
      
      {/* Changing Content */}
      <div className="main-content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;