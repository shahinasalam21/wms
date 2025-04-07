import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";

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
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("📡 Fetching documents for taskId:", taskId);
      const response = await fetch(
        `http://localhost:5000/api/upload/uploaded-files/${taskId}`,
        { headers }
      );

      if (!response.ok) throw new Error("Error fetching documents.");

      const data = await response.json();
      console.log("✅ Fetched files:", data);

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
      const response = await fetch(`http://localhost:5000/api/upload/download/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  return (
    <div className="view-documents-page" style={{ padding: "2rem" }}>
      <div className="container">
        <h2>📄 Documents for Task: <strong>{taskTitle}</strong></h2>

        {message && <p style={{ marginTop: "1rem", color: "gray" }}>{message}</p>}

        {files.length > 0 && (
          <ul style={{ marginTop: "1rem", paddingLeft: "1rem" }}>
            {files.map((file) => (
              <li key={file.id} style={{ marginBottom: "10px" }}>
                <span>{file.name}</span>
                <button
                  onClick={() => handleDownload(file.id, file.name)}
                  style={{
                    marginLeft: "15px",
                    color: "#007bff",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  View / Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerViewDocuments;
