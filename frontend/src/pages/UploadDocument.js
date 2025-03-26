import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "../components/UploadDocument.css";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    fetchUploadedFiles();
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/uploaded-files");
      if (!response.ok) throw new Error("Failed to fetch files");
      const files = await response.json();
      setUploadedFiles(files);
    } catch (error) {
      setMessage("⚠️ Failed to fetch files.");
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    if (preview) URL.revokeObjectURL(preview);

    setPreview(
      selectedFile.type.startsWith("image/")
        ? URL.createObjectURL(selectedFile)
        : selectedFile.type === "application/pdf"
        ? "/pdf-icon.png"
        : "/file-icon.png"
    );
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed.");

      setMessage("✅ File uploaded successfully!");
      setFile(null);
      setPreview(null);
      fetchUploadedFiles();
    } catch (error) {
      setMessage("❌ File upload failed.");
    }
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/delete-file/${filename}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete file");

      setMessage("✅ File deleted successfully!");
      fetchUploadedFiles();
    } catch (error) {
      setMessage("❌ Failed to delete file.");
    }
  };

 
  const filteredFiles = uploadedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="upload-page">
    
      <header className="upload-header">
        <h2>📄 DOCUMENTS</h2>
      </header>

      <div className="content-container">
       
        <div className="upload-container">
          <h2>Upload Files</h2>
          <div className="drop-zone" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>📂 Drag & Drop or Click to Browse</p>
          </div>

          {file && (
            <div className="file-preview-container">
              <h4>Selected File:</h4>
              {file.type.startsWith("image/") ? (
                <img src={preview} alt="Selected File" className="file-preview" />
              ) : (
                <div className="file-info">
                  <img src={preview} alt="File Icon" className="file-icon" />
                  <p>{file.name}</p>
                </div>
              )}
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
                  <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" className="view-button">View</a>
                  <button className="delete-button" onClick={() => handleDelete(file.name)}>Delete</button>
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
