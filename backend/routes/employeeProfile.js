import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { verifyJWT, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


 //get Employee Profile
 
router.get("/employees/:id", verifyJWT, authMiddleware(["employee"]), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1 AND role = 'employee'", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;