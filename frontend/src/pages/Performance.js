import React, { useEffect, useState } from "react";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBell,
  FaUsers,
  FaHourglassHalf,
  FaUserCircle,
} from "react-icons/fa";
import "./Performance.css";

const Performance = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const employeeId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/performance/report/${employeeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setReport(data);
        } else {
          setError(data.message || "Failed to fetch Performance.");
        }
      } catch (err) {
        setError("Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [employeeId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );

  const metrics = [
    { label: "Total Tasks", value: report.total_tasks, icon: <FaTasks className="metric-icon" /> },
    { label: "Completed Tasks", value: report.completed_tasks, class: "bg-success text-white", icon: <FaCheckCircle className="metric-icon" /> },
    { label: "Pending Tasks", value: report.pending_tasks, class: "bg-warning text-dark", icon: <FaHourglassHalf className="metric-icon" /> },
    { label: "Rejected Tasks", value: report.rejected_tasks, class: "bg-danger text-white", icon: <FaTimesCircle className="metric-icon" /> },
    { label: "Avg Completion Time (hrs)", value: report.avg_completion_time || "N/A", icon: <FaClock className="metric-icon" /> },
    { label: "Notifications Received", value: report.notifications_received, icon: <FaBell className="metric-icon" /> },
    { label: "Meetings Attended", value: report.meetings_attended, icon: <FaUsers className="metric-icon" /> },
  ];

  return (
    <div className="performance-container">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">📊 Employee Performance Report</h2>
        <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
          <h5 className="d-flex align-items-center gap-2">
            <FaUserCircle className="text-secondary fs-4" />
            :<span className="badge bg-secondary fs-6">{report.employee_name}</span>
          </h5>
          <h5>
            Role: <span className="badge bg-info text-dark fs-6">{report.department}</span>
          </h5>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {metrics.map((metric, idx) => (
          <div key={idx} className="col-lg-3 col-md-4 col-sm-6">
            <div className={`metric-card shadow-sm rounded text-center h-100 p-4 ${metric.class || ""}`}>
              {metric.icon}
              <h6 className="text-muted mt-2">{metric.label}</h6>
              <div className="fs-4 fw-bold mt-1">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
