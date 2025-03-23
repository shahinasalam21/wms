import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { verifyJWT, authMiddleware } from "./middleware/authMiddleware.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// User Routes
app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/tasks", taskRoutes);

// Role-Based Protected Routes
app.get("/manager-dashboard", verifyJWT, authMiddleware(["manager"]), (req, res) => {
  res.json({ message: "Welcome to the Manager Dashboard!" });
});

app.get("/employee-dashboard", verifyJWT, authMiddleware(["employee"]), (req, res) => {
  res.json({ message: "Welcome to the Employee Dashboard!" });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
