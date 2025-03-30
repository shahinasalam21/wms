import express from "express";
import pool from "../config/db.js"; // Adjust based on your project structure
import verifyJWT from "../middleware/verifyJWT.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch employee count
router.get("/count", async (req, res) => {
    try {
      const result = await pool.query("SELECT COUNT(*) AS count FROM users WHERE role = 'employee'");
      res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (err) {
      console.error("Error fetching employee count:", err);
      res.status(500).json({ error: "Failed to fetch employee count" });
    }
  });
  
export default router;
