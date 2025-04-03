import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { verifyJWT, authMiddleware } from "./middleware/authMiddleware.js";
import employeeRoutes from "./routes/employees.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import ProfileRoutes from "./routes/ProfileRoutes.js";
import empprofileRoute from "./routes/empprofileroutes.js"; 
import db from "./config/db.js"; // Ensure db connection is imported

dotenv.config();

const app = express();

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created 'uploads/' folder");
}

const allowedOrigins = ["http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/meeting", meetingRoutes);
app.use("/api", verifyJWT, ProfileRoutes);
app.use("/api", verifyJWT, empprofileRoute); // ✅ Ensure the correct route is used

// Role-Based Protected Routes
app.get("/manager-dashboard", verifyJWT, authMiddleware(["manager"]), (req, res) => {
  res.json({ message: "Welcome to the Manager Dashboard!" });
});

app.get("/employee-dashboard", verifyJWT, authMiddleware(["employee"]), (req, res) => {
  res.json({ message: "Welcome to the Employee Dashboard!" });
});

// Manager Profile Route (Ensure verifyJWT is used)
app.get("/api/manager-profile", verifyJWT, async (req, res) => {
  try {
      const userId = req.user.id; 
      const result = await db.query("SELECT name, email FROM users WHERE id = $1", [userId]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Manager not found" });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error fetching manager profile:", error);
      res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
