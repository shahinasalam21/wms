import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";
import pool from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to Verify JWT and Attach User Role
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user details to request
  } catch (err) {
    console.error("JWT Verification Failed:", err);
  }

  next();
});

//  Role-Based Protected Routes
app.get("/admin", authMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

app.get("/manager", authMiddleware(["admin", "manager"]), (req, res) => {
  res.json({ message: "Welcome Manager!" });
});

//  User Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
