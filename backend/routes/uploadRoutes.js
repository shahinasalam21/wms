import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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

// Upload document
router.post("/upload/:taskId", verifyJWT, upload.single("document"), async (req, res) => {
  const { taskId } = req.params;
  const { originalname, mimetype, buffer } = req.file;

  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    console.log("📥 Uploading file for taskId:", taskId, "by user:", req.user.id);
    const result = await pool.query(
      "INSERT INTO documents (filename, mimetype, data, task_id, uploaded_by) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [originalname, mimetype, buffer, taskId, req.user.id]
    );
    res.json({ message: "File uploaded successfully!", id: result.rows[0].id, name: originalname });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

// Get documents for a task
router.get("/uploaded-files/:taskId", verifyJWT, async (req, res) => {
  const { taskId } = req.params;

  try {
    console.log("📤 Fetching uploaded files for taskId:", taskId);

    const result = await pool.query(
      "SELECT id, filename, uploaded_at FROM documents WHERE task_id = $1 ORDER BY uploaded_at DESC",
      [taskId]
    );

    console.log("📦 Found documents:", result.rows);

    res.json(result.rows.map(doc => ({
      id: doc.id,
      name: doc.filename,
      uploaded_at: doc.uploaded_at,
    })));
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to list files." });
  }
});

export default router;
