import db from '../config/db.js'; // Assuming you have a db.js or database connection file

// Get manager profile data
const getManagerProfile = async (req, res) => {
  const { userId } = req.user; // Assuming user is authenticated and userId is in req.user

  try {
    const result = await db.query('SELECT name, email FROM managers WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Manager not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
};

// Update manager profile
const updateManagerProfile = async (req, res) => {
  const { userId } = req.user;
  const { name, email } = req.body;

  try {
    await db.query('UPDATE managers SET name = $1, email = $2 WHERE id = $3', [name, email, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Delete manager profile
const deleteManagerProfile = async (req, res) => {
  const { userId } = req.user;

  try {
    await db.query('DELETE FROM managers WHERE id = $1', [userId]);
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting profile' });
  }
};

export { getManagerProfile, updateManagerProfile, deleteManagerProfile }; // Using named exports
