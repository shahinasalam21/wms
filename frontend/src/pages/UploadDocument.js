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

  useEffect(() => {
    if (taskId) fetchUploadedFiles(taskId);
    return () => preview && URL.revokeObjectURL(preview);
  }, [taskId, preview]);

  const fetchUploadedFiles = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/uploaded-files/${taskId}`);
      if (!response.ok) throw new Error("Failed to fetch files");
      const files = await response.json();
      setUploadedFiles(files);
    } catch {
      setMessage("⚠️ Failed to fetch files.");
    }
  };

  const onDrop = (acceptedFiles) => {
    const selected = acceptedFiles[0];
    setFile(selected);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(selected.type.startsWith("image/") ? URL.createObjectURL(selected) : "/file-icon.png");
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file || !taskId) return setMessage("⚠️ Please select a file and valid task.");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(`http://localhost:5000/api/upload/${taskId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setMessage("✅ File uploaded successfully!");
      setFile(null);
      setPreview(null);
      fetchUploadedFiles(taskId);
    } catch {
      setMessage("❌ File upload failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-file/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      setMessage("✅ File deleted successfully!");
      fetchUploadedFiles(taskId);
    } catch {
      setMessage("❌ Failed to delete file.");
    }
  };

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="upload-page">
      <div className="content-container">
        <div className="upload-container">
          <h2>Upload Document for: <strong>{taskTitle}</strong></h2>
          <div className="drop-zone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>📂 Drag & Drop or Click to Browse</p>
          </div>

          {file && (
            <div className="file-preview-container">
              <h4>Selected File:</h4>
              <img src={preview} alt="Preview" className="file-preview" />
              <p>{file.name}</p>
              <button className="cancel-button" onClick={() => setFile(null)}>Cancel</button>
            </div>
          )}

          <button className="upload-button" onClick={handleUpload} disabled={!file}>Upload</button>

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
                <div className="file-actions">
                  <a href={`http://localhost:5000/api/download/${file.id}`} target="_blank" rel="noopener noreferrer" className="view-button">View</a>
                  <button className="delete-button" onClick={() => handleDelete(file.id)}>Delete</button>
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
