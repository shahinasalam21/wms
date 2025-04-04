import React, { useEffect, useState } from "react";
import axios from "axios";

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

    if (loading) return <div className="text-center my-5"><div className="spinner-border text-primary" /></div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg rounded">
                <div className="card-header bg-primary text-white text-center">
                    <h3 className="mb-0">Employee Performance Report</h3>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5>Name: <span className="badge bg-secondary">{report.employee_name}</span></h5>
                        </div>
                        <div className="col-md-6">
                            <h5>Department: <span className="badge bg-info text-dark">{report.department}</span></h5>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Metric</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Total Tasks</td><td>{report.total_tasks}</td></tr>
                                <tr><td>Completed Tasks</td><td><span className="badge bg-success">{report.completed_tasks}</span></td></tr>
                                <tr><td>Pending Tasks</td><td><span className="badge bg-warning text-dark">{report.pending_tasks}</span></td></tr>
                                <tr><td>Rejected Tasks</td><td><span className="badge bg-danger">{report.rejected_tasks}</span></td></tr>
                                <tr><td>Avg Completion Time (hrs)</td><td>{report.avg_completion_time || "N/A"}</td></tr>
                                <tr><td>Notifications Received</td><td>{report.notifications_received}</td></tr>
                                <tr><td>Meetings Attended</td><td>{report.meetings_attended}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
