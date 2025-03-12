import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../config/db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify reCAPTCHA
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET;
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${token}`,
  });
  const data = await response.json();
  return data.success;
};

// User Registration
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["manager", "employee"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    try {
      // Check if email already exists
      const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      // Insert into database
      const result = await pool.query(
        "INSERT INTO users (name, email, password, role, verified, verification_token) VALUES ($1, $2, $3, $4, false, $5) RETURNING *",
        [name, email, hashedPassword, role, verificationToken]
      );

      if (result.rowCount === 0) {
        return res.status(500).json({ error: "Database insertion failed" });
      }
// Send verification email
const verificationLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Verify Your Email - WMS Project",
  html: `<p>Click the link below to verify your email:</p>
         <p><a href="${verificationLink}">${verificationLink}</a></p>
         <p>If you did not request this, please ignore this email.</p>`,
});
console.log("Email sent successfully to:", email);


     
      res.json({ message: "Signup successful. Check your email to verify your account." });
    } catch (error) {
      console.error(" Error in Register Route:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Email Verification
router.get("/verify-email/:token", async (req, res) => {
  try {
    const result = await pool.query("UPDATE users SET verified = true WHERE verification_token = $1 RETURNING *", [req.params.token]);
    if (result.rowCount === 0) return res.status(400).send("Invalid or expired token");
    res.redirect("http://localhost:3000/login?verified=true");
  } catch {
    res.status(500).send("Error verifying email");
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password, recaptchaToken } = req.body;
  if (!(await verifyRecaptcha(recaptchaToken))) return res.status(400).json({ error: "reCAPTCHA failed" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    if (!user.verified) return res.status(403).json({ error: "Verify your email before login." });

    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const redirectURL = user.role === "manager" ? "/manager-dashboard" : "/employee-dashboard";
    res.json({ message: "Login successful", token, role: user.role, redirectURL });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;