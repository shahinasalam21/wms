import pool from "../config/db.js";

//insert task
export const createTask = async (title, description, priority, assignedToEmail, workflowId, dueDate) => {
  try {
    
    const userQuery = "SELECT id FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [assignedToEmail]);

    if (userResult.rows.length === 0) {
      throw new Error("Assigned user not found");
    }

    const assignedToId = userResult.rows[0].id;

   
    const taskQuery = `
      INSERT INTO tasks (title, description, priority, assigned_to, workflow_id, due_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;
    `;

    const values = [title, description, priority, assignedToId, workflowId, dueDate];
    const { rows } = await pool.query(taskQuery, values);
    const newTask = rows[0];

    
    

    return newTask;
  } catch (error) {
    throw error;
  }
};
