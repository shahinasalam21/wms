import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../config/db.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
import fetch from "node-fetch"; // for reCAPTCHA

dotenv.config();
const router = express.Router();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, //  Gmail Address
    pass: process.env.EMAIL_PASS, //  App Password 
  },
});

//  to Verify reCAPTCHA
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET;
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await response.json();
  console.log("🔹 reCAPTCHA verification response:", data);
  return data.success;
};

// user Registration Route
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, recaptchaToken } = req.body;
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");

      const result = await pool.query(
        "INSERT INTO users (name, email, password, role, verified, verification_token) VALUES ($1, $2, $3, 'user', false, $4) RETURNING *",
        [name, email, hashedPassword, verificationToken]
      );

      //  Send Verification Email
      const verificationLink = `http://localhost:5000/api/auth/verify-email/${verificationToken}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email - WMS Project",
        html: `<p>Click the link below to verify your email:</p>
               <p><a href="${verificationLink}">${verificationLink}</a></p>
               <p>If you did not request this, please ignore this email.</p>`,
      });

      res.json({ message: "Signup successful. Check your email to verify your account." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//  Email Verification Route 
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const result = await pool.query(
      "UPDATE users SET verified = true WHERE verification_token = $1 RETURNING *",
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).send("<h2>Invalid or expired verification token</h2>");
    }

    // Redirect user to frontend login page
    res.redirect("http://localhost:3000/login?verified=true");
  } catch (error) {
    res.status(500).send(`<h2>Error verifying email: ${error.message}</h2>`);
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  const { email, password, recaptchaToken } = req.body;
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return res.status(400).json({ error: "reCAPTCHA verification failed" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    if (!user.verified) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
