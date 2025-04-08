import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ManagerViewDocuments.css";

const ManagerViewDocuments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId: urlTaskId } = useParams();
  const taskId = location.state?.taskId || urlTaskId;
  const taskTitle = location.state?.taskTitle || "Untitled Task";

  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

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

  const handleApproveFile = async (fileId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/upload/update-status/${fileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Approved" }),
        }
      );
      if (!response.ok) throw new Error("Failed to approve.");
      fetchDocuments();
    } catch (err) {
      console.error("❌ Approve error:", err);
      alert("Failed to approve file.");
    }
  };

  const handleRejectFile = (fileId) => {
    setSelectedFileId(fileId);
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/upload/update-status/${selectedFileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "Rejected",
            rejection_message: rejectionReason,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to reject.");
      setShowRejectModal(false);
      setRejectionReason("");
      fetchDocuments();
    } catch (err) {
      console.error("❌ Reject error:", err);
      alert("Failed to reject file.");
    }
  };

  const handleApproveTask = async () => {
    const allApproved = files.length > 0 && files.every((f) => f.status === "Approved");
    if (!allApproved) {
      toast.warn("All documents must be approved to approve the task.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve`, {
        method: "PUT", // ✅ CHANGED FROM POST TO PUT
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to approve task.");
      const data = await response.json();
      toast.success(data.message || "Task approved!");
      fetchDocuments();
    } catch (err) {
      console.error("❌ Task approve error:", err);
      toast.error("Error approving task.");
    }
  };

  const handleRejectTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/reject`, {
        method: "PUT", // ✅ CHANGED FROM POST TO PUT
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to reject task.");
      const data = await response.json();
      toast.success(data.message || "Task rejected.");
      fetchDocuments();
    } catch (err) {
      console.error("❌ Task reject error:", err);
      toast.error("Error rejecting task.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="card-body">
          <h3 className="fw-bold">
            📁 Documents for Task:{" "}
            <span className="text-primary text-capitalize">{taskTitle}</span>
          </h3>

          <div className="d-flex gap-3 my-3">
            <button className="btn btn-success fw-semibold px-4 rounded-pill" onClick={handleApproveTask}>
              ✅ Approve Task
            </button>
            <button className="btn btn-danger fw-semibold px-4 rounded-pill" onClick={handleRejectTask}>
              ❌ Reject Task
            </button>
          </div>

          {message && (
            <div className="alert alert-info text-center fw-semibold">
              {message}
            </div>
          )}

          <div className="row gx-4 gy-4">
            {files.map((file) => (
              <div key={file.id} className="col-xl-4 col-lg-6 col-md-6">
                <div className="card h-100 shadow-sm rounded-4 p-3">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="avatar bg-secondary text-white rounded-circle me-3 d-flex justify-content-center align-items-center"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <i className="bi bi-person-circle fs-5"></i>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-truncate fw-semibold" title={file.name}>
                          📄 {file.name}
                        </h6>
                        <small className="text-muted">
                          Uploaded by: <span className="fw-medium">{file.uploaded_by || "Unknown"}</span>
                        </small>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span
                        className={`badge bg-${
                          file.status === "Approved"
                            ? "success"
                            : file.status === "Rejected"
                            ? "danger"
                            : file.status === "Resubmitted"
                            ? "info"
                            : "warning"
                        } text-dark px-3 py-1`}
                      >
                        {file.status || "Pending"}
                      </span>
                    </div>

                    {file.status === "Rejected" && (
                      <div className="alert alert-warning p-2 small">
                        ❌ Rejection Reason:
                        <br />
                        <strong>{file.rejection_message || "N/A"}</strong>
                      </div>
                    )}

                    <div className="d-flex justify-content-between gap-2 mb-2">
                      <button
                        className="btn btn-outline-success btn-sm flex-fill rounded-pill"
                        onClick={() => handleApproveFile(file.id)}
                        disabled={file.status === "Approved"}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm flex-fill rounded-pill"
                        onClick={() => handleRejectFile(file.id)}
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

          {showRejectModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Reason for Rejection</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowRejectModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <textarea
                      className="form-control"
                      placeholder="Enter rejection reason..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowRejectModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={submitRejection}
                      disabled={!rejectionReason.trim()}
                    >
                      Submit Rejection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerViewDocuments;
