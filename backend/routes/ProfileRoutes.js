import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { verifyJWT, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET Manager Profile (Only Managers Allowed)
router.get("/users/:id", verifyJWT, authMiddleware(["manager"]), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Update Manager Profile (Name & Password)
router.put("/users/:id", verifyJWT, authMiddleware(["manager"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Name and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING id, name, email, role",
      [name, hashedPassword, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Manager Profile
router.delete("/users/:id", verifyJWT, authMiddleware(["manager"]), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
