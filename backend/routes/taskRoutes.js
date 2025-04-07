import express from "express";
import pool from "../config/db.js";
import { createTask } from "../models/task.js";
import { verifyJWT, authMiddleware } from "../middleware/authMiddleware.js";
import { sendTaskAssignedEmail } from "../utils/sendEmail.js"; // ✅ import email function

const router = express.Router();
router.post("/create", verifyJWT, async (req, res) => {
  const { title, description, priority, assignedTo, workflow_id, due_date } = req.body;

  if (!title || !workflow_id || !due_date) {
    return res.status(400).json({ error: "Title, workflow ID, and due date are required" });
  }

  try {
    const task = await createTask(title, description, priority, assignedTo, workflow_id, due_date);

    // ✅ If assignedTo is already an email, no need to query the DB
    const employeeEmail = assignedTo;

    if (employeeEmail) {
      await sendTaskAssignedEmail(employeeEmail, {
        title,
        description,
        priority,
        due_date
      });
    }

    res.status(201).json({ message: "Task created and email sent successfully", task });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ error: error.message || "Server error while creating task" });
  }
});



router.get("/", verifyJWT, authMiddleware(["manager"]),async (req, res) => {
  try {
    const managerId = req.user.id; 
    console.log("🔐 Logged in manager ID:", managerId);

    const result = await pool.query(
      `
      SELECT tasks.*, users.name AS assigned_to_name
      FROM tasks
      INNER JOIN workflows ON tasks.workflow_id = workflows.id
      LEFT JOIN users ON tasks.assigned_to = users.id
      WHERE workflows.manager_id = $1
      ORDER BY tasks.created_at DESC
      `,
      [managerId]
    );

    console.log("📦 Retrieved tasks:", result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching manager-specific tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/active", async (req, res) => {
  const { managerId } = req.query;
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE workflow_id IN (SELECT id FROM workflows WHERE manager_id = $1)",
      [managerId]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error("Error fetching active tasks:", error);
    res.status(500).json({ error: "Server error while fetching active tasks" });
  }
});
//get Tasks Assigned to an Employee
router.get("/assigned/:employeeId", verifyJWT, authMiddleware(["employee"]), async (req, res) => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE assigned_to = $1",
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//get tasks assigned to employee and display on dashboard
router.get("/getTask/:employeeId", verifyJWT, authMiddleware(["employee"]), async (req, res) => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE assigned_to = $1",
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;