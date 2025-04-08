import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ManagerViewDocuments.css"; // For custom styles

const ManagerViewDocuments = () => {
  const location = useLocation();
  const { taskId: urlTaskId } = useParams();
  const taskId = location.state?.taskId || urlTaskId;
  const taskTitle = location.state?.taskTitle || "Untitled Task";

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchDocuments = useCallback(async () => {
    if (!taskId) {
      setMessage("❌ No task ID provided.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/upload/uploaded-files/${taskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching documents.");
      const data = await response.json();
      if (data.length === 0) {
        setFiles([]);
        setMessage("ℹ️ No documents uploaded for this task yet.");
      } else {
        setFiles(data);
        setMessage("");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setMessage("❌ Failed to load documents.");
    }
  }, [token, taskId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/upload/download/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to download.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Download error:", err);
      alert("Failed to download file.");
    }
  };

  const handleStatusUpdate = async (fileId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/upload/update-status/${fileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status.");
      fetchDocuments(); // Refresh
    } catch (err) {
      console.error("❌ Status update error:", err);
      alert("Failed to update document status.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="card-body">
          <h3 className="mb-4 fw-bold">
            📁 Documents for Task:{" "}
            <span className="text-primary text-capitalize">{taskTitle}</span>
          </h3>

          {message && (
            <div className="alert alert-info text-center fw-semibold">
              {message}
            </div>
          )}

          <div className="row gx-4 gy-4">
            {files.map((file) => (
              <div key={file.id} className="col-xl-4 col-lg-6 col-md-6">
                <div
                  className="card h-100 shadow-sm rounded-4 p-3"
                  style={{ minHeight: "260px", minWidth: "240px" }}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="bi bi-person-circle fs-5"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6
                          className="mb-1 text-truncate fw-semibold"
                          title={file.name}
                        >
                          📄 {file.name}
                        </h6>
                        <small className="text-muted">
                          Uploaded by:{" "}
                          <span className="fw-medium">
                            {file.uploaded_by || "Unknown"}
                          </span>
                        </small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span
                        className={`badge bg-${
                          file.status === "Approved"
                            ? "success"
                            : file.status === "Rejected"
                            ? "danger"
                            : "warning"
                        } text-dark px-3 py-1`}
                      >
                        {file.status || "Pending"}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between gap-2 mb-2">
                      <button
                        className="btn btn-outline-success btn-sm flex-fill rounded-pill"
                        onClick={() => handleStatusUpdate(file.id, "Approved")}
                        disabled={file.status === "Approved"}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill rounded-pill"
                        onClick={() => handleStatusUpdate(file.id, "Rejected")}
                        disabled={file.status === "Rejected"}
                      >
                        ❌ Reject
                      </button>
                    </div>

                    <button
                      className="btn btn-outline-primary mt-auto rounded-pill fw-semibold"
                      onClick={() => handleDownload(file.id, file.name)}
                    >
                      ⬇️ View / Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerViewDocuments;
