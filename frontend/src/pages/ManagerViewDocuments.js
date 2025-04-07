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

      const response = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
        headers,
      });

      if (!response.ok) throw new Error("Error fetching documents.");

      const data = await response.json();
      console.log("✅ Fetched files:", data);

      if (data.length === 0) {
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

  return (
    <div className="view-documents-page">
      <div className="container">
        <h2>📄 Documents for Task: <strong>{taskTitle}</strong></h2>
        {message && <p>{message}</p>}
        {files.length > 0 && (
          <ul>
            {files.map((file) => (
              <li key={file.id} style={{ marginBottom: "10px" }}>
                <span>{file.name}</span>
                <a
                  href={`http://localhost:5000/api/download/${file.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "15px", color: "blue", textDecoration: "underline" }}
                >
                  View / Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManagerViewDocuments;
