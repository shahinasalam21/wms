import express from "express";
import multer from "multer";
import pool from "../config/db.js"; // ✅ This is the correct pool

const router = express.Router();

const allowedTypes = [
  "image/jpeg", "image/png", "image/gif", "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel" // .xls
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type."));
    }
    cb(null, true);
  },
});

router.post("/upload", upload.single("document"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  const { originalname, mimetype, buffer } = req.file;

  try {
    const result = await pool.query(  // ✅ use pool.query
      "INSERT INTO documents (filename, mimetype, data) VALUES ($1, $2, $3) RETURNING id",
      [originalname, mimetype, buffer]
    );
    res.json({
      message: "File uploaded successfully!",
      id: result.rows[0].id,
      name: originalname,
    });
  } catch (err) {
    console.error("Upload Error:", err); // will show exact error in terminal
    res.status(500).json({ error: "Failed to upload file." });
  }
});

router.get("/uploaded-files", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, filename FROM documents ORDER BY uploaded_at DESC");
    res.json(result.rows.map(doc => ({
      id: doc.id,
      name: doc.filename,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list files." });
  }
});

router.get("/download/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT filename, mimetype, data FROM documents WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "File not found." });
    }

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

router.delete("/delete-file/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM documents WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "File not found." });
    }
    res.json({ message: "File deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

export default router;
