// routes/PerformanceRoutes.js

import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ FIXED: Added leading slash
router.get("/report/:employeeId", async (req, res) => {
    const { employeeId } = req.params;

    try {
        const reportQuery = `
            SELECT 
                u.name AS employee_name,
                u.role AS department,
                COUNT(t.id) AS total_tasks,
                COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_tasks,
                COUNT(CASE WHEN t.status = 'pending' THEN 1 END) AS pending_tasks,
                COUNT(CASE WHEN t.status = 'rejected' THEN 1 END) AS rejected_tasks,
                ROUND(AVG(EXTRACT(EPOCH FROM (t.due_date - t.created_at)) / 3600), 2) AS avg_completion_time,
                (
                    SELECT COUNT(*) 
                    FROM meeting_invites mi 
                    WHERE mi.employee_id = u.id
                ) AS meetings_attended,
                (
                    SELECT COUNT(*) 
                    FROM tasks nt 
                    WHERE nt.assigned_to = u.id AND nt.created_at >= NOW() - INTERVAL '30 days'
                ) AS notifications_received
            FROM users u
            LEFT JOIN tasks t ON u.id = t.assigned_to
            WHERE u.id = $1
            GROUP BY u.id;
        `;

        const result = await db.query(reportQuery, [employeeId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching employee report:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
