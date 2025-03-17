import React from "react";
import { Outlet } from "react-router-dom";
import EmpSidebar from "./EmpSidebar";

const EmpDashboardLayout = () => {
  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar remains fixed */}
      <EmpSidebar />
      
      {/* Main content area */}
      <div className="employee-main-content flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default EmpDashboardLayout;