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
  const [resubmittingFileId, setResubmittingFileId] = useState(null);

  const { state } = useLocation();
  const taskId = state?.taskId;
  const taskTitle = state?.taskTitle;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const files = await res.json();
        setUploadedFiles(files);
      } catch {
        setMessage("⚠️ Failed to fetch files.");
      }
    };
    if (taskId) fetchUploadedFiles();
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
    if (!file || (!taskId && !resubmittingFileId)) {
      return setMessage("⚠️ Please select a file and valid task.");
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const url = resubmittingFileId
        ? `http://localhost:5000/api/upload/resubmit/${resubmittingFileId}`
        : `http://localhost:5000/api/upload/upload/${taskId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      setMessage(resubmittingFileId
        ? "✅ File resubmitted and replaced successfully!"
        : "✅ File uploaded successfully!");

      setFile(null);
      setPreview(null);
      setResubmittingFileId(null);

      // Refresh file list
      const refresh = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedFiles = await refresh.json();
      setUploadedFiles(updatedFiles);
    } catch {
      setMessage("❌ File upload failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/upload/delete-file/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setMessage("✅ File deleted successfully!");
      const refresh = await fetch(`http://localhost:5000/api/upload/uploaded-files/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await refresh.json();
      setUploadedFiles(updated);
    } catch {
      setMessage("❌ Failed to delete file.");
    }
  };

  const handleSecureDownload = async (fileId, fileName) => {
    try {
      const res = await fetch(`http://localhost:5000/api/upload/download/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setMessage("❌ Download failed.");
    }
  };

  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nonRejectedFiles = filteredFiles.filter(file =>
    file.status !== "Rejected" && file.status !== "Resubmitted"
  );
  const rejectedFiles = filteredFiles.filter(file =>
    file.status === "Rejected" && file.id !== resubmittingFileId
  );
  const resubmittedFiles = filteredFiles.filter(file =>
    file.status === "Resubmitted"
  );

  const rejectedFile = uploadedFiles.find(f => f.id === resubmittingFileId);

  return (
    <div className="upload-page">
      <div className="content-container">
        <div className="upload-container">
          <h2>
            {resubmittingFileId
              ? "📤 Replace Rejected File (Marked as Resubmitted)"
              : `Upload Document for: ${taskTitle}`}
          </h2>

          {resubmittingFileId && rejectedFile && (
            <div className="alert alert-info mt-2">
              You're replacing rejected file: <strong>{rejectedFile.name}</strong><br />
              This will update the file and mark it as <strong>Resubmitted</strong>.
            </div>
          )}

          <div className="drop-zone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>📂 Drag & Drop or Click to Browse</p>
          </div>

          {file && (
            <div className="file-preview-container">
              <h4>Selected File:</h4>
              <img src={preview} alt="Preview" className="file-preview" />
              <p>{file.name}</p>
              <button className="cancel-button" onClick={() => {
                setFile(null);
                setPreview(null);
                setResubmittingFileId(null);
              }}>
                Cancel
              </button>
            </div>
          )}

          <button className="upload-button" onClick={handleUpload} disabled={!file}>
            {resubmittingFileId ? "Replace & Resubmit" : "Upload"}
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
            {nonRejectedFiles.map((file) => (
              <li key={file.id} className="file-item">
                <span>{file.name}</span>
                {file.status && (
                  <span className={`file-status badge ${
                    file.status === "Approved" ? "bg-success" : "bg-warning text-dark"
                  }`}>
                    {file.status}
                  </span>
                )}
                <div className="file-actions">
                  <button onClick={() => handleSecureDownload(file.id, file.name)}>View</button>
                  <button onClick={() => handleDelete(file.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {rejectedFiles.length > 0 && (
            <div className="rejected-files-container mt-4">
              <h4 className="text-danger">❌ Rejected Files</h4>
              <ul className="file-list">
                {rejectedFiles.map((file) => (
                  <li key={file.id} className="file-item rejected-item">
                    <div className="file-header">
                      <span className="file-name">{file.name}</span>
                      <span className="file-status badge bg-danger">Rejected</span>
                    </div>
                    <div className="rejection-message">
                      <strong>Reason:</strong> {file.rejection_message}
                    </div>
                    <div className="file-actions mt-2">
                      <button onClick={() => handleSecureDownload(file.id, file.name)}>View</button>
                      <button onClick={() => handleDelete(file.id)}>Delete</button>
                      <button
                        className="resubmit-button"
                        onClick={() => setResubmittingFileId(file.id)}
                      >
                        Resubmit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {resubmittedFiles.length > 0 && (
            <div className="resubmitted-files-container mt-4">
              <h4 className="text-primary">🔁 Resubmitted (Replaced Rejected Files)</h4>
              <ul className="file-list">
                {resubmittedFiles.map((file) => (
                  <li key={file.id} className="file-item resubmitted-item">
                    <div className="file-header">
                      <span className="file-name">{file.name}</span>
                      <span className={`file-status badge ${
                        file.status === "Approved"
                          ? "bg-success"
                          : file.status === "Rejected"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}>
                        {file.status}
                      </span>
                    </div>
                    <div className="file-actions mt-2">
                      <button onClick={() => handleSecureDownload(file.id, file.name)}>View</button>
                      <button onClick={() => handleDelete(file.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
