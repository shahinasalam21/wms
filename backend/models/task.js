import pool from "../config/db.js";

export const createTask = async (title, description, status, priority, assigned_to, workflow_id, due_date) => {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, status, priority, assigned_to, workflow_id, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [title, description, status, priority, assigned_to, workflow_id, due_date]
  );
  return result.rows[0];
};
