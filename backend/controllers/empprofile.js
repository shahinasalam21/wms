import db from '../config/db.js'; // Database connection file

// Get employee profile data
const getEmployeeProfile = async (req, res) => {
  const { userId } = req.user; // Assuming user is authenticated and userId is in req.user

  try {
    const result = await db.query('SELECT name, email FROM employees WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching employee profile data' });
  }
};

// Update employee profile
const updateEmployeeProfile = async (req, res) => {
  const { userId } = req.user;
  const { name, email } = req.body;

  try {
    await db.query('UPDATE employees SET name = $1, email = $2 WHERE id = $3', [name, email, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating employee profile' });
  }
};

// Delete employee profile
const deleteEmployeeProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    await db.query('DELETE FROM employees WHERE id = $1', [userId]);
    res.json({ message: 'Employee profile deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting employee profile' });
  }
};

export { getEmployeeProfile, updateEmployeeProfile, deleteEmployeeProfile }; // Named exports
