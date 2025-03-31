import express from "express";
import { createTask } from "../models/task.js";

const router = express.Router();

// Create Task API
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

export default router;
