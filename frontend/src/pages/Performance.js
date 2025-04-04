import React, { useEffect, useState } from "react";

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
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );

    if (error)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="alert alert-danger text-center">{error}</div>
            </div>
        );

    return (
        <div className="container d-flex justify-content-center align-items-center my-5">
            <div className="card shadow-lg rounded p-4 w-100" style={{ maxWidth: "900px" }}>
                <div className="card-header bg-primary text-white text-center">
                    <h2 className="display-9 mb-0">Employee Performance Report</h2>
                </div>
                <div className="card-body">
                    <div className="row text-center mb-4">
                        <div className="col-md-6">
                            <h4>Name: <span className="badge bg-secondary fs-5">{report.employee_name}</span></h4>
                        </div>
                        <div className="col-md-6">
                            <h4>Department: <span className="badge bg-info text-dark fs-5">{report.department}</span></h4>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-dark text-center fs-5">
                                <tr>
                                    <th>Metric</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody className="text-center fs-5">
                                <tr><td>Total Tasks</td><td>{report.total_tasks}</td></tr>
                                <tr><td>Completed Tasks</td><td><span className="badge bg-success fs-6">{report.completed_tasks}</span></td></tr>
                                <tr><td>Pending Tasks</td><td><span className="badge bg-warning text-dark fs-6">{report.pending_tasks}</span></td></tr>
                                <tr><td>Rejected Tasks</td><td><span className="badge bg-danger fs-6">{report.rejected_tasks}</span></td></tr>
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
