import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

// ✅ Multer in-memory storage for DB upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword", "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type."));
    }
    cb(null, true);
  }
});

// ✅ Upload document to DB
router.post("/upload/:taskId", verifyJWT, upload.single("document"), async (req, res) => {
  const { taskId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (!taskId) {
    return res.status(400).json({ error: "Missing task ID." });
  }

  const { originalname, mimetype, buffer } = req.file;

  try {
    console.log("📥 Uploading file for taskId:", taskId, "by user:", req.user.id);

    const result = await pool.query(
      `INSERT INTO documents (filename, mimetype, data, task_id, uploaded_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [originalname, mimetype, buffer, taskId, req.user.id]
    );

    res.status(201).json({
      message: "✅ File uploaded successfully!",
      id: result.rows[0].id,
      name: originalname
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

// ✅ Get all documents for a task
router.get("/uploaded-files/:taskId", verifyJWT, async (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ error: "Missing task ID." });
  }

  try {
    const result = await pool.query(
      `SELECT id, filename, uploaded_at
       FROM documents
       WHERE task_id = $1
       ORDER BY uploaded_at DESC`,
      [taskId]
    );

    const files = result.rows.map(doc => ({
      id: doc.id,
      name: doc.filename,
      uploaded_at: doc.uploaded_at
    }));

    res.json(files);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch uploaded files." });
  }
});

// ✅ Secure file download
router.get("/download/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT filename, mimetype, data
       FROM documents
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found." });
    }

    const file = result.rows[0];

    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.filename)}"`);

    res.send(file.data);
  } catch (err) {
    console.error("❌ Download error:", err);
    res.status(500).json({ error: "Failed to retrieve file." });
  }
});

// ✅ Secure file deletion
router.delete("/delete-file/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM documents
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "File not found." });
    }

    res.json({ message: "🗑️ File deleted successfully." });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

export default router;
