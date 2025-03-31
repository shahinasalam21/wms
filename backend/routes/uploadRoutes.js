import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const uploadDir = "uploads";


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname.replace(/\s+/g, "_").toLowerCase();
    cb(null, uniqueSuffix);
  },
});


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
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Allowed: JPG, PNG, GIF, PDF, PPTX, DOCX, XLSX."));
    }
    cb(null, true);
  },
});

router.use("/uploads", express.static(uploadDir));


router.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  res.json({
    message: "File uploaded successfully!",
    name: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
});

router.get("/uploaded-files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to list files." });
    }

    const fileList = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
    }));

    res.json(fileList);
  });
});


router.delete("/delete-file/:filename", async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  try {
   
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    await fs.promises.unlink(filePath);
    res.json({ message: "File deleted successfully." });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: " Failed to delete file." });
  }
});

export default router;
