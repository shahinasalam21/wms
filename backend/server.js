import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { verifyJWT, authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Role-Based Protected Routes
app.get("/manager-dashboard", verifyJWT, authMiddleware(["manager"]), (req, res) => {
  res.json({ message: "Welcome to the Manager Dashboard!" });
});

app.get("/employee-dashboard", verifyJWT, authMiddleware(["employee"]), (req, res) => {
  res.json({ message: "Welcome to the Employee Dashboard!" });
});

// User Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
