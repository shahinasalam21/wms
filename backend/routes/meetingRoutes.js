import express from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import pool from "../config/db.js";
import dotenv from "dotenv";
import { verifyJWT, authMiddleware } from "../middleware/authMiddleware.js";
dotenv.config();
const router = express.Router();

// Google OAuth2 Client
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:5000/auth/callback"
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

//Function to Send Meeting Email
async function sendMeetingEmail(email, meetingLink, title) {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Meeting Invitation: ${title}`,
            text: `You have been invited to a meeting.\n\nJoin here: ${meetingLink}\n\nMeeting Title: ${title}`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(` Failed to send email to ${email}:`, error);
    }
}

// Create Google Meet Meeting
router.post("/create", async (req, res) => {
    const { manager_id, title, start_time, end_time, employee_ids } = req.body;

    //  Validate request data
    if (!manager_id || !title || !start_time || !end_time || !Array.isArray(employee_ids)) {
        return res.status(400).json({ error: "Missing or invalid data" });
    }

    try {
        const event = {
            summary: title,
            start: { 
                dateTime: new Date(start_time).toISOString(), 
                timeZone: "UTC" 
            },
            end: { 
                dateTime: new Date(end_time).toISOString(), 
                timeZone: "UTC" 
            },
            conferenceData: {
                createRequest: {
                    requestId: `meet_${Date.now()}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" }
                }
            }
        };
        

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
        });

        const meetingLink = response.data.hangoutLink;
        console.log(` Meeting Created: ${meetingLink}`);

        //  Insert meeting into DB
        const result = await pool.query(
            "INSERT INTO meetings (manager_id, title, start_time, end_time, meeting_link) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [manager_id, title, start_time, end_time, meetingLink]
        );

        const meetingId = result.rows[0].id;

        //  Store invites & Send Emails in parallel
        await Promise.all(
            employee_ids.map(async (empId) => {
                await pool.query("INSERT INTO meeting_invites (meeting_id, employee_id) VALUES ($1, $2)", [meetingId, empId]);

                // Fetch employee email
                const emp = await pool.query("SELECT email FROM users WHERE id = $1", [empId]);
                if (emp.rows.length > 0) {
                    await sendMeetingEmail(emp.rows[0].email, meetingLink, title);
                }
            })
        );

        res.json({ success: true, meeting_link: meetingLink });
    } catch (error) {
        console.error(" Error Creating Meeting:", error);
        res.status(500).json({ error: "Failed to create meeting" });
    }
});

//  Get Manager Meetings with Employees
router.get("/manager/:manager_id", async (req, res) => {
    try {
        const { manager_id } = req.params;
        const result = await pool.query(
            `SELECT m.*, array_agg(u.name) AS employees
             FROM meetings m
             LEFT JOIN meeting_invites mi ON m.id = mi.meeting_id
             LEFT JOIN users u ON mi.employee_id = u.id
             WHERE m.manager_id = $1
             GROUP BY m.id
             ORDER BY m.start_time DESC`,
            [manager_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error Fetching Manager Meetings:", error);
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
});

// Get Employee Meetings
router.get("/employee/:employee_id", async (req, res) => {
    const { employee_id } = req.params;

    console.log("Received Employee ID:", employee_id); 

    if (!employee_id || employee_id === "undefined") {
        return res.status(400).json({ error: "Invalid or missing employee ID" });
    }

    try {
        const result = await pool.query(
            `SELECT m.* FROM meetings m
             JOIN meeting_invites mi ON m.id = mi.meeting_id
             WHERE mi.employee_id = $1
             ORDER BY m.start_time DESC`,
            [employee_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(" Error Fetching Employee Meetings:", error);
        res.status(500).json({ error: "Failed to fetch meetings" });
    }
});
router.get("/emp/employee/:employeeId", verifyJWT, authMiddleware(["employee"]), async (req, res) => {
    try {
        const { employeeId } = req.params;

        console.log("Received Employee ID:", employeeId); // Debugging: Check if employeeId is correct

        if (!employeeId || employeeId === "undefined") {
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        // ❌ Incorrect Query
        // "SELECT * FROM meetings WHERE assigned_to = $1"

        // ✅ Correct Query: Use `meeting_invites` to get meetings for an employee
        const result = await pool.query(
            `SELECT m.* FROM meetings m
             JOIN meeting_invites mi ON m.id = mi.meeting_id
             WHERE mi.employee_id = $1
             ORDER BY m.start_time DESC`,
            [employeeId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No meetings found for this employee" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ message: "Server error" });
    }
});


  
export default router;