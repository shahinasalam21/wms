import express from "express";
import db from "../config/db.js"; 
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/manager-profile", verifyJWT, async (req, res) => {
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

export default router;