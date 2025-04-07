import express from "express";
import multer from "multer";
import pool from "../config/db.js";
import verifyJWT from "../middleware/verifyJWT.js"; // import middleware

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

// ✅ Protected Upload
router.post("/upload/:taskId", verifyJWT, upload.single("document"), async (req, res) => {
  const { taskId } = req.params;
  const { originalname, mimetype, buffer } = req.file;

  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const result = await pool.query(
      "INSERT INTO documents (filename, mimetype, data, task_id, uploaded_by) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [originalname, mimetype, buffer, taskId, req.user.id] // req.user from JWT
    );
    res.json({
      message: "File uploaded successfully!",
      id: result.rows[0].id,
      name: originalname,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload file." });
  }
});

// ✅ Protected File List
router.get("/uploaded-files/:taskId", verifyJWT, async (req, res) => {
  const { taskId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, filename FROM documents WHERE task_id = $1 ORDER BY uploaded_at DESC",
      [taskId]
    );
    res.json(result.rows.map(doc => ({
      id: doc.id,
      name: doc.filename
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list files." });
  }
});

// ✅ Protected File Download
router.get("/download/:id", verifyJWT, async (req, res) => {
  try {
    const result = await pool.query("SELECT filename, mimetype, data FROM documents WHERE id = $1", [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "File not found." });

    const file = result.rows[0];
    res.set({
      "Content-Type": file.mimetype,
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });
    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve file." });
  }
});

// ✅ Protected File Deletion
router.delete("/delete-file/:id", verifyJWT, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM documents WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "File not found." });
    res.json({ message: "File deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

export default router;
