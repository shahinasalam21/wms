import pool from "../config/db.js";

export const createWorkflow = async (name, description, manager_id) => {
  const query = `
    INSERT INTO workflows (name, description, manager_id, created_at)
    VALUES ($1, $2, $3, NOW()) RETURNING *;
  `;
  const values = [name, description, manager_id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

//fetching
export const getAllWorkflows = async (manager_id = null) => {
  if (manager_id) {
    const result = await pool.query(
      "SELECT * FROM workflows WHERE manager_id = $1",
      [manager_id]
    );
    return result.rows;
  } else {
    const result = await pool.query("SELECT * FROM workflows");
    return result.rows;
  }
};