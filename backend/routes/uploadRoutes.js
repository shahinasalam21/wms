import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
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

// 📥 Upload a document
router.post("/upload/:taskId", verifyJWT, upload.single("document"), async (req, res) => {
  const { taskId } = req.params;
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const { originalname, mimetype, buffer } = req.file;

  try {
    const taskCheck = await pool.query("SELECT status FROM tasks WHERE id = $1", [taskId]);

    if (taskCheck.rowCount === 0) return res.status(404).json({ error: "Task not found." });
    const taskStatus = taskCheck.rows[0].status;

    if (["Approved"].includes(taskStatus)) {
      return res.status(400).json({ error: `Cannot upload. Task is already ${taskStatus}.` });
    }

    const result = await pool.query(
      `INSERT INTO documents (filename, mimetype, data, task_id, uploaded_by, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING id`,
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

// 📄 Get all documents for a task
router.get("/uploaded-files/:taskId", verifyJWT, async (req, res) => {
  const { taskId } = req.params;

  try {
    const result = await pool.query(
      `SELECT d.id, d.filename, d.uploaded_at, d.status, d.rejection_message, u.name AS uploaded_by
       FROM documents d
       LEFT JOIN users u ON d.uploaded_by = u.id
       WHERE d.task_id = $1
       ORDER BY d.uploaded_at DESC`,
      [taskId]
    );

    const files = result.rows.map(doc => ({
      id: doc.id,
      name: doc.filename,
      uploaded_at: doc.uploaded_at,
      uploaded_by: doc.uploaded_by || "Unknown",
      status: doc.status || "Pending",
      rejection_message: doc.rejection_message || ""
    }));

    res.json(files);
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch uploaded files." });
  }
});

// 📥 Download a document
router.get("/download/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT filename, mimetype, data FROM documents WHERE id = $1`,
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

// ✅ Approve or Reject a document
router.put("/update-status/:fileId", verifyJWT, async (req, res) => {
  const { fileId } = req.params;
  const { status, rejection_message } = req.body;

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const result = await pool.query(
      `UPDATE documents SET status = $1, rejection_message = $2 WHERE id = $3 RETURNING *`,
      [status, status === "Rejected" ? rejection_message : null, fileId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Document not found." });
    }

    res.json({ message: `✅ Document marked as ${status}`, document: result.rows[0] });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ error: "Failed to update document status." });
  }
});

// ❌ Delete document
router.delete("/delete-file/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM documents WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "File not found." });
    }

    res.json({ message: "🗑️ File deleted successfully." });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});
router.post("/resubmit/:docId", verifyJWT, upload.single("document"), async (req, res) => {
  const { docId } = req.params;
  const file = req.file;

  console.log("📥 Incoming resubmit file:", file);
  console.log("👤 User ID from token:", req.user.id);
  console.log("📝 Document ID param:", docId);

  if (!file) {
    console.log("❌ No file received.");
    return res.status(400).json({ message: "No file uploaded." });
  }

  try {
    const docResult = await pool.query(
      `SELECT task_id FROM documents WHERE id = $1 AND uploaded_by = $2`,
      [docId, req.user.id]
    );

    if (docResult.rowCount === 0) {
      console.log("❌ Document not found or user unauthorized.");
      return res.status(404).json({ message: "Document not found or unauthorized." });
    }

    const taskId = docResult.rows[0].task_id;

    const taskResult = await pool.query("SELECT status FROM tasks WHERE id = $1", [taskId]);

    if (taskResult.rowCount === 0) {
      console.log("❌ Task not found.");
      return res.status(404).json({ message: "Task not found." });
    }

    const taskStatus = taskResult.rows[0].status;
    if (["Approved"].includes(taskStatus)) {
      console.log("🚫 Task already finalized:", taskStatus);
      return res.status(400).json({ message: `Cannot resubmit. Task is already ${taskStatus}.` });
    }

    const result = await pool.query(
      `UPDATE documents
       SET filename = $1,
           mimetype = $2,
           data = $3,
           status = 'Resubmitted',
           rejection_message = NULL
       WHERE id = $4
       RETURNING *`,
      [file.originalname, file.mimetype, file.buffer, docId]
    );

    console.log("✅ Document updated:", result.rows[0]);

    res.json({ message: "✅ File resubmitted successfully.", file: result.rows[0] });
  } catch (error) {
    console.error("❌ Error resubmitting file:", error);
    res.status(500).json({ message: "Failed to resubmit file." });
  }
});



export default router;
