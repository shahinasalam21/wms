import express from "express";
import { createTask } from "../models/task.js";
import verifyJWT from "../middleware/verifyJWT.js"; 
import pool from "../config/db.js";
const router = express.Router();

// task api
router.post("/create", async (req, res) => {
  const { title, description, priority, assignedTo, workflow_id, due_date } = req.body;

  try {
    const task = await createTask(title, description, priority, assignedTo, workflow_id, due_date);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: error.message || "Server error while creating task" });
  }
});
// Middleware to verify JWT

router.get("/", verifyJWT, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/active", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM tasks");
    res.json({ count: result.rows[0].count });
  } catch (error) {
    console.error("Error fetching active tasks count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
