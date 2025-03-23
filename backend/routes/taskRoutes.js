import express from "express";
import { createTask } from "../models/task.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { title, description, status, priority, assigned_to, workflow_id, due_date } = req.body;
  try {
    const task = await createTask(title, description, status, priority, assigned_to, workflow_id, due_date);
    res.json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
