import pool from "../config/db.js"; // ✅ Ensure this points to your PostgreSQL connection

export const createWorkflow = async (name, description, manager_id) => {
  const query = `
    INSERT INTO workflows (name, description, manager_id, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING *;
  `;
  const values = [name, description, manager_id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Fetch all workflows
export const getAllWorkflows = async () => {
  const query = "SELECT * FROM workflows ORDER BY created_at DESC;";
  const { rows } = await pool.query(query);
  return rows;
};

