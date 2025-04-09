
import express from "express";
import pool from "../config/db.js";
import { createTask } from "../models/task.js";
import { verifyJWT, authMiddleware } from "../middleware/authMiddleware.js";
import { sendTaskAssignedEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ---------------------  Task Creation --------------------- */
router.post("/create", verifyJWT, async (req, res) => {
  const { title, description, priority, assignedTo, workflow_id, due_date } = req.body;

  if (!title || !workflow_id || !due_date) {
    return res.status(400).json({ error: "Title, workflow ID, and due date are required" });
  }

  try {
    const task = await createTask(title, description, priority, assignedTo, workflow_id, due_date);

    const employeeEmail = assignedTo; // If it's an email already
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

/* ---------------------  Get Tasks for Manager --------------------- */
router.get("/", verifyJWT, authMiddleware(["manager"]), async (req, res) => {
  try {
    const managerId = req.user.id;

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

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching manager-specific tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ---------------------  Get Active Task Count --------------------- */
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

/* ---------------------  Get Tasks Assigned to Employee --------------------- */
router.get("/assigned/:employeeId", verifyJWT, authMiddleware(["employee"]), async (req, res) => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query("SELECT * FROM tasks WHERE assigned_to = $1", [employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------  Dashboard Task Fetch --------------------- */
router.get("/getTask/:employeeId", verifyJWT, authMiddleware(["employee"]), async (req, res) => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query("SELECT * FROM tasks WHERE assigned_to = $1", [employeeId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ---------------------  Approve Task --------------------- */
router.put("/:taskId/approve", verifyJWT, authMiddleware(["manager"]), async (req, res) => {
  const { taskId } = req.params;

  try {
    const { rows: documents } = await pool.query(
      'SELECT status FROM documents WHERE task_id = $1',
      [taskId]
    );

    const allApproved = documents.every(doc => doc.status === 'Approved');

    if (!allApproved) {
      return res.status(400).json({ message: 'All documents must be approved to approve the task.' });
    }

    await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2',
      ['Approved', taskId]
    );

    res.status(200).json({ message: 'Task approved successfully.' });
  } catch (error) {
    console.error('Error approving task:', error);
    res.status(500).json({ message: 'Server error while approving task.' });
  }
});

/* --------------------- Reject Task --------------------- */
router.put("/:taskId/reject", verifyJWT, authMiddleware(["manager"]), async (req, res) => {
  const { taskId } = req.params;

  try {
    await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2',
      ['Rejected', taskId]
    );

    res.status(200).json({ message: 'Task rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting task:', error);
    res.status(500).json({ message: 'Server error while rejecting task.' });
  }
});

/* ---------------------  Get Task Status --------------------- */
router.get("/status/:taskId", verifyJWT, authMiddleware(["manager", "employee"]), async (req, res) => {
  const { taskId } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT status FROM tasks WHERE id = $1',
      [taskId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ status: rows[0].status });
  } catch (error) {
    console.error('Error fetching task status:', error);
    res.status(500).json({ message: 'Server error while fetching task status.' });
  }
});

router.get("/:id", verifyJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, description, status, assigned_to, created_at
       FROM tasks
       WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching task:", err.message);
    res.status(500).json({ error: "Failed to fetch task." });
  }
});


export default router;
