import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import pool from "../config/db.js";
import fetch from "node-fetch";

const router = express.Router();
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// 🟢 REGISTER (SIGN UP) WITH reCAPTCHA VERIFICATION
router.post("/register", async (req, res) => {
  const { name, email, password, captchaToken } = req.body;

  if (!captchaToken) {
    console.log("❌ No reCAPTCHA token received!");
    return res.status(400).json({ error: "reCAPTCHA verification failed" });
  }

  try {
    console.log("🟢 Verifying reCAPTCHA token:", captchaToken);

    // Verify reCAPTCHA with Google
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();
    console.log("🔍 reCAPTCHA verification response:", recaptchaData);

    if (!recaptchaData.success) {
      console.log("❌ reCAPTCHA verification failed:", recaptchaData["error-codes"]);
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    console.log("✅ reCAPTCHA verified successfully!");

    // Check if email already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password & insert into DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

  } catch (error) {
    console.error("❌ Error during registration:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🟢 LOGIN WITH reCAPTCHA VERIFICATION
router.post("/login", async (req, res) => {
  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    console.log("❌ No reCAPTCHA token received!");
    return res.status(400).json({ error: "reCAPTCHA verification failed" });
  }

  try {
    console.log("🟢 Verifying reCAPTCHA token:", captchaToken);

    // Verify reCAPTCHA with Google
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        }),
      }
    );

    const recaptchaData = await recaptchaResponse.json();
    console.log("🔍 reCAPTCHA verification response:", recaptchaData);

    if (!recaptchaData.success) {
      console.log("❌ reCAPTCHA verification failed:", recaptchaData["error-codes"]);
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    console.log("✅ reCAPTCHA verified successfully!");

    // Authenticate user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("❌ Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
