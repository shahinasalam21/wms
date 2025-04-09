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
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchDocuments = useCallback(async () => {
    if (!taskId) {
      setMessage("No task ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
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
        setMessage("No documents have been uploaded for this task yet");
      } else {
        setFiles(data);
        setMessage("");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Failed to load documents");
    } finally {
      setLoading(false);
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
      console.error("Download error:", err);
      toast.error("Failed to download file");
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
      toast.success("Document approved successfully");
      fetchDocuments();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve file");
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
      toast.info("Document rejected");
      fetchDocuments();
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Failed to reject file");
    }
  };

  const handleApproveTask = async () => {
    const allApproved = files.length > 0 && files.every((f) => f.status === "Approved");
    if (!allApproved) {
      toast.warn("All documents must be approved to approve the task");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve`, {
        method: "PUT", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to approve task.");
      const data = await response.json();
      toast.success(data.message || "Task approved successfully!");
      fetchDocuments();
    } catch (err) {
      console.error("Task approve error:", err);
      toast.error("Error approving task");
    }
  };

  const handleRejectTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/reject`, {
        method: "PUT", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to reject task.");
      const data = await response.json();
      toast.success(data.message || "Task rejected successfully");
      fetchDocuments();
    } catch (err) {
      console.error("Task reject error:", err);
      toast.error("Error rejecting task");
    }
  };
  
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return "bi-file-earmark-pdf";
      case 'doc':
      case 'docx':
        return "bi-file-earmark-word";
      case 'xls':
      case 'xlsx':
        return "bi-file-earmark-excel";
      case 'ppt':
      case 'pptx':
        return "bi-file-earmark-ppt";
      case 'jpg':
      case 'jpeg':
      case 'png':
        return "bi-file-earmark-image";
      default:
        return "bi-file-earmark";
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Approved':
        return "success";
      case 'Rejected':
        return "danger";
      case 'Resubmitted':
        return "info";
      default:
        return "warning";
    }
  };

  // Get border color based on file status
  const getBorderColor = (status) => {
    switch(status) {
      case 'Approved':
        return "#28a745";  // Success green
      case 'Rejected':
        return "#dc3545";  // Danger red
      case 'Resubmitted':
        return "#17a2b8";  // Info blue
      default:
        return "#ffc107";  // Warning yellow
    }
  };

  return (
    // Modified the class name for container to be unique
    <div className="bg-light min-vh-100 py-4 manager-documents-view">
      <div className="manager-documents-container">
        <div className="card shadow border-0 rounded-4">
          <div className="card-header bg-primary bg-gradient text-white p-3 rounded-top-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-0 fw-bold">
                  <i className="bi bi-folder me-2"></i>
                  Task Documents Review
                </h3>
                <p className="text-white-50 mb-0 mt-1 fs-5 text-capitalize">
                  {taskTitle}
                </p>
              </div>
              <div>
                <button 
                  className="btn btn-light fw-semibold" 
                  onClick={() => navigate(-1)}
                >
                  <i className="bi bi-arrow-left me-1"></i> Back
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white border-bottom">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div className="fs-5 fw-semibold text-secondary mb-2 mb-md-0">
                <i className="bi bi-file-earmark-check me-2"></i>
                Document Review {files.length > 0 ? `(${files.length} document${files.length !== 1 ? "s" : ""})` : ""}
              </div>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-success btn-sm fw-semibold" 
                  onClick={handleApproveTask}
                >
                  <i className="bi bi-check-circle me-1"></i> Approve Task
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm fw-semibold" 
                  onClick={handleRejectTask}
                >
                  <i className="bi bi-x-circle me-1"></i> Reject Task
                </button>
              </div>
            </div>
          </div>
          
          <div className="card-body p-3 manager-documents-card-body">
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading documents...</p>
              </div>
            ) : message ? (
              <div className="alert alert-info d-flex align-items-center p-3 shadow-sm">
                <i className="bi bi-info-circle fs-4 me-3"></i>
                <div>{message}</div>
              </div>
            ) : (
              <div className="row g-3">
                {files.map((file) => (
                  <div key={file.id} className="col-xl-3 col-lg-4 col-md-6">
                    <div 
                      className="card h-100 rounded-3" 
                      style={{
                        transition: "all 0.3s ease", 
                        transform: "translateY(0)", 
                        minHeight: "220px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        border: `2px solid ${getBorderColor(file.status)}`,
                        overflow: "hidden"
                      }}
                      onMouseOver={(e) => {e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)"}}
                      onMouseOut={(e) => {e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}}
                    >
                      <div className="card-header bg-light pt-3 pb-0 px-3" style={{borderBottom: "1px solid #eee"}}>
                        <div className="d-flex align-items-center">
                          <div className={`bg-${getStatusClass(file.status)} bg-opacity-10 p-2 rounded-3 me-2`}>
                            <i className={`bi ${getFileIcon(file.name)} fs-4 text-${getStatusClass(file.status)}`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="position-relative" style={{maxWidth: "100%"}}>
                              <h6 
                                className="mb-1 fw-semibold" 
                                title={file.name}
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  fontSize: "0.9rem",
                                  lineHeight: "1.2rem",
                                  maxWidth: "100%"
                                }}
                              >
                                {file.name}
                              </h6>
                            </div>
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="bg-secondary bg-opacity-10 text-secondary rounded-pill px-2 py-0 me-2 small mb-1">
                                <i className="bi bi-person-circle me-1"></i>
                                <span className="small">{file.uploaded_by || "Unknown"}</span>
                              </div>
                              <span className={`badge bg-${getStatusClass(file.status)} bg-opacity-10 text-${getStatusClass(file.status)} px-2 py-0 small mb-1`}>
                                {file.status || "Pending"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card-body p-3 manager-documents-file-card-body d-flex flex-column">
                        {file.status === "Rejected" && (
                          <div className="alert alert-danger bg-opacity-10 border-0 mb-2 py-1 px-2" style={{minHeight: "40px", maxHeight: "50px", overflow: "auto"}}>
                            <small className="fw-semibold d-block mb-1">Rejection Reason:</small>
                            <p className="mb-0 fst-italic small">"{file.rejection_message || "No reason provided"}"</p>
                          </div>
                        )}
                        {file.status !== "Rejected" && (
                          <div style={{minHeight: "40px"}}></div>
                        )}

                        <div className="d-grid gap-1 mt-auto">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleDownload(file.id, file.name)}
                          >
                            <i className="bi bi-cloud-download me-1"></i>
                            View / Download
                          </button>
                          
                          <div className="d-flex gap-1 mt-1">
                            <button
                              className={`btn btn-xs flex-grow-1 ${file.status === "Approved" ? "btn-outline-success disabled" : "btn-outline-success"}`}
                              onClick={() => handleApproveFile(file.id)}
                              disabled={file.status === "Approved"}
                              style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}
                            >
                              <i className="bi bi-check-circle me-1"></i> Approve
                            </button>
                            <button
                              className={`btn btn-xs flex-grow-1 ${file.status === "Rejected" ? "btn-outline-danger disabled" : "btn-outline-danger"}`}
                              onClick={() => handleRejectFile(file.id)}
                              disabled={file.status === "Rejected"}
                              style={{ fontSize: "0.7rem", padding: "0.2rem 0.4rem" }}
                            >
                              <i className="bi bi-x-circle me-1"></i> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-danger bg-opacity-10 border-0">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  Document Rejection
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="rejectionReason" className="form-label">
                    Rejection Reason (required)
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="form-control"
                    rows="4"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={submitRejection}
                  disabled={!rejectionReason}
                >
                  Reject Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerViewDocuments;
