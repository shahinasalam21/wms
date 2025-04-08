import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "react-router-dom";
import "../components/UploadDocument.css";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { state } = useLocation();
  const taskId = state?.taskId;
  const taskTitle = state?.taskTitle;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUploadedFiles = async (taskId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch files");
        const files = await response.json();
        setUploadedFiles(files);
      } catch {
        setMessage("⚠️ Failed to fetch files.");
      }
    };

    if (taskId) fetchUploadedFiles(taskId);
    return () => preview && URL.revokeObjectURL(preview);
  }, [taskId, preview, token]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 10000);
    return () => clearTimeout(timer);
  }, [message]);

  const onDrop = (acceptedFiles) => {
    const selected = acceptedFiles[0];
    setFile(selected);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(
      selected.type.startsWith("image/")
        ? URL.createObjectURL(selected)
        : "/file-icon.png"
    );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file || !taskId) return setMessage("⚠️ Please select a file and valid task.");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(`http://localhost:5000/api/upload/upload/${taskId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setMessage("✅ File uploaded successfully!");
      setFile(null);
      setPreview(null);

      const refresh = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedFiles = await refresh.json();
      setUploadedFiles(updatedFiles);
    } catch {
      setMessage("❌ File upload failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/delete-file/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      setMessage("✅ File deleted successfully!");

      const refresh = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedFiles = await refresh.json();
      setUploadedFiles(updatedFiles);
    } catch {
      setMessage("❌ Failed to delete file.");
    }
  };

  const handleSecureDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/download/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage("❌ Download failed.");
    }
  };

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="upload-page">
      <div className="content-container">
        <div className="upload-container">
          <h2>
            Upload Document for: <strong>{taskTitle}</strong>
          </h2>
          <div className="drop-zone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>📂 Drag & Drop or Click to Browse</p>
          </div>

          {file && (
            <div className="file-preview-container">
              <h4>Selected File:</h4>
              <img src={preview} alt="Preview" className="file-preview" />
              <p>{file.name}</p>
              <button className="cancel-button" onClick={() => setFile(null)}>
                Cancel
              </button>
            </div>
          )}

          <button className="upload-button" onClick={handleUpload} disabled={!file}>
            Upload
          </button>

          {message && <p className="upload-message">{message}</p>}
        </div>

        <div className="uploaded-files-container">
          <h3>Uploaded Files</h3>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ul className="file-list">
            {filteredFiles.map((file, index) => (
              <li key={index} className="file-item">
                <span>{file.name}</span>

                {/* ✅ Show document status */}
                <span
                  className={`file-status badge ${
                    file.status === "Approved"
                      ? "bg-success"
                      : file.status === "Rejected"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {file.status || "Pending"}
                </span>

                <div className="file-actions">
                  <button
                    className="view-button"
                    onClick={() => handleSecureDownload(file.id, file.name)}
                  >
                    View
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(file.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
